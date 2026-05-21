// app/api/auto-repair/route.js
// ============================================================
// AppForge 1-Click Auto-Repair Engine
//
// POST /api/auto-repair
// Body: { schema, errorLogs, currentCode, projectId }
//
// Flow:
//   1. Run regex analyzer (instant, no AI cost)
//   2. Send to Gemini for deep patch generation
//   3. Return JSON patch + fixed code + user-friendly explanation
// ============================================================

import { NextResponse } from 'next/server';
import { compileRepairContext } from '@/utils/flutterPromptCompiler';
import { analyzeLog } from '@/utils/flutterRepair';

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=`;

// ── Fast regex pre-scan (zero AI cost) ──────────────────────────────────────
const quickScan = (errorLogs) => {
  const issues = analyzeLog(errorLogs);
  const severity = issues.some((i) => i.category === 'null_check' || i.category === 'overflow')
    ? 'critical'
    : issues.length > 0
    ? 'warning'
    : 'info';
  return { issues, severity };
};

// ── AI deep repair ───────────────────────────────────────────────────────────
const runAIRepair = async (schema, errorLogs, currentCode, quickIssues) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('Missing GEMINI_API_KEY');

  const systemPrompt = compileRepairContext(schema, errorLogs, 'Fix all build errors and return corrected code');

  const userMessage = `
Here is the FAILING Dart code:
\`\`\`dart
${currentCode}
\`\`\`

Regex pre-scan flagged these issues:
${quickIssues.map((i) => `- [${i.category}] ${i.title}: ${i.suggestion}`).join('\n')}

Return a JSON object with EXACTLY this structure (no markdown, no backticks):
{
  "rootCause": "Single sentence diagnosis of the primary error",
  "fixType": "schema_patch | code_patch | import_fix | type_cast | layout_fix",
  "severity": "critical | warning | info",
  "confidence": 0.95,
  "fixedCode": "the complete corrected Dart code (raw, no fences)",
  "schemaPatch": {
    "nodeId": "optional node id if a schema prop change fixes it",
    "propChanges": {}
  },
  "explanation": "2-3 sentences the user can understand without Dart knowledge",
  "terminalMessage": "Short one-liner for the build log",
  "preventionTip": "One sentence on how to avoid this in future"
}`;

  const response = await fetch(`${GEMINI_URL}${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ parts: [{ text: userMessage }] }],
      generationConfig: { responseMimeType: 'application/json' },
    }),
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);

  const raw = data.candidates[0]?.content?.parts[0]?.text || '{}';
  return JSON.parse(raw.replace(/```json|```/g, '').trim());
};

// ── Clean AI-generated Dart code ─────────────────────────────────────────────
const cleanDartCode = (code) => {
  if (!code) return '';
  return code
    .replace(/```dart\n?/g, '')
    .replace(/```\n?/g, '')
    .trim();
};

// ── MAIN HANDLER ─────────────────────────────────────────────────────────────
export async function POST(request) {
  try {
    const body = await request.json();
    const { schema, errorLogs, currentCode, projectId } = body;

    if (!errorLogs || !currentCode) {
      return NextResponse.json(
        { error: 'errorLogs and currentCode are required' },
        { status: 400 }
      );
    }

    // Step 1: Fast regex scan
    const { issues: quickIssues, severity } = quickScan(errorLogs);

    // Step 2: AI deep repair
    let aiResult;
    try {
      aiResult = await runAIRepair(schema || {}, errorLogs, currentCode, quickIssues);
    } catch (aiErr) {
      console.error('[auto-repair] AI failed, returning quick scan only:', aiErr.message);
      // Graceful degradation — return quick scan results even if AI fails
      return NextResponse.json({
        success: true,
        repairMode: 'quick-scan-only',
        severity,
        quickIssues,
        fixedCode: currentCode,
        rootCause: quickIssues[0]?.title || 'Build error detected',
        explanation: quickIssues[0]?.suggestion || 'Check the build log for details.',
        terminalMessage: '[AppForge] AI repair unavailable — quick scan complete',
        confidence: 0.4,
      });
    }

    const fixedCode = cleanDartCode(aiResult.fixedCode) || currentCode;

    return NextResponse.json({
      success: true,
      repairMode: 'ai-deep-repair',
      severity: aiResult.severity || severity,
      confidence: aiResult.confidence || 0.8,
      rootCause: aiResult.rootCause,
      fixType: aiResult.fixType,
      fixedCode,
      schemaPatch: aiResult.schemaPatch || null,
      explanation: aiResult.explanation,
      terminalMessage: aiResult.terminalMessage || '[AppForge] Auto-repair complete',
      preventionTip: aiResult.preventionTip,
      quickIssues,
      projectId,
    });
  } catch (error) {
    console.error('[auto-repair]', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Use POST' }, { status: 405 });
}