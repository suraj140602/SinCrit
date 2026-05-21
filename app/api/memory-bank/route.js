// app/api/memory-bank/route.js
// ============================================================
// AppForge RAG Memory Bank — Search & Save API
//
// GET  /api/memory-bank?query=fitness+tracker&category=fitness&limit=5
//      → Returns similar patterns using vector similarity search
//
// POST /api/memory-bank
//      Body: { action: "save", label, description, category, tags, schemaNode, creatorId }
//      → Embeds and saves a new pattern
//
//      Body: { action: "search", query, category, limit }
//      → Text search when no embedding available
//
//      Body: { action: "used", patternId }
//      → Increments the use_count for a pattern
// ============================================================

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ── Generate embedding using Gemini text-embedding-004 ───────────────────────
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

// ── Vector similarity search ──────────────────────────────────────────────────
const vectorSearch = async (query, category = null, limit = 5) => {
  const embedding = await generateEmbedding(query);

  const { data, error } = await supabaseAdmin.rpc('search_memory_bank', {
    query_embedding: embedding,
    match_threshold: 0.55,
    match_count: limit,
    filter_category: category || null,
  });

  if (error) throw new Error(`Vector search failed: ${error.message}`);
  return data || [];
};

// ── Keyword fallback search (when embedding generation fails) ─────────────────
const keywordSearch = async (query, category = null, limit = 5) => {
  let q = supabaseAdmin
    .from('appforge_memory_bank')
    .select('id, label, description, category, tags, quality_score, use_count, schema_json')
    .textSearch('label', query, { type: 'websearch' })
    .order('quality_score', { ascending: false })
    .limit(limit);

  if (category) q = q.eq('category', category);

  const { data, error } = await q;
  if (error) throw new Error(error.message);

  // Add a fake similarity score since we didn't use vectors
  return (data || []).map((row) => ({ ...row, similarity: 0.7 }));
};

// ── Save a new pattern with embedding ────────────────────────────────────────
const savePattern = async ({ label, description, category, tags, schemaNode, creatorId }) => {
  if (!label || !description || !category || !schemaNode) {
    throw new Error('label, description, category, and schemaNode are required');
  }

  // Build the text to embed
  const textToEmbed = `${label}. ${description}. Category: ${category}. Tags: ${(tags || []).join(', ')}.`;

  let embedding = null;
  try {
    embedding = await generateEmbedding(textToEmbed);
  } catch (e) {
    console.warn('[memory-bank] Embedding failed, saving without vector:', e.message);
  }

  const { data, error } = await supabaseAdmin
    .from('appforge_memory_bank')
    .insert({
      label,
      description,
      category,
      tags: tags || [],
      schema_json: schemaNode,
      embedding: embedding ? JSON.stringify(embedding) : null,
      source: creatorId ? 'user' : 'community',
      creator_id: creatorId || null,
      quality_score: 0.75,
    })
    .select('id, label, category')
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// ── Increment use count ───────────────────────────────────────────────────────
const markUsed = async (patternId) => {
  const { error } = await supabaseAdmin.rpc('increment_pattern_use', {
    pattern_id: patternId,
  });
  if (error) throw new Error(error.message);
  return { success: true, patternId };
};

// ── GET — quick text search ───────────────────────────────────────────────────
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const category = searchParams.get('category') || null;
    const limit = parseInt(searchParams.get('limit') || '5', 10);

    if (!query) {
      // Return all curated patterns if no query
      const { data, error } = await supabaseAdmin
        .from('appforge_memory_bank')
        .select('id, label, description, category, tags, quality_score, use_count')
        .eq('source', 'curated')
        .order('quality_score', { ascending: false })
        .limit(20);
      if (error) throw new Error(error.message);
      return NextResponse.json({ patterns: data || [], total: data?.length || 0 });
    }

    let results;
    try {
      results = await vectorSearch(query, category, limit);
    } catch {
      results = await keywordSearch(query, category, limit);
    }

    return NextResponse.json({
      patterns: results,
      total: results.length,
      query,
      category,
    });
  } catch (error) {
    console.error('[memory-bank GET]', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ── POST — save, search with embedding, or mark used ─────────────────────────
export async function POST(request) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'save': {
        const saved = await savePattern(body);
        return NextResponse.json({ success: true, pattern: saved });
      }

      case 'search': {
        const { query, category, limit = 5 } = body;
        if (!query) return NextResponse.json({ error: 'query is required' }, { status: 400 });

        let results;
        try {
          results = await vectorSearch(query, category, limit);
        } catch {
          results = await keywordSearch(query, category, limit);
        }

        return NextResponse.json({ patterns: results, total: results.length });
      }

      case 'used': {
        const { patternId } = body;
        if (!patternId) return NextResponse.json({ error: 'patternId is required' }, { status: 400 });
        const result = await markUsed(patternId);
        return NextResponse.json(result);
      }

      case 'embed-all': {
        // Admin utility: re-embed all patterns that have no embedding
        const { data: unembedded } = await supabaseAdmin
          .from('appforge_memory_bank')
          .select('id, label, description, category, tags')
          .is('embedding', null)
          .limit(50);

        const results = [];
        for (const row of unembedded || []) {
          try {
            const text = `${row.label}. ${row.description}. Category: ${row.category}. Tags: ${(row.tags || []).join(', ')}.`;
            const embedding = await generateEmbedding(text);
            await supabaseAdmin
              .from('appforge_memory_bank')
              .update({ embedding: JSON.stringify(embedding) })
              .eq('id', row.id);
            results.push({ id: row.id, label: row.label, status: 'embedded' });
          } catch (e) {
            results.push({ id: row.id, label: row.label, status: 'failed', error: e.message });
          }
          // Small delay to avoid rate-limiting
          await new Promise((r) => setTimeout(r, 200));
        }

        return NextResponse.json({ success: true, processed: results.length, results });
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch (error) {
    console.error('[memory-bank POST]', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}