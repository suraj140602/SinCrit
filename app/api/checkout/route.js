import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { userId } = await request.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          // TODO: Create a $49/mo product in your Stripe Dashboard and paste the Price ID here
          price: 'price_1TVU3mEcIA7SUbFJVqvXaEW4', 
          quantity: 1,
        },
      ],
      // FIX: Changed from 'payment' to 'subscription'
      mode: 'subscription', 
      
      // We pass the userId so the Webhook knows whose account to upgrade
      metadata: {
        userId: userId
      },
      
      // Hardcoded temporarily to guarantee it works
      success_url: `http://localhost:3000/?success=true`,
      cancel_url: `http://localhost:3000/?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}