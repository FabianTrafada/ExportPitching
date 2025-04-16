"use client";

import { motion } from "framer-motion";

import AnimatedSection from "@/components/AnimatedSection";
import StaggeredList from "@/components/StaggeredList";
import { features } from "@/constants/features";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Features() {
  return (
    <section id="features" className="py-20 bg-gray-50" aria-labelledby="features-heading">
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <div className="text-center mb-16">
            <h2 id="features-heading" className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              FEATURED
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform offers comprehensive tools to perfect your export pitch
            </p>
          </div>
        </AnimatedSection>

        <StaggeredList>
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{
                y: -5,
                transition: { duration: 0.2 },
              }}
              className="h-full"
            >
              <Card className="bg-white border-gray-200 hover:border-yellow-400/50 shadow-sm transition-all duration-300 h-full">
                <CardHeader>
                  <motion.div
                    className="mb-4"
                    whileHover={{
                      rotate: [0, -10, 10, -10, 0],
                      transition: { duration: 0.5 },
                    }}
                  >
                    {feature.icon}
                  </motion.div>
                  <CardTitle className="text-xl font-bold text-black">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </StaggeredList>
      </div>
    </section>
  )
}
