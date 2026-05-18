import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { compileRepairContext } from '@/utils/flutterPromptCompiler';
import { analyzeLog } from '@/utils/flutterRepair';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { schema, currentCode, errorLogs } = await req.json();

    if (!errorLogs || !currentCode) {
      return NextResponse.json({ error: 'Missing code or logs' }, { status: 400 });
    }

    // 1. FAST PATH: Run your local regex analyzer
    const knownIssues = analyzeLog(errorLogs);
    
    // 2. DEEP REPAIR: Compile the dense repair context
    const systemInstruction = compileRepairContext(schema, errorLogs, "Fix the Dart build errors.");
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      systemInstruction: systemInstruction 
    });

    // 3. Command Gemini to rewrite the file
    const prompt = `
Here is the currently failing code:
\`\`\`dart
${currentCode}
\`\`\`

The regex analyzer flagged these potential issues: ${knownIssues.map(i => i.title).join(', ')}.
Apply the exact fixes needed so this compiles perfectly. Output ONLY the raw corrected Dart code.`;

    const result = await model.generateContent(prompt);
    
    // 4. Clean the output
    const fixedCode = result.response.text().replace(/```dart\n/g, '').replace(/```\n?/g, '');

    return NextResponse.json({ 
      success: true, 
      code: fixedCode,
      insights: knownIssues
    });

  } catch (error) {
    console.error("Repair Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}