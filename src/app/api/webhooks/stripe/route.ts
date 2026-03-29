import { stripe } from "@/lib/stripe";
import { db } from "@/db";
import { user } from "@/db/schema";
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

  if (event.type === "checkout.session.completed") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    if (!session?.metadata?.userId) {
      return new NextResponse("User id is required", { status: 400 });
    }

    await db.update(user)
      .set({
        plan: "pro",
        credits: 100,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0].price.id,
        subscriptionStatus: subscription.status,
      })
      .where(eq(user.id, session.metadata.userId));
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
