import { NextResponse } from 'next/server';
import { analyzeLog } from '@/utils/flutterRepair';

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=`;

// FIX: hard limits to prevent prompt injection and oversized payloads
const MAX_CODE_CHARS   = 80_000;  // ~20k tokens of Dart code
const MAX_LOG_CHARS    = 10_000;  // build logs rarely exceed this
const FETCH_TIMEOUT_MS = 25_000;  // Gemini p50 is ~8s, 25s gives headroom

export async function POST(request) {
  try {
    const body = await request.json();
    const { errorLogs, currentCode } = body;
    // NOTE: schema is accepted for future use but intentionally not forwarded
    // to Gemini — it can contain credentials (supabaseConfig etc.) stripped
    // in handleSaveProject but still present in memory during a build session.

    // FIX: validate required fields with clear error messages
    if (!errorLogs || typeof errorLogs !== 'string') {
      return NextResponse.json(
        { error: 'errorLogs is required and must be a string' },
        { status: 400 }
      );
    }
    if (!currentCode || typeof currentCode !== 'string') {
      return NextResponse.json(
        { error: 'currentCode is required and must be a string' },
        { status: 400 }
      );
    }

    // FIX: truncate oversized inputs rather than rejecting — a build log from
    // a failed Flutter release build can be 50k+ chars; we keep the tail
    // because that's where the actual error usually lives.
    const safeLogs = errorLogs.length > MAX_LOG_CHARS
      ? '...[truncated]\n' + errorLogs.slice(-MAX_LOG_CHARS)
      : errorLogs;

    const safeCode = currentCode.length > MAX_CODE_CHARS
      ? currentCode.slice(0, MAX_CODE_CHARS) + '\n// ...[truncated]'
      : currentCode;

    const quickIssues = analyzeLog(safeLogs);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        success: true,
        repairMode: 'quick-scan-only',
        quickIssues,
        fixedCode: currentCode,
        rootCause: quickIssues[0]?.title || 'Build error detected',
        explanation: quickIssues[0]?.suggestion || 'Check the build log for details.',
        terminalMessage: '[AppForge] Quick scan complete (no AI key configured)',
        confidence: 0.4,
      });
    }

    const systemPrompt = `You are AppForge Flutter repair engine. Analyze the build error and return ONLY a JSON object (no markdown):
{
  "rootCause": "one sentence diagnosis",
  "fixType": "layout_fix | type_cast | null_check | import_fix | code_patch",
  "severity": "critical | warning | info",
  "confidence": 0.9,
  "fixedCode": "the complete corrected Dart code",
  "explanation": "2-3 sentences the user can understand",
  "terminalMessage": "short one-liner for the build log",
  "preventionTip": "one sentence on how to avoid this"
}`;

    const userMessage = [
      `BUILD ERROR:\n${safeLogs}`,
      `FAILING CODE:\n${safeCode}`,
      quickIssues.length > 0
        ? `QUICK SCAN FOUND:\n${quickIssues.map(i => `- ${i.title}: ${i.suggestion}`).join('\n')}`
        : 'QUICK SCAN: no known patterns matched',
    ].join('\n\n');

    // FIX: AbortController gives us a hard timeout so a slow/hung Gemini
    // request doesn't keep a serverless function alive until the platform
    // kills it (Vercel default is 10s on hobby, 300s on pro — both are wrong
    // defaults for this use case).
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    let response;
    try {
      response = await fetch(`${GEMINI_URL}${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: [{ parts: [{ text: userMessage }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      });
    } finally {
      clearTimeout(timeoutId);
    }

    // FIX: check HTTP status BEFORE calling .json() — a 429/503 from Gemini
    // returns an HTML or plain-text body that silently breaks JSON.parse
    if (!response.ok) {
      const errText = await response.text();
      console.error('[auto-repair] Gemini HTTP error', response.status, errText.slice(0, 300));
      // Fall back to quick-scan result rather than crashing
      return NextResponse.json({
        success: true,
        repairMode: 'quick-scan-fallback',
        quickIssues,
        fixedCode: currentCode,
        rootCause: `Gemini returned ${response.status}`,
        explanation: 'AI repair service is temporarily unavailable. Quick-scan results are shown instead.',
        terminalMessage: `[AppForge] AI unavailable (HTTP ${response.status}), quick scan used`,
        confidence: 0.4,
      });
    }

    const data = await response.json();

    // FIX: Gemini wraps API errors in data.error even on a 200 response
    if (data.error) {
      throw new Error(data.error.message || JSON.stringify(data.error));
    }

    // FIX: safe optional chaining — candidates can be undefined when Gemini
    // returns a finish_reason of SAFETY or RECITATION
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      const reason = data.candidates?.[0]?.finishReason || 'unknown';
      console.error('[auto-repair] Empty Gemini response, finishReason:', reason);
      return NextResponse.json({
        success: true,
        repairMode: 'quick-scan-fallback',
        quickIssues,
        fixedCode: currentCode,
        rootCause: `AI response blocked (${reason})`,
        explanation: 'The AI could not process this error. Quick-scan results are shown instead.',
        terminalMessage: `[AppForge] AI response blocked (${reason})`,
        confidence: 0.4,
      });
    }

    // FIX: wrap JSON.parse in its own try/catch — malformed AI output should
    // degrade gracefully, not explode the whole endpoint
    let aiResult;
    try {
      aiResult = JSON.parse(rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());
    } catch (parseErr) {
      console.error('[auto-repair] Failed to parse AI JSON:', parseErr.message, rawText.slice(0, 200));
      return NextResponse.json({
        success: true,
        repairMode: 'quick-scan-fallback',
        quickIssues,
        fixedCode: currentCode,
        rootCause: 'AI returned malformed JSON',
        explanation: 'The AI response could not be parsed. Quick-scan results are shown instead.',
        terminalMessage: '[AppForge] AI parse error, quick scan used',
        confidence: 0.4,
      });
    }

    const fixedCode = (aiResult.fixedCode || currentCode)
      .replace(/```dart\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    return NextResponse.json({
      success: true,
      repairMode: 'ai-deep-repair',
      severity: aiResult.severity || 'warning',
      confidence: aiResult.confidence || 0.8,
      rootCause: aiResult.rootCause,
      fixType: aiResult.fixType,
      fixedCode,
      explanation: aiResult.explanation,
      terminalMessage: aiResult.terminalMessage || '[AppForge] Auto-repair complete',
      preventionTip: aiResult.preventionTip,
      quickIssues,
    });

  } catch (error) {
    // AbortError means we hit the timeout
    if (error.name === 'AbortError') {
      console.error('[auto-repair] Gemini fetch timed out after', FETCH_TIMEOUT_MS, 'ms');
      return NextResponse.json(
        { error: 'Repair request timed out. Try again or check your build log manually.' },
        { status: 504 }
      );
    }

    console.error('[auto-repair]', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  // FIX: 405 with Allow header is the correct HTTP response for wrong method
  return NextResponse.json(
    { error: 'Method not allowed. Use POST.' },
    { status: 405, headers: { Allow: 'POST' } }
  );
}