cat > ~/app-forge/app/api/memory-bank/route.js << 'ENDOFFILE'
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const generateEmbedding = async (text) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('Missing GEMINI_API_KEY');

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'models/text-embedding-004',
        content: { parts: [{ text: text.slice(0, 2000) }] },
        taskType: 'RETRIEVAL_DOCUMENT',
      }),
    }
  );

  const data = await response.json();
  if (data.error) throw new Error(`Embedding error: ${data.error.message}`);
  return data.embedding?.values || [];
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const category = searchParams.get('category') || null;
    const limit = parseInt(searchParams.get('limit') || '5', 10);

    if (!query) {
      const { data, error } = await supabaseAdmin
        .from('appforge_memory_bank')
        .select('id, label, description, category, tags, quality_score, use_count')
        .order('quality_score', { ascending: false })
        .limit(20);
      if (error) throw new Error(error.message);
      return NextResponse.json({ patterns: data || [], total: data?.length || 0 });
    }

    let embedding;
    try {
      embedding = await generateEmbedding(query);
    } catch {
      const { data } = await supabaseAdmin
        .from('appforge_memory_bank')
        .select('id, label, description, category, tags, quality_score, schema_json')
        .ilike('label', `%${query}%`)
        .limit(limit);
      return NextResponse.json({ patterns: (data || []).map(r => ({ ...r, similarity: 0.7 })), total: data?.length || 0 });
    }

    const { data, error } = await supabaseAdmin.rpc('search_memory_bank', {
      query_embedding: embedding,
      match_threshold: 0.5,
      match_count: limit,
      filter_category: category || null,
    });

    if (error) throw new Error(error.message);
    return NextResponse.json({ patterns: data || [], total: data?.length || 0, query });
  } catch (error) {
    console.error('[memory-bank GET]', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'embed-all') {
      const { data: rows } = await supabaseAdmin
        .from('appforge_memory_bank')
        .select('id, label, description, category, tags')
        .is('embedding', null)
        .limit(50);

      const results = [];
      for (const row of rows || []) {
        try {
          const text = `${row.label}. ${row.description}. Category: ${row.category}. Tags: ${(row.tags || []).join(', ')}.`;
          const embedding = await generateEmbedding(text);
          await supabaseAdmin
            .from('appforge_memory_bank')
            .update({ embedding: JSON.stringify(embedding) })
            .eq('id', row.id);
          results.push({ label: row.label, status: 'embedded' });
        } catch (e) {
          results.push({ label: row.label, status: 'failed', error: e.message });
        }
        await new Promise(r => setTimeout(r, 300));
      }
      return NextResponse.json({ success: true, processed: results.length, results });
    }

    if (action === 'save') {
      const { label, description, category, tags, schemaNode, creatorId } = body;
      if (!label || !description || !category || !schemaNode)
        return NextResponse.json({ error: 'label, description, category, schemaNode required' }, { status: 400 });

      let embedding = null;
      try {
        const text = `${label}. ${description}. Category: ${category}. Tags: ${(tags || []).join(', ')}.`;
        embedding = await generateEmbedding(text);
      } catch (e) {
        console.warn('Embedding failed:', e.message);
      }

      const { data, error } = await supabaseAdmin
        .from('appforge_memory_bank')
        .insert({ label, description, category, tags: tags || [], schema_json: schemaNode, embedding: embedding ? JSON.stringify(embedding) : null, source: creatorId ? 'user' : 'community', creator_id: creatorId || null, quality_score: 0.75 })
        .select('id, label, category')
        .single();

      if (error) throw new Error(error.message);
      return NextResponse.json({ success: true, pattern: data });
    }

    if (action === 'used') {
      const { patternId } = body;
      await supabaseAdmin.rpc('increment_pattern_use', { pattern_id: patternId });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
  } catch (error) {
    console.error('[memory-bank POST]', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
ENDOFFILE