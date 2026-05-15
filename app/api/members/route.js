import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// GET /api/members?projectId=xxx  — get project members
// GET /api/members?search=xxx     — search all users (for inviting)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');
    const search    = searchParams.get('search');

    if (search) {
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('id, full_name, email, avatar_url, role, is_premium')
        .or(`full_name.ilike.%${search}%,email.ilike.%${search}%`)
        .limit(10);
      if (error) throw error;
      return NextResponse.json({ members: data || [] });
    }

    if (projectId) {
      const { data, error } = await supabaseAdmin
        .from('project_members')
        .select('user_id, role, profile:profiles(id, full_name, email, avatar_url, role)')
        .eq('project_id', projectId);
      if (error) throw error;
      return NextResponse.json({ members: (data || []).map(m => ({ ...m.profile, memberRole: m.role })) });
    }

    // Return all developers
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('id, full_name, email, avatar_url, role, is_premium')
      .eq('role', 'developer')
      .limit(50);
    if (error) throw error;
    return NextResponse.json({ members: data || [] });

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/members — add member to project
export async function POST(req) {
  try {
    const { project_id, user_id, role = 'developer' } = await req.json();
    if (!project_id || !user_id) return NextResponse.json({ error: 'project_id and user_id required' }, { status: 400 });

    const { error } = await supabaseAdmin
      .from('project_members')
      .upsert([{ project_id, user_id, role }]);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/members?projectId=x&userId=y
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');
    const userId    = searchParams.get('userId');

    const { error } = await supabaseAdmin
      .from('project_members')
      .delete()
      .eq('project_id', projectId)
      .eq('user_id', userId);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}