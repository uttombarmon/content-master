"use server";

import { stripe } from "@/lib/stripe";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Creates a Stripe Checkout Session for subscription.
 */
export async function createCheckoutSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const dbUser = await db.query.user.findFirst({
    where: eq(user.id, session.user.id),
  });

  if (!dbUser) {
    throw new Error("User not found");
  }

  let stripeCustomerId = dbUser.stripeCustomerId;

  // Create Stripe customer if it doesn't exist
  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: session.user.email,
      name: session.user.name,
      metadata: {
        userId: session.user.id,
      },
    });
    stripeCustomerId = customer.id;

    await db.update(user)
      .set({ stripeCustomerId })
      .where(eq(user.id, session.user.id));
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    line_items: [
      {
        price: process.env.STRIPE_PRO_PRICE_ID, // Ensure this matches your dashboard
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${baseUrl}/dashboard?success=true`,
    cancel_url: `${baseUrl}/dashboard?canceled=true`,
    metadata: {
      userId: session.user.id,
    },
  });

  return { url: checkoutSession.url };
}
