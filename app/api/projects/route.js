import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const dynamic = 'force-dynamic';

// GET /api/projects?userId=xxx
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const role   = searchParams.get('role'); // 'manager' | 'developer'

    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

    let query;

    if (role === 'manager') {
      // Managers see projects they created
      query = supabaseAdmin
        .from('projects')
        .select(`
          *,
          tasks:tasks(count),
          members:project_members(
            user_id,
            role,
            profile:profiles(id, full_name, email, avatar_url, role)
          )
        `)
        .eq('manager_id', userId)
        .order('created_at', { ascending: false });
    } else {
      // Developers see projects they are members of
      const { data: memberProjects } = await supabaseAdmin
        .from('project_members')
        .select('project_id')
        .eq('user_id', userId);

      const projectIds = (memberProjects || []).map(m => m.project_id);

      if (projectIds.length === 0) return NextResponse.json({ projects: [] });

      query = supabaseAdmin
        .from('projects')
        .select(`
          *,
          tasks:tasks(count),
          members:project_members(
            user_id,
            role,
            profile:profiles(id, full_name, email, avatar_url, role)
          )
        `)
        .in('id', projectIds)
        .order('created_at', { ascending: false });
    }

    const { data: projects, error } = await query;
    if (error) throw error;

    return NextResponse.json({ projects: projects || [] });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/projects  — create project
export async function POST(req) {
  try {
    const body = await req.json();
    const { name, description, manager_id, deadline, color = '#3b82f6', member_ids = [] } = body;

    if (!name || !manager_id) {
      return NextResponse.json({ error: 'name and manager_id required' }, { status: 400 });
    }

    const { data: project, error } = await supabaseAdmin
      .from('projects')
      .insert([{ name, description, manager_id, deadline, color, status: 'active' }])
      .select()
      .single();

    if (error) throw error;

    // Add manager as a member too
    const allMembers = [...new Set([manager_id, ...member_ids])];
    if (allMembers.length > 0) {
      await supabaseAdmin.from('project_members').insert(
        allMembers.map(uid => ({
          project_id: project.id,
          user_id: uid,
          role: uid === manager_id ? 'manager' : 'developer',
        }))
      );
    }

    return NextResponse.json({ project });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH /api/projects  — update project
export async function PATCH(req) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    const { data, error } = await supabaseAdmin
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ project: data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/projects?id=xxx
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    await supabaseAdmin.from('tasks').delete().eq('project_id', id);
    await supabaseAdmin.from('project_members').delete().eq('project_id', id);
    const { error } = await supabaseAdmin.from('projects').delete().eq('id', id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}