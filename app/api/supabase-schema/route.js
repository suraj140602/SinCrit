import { NextResponse } from 'next/server';

const normalizeSupabaseUrl = (url) => {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.endsWith('.supabase.co')) return null;
    return parsed.origin;
  } catch {
    return null;
  }
};

const getProjectRef = (projectRef, url) => {
  if (projectRef) return String(projectRef).trim();
  const normalizedUrl = normalizeSupabaseUrl(url);
  if (!normalizedUrl) return '';
  return new URL(normalizedUrl).hostname.split('.')[0];
};

export async function POST(req) {
  try {
    const body = await req.json();
    const { action, url, anonKey, managementToken, sql } = body;
    const projectRef = getProjectRef(body.projectRef, url);

    if (action === 'validate') {
      const normalizedUrl = normalizeSupabaseUrl(url);
      if (!normalizedUrl || !anonKey) {
        return NextResponse.json({ error: 'Supabase URL and anon key are required.' }, { status: 400 });
      }

      const restResponse = await fetch(`${normalizedUrl}/rest/v1/`, {
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${anonKey}`,
          Accept: 'application/openapi+json'
        }
      });

      if (!restResponse.ok) {
        return NextResponse.json({ error: 'Could not validate Supabase runtime access. Check the URL and anon key.' }, { status: 400 });
      }

      let managementReady = false;
      if (managementToken && projectRef) {
        const projectResponse = await fetch(`https://api.supabase.com/v1/projects/${projectRef}`, {
          headers: { Authorization: `Bearer ${managementToken}` }
        });
        managementReady = projectResponse.ok;
      }

      return NextResponse.json({ ok: true, projectRef, managementReady });
    }

    if (action === 'execute') {
      if (!projectRef || !managementToken || !sql) {
        return NextResponse.json({ error: 'Project ref, Management API token, and SQL are required.' }, { status: 400 });
      }

      const queryResponse = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${managementToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: sql,
          read_only: false
        })
      });

      const resultText = await queryResponse.text();
      let result = {};
      try {
        result = resultText ? JSON.parse(resultText) : {};
      } catch {
        result = { message: resultText };
      }

      if (!queryResponse.ok) {
        return NextResponse.json({ error: result.message || result.error || 'Supabase rejected the SQL migration.' }, { status: queryResponse.status });
      }

      return NextResponse.json({ ok: true, result });
    }

    return NextResponse.json({ error: 'Unknown action.' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Supabase schema operation failed.' }, { status: 500 });
  }
}
