'use client'

import { StaggeredListProps } from "@/types/type"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"

export default function StaggeredList({
    children,
    className = "",
    delay = 0,
    staggerDelay = 0.1,
    direction = "up",
    duration = 0.5,
    once = true,
  }: StaggeredListProps) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once, amount: 0.2 })
  
    const getDirectionOffset = () => {
      switch (direction) {
        case "up":
          return { y: 20 }
        case "down":
          return { y: -20 }
        case "left":
          return { x: 20 }
        case "right":
          return { x: -20 }
        case "none":
          return {}
        default:
          return { y: 20 }
      }
    }
  
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: staggerDelay,
          delayChildren: delay,
        },
      },
    }
  
    const itemVariants = {
      hidden: {
        opacity: 0,
        ...getDirectionOffset(),
      },
      visible: {
        opacity: 1,
        x: 0,
        y: 0,
        transition: {
          duration,
          ease: "easeOut",
        },
      },
    }
  
    return (
      <div ref={ref} className={className}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {children.map((child, index) => (
            <motion.div key={index} variants={itemVariants}>
              {child}
            </motion.div>
          ))}
        </motion.div>
      </div>
    )
  }
  