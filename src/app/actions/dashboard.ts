"use server";

import { db } from "@/db";
import { socialContent } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

/**
 * Updates an existing social content post.
 */
export async function updatePostAction(id: string, data: { title: string; body: string }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) throw new Error("Unauthorized");

  await db.update(socialContent)
    .set({
      title: data.title,
      body: data.body,
      updatedAt: new Date(),
    })
    .where(and(
      eq(socialContent.id, id),
      eq(socialContent.userId, session.user.id)
    ));

  revalidatePath("/dashboard");
  return { success: true };
}

/**
 * Deletes an existing social content post.
 */
export async function deletePostAction(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) throw new Error("Unauthorized");

  await db.delete(socialContent)
    .where(and(
      eq(socialContent.id, id),
      eq(socialContent.userId, session.user.id)
    ));

  revalidatePath("/dashboard");
  return { success: true };
}
