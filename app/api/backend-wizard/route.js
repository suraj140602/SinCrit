// app/api/backend-wizard/route.js
// ============================================================
// AppForge Backend Architect — AI Setup Wizard
//
// POST /api/backend-wizard
// Body: { schema, userPrompt, step }
//
// Steps:
//   "analyze"   — inspects the schema and generates SQL + binding code
//   "validate"  — checks that a table was successfully created (ping test)
//   "bind"      — generates the full FutureBuilder for a specific table
// ============================================================

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { compileBackendWizardContext } from '@/utils/flutterPromptCompiler';
import { generateSupabaseSQL } from '@/utils/sqlGenerator';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ── Step handler: ANALYZE ────────────────────────────────────────────────────
const handleAnalyze = async (schema, userPrompt) => {
  const tables = schema.appConfig?.dbTables || [];
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) throw new Error('Server missing Gemini API Key');

  // Build the wizard system prompt
  const wizardContext = compileBackendWizardContext(schema);

  // Generate the SQL using our existing sqlGenerator
  const generatedSQL = generateSupabaseSQL(tables);

  // Ask Gemini to explain it and generate the binding code
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`;

  const promptBody = {
    systemInstruction: {
      parts: [
        {
          text: `${wizardContext}
          
You are generating a backend setup guide for an AppForge user. 
Return ONLY a valid JSON object (no markdown, no backticks) with this exact structure:
{
  "sql": "the complete CREATE TABLE SQL",
  "explanation": "friendly plain English 2-3 sentence explanation of what will be created",
  "tables": ["array", "of", "table", "names"],
  "bindingCode": "a clean Dart FutureBuilder snippet for the first table",
  "testSnippet": "a simple Dart snippet to test the connection prints 1 row",
  "nextStep": "what the user should do after running the SQL",
  "warnings": ["any potential issues or things to check"]
}`,
        },
      ],
    },
    contents: [
      {
        parts: [
          {
            text: `Schema context: ${JSON.stringify({
              tables: tables.map((t) => ({
                name: t.name,
                columns: t.columns,
                rlsEnabled: t.rlsEnabled,
                rlsAuthOnly: t.rlsAuthOnly,
              })),
              backendProvider: schema.backendProvider || 'supabase',
              supabaseUrl: schema.supabaseConfig?.url || '',
            })}
            
User question: ${userPrompt || 'Generate my database setup'}`,
          },
        ],
      },
    ],
    generationConfig: { responseMimeType: 'application/json' },
  };

  const response = await fetch(geminiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(promptBody),
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);

  const rawText = data.candidates[0]?.content?.parts[0]?.text || '{}';
  let parsed;
  try {
    parsed = JSON.parse(rawText.replace(/```json|```/g, '').trim());
  } catch {
    parsed = { sql: generatedSQL, explanation: 'SQL generated from your schema.', tables: tables.map((t) => t.name) };
  }

  // Always use our deterministic SQL generator as the source of truth
  parsed.sql = generatedSQL;

  return parsed;
};

// ── Step handler: VALIDATE ───────────────────────────────────────────────────
const handleValidate = async (schema, tableName) => {
  if (!tableName) {
    const tables = schema.appConfig?.dbTables || [];
    if (tables.length === 0) return { success: false, message: 'No tables defined in schema.' };
    tableName = tables[0].name;
  }

  try {
    const { data, error, count } = await supabaseAdmin
      .from(tableName)
      .select('*', { count: 'exact', head: true });

    if (error) {
      // Table doesn't exist yet
      if (error.code === '42P01') {
        return {
          success: false,
          tableName,
          message: `Table "${tableName}" does not exist yet. Please run the SQL in your Supabase SQL Editor first.`,
          hint: 'Copy the SQL from Step 1 above, open Supabase → SQL Editor, paste it, and click Run.',
        };
      }
      return { success: false, tableName, message: error.message };
    }

    return {
      success: true,
      tableName,
      rowCount: count || 0,
      message: `✓ Table "${tableName}" exists and is connected! (${count || 0} rows)`,
    };
  } catch (err) {
    return { success: false, tableName, message: `Connection error: ${err.message}` };
  }
};

// ── Step handler: BIND ────────────────────────────────────────────────────────
const handleBind = async (schema, tableName, widgetType = 'ListView') => {
  const table = (schema.appConfig?.dbTables || []).find((t) => t.name === tableName);
  if (!table) return { success: false, message: `Table "${tableName}" not found in schema.` };

  const columns = table.columns || [];
  const firstTextCol = columns.find((c) => c.type === 'text')?.name || 'title';
  const firstNumCol = columns.find((c) => c.type === 'numeric')?.name;
  const supabaseUrl = schema.supabaseConfig?.url || 'YOUR_SUPABASE_URL';

  const bindingCode = `// Bind "${tableName}" to a Flutter ListView
// Add this FutureBuilder to your widget tree:

FutureBuilder<List<Map<String, dynamic>>>(
  future: Supabase.instance.client
      .from('${tableName}')
      .select()
      .order('created_at', ascending: false),
  builder: (context, snapshot) {
    if (snapshot.connectionState == ConnectionState.waiting) {
      return const Center(child: CircularProgressIndicator());
    }
    if (snapshot.hasError) {
      return Center(child: Text('Error: \${snapshot.error}'));
    }
    final rows = snapshot.data ?? [];
    if (rows.isEmpty) {
      return const Center(child: Text('No data yet. Add some records!'));
    }
    return ListView.builder(
      shrinkWrap: true,
      physics: const ClampingScrollPhysics(),
      itemCount: rows.length,
      itemBuilder: (context, index) {
        final row = rows[index];
        return Card(
          margin: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 6.0),
          child: ListTile(
            title: Text(row['${firstTextCol}'] ?? 'Untitled'),
            ${firstNumCol ? `subtitle: Text('\${row['${firstNumCol}'] ?? ''}'),` : ''}
            trailing: Text(
              row['created_at']?.toString().substring(0, 10) ?? '',
              style: const TextStyle(fontSize: 11, color: Colors.grey),
            ),
          ),
        );
      },
    );
  },
)`;

  const insertCode = `// Insert a new row into "${tableName}":
await Supabase.instance.client.from('${tableName}').insert({
  ${columns.map((c) => `'${c.name}': /* your value */`).join(',\n  ')}
});
// Then call setState() or refresh your FutureBuilder to show the new data.`;

  return {
    success: true,
    tableName,
    columns: columns.map((c) => ({ name: c.name, type: c.type })),
    bindingCode,
    insertCode,
    message: `Ready to bind! Copy the FutureBuilder code into your screen widget.`,
  };
};

// ── MAIN ROUTE HANDLER ────────────────────────────────────────────────────────
export async function POST(request) {
  try {
    const body = await request.json();
    const { schema, userPrompt, step = 'analyze', tableName } = body;

    if (!schema) {
      return NextResponse.json({ error: 'schema is required' }, { status: 400 });
    }

    let result;

    switch (step) {
      case 'analyze':
        result = await handleAnalyze(schema, userPrompt);
        break;
      case 'validate':
        result = await handleValidate(schema, tableName);
        break;
      case 'bind':
        result = await handleBind(schema, tableName);
        break;
      default:
        return NextResponse.json({ error: `Unknown step: ${step}` }, { status: 400 });
    }

    return NextResponse.json({ success: true, step, ...result });
  } catch (error) {
    console.error('[backend-wizard]', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Use POST' }, { status: 405 });
}