import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { compileFlutterContext } from '@/utils/flutterPromptCompiler';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { schema, task } = await req.json();

    if (!schema) {
      return NextResponse.json({ error: 'Schema is required' }, { status: 400 });
    }

    // 1. Run your master intelligence engine!
    // This turns the JSON tree into the dense system prompt.
    const systemContext = compileFlutterContext(schema, task || 'Generate the main.dart UI code for this layout.', {
      includeThemes: true,
      includeBackend: true,
      includePatterns: true,
      verbosity: 'full'
    });

    // 2. Configure Gemini 2.0 Flash (Fast & excellent at code)
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      systemInstruction: systemContext // Injecting your massive knowledge base here!
    });

    // 3. Send the final generation command
    const prompt = `Based on the system instructions and the provided schema, output the complete, production-ready Dart code. Do not use markdown blocks, just return the raw code.`;
    
    const result = await model.generateContent(prompt);
    const code = result.response.text();

    // Clean up any rogue markdown code fences the AI might return
    const cleanCode = code.replace(/```dart\n/g, '').replace(/```\n?/g, '');

    return NextResponse.json({ 
      success: true, 
      code: cleanCode 
    });

  } catch (error) {
    console.error("Generation Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}