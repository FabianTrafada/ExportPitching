import { getCurrentUser } from "@/actions/general.actions";
import { db } from "@/db/neon";
import { pitchingSessions, practiceTemplates } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function startPracticeSession(id: number) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    // Nambahin usageCount
    await db
      .update(practiceTemplates)
      .set({
        usageCount: +1,
        updatedAt: new Date(),
      })
      .where(eq(practiceTemplates.id, id));

    const newSession = await db.insert(pitchingSessions).values({
      userId: user.id,
      templateId: id,
      status: "in_progress",
      createdAt: new Date(),
    }).returning();

    if(newSession && newSession[0]) {
        return { success: true, pitchingId: newSession[0].id };
    }

    return { success: false, message: "Failed to create new session" };
  } catch (error) {
    console.error("Error starting practice session:", error);
    return { success: false, message: "Failed to start practice session" };
  }
}
