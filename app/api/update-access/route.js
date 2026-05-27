import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const WINDOW_MS    = 60 * 1000;
const MAX_REQUESTS = 10;
const rateLimitMap = new Map();

function isRateLimited(ip) {
  const now   = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry.windowStart > WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return false;
  }
  if (entry.count >= MAX_REQUESTS) return true;
  entry.count++;
  return false;
}

function isValidEmail(email) {
  return (
    typeof email === 'string' &&
    email.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  );
}

const ALLOWED_ACTIONS = new Set(['grant_pro', 'revoke']);

export async function POST(request) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait before trying again.' },
      { status: 429 }
    );
  }

  const authHeader = request.headers.get('authorization');
  if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_PASSPHRASE}`) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const { email, action } = body;

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: 'A valid email address is required.' },
      { status: 400 }
    );
  }

  if (!ALLOWED_ACTIONS.has(action)) {
    return NextResponse.json(
      { error: `Invalid action. Must be one of: ${[...ALLOWED_ACTIONS].join(', ')}.` },
      { status: 400 }
    );
  }

  // Whitelisted DB values — no user-supplied data reaches columns directly
  const updateData =
    action === 'grant_pro'
      ? { status: 'Pro',  access: true  }
      : { status: 'Free', access: false };

  // Verify user exists before updating
  const { data: existingUser, error: lookupError } = await supabase
    .from('user')
    .select('email, status')
    .eq('email', email)
    .maybeSingle();

  if (lookupError) {
    console.error('[update-access] Lookup error:', lookupError.message);
    return NextResponse.json(
      { error: 'Database error during user lookup.' },
      { status: 500 }
    );
  }

  if (!existingUser) {
    return NextResponse.json(
      { error: `No account found for ${email}.` },
      { status: 404 }
    );
  }

  const { error: updateError } = await supabase
    .from('user')
    .update(updateData)
    .eq('email', email);

  if (updateError) {
    console.error('[update-access] Update error:', updateError.message);
    return NextResponse.json(
      { error: 'Failed to update user. Please try again.' },
      { status: 500 }
    );
  }

  // Audit log — non-fatal if it fails
  const { error: auditError } = await supabase
    .from('admin_audit_log')
    .insert({
      action,
      target_email:    email,
      previous_status: existingUser.status,
      new_status:      updateData.status,
      ip,
    });

  if (auditError) {
    console.warn('[update-access] Audit log failed:', auditError.message);
  }

  return NextResponse.json({
    success: true,
    message: `${email} updated to ${updateData.status}.`,
  });
}

export async function GET()    { return NextResponse.json({ error: 'Method not allowed.' }, { status: 405 }); }
export async function PUT()    { return NextResponse.json({ error: 'Method not allowed.' }, { status: 405 }); }
export async function DELETE() { return NextResponse.json({ error: 'Method not allowed.' }, { status: 405 }); }