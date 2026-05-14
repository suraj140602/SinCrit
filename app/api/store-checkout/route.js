import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Initialize Stripe with your Secret Key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Initialize Supabase Admin (to fetch theme details securely)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const { themeId, buyerId } = await req.json();

    // 1. Fetch the Theme from Supabase
    const { data: theme, error: themeError } = await supabaseAdmin
      .from('marketplace_items')
      .select('*')
      .eq('id', themeId)
      .single();

    if (themeError || !theme) {
      return NextResponse.json({ error: 'Theme not found' }, { status: 404 });
    }

    // 2. Calculate the AppForge 25% Platform Fee (in cents)
    const priceInCents = Math.round(theme.price_usd * 100);
    const platformFeeInCents = Math.round(priceInCents * 0.25);

    // 3. Create the Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { 
                name: theme.title,
                description: theme.description,
                images: theme.thumbnail_url ? [theme.thumbnail_url] : [],
            },
            unit_amount: priceInCents, 
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      
      // THIS IS THE BILLION DOLLAR CODE BLOCK:
      payment_intent_data: {
        application_fee_amount: platformFeeInCents, // Your 25% Cut
        transfer_data: {
          destination: theme.creator_stripe_account_id, // Their 75% Cut
        },
      },
      
      // Store the theme ID and Buyer ID in the metadata so we know who to give it to after they pay
      metadata: {
        themeId: theme.id,
        buyerId: buyerId
      },
      success_url: `${process.env.NEXT_PUBLIC_URL}/store?success=true&themeId=${theme.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/store?canceled=true`,
    });

    return NextResponse.json({ url: session.url });

  } catch (error) {
    console.error('Store Checkout Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}