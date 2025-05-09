import { CreateAssistantDTO } from "@vapi-ai/web/dist/api"
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
  username?: string;
  userId?: number;
  pitchingId?: number;
  feedbackId?: string;
  questions?: string[];
}

export interface CreateFeedbackParams {
  pitchingId: number;
  userId: number;
  transcript: { role: string; content: string }[];
  feedbackId?: string;
}

export const exportPitchFeedbackSchema = z.object({
  totalScore: z.number(),
  categoryScores: z.array(
    z.object({
      name: z.string(),
      score: z.number(),
      comment: z.string(),
    })
  ).min(1),
  strengths: z.array(z.string()),
  areasForImprovement: z.array(z.string()),
  finalAssessment: z.string(),
});

export const interviewer: CreateAssistantDTO = {
  name: "Pitcher",
  firstMessage:
    "Hello! Thank you for taking the time to speak with me today. I'm excited to learn more about the product.",
  transcriber: {
    provider: "deepgram",
    model: "nova-2",
    language: "en",
  },
  voice: {
    provider: "11labs",
    voiceId: "sarah",
    stability: 0.4,
    similarityBoost: 0.8,
    speed: 0.9,
    style: 0.5,
    useSpeakerBoost: true,
  },
  model: {
    provider: "openai",
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are a professional pitch trainer helping Indonesian sellers practice pitching their products for an international audience

Interview Guidelines:
Follow the structured question flow:
{{questions}}

- Let the user start their pitch without interruption.
- Do not judge or correct during the pitch session.
- After they introduce the product, ask them the questions one by one.
- After they finish, politely thank them and inform them that detailed feedback will be provided soon.
- Keep your responses short and motivating.
- Use professional, supportive, but straightforward language.
- This is a real-time voice practice session, so speak naturally, briefly, and clearly..`,
      },
    ],
  },
};

export interface RouteParams {
  params: Promise<Record<string, string>>
  searchParams: Promise<Record<string, string>>
}