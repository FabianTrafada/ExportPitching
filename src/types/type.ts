import { ReactNode } from "react"
import { z } from "zod"

export interface AnimatedSectionProps {
    children: ReactNode
    className?: string
    delay?: number
    direction?: "up" | "down" | "left" | "right" | "none"
    duration?: number
    once?: boolean
} 

export interface StaggeredListProps {
    children: ReactNode[]
    className?: string
    delay?: number
    staggerDelay?: number
    direction?: "up" | "down" | "left" | "right" | "none"
    duration?: number
    once?: boolean
}

export interface AuthLayoutProps {
  children: ReactNode
  title: string
  description: string
  backUrl?: string
  backLabel?: string
}

export interface DashboardLayoutProps {
  children: ReactNode
}

export interface PracticeCardProps {
  id: number;
  title: string;
  description: string;
  difficulty: string; // beginner, intermediate, advanced
  duration: number; // in minutes
  industry: string;
  targetMarket: string;
  targetMarketCode: string;
  imageUrl?: string | null;
  usageCount: number;
}

export interface PracticeTemplateControlProps {
  templates: PracticeCardProps[];
}

export interface SearchParams {
  search?: string;
  difficulty?: string;
  industry?: string;
  page?: string;
}

export interface AgentProps {
  username: string;
  userId?: string;
  interviewId?: string;
  feedbackId?: string;
  questions?: string[];
}

export interface CreateFeedbackParams {
  pitchingId: string;
  userId: string;
  transcript: { role: string; content: string }[];
  feedbackId?: string;
}

export const exportPitchFeedbackSchema = z.object({
  totalScore: z.number(),
  categoryScores: z.tuple([
    z.object({
      name: z.literal("Product Knowledge"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Market Relevance"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Handling Objections"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Negotiation Skills"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Logistics and Payment Understanding"),
      score: z.number(),
      comment: z.string(),
    }),
  ]),
  strengths: z.array(z.string()),
  areasForImprovement: z.array(z.string()),
  finalAssessment: z.string(),
});
