import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { provider, apiKey, messages, prompt, currentSchema } = body;

    // --- SYSTEM INSTRUCTION (Shared across all models) ---
    const systemInstruction = `You are AppForge AI, an elite frontend engineer assistant.
    You have two jobs:
    1. Reply to the user conversationally.
    2. If the user asks for a UI change, output the EXACT JSON patch.
    OUTPUT FORMAT MUST BE STRICT JSON:
    {
      "chat_reply": "Sure! I've updated the button.",
      "ui_patch": { "target_id": "element-id", "updated_props": { "borderRadius": "9999px" } }
    }`;

    // Compile the prompt
    let finalPrompt = prompt || "";
    if (messages) {
       finalPrompt = messages.map(m => `${m.role.toUpperCase()}: ${m.text}`).join('\n');
       if (currentSchema) finalPrompt += `\n\nCURRENT APP CONTEXT:\n${JSON.stringify(currentSchema)}`;
    }

    let replyText = "";

    // ==========================================
    // ROUTE 1: GOOGLE GEMINI (Default / Free)
    // ==========================================
    if (provider === 'gemini-default' || !provider) {
        const geminiKey = process.env.GEMINI_API_KEY;
        if (!geminiKey) throw new Error("Server missing Gemini API Key");

const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`;       const response = await fetch(url, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({
                systemInstruction: { parts: [{ text: systemInstruction }] },
                contents: [{ parts: [{ text: finalPrompt }] }],
                generationConfig: { responseMimeType: "application/json" }
            }) 
        });
        
        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        replyText = data.candidates[0]?.content?.parts[0]?.text || "{}";
    } 

    // ==========================================
    // ROUTE: DEEPSEEK V3 / CODER
    // ==========================================
    else if (provider === 'deepseek') {
        if (!apiKey) throw new Error("Please enter your DeepSeek API Key.");

        // DeepSeek uses an OpenAI-compatible endpoint!
        const response = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'deepseek-chat', // This routes to their V3 model
                response_format: { type: "json_object" }, // Forces strict JSON
                messages: [
                    { role: 'system', content: systemInstruction },
                    { role: 'user', content: finalPrompt }
                ]
            })
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        replyText = data.choices[0]?.message?.content || "{}";
    }
    
    // ==========================================
    // ROUTE 2: ANTHROPIC CLAUDE 3.5 SONNET
    // ==========================================
    else if (provider === 'claude-3-5') {
        if (!apiKey) throw new Error("Please enter your Anthropic API Key.");

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                model: 'claude-3-5-sonnet-20240620',
                max_tokens: 1024,
                system: systemInstruction,
                messages: [{ role: 'user', content: finalPrompt + "\n\nRespond ONLY in valid JSON format." }]
            })
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        replyText = data.content[0]?.text || "{}";
    }

    // ==========================================
    // ROUTE 3: OPENAI GPT-4o
    // ==========================================
    else if (provider === 'gpt-4o') {
        if (!apiKey) throw new Error("Please enter your OpenAI API Key.");

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                response_format: { type: "json_object" },
                messages: [
                    { role: 'system', content: systemInstruction },
                    { role: 'user', content: finalPrompt }
                ]
            })
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        replyText = data.choices[0]?.message?.content || "{}";
    }

    return NextResponse.json({ reply: replyText });

  } catch (error) {
    console.error("Multi-Model API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}