import { stripe } from "@/lib/stripe";
import { db } from "@/db";
import { user, payment } from "@/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  let event: Stripe.Event;

  if (!stripe) {
    return new NextResponse("Stripe is not configured", { status: 500 });
  }

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  console.log("session :", session);

  if (event.type === "checkout.session.completed") {
    try {
      if (!session?.metadata?.userId) {
        console.error("Missing userId in metadata for session:", session.id);
        return new NextResponse("User id is required", { status: 400 });
      }

      const userId = session.metadata.userId;

      // 1. Store the Payment History
      await db.insert(payment).values({
        id: (session.payment_intent as string) || (session.id as string),
        userId: userId,
        stripeSessionId: session.id,
        amount: session.amount_total || 0,
        currency: session.currency || "usd",
        status: session.payment_status || "completed",
      });

      console.log(`[Webhook] Stored payment history for user ${userId}`);

      // 2. Fetch Subscription if exists and update User
      let stripeSubscriptionId = null;
      let stripeCustomerId = session.customer as string;
      let stripePriceId = null;
      let subscriptionStatus = "active";

      if (session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );
        stripeSubscriptionId = subscription.id;
        stripeCustomerId = subscription.customer as string;
        stripePriceId = subscription.items.data[0].price.id;
        subscriptionStatus = subscription.status;
      }

      await db.update(user)
        .set({
          plan: "pro",
          credits: 100,
          stripeSubscriptionId: stripeSubscriptionId,
          stripeCustomerId: stripeCustomerId,
          stripePriceId: stripePriceId,
          subscriptionStatus: subscriptionStatus,
        })
        .where(eq(user.id, userId));

      console.log(`[Webhook] User ${userId} successfully upgraded to Pro Plan.`);

    } catch (e: any) {
      console.error("[Webhook Error] Failed to process checkout completed event:", e);
      return new NextResponse(`Webhook Processing Error: ${e.message}`, { status: 500 });
    }
  }

  if (event.type === "customer.subscription.deleted") {
    // Handling cancellation
    const subscription = event.data.object as Stripe.Subscription;
    const userId = subscription.metadata.userId;

    if (userId) {
      await db.update(user)
        .set({
          plan: "free",
          credits: 10,
          subscriptionStatus: "canceled",
        })
        .where(eq(user.id, userId));
    }
  }

  return new NextResponse(null, { status: 200 });
}
