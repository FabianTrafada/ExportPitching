"use server";

import { getCurrentUser } from "@/actions/general.actions";
import { db } from "@/db/neon";
import { pitchingSessions, practiceTemplates, users } from "@/db/schema";
import { eq, and, inArray, desc, sql } from "drizzle-orm";

export async function startPracticeSession(id: number) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("User not authenticated");
    }
    
    // Check if user has enough credits
    if (user.credit < 1) {
      return { success: false, message: "Not enough credits to start a practice session" };
    }

    // Deduct 1 credit from user
    await db
      .update(users)
      .set({
        credit: user.credit - 10,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    // Increment usageCount
    await db
      .update(practiceTemplates)
      .set({
        usageCount: sql`${practiceTemplates.usageCount} + 1`,
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

export async function getUserPracticeSessions(userId: number) {
  try {
    // Using select query pattern instead of findMany
    const sessions = await db
      .select()
      .from(pitchingSessions)
      .where(eq(pitchingSessions.userId, userId))
      .orderBy(desc(pitchingSessions.createdAt))
      .limit(5);

    // Load templates in a separate query
    const sessionsWithTemplates = await Promise.all(
      sessions.map(async (session) => {
        const template = await db
          .select({
            id: practiceTemplates.id,
            title: practiceTemplates.title,
            difficulty: practiceTemplates.difficulty,
            industry: practiceTemplates.industry,
            targetMarket: practiceTemplates.targetMarket,
            imageUrl: practiceTemplates.imageUrl,
          })
          .from(practiceTemplates)
          .where(eq(practiceTemplates.id, session.templateId))
          .then((results) => results[0]);

        return {
          ...session,
          template,
        };
      })
    );

    return sessionsWithTemplates;
  } catch (error) {
    console.error("Error fetching user practice sessions:", error);
    throw new Error("Failed to fetch user practice sessions");
  }
}

export async function getRecommendedTemplates(userId: number) {
  try {
    // Get user sessions
    const userSessions = await db
      .select()
      .from(pitchingSessions)
      .where(eq(pitchingSessions.userId, userId))
      .orderBy(desc(pitchingSessions.createdAt));

    // If no sessions, return popular templates
    if (userSessions.length === 0) {
      return db
        .select()
        .from(practiceTemplates)
        .where(eq(practiceTemplates.isActive, true))
        .orderBy(desc(practiceTemplates.usageCount))
        .limit(3);
    }

    // Get all templates for user sessions
    const templateIds = userSessions.map(session => session.templateId);
    const templates = await db
      .select()
      .from(practiceTemplates)
      .where(
        inArray(practiceTemplates.id, templateIds)
      );

    // Get industries user has practiced with
    const userIndustries = [...new Set(templates.map(t => t.industry))];
    
    // Get recommended templates based on user's industries
    if (userIndustries.length > 0) {
      return db
        .select()
        .from(practiceTemplates)
        .where(
          and(
            eq(practiceTemplates.isActive, true),
            inArray(practiceTemplates.industry, userIndustries)
          )
        )
        .orderBy(desc(practiceTemplates.usageCount))
        .limit(3);
    } else {
      // Fallback to popular templates
      return db
        .select()
        .from(practiceTemplates)
        .where(eq(practiceTemplates.isActive, true))
        .orderBy(desc(practiceTemplates.usageCount))
        .limit(3);
    }
  } catch (error) {
    console.error("Error fetching recommended templates:", error);
    throw new Error("Failed to fetch recommended templates");
  }
} 