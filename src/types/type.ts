import { ReactNode } from "react"

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