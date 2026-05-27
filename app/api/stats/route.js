import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const WINDOW_MS    = 60 * 1000;
const MAX_REQUESTS = 20;
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

export async function GET(request) {
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

    const countError = devError || proError || exportError;
    if (countError) throw countError;

    // Fetch recent users with all fields the frontend needs
    const { data: recentUsers, error: userError } = await supabase
      .from('user')
      .select('email, status, access, created_at')
      .order('created_at', { ascending: false })
      .limit(10);

    if (userError) throw userError;

    // Real latency ping
    const pingStart = Date.now();
    await supabase.from('user').select('*', { count: 'exact', head: true }).limit(1);
    const latency = `${Date.now() - pingStart}ms`;

    return NextResponse.json({
      metrics: {
        developers: devCount    ?? 0,
        activeSubs: proCount    ?? 0,
        apkExports: exportCount ?? 0,
        latency,
      },
      // Normalize shape so the frontend gets consistent fields
      recentUsers: (recentUsers ?? []).map((u) => ({
        email:    u.email,
        access:   u.access,
        status:   u.status ?? (u.access ? 'Pro' : 'Free'),
        joinedAt: u.created_at,
      })),
    });

  } catch (error) {
    console.error('[stats] DB error:', error.message);
    return NextResponse.json(
      { error: 'Failed to load stats. Please try again.' },
      { status: 500 }
    );
  }
}

export async function POST()   { return NextResponse.json({ error: 'Method not allowed.' }, { status: 405 }); }
export async function PUT()    { return NextResponse.json({ error: 'Method not allowed.' }, { status: 405 }); }
export async function DELETE() { return NextResponse.json({ error: 'Method not allowed.' }, { status: 405 }); }