cat > ~/app-forge/app/api/auto-repair/route.js << 'ENDOFFILE'
import { NextResponse } from 'next/server';
import { analyzeLog } from '@/utils/flutterRepair';

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=`;

export async function POST(request) {
  try {
    const body = await request.json();
    const { schema, errorLogs, currentCode } = body;

    if (!errorLogs || !currentCode) {
      return NextResponse.json({ error: 'errorLogs and currentCode are required' }, { status: 400 });
    }

    const quickIssues = analyzeLog(errorLogs);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        success: true,
        repairMode: 'quick-scan-only',
        quickIssues,
        fixedCode: currentCode,
        rootCause: quickIssues[0]?.title || 'Build error detected',
        explanation: quickIssues[0]?.suggestion || 'Check the build log for details.',
        terminalMessage: '[AppForge] Quick scan complete',
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

    const userMessage = `BUILD ERROR:\n${errorLogs}\n\nFAILING CODE:\n${currentCode}\n\nQUICK SCAN FOUND:\n${quickIssues.map(i => `- ${i.title}: ${i.suggestion}`).join('\n')}`;

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
    const aiResult = JSON.parse(raw.replace(/```json|```/g, '').trim());

    const fixedCode = (aiResult.fixedCode || currentCode).replace(/```dart\n?/g, '').replace(/```\n?/g, '').trim();

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
    console.error('[auto-repair]', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Use POST' }, { status: 405 });
}
ENDOFFILE