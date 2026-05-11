import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// Get this from your Stripe Dashboard (Developers -> Webhooks)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET; 

export async function POST(req) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  let event;

  try {
    // 1. Verify the request is actually from Stripe
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook Error:', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // 2. Handle the successful subscription
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    // Retrieve the userId we passed in Step 1
    const userId = session.metadata.userId;
    const subscriptionId = session.subscription;

    // 3. Initialize Supabase Admin (Bypasses RLS security)
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY // MUST use service role key
    );

    // 4. Upgrade the User's Workspace in Supabase
    // (Assuming you have a 'profiles' or 'users' table linking to their auth.uid)
    const { error } = await supabaseAdmin
      .from('profiles')
      .update({ 
        is_premium: true, 
        stripe_subscription_id: subscriptionId 
      })
      .eq('id', userId);

    if (error) console.error("Supabase Admin Update Error:", error);
  }

  // Optional: Handle cancellations
  if (event.type === 'customer.subscription.deleted') {
     const subscriptionId = event.data.object.id;
     const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
     
     // Downgrade the user back to free tier
     await supabaseAdmin
      .from('profiles')
      .update({ is_premium: false })
      .eq('stripe_subscription_id', subscriptionId);
  }

  return NextResponse.json({ received: true });
}