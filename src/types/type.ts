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