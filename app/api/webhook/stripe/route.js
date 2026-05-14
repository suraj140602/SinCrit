import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// Your Stripe Webhook Secret (starts with 'whsec_')
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Initialize Supabase Admin (Required to bypass RLS and insert the purchase)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  // 1. Get the raw text body and the Stripe signature header
  const rawBody = await req.text();
  const signature = req.headers.get('stripe-signature');

  let event;

  // 2. Verify the webhook actually came from Stripe (Hack prevention)
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, endpointSecret);
  } catch (err) {
    console.error(`⚠️ Webhook signature verification failed:`, err.message);
    return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
  }

  // 3. Handle the successful checkout event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Extract the IDs we hid in the metadata during the checkout step!
    const buyerId = session.metadata?.buyerId;
    const themeId = session.metadata?.themeId;

    if (buyerId && themeId) {
      try {
        // 4. Delivery! Insert the record into Supabase to unlock it for the user
        const { error } = await supabaseAdmin
          .from('user_purchases')
          .insert([
            { user_id: buyerId, item_id: themeId }
          ]);

        if (error) throw error;
        
        console.log(`✅ Successfully delivered theme ${themeId} to user ${buyerId}`);
      } catch (dbError) {
        console.error('Database Insert Error:', dbError);
        // Do NOT return a 500 here, or Stripe will retry the webhook 10 times
      }
    }
  }

  // 5. Tell Stripe we got the message
  return NextResponse.json({ received: true }, { status: 200 });
}