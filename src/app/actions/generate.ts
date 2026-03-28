"use server";

import { generateSocialPost } from "@/lib/ai";
import { db } from "@/db";
import { socialContent } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function generateAction(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) throw new Error("Unauthorized");

  const platform = formData.get("platform") as string;
  const topic = formData.get("topic") as string;
  const keywords = (formData.get("keywords") as string)?.split(",").map(k => k.trim());

  const result = await generateSocialPost({ platform, topic, keywords });
  console.log(result);
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
    }
  }).returning();

  return post;
}
