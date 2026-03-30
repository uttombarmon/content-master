"use server";

import { stripe } from "@/lib/stripe";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Creates a Stripe Checkout Session for subscription
 * or falls back to a simulated upgrade in development if keys are missing.
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

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
//|| !process.env.STRIPE_PRO_PRICE_ID
  if (!stripe ) {
    // if (process.env.NODE_ENV !== "production") {
    //   // Simulate upgrade in development mode
    //   await db.update(user)
    //     .set({ plan: "pro", credits: 100 })
    //     .where(eq(user.id, session.user.id));
      
    //   return { url: `${baseUrl}/dashboard?success=true&simulated=true` };
    // } else {
      throw new Error("Stripe is not configured. Please add STRIPE_SECRET_KEY and STRIPE_PRO_PRICE_ID to your environment variables.");
    // }
  }

  let stripeCustomerId = dbUser.stripeCustomerId;

  // console.log("stripeCustomerId :",stripeCustomerId)

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

/**
 * Creates a Stripe Customer Portal Session for managing subscriptions.
 */
// export async function createCustomerPortalSession() {
//   const session = await auth.api.getSession({
//     headers: await headers(),
//   });

//   if (!session?.user) {
//     throw new Error("Unauthorized");
//   }

//   const dbUser = await db.query.user.findFirst({
//     where: eq(user.id, session.user.id),
//   });

//   if (!dbUser) {
//     throw new Error("User not found");
//   }

//   const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

//   // Simulate portal down in dev mode if Stripe not configured
//   if (!stripe) {
//      if (process.env.NODE_ENV !== "production") {
//         // Un-upgrade them for testing cancellation
//         await db.update(user)
//           .set({ plan: "free", credits: 10 })
//           .where(eq(user.id, session.user.id));
//         return { url: `${baseUrl}/dashboard?canceled=true&simulated_cancel=true` };
//      } else {
//         throw new Error("Stripe is not configured.");
//      }
//   }

//   if (!dbUser.stripeCustomerId) {
//     throw new Error("You don't have an active Stripe customer account.");
//   }

//   const portalSession = await stripe.billingPortal.sessions.create({
//     customer: dbUser.stripeCustomerId,
//     return_url: `${baseUrl}/dashboard`,
//   });

//   return { url: portalSession.url };
// }
