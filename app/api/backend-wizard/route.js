import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateSupabaseSQL } from '@/utils/sqlGenerator';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const body = await request.json();
    const { schema, step = 'analyze', tableName } = body;

    if (!schema) return NextResponse.json({ error: 'schema is required' }, { status: 400 });

    if (step === 'analyze') {
      const tables = schema.appConfig?.dbTables || [];
      const sql = generateSupabaseSQL(tables);

      const firstTable = tables[0]?.name || 'your_table';
      const firstCols = tables[0]?.columns || [];
      const firstTextCol = firstCols.find(c => c.type === 'text')?.name || 'title';

      const bindingCode = `FutureBuilder<List<Map<String, dynamic>>>(
  future: Supabase.instance.client
      .from('${firstTable}')
      .select()
      .order('created_at', ascending: false),
  builder: (context, snapshot) {
    if (snapshot.connectionState == ConnectionState.waiting)
      return const Center(child: CircularProgressIndicator());
    if (snapshot.hasError)
      return Center(child: Text('Error: \${snapshot.error}'));
    final rows = snapshot.data ?? [];
    return ListView.builder(
      itemCount: rows.length,
      itemBuilder: (context, index) => ListTile(
        title: Text(rows[index]['${firstTextCol}'] ?? ''),
      ),
    );
  },
)`;

      return NextResponse.json({
        success: true,
        step: 'analyze',
        sql,
        tables: tables.map(t => t.name),
        explanation: `This SQL creates ${tables.length} table(s): ${tables.map(t => t.name).join(', ')}. Each table has a UUID primary key and timestamp. Row Level Security is enabled.`,
        bindingCode,
        nextStep: 'Copy the SQL above, open Supabase → SQL Editor, paste and click Run. Then come back and test the connection.',
      });
    }

    if (step === 'validate') {
      const name = tableName || schema.appConfig?.dbTables?.[0]?.name;
      if (!name) return NextResponse.json({ success: false, message: 'No table name provided' });

      const { count, error } = await supabaseAdmin
        .from(name)
        .select('*', { count: 'exact', head: true });

      if (error) {
        return NextResponse.json({
          success: false,
          tableName: name,
          message: error.code === '42P01'
            ? `Table "${name}" does not exist yet. Run the SQL first.`
            : error.message,
        });
      }

      return NextResponse.json({
        success: true,
        tableName: name,
        rowCount: count || 0,
        message: `✓ Table "${name}" is connected! (${count || 0} rows)`,
      });
    }

    return NextResponse.json({ error: `Unknown step: ${step}` }, { status: 400 });
  } catch (error) {
    console.error('[backend-wizard]', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Use POST' }, { status: 405 });
}
