import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Initialize Stripe with your Secret Key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Initialize Supabase Admin (Required to securely update the user's profile)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(req) {
  try {
    // 1. Get the userId from the URL we passed in the frontend
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) return NextResponse.json({ error: 'User ID is required' }, { status: 400 });

    // 2. Check if they already have an account ID in Supabase
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('stripe_account_id')
      .eq('id', userId)
      .single();

    let accountId = profile?.stripe_account_id;

    // 3. If they don't have a Stripe account yet, create one!
    if (!accountId) {
      const account = await stripe.accounts.create({
        type: 'express', // 'Express' is Stripe's pre-built UI for marketplace sellers
      });
      accountId = account.id;

      // Immediately save this new Stripe Account ID to their Supabase profile
      await supabaseAdmin
        .from('profiles')
        .update({ stripe_account_id: accountId })
        .eq('id', userId);
    }

const baseUrl = 'https://sin-crit.vercel.app';

    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${process.env.NEXT_PUBLIC_URL}/builder`, // If they click 'back'
      return_url: `${process.env.NEXT_PUBLIC_URL}/builder?stripe_connected=true`, // On success
      type: 'account_onboarding',
    });

    // 5. Redirect the user's browser to the Stripe secure page
    return NextResponse.redirect(accountLink.url);

    } catch (error) {
    console.error('Stripe Connect Error:', error);
    // FIXED: Now it will print the EXACT reason it crashed to your browser!
    return NextResponse.json({ 
      error: 'Failed to connect Stripe', 
      details: error.message 
    }, { status: 500 });
  }
}