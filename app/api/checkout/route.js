import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ────────────────────────────────────────────────────────────
// POST /api/checkout  →  creates a Stripe Checkout Session
// ────────────────────────────────────────────────────────────
export async function POST(req) {
  try {
    const { userId, projectId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    // 1. Guard: is the user already premium?
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('is_premium, email')
      .eq('id', userId)
      .single();

    if (profile?.is_premium) {
      return NextResponse.json({ alreadyPremium: true });
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://sin-crit.vercel.app';

    // 2. Build success / cancel URLs — NO payment-loop query params
    const successUrl = `${baseUrl}/builder?upgraded=true&projectId=${projectId || ''}`;
    const cancelUrl  = `${baseUrl}/builder?upgrade_cancelled=true`;

    // 3. Create a one-time Checkout Session (subscription)
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: profile?.email || undefined,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            recurring: { interval: 'month' },
            product_data: {
              name: 'AppForge Pro',
              description: 'Unlimited APK builds, Flutter export, AI features & more.',
              images: [`${baseUrl}/logo.png`],
            },
            unit_amount: 1900, // $19.00
          },
          quantity: 1,
        },
      ],
      metadata: { userId, projectId: projectId || '' },
      success_url: successUrl,
      cancel_url:  cancelUrl,
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Block GET / other methods
export async function GET()    { return NextResponse.json({ error: 'Method not allowed' }, { status: 405 }); }
export async function PUT()    { return NextResponse.json({ error: 'Method not allowed' }, { status: 405 }); }
export async function DELETE() { return NextResponse.json({ error: 'Method not allowed' }, { status: 405 }); }