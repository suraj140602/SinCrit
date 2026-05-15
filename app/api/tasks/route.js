import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// GET /api/tasks?projectId=xxx  OR  ?assignedTo=xxx
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId  = searchParams.get('projectId');
    const assignedTo = searchParams.get('assignedTo');

    let query = supabaseAdmin.from('tasks').select(`
      *,
      assignee:profiles!tasks_assigned_to_fkey(id, full_name, email, avatar_url),
      creator:profiles!tasks_created_by_fkey(id, full_name, email, avatar_url),
      project:projects(id, name, color)
    `).order('created_at', { ascending: false });

    if (projectId)  query = query.eq('project_id', projectId);
    if (assignedTo) query = query.eq('assigned_to', assignedTo);

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ tasks: data || [] });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/tasks  — create task
export async function POST(req) {
  try {
    const body = await req.json();
    const { title, description, project_id, assigned_to, created_by, priority = 'medium', due_date, tags = [] } = body;

    if (!title || !project_id || !created_by) {
      return NextResponse.json({ error: 'title, project_id, created_by required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('tasks')
      .insert([{ title, description, project_id, assigned_to, created_by, priority, due_date, tags, status: 'todo' }])
      .select(`
        *,
        assignee:profiles!tasks_assigned_to_fkey(id, full_name, email, avatar_url),
        creator:profiles!tasks_created_by_fkey(id, full_name, email, avatar_url),
        project:projects(id, name, color)
      `)
      .single();

    if (error) throw error;
    return NextResponse.json({ task: data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH /api/tasks  — update task (status, fields, etc.)
export async function PATCH(req) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    // Add updated_at
    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        assignee:profiles!tasks_assigned_to_fkey(id, full_name, email, avatar_url),
        creator:profiles!tasks_created_by_fkey(id, full_name, email, avatar_url),
        project:projects(id, name, color)
      `)
      .single();

    if (error) throw error;
    return NextResponse.json({ task: data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/tasks?id=xxx
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    const { error } = await supabaseAdmin.from('tasks').delete().eq('id', id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}