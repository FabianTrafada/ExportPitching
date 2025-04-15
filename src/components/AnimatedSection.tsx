"use client"

import { AnimatedSectionProps } from "@/types/type";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function AnimatedSection({
    children,
    className = "",
    delay = 0,
    direction = "up",
    duration = 0.5,
    once = true,
}: AnimatedSectionProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once, amount: 0.2 });

    const getDirectionOffSet = () => {
        switch (direction) {
            case "up":
                return { y: 50 }
            case "down":
                return { y: -50 }
            case "left":
                return { x: 50 }
            case "right":
                return { x: -50 }
            case "none":
                return {}
            default:
                return { y: 50 }
        }
    }

    const variants = {
        hidden: {
            opacity: 0,
            ...getDirectionOffSet(),
        },
        visible: {
            opacity: 1,
            x: 0,
            y: 0,
            transition: {
                duration,
                delay,
                ease: "easeOut",
            }
        }
    }

    return (
        <div ref={ref} className={className}>
            <motion.div variants={variants} initial="hidden" animate={isInView ? "visible" : "hidden"}>
                {children}
            </motion.div>
        </div>
    )
}