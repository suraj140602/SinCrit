import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// ---------------------------------------------------------------------------
// Supabase admin client — service role key stays server-side only, never
// exposed to the browser. This key bypasses Row Level Security so it can
// update any user record.
// ---------------------------------------------------------------------------
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ---------------------------------------------------------------------------
// In-memory rate limiter
// Allows MAX_REQUESTS attempts per IP within WINDOW_MS before blocking.
// Resets automatically after the window expires.
// Note: this resets on each serverless cold start. For persistent rate
// limiting across instances, swap the Map for a Redis/Upstash store.
// ---------------------------------------------------------------------------
const WINDOW_MS   = 60 * 1000; // 1 minute window
const MAX_REQUESTS = 10;        // max 10 requests per IP per window

const rateLimitMap = new Map(); // { ip: { count, windowStart } }

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    // First request in a new window
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return false;
  }

  if (entry.count >= MAX_REQUESTS) {
    return true; // Too many requests
  }

  entry.count++;
  return false;
}

// ---------------------------------------------------------------------------
// Input validators
// ---------------------------------------------------------------------------

/** Basic email sanity check — not a full RFC 5322 parser, but blocks garbage. */
function isValidEmail(email) {
  return (
    typeof email === 'string' &&
    email.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  );
}

/** Only allow the two known action strings — nothing else reaches the DB. */
const ALLOWED_ACTIONS = new Set(['grant_pro', 'revoke']);

function isValidAction(action) {
  return ALLOWED_ACTIONS.has(action);
}

// ---------------------------------------------------------------------------
// POST /api/update-access
// ---------------------------------------------------------------------------
export async function POST(request) {

  // 1. RATE LIMIT — checked before anything else, no DB or auth cost
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

  // 2. AUTH GUARD — must be valid before we read the body or touch the DB
  const authHeader = request.headers.get('authorization');
  if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_PASSPHRASE}`) {
    // Generic message — don't reveal whether the token exists or is wrong
    return NextResponse.json(
      { error: 'Unauthorized.' },
      { status: 401 }
    );
  }

  // 3. PARSE & VALIDATE BODY
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body.' },
      { status: 400 }
    );
  }

  const { email, action } = body;

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: 'A valid email address is required.' },
      { status: 400 }
    );
  }

  if (!isValidAction(action)) {
    return NextResponse.json(
      { error: `Invalid action. Must be one of: ${[...ALLOWED_ACTIONS].join(', ')}.` },
      { status: 400 }
    );
  }

  // 4. RESOLVE WHAT TO WRITE
  // Whitelist maps action → exact DB values so no user-supplied data
  // ever reaches the database columns directly.
  const updateData =
    action === 'grant_pro'
      ? { status: 'Pro',  access: true  }
      : { status: 'Free', access: false };

  // 5. VERIFY THE USER EXISTS FIRST
  // Prevents silently succeeding on a typo'd email address.
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

  // 6. APPLY THE UPDATE
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

  // 7. AUDIT LOG
  // Writes a tamper-evident record of every access change.
  // Create an admin_audit_log table if it doesn't exist yet:
  //   id uuid default gen_random_uuid() primary key,
  //   action text, target_email text, previous_status text,
  //   new_status text, ip text, created_at timestamptz default now()
  const { error: auditError } = await supabase
    .from('admin_audit_log')
    .insert({
      action,
      target_email:    email,
      previous_status: existingUser.status,
      new_status:      updateData.status,
      ip,
    });

  // Audit failure is non-fatal — log it but don't roll back the update
  if (auditError) {
    console.warn('[update-access] Audit log failed:', auditError.message);
  }

  // 8. SUCCESS
  return NextResponse.json({
    success: true,
    message: `${email} updated to ${updateData.status}.`,
  });
}

// Block every other HTTP method explicitly
export async function GET()    { return NextResponse.json({ error: 'Method not allowed.' }, { status: 405 }); }
export async function PUT()    { return NextResponse.json({ error: 'Method not allowed.' }, { status: 405 }); }
export async function DELETE() { return NextResponse.json({ error: 'Method not allowed.' }, { status: 405 }); }