import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

// ---------------------------------------------------------------------------
// Supabase admin client — service role key is server-only, never sent to
// the browser. Bypasses Row Level Security so we can read all rows.
// ---------------------------------------------------------------------------
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ---------------------------------------------------------------------------
// In-memory rate limiter — shared with update-access if you move this to a
// shared lib, but works fine standalone per-route for a low-traffic admin panel.
// Allows MAX_REQUESTS per IP within WINDOW_MS before returning 429.
// Resets on cold start — swap Map for Upstash Redis for persistent limiting.
// ---------------------------------------------------------------------------
const WINDOW_MS    = 60 * 1000; // 1 minute
const MAX_REQUESTS = 20;         // stats is read-only so slightly more generous

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

// ---------------------------------------------------------------------------
// GET /api/stats
// ---------------------------------------------------------------------------
export async function GET(request) {

  // 1. RATE LIMIT — zero cost, runs before anything else
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

  // 2. AUTH GUARD — checked before any DB work
  const authHeader = request.headers.get('authorization');
  if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_PASSPHRASE}`) {
    return NextResponse.json(
      { error: 'Unauthorized.' },
      { status: 401 }
    );
  }

  // 3. FETCH METRICS — all three counts run concurrently
  try {
    const [
      { count: devCount,    error: devError    },
      { count: proCount,    error: proError    },
      { count: exportCount, error: exportError },
    ] = await Promise.all([
      supabase.from('user').select('*',          { count: 'exact', head: true }),
      supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('apk_exports').select('*',   { count: 'exact', head: true }),
    ]);

    // Surface individual query errors rather than silently returning 0
    const countError = devError || proError || exportError;
    if (countError) throw countError;

    // 4. FETCH RECENT USERS
    const { data: recentUsers, error: userError } = await supabase
      .from('user')
      .select('email, status, access')
      .order('created_at', { ascending: false })
      .limit(5);

    if (userError) throw userError;

    // 5. MEASURE REAL ROUND-TRIP LATENCY
    // Pings Supabase with a lightweight query and reports the actual time.
    // More honest than the hardcoded '34ms' in the original.
    const pingStart = Date.now();
    await supabase.from('user').select('*', { count: 'exact', head: true }).limit(1);
    const latency = `${Date.now() - pingStart}ms`;

    // 6. RESPOND
    return NextResponse.json({
      metrics: {
        developers: devCount    ?? 0,
        activeSubs: proCount    ?? 0,
        apkExports: exportCount ?? 0,
        latency,
      },
      recentUsers: recentUsers ?? [],
    });

  } catch (error) {
    console.error('[stats] DB error:', error.message);

    // Never forward raw DB error messages to the client — they can leak
    // table names, column names, or query structure to an attacker.
    return NextResponse.json(
      { error: 'Failed to load stats. Please try again.' },
      { status: 500 }
    );
  }
}

// Block every other HTTP method explicitly
export async function POST()   { return NextResponse.json({ error: 'Method not allowed.' }, { status: 405 }); }
export async function PUT()    { return NextResponse.json({ error: 'Method not allowed.' }, { status: 405 }); }
export async function DELETE() { return NextResponse.json({ error: 'Method not allowed.' }, { status: 405 }); }