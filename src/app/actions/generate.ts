"use server";

import { generateSocialPost } from "@/lib/ai";
import { db } from "@/db";
import { socialContent, user } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, sql } from "drizzle-orm";

export async function generateAction(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) throw new Error("Unauthorized");

  // Credit system logic
  const userData = await db.query.user.findFirst({
    where: eq(user.id, session.user.id),
  });

  if (!userData) throw new Error("User not found");

  const now = new Date();
  const lastReset = new Date(userData.lastCreditReset);
  const diffInHours = (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60);

  let currentCredits = userData.credits;

  // Reset credits if last reset was more than 24h ago
  if (diffInHours >= 24) {
    currentCredits = userData.plan === "pro" ? 100 : 10;
    await db.update(user)
      .set({ 
        credits: currentCredits, 
        lastCreditReset: now 
      })
      .where(eq(user.id, session.user.id));
  }

  if (currentCredits <= 0) {
    throw new Error("You have run out of credits for today. Please upgrade to Pro for more.");
  }

  const platform = formData.get("platform") as string;
  const topic = formData.get("topic") as string;
  const keywords = (formData.get("keywords") as string)?.split(",").map(k => k.trim());

  const result = await generateSocialPost({ platform, topic, keywords });
  
  // Save to database
  const [post] = await db.insert(socialContent).values({
    userId: session.user.id,
    platform,
    title: result.title,
    body: result.body,
    keywords: result.keywords,
    hashtags: result.hashtags,
    status: "draft",
    seoScore: result.score,
    metadata: {
      ogTitle: result.title,
      ogDescription: result.body.substring(0, 160),
      seoExplanation: result.seo_explanation,
      imagePrompt: result.image_prompt,
    }
  }).returning();

  // Deduct credit
  await db.update(user)
    .set({ credits: sql`${user.credits} - 1` })
    .where(eq(user.id, session.user.id));

  return post;
}
