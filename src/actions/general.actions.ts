"use server";

import { db } from "@/db/neon";
import { practiceTemplates, users, pitchFeedback } from "@/db/schema";
import { CreateFeedbackParams, exportPitchFeedbackSchema } from "@/types/type";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq, ilike, count } from "drizzle-orm";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";

export async function getCurrentUser() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return null;
  }

  const user = await db.query.users.findFirst({
    where: eq(users.clerkUserId, clerkUser.id),
  });

  return user;
}

export async function getPracticeTemplates(
  search?: string,
  difficulty?: string,
  industry?: string,
  page: number = 1,
  pageSize: number = 8
) {
  const whereConditions = [eq(practiceTemplates.isActive, true)];

  if (search && search.trim() !== "") {
    whereConditions.push(ilike(practiceTemplates.title, `%${search}%`));
  }

  if (difficulty && difficulty.trim() !== "") {
    whereConditions.push(eq(practiceTemplates.difficulty, difficulty));
  }

  if (industry && industry.trim() !== "") {
    whereConditions.push(eq(practiceTemplates.industry, industry));
  }

  const countResult = await db
    .select({ value: count() })
    .from(practiceTemplates)
    .where(and(...whereConditions));

  const totalCount = countResult[0].value;

  const templates = await db.query.practiceTemplates.findMany({
    where: and(...whereConditions),
    orderBy: (templates, { asc }) => [asc(templates.difficulty)],
    limit: pageSize,
    offset: (page - 1) * pageSize,
  });

  return {
    templates,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
  };
}

export async function getUniqueDifficulties() {
  const result = await db
    .selectDistinct({ difficulty: practiceTemplates.difficulty })
    .from(practiceTemplates)
    .where(eq(practiceTemplates.isActive, true));

  return result.map((r) => r.difficulty);
}

export async function getUniqueIndustries() {
  const result = await db
    .selectDistinct({ industry: practiceTemplates.industry })
    .from(practiceTemplates)
    .where(eq(practiceTemplates.isActive, true));

  return result.map((r) => r.industry);
}

export async function createFeedback(params: CreateFeedbackParams) {
  const { pitchingId, userId, transcript, feedbackId } = params;

  try {
    const formattedTranscript = transcript
      .map(
        (sentence: { role: string; content: string }) =>
          `- ${sentence.role}: ${sentence.content}\n`
      )
      .join("");

    const { object } = await generateObject({
      model: google("gemini-2.0-flash-001", {
        structuredOutputs: true,
      }),
      schema: exportPitchFeedbackSchema,
      prompt: `
            You are an AI pitching analyzing a pitching exercise. Your task is to evaluate the seller based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the seller. If there are mistakes or areas for improvement, point them out.
        Transcript:
        ${formattedTranscript}

        Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
        - **Product Knowledge**: Understanding of the product features, benefits, and cultural significance.
        - **Market Relevance**: Ability to connect the product to the target market's needs and preferences.
        - **Handling Objections**: Skill in addressing buyer concerns (such as quality, certification, cultural fit).
        - **Negotiation Skills**: Ability to negotiate terms like pricing, shipping, and payment while maintaining margins.
        - **Logistics and Payment Understanding**: Knowledge of export regulations, shipping options, and international payment methods.
        `,
      system:
        "You are a pitching analysis AI. Your task is to evaluate the seller based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the seller. If there are mistakes or areas for improvement, point them out.",
    });

    const feedbackData = {
      pitchingId: pitchingId,
      userId: userId,
      totalScore: object.totalScore,
      categoryScores: JSON.stringify(object.categoryScores),
      strengths: JSON.stringify(object.strengths),
      areasForImprovement: JSON.stringify(object.areasForImprovement),
      finalAssessment: object.finalAssessment,
      transcript: formattedTranscript,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    let result;

    if (feedbackId) {
      result = await db
        .update(pitchFeedback)
        .set(feedbackData)
        .where(eq(pitchFeedback.id, parseInt(feedbackId)))
        .returning();
    } else {
      result = await db.insert(pitchFeedback).values(feedbackData).returning();
    }

    return {
      success: true,
      feedbackId: result[0].id,
      message: "Feedback created successfully",
    }

  } catch (error) {
    console.error("Error creating feedback:", error);
    throw new Error("Failed to create feedback");
  }
}

export async function getPracticeById(id: number) {
  try {
    const template = await db.query.practiceTemplates.findFirst({
      where: eq(practiceTemplates.id, id),
    })

    return template
  } catch (error) {
    console.error("Error fetching practice template:", error);
    throw new Error("Failed to fetch practice template");
  }
}