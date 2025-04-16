"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

import AnimatedSection from "@/components/AnimatedSection";
import { benefits } from "@/constants/benefits";
import Image from "next/image";

export default function Benefits() {
  return (
    <section
      id="benefits"
      className="py-20 bg-gray-100"
      aria-labelledby="benefits-heading"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <AnimatedSection direction="left" className="order-2 md:order-1">
            <h2
              id="benefits-heading"
              className="text-3xl md:text-4xl font-bold mb-6 text-gray-900"
            >
              Why Train With ExportPitch AI
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Our AI-powered platform is specifically designed for Indonesian
              exporters looking to succeed in international markets. We combine
              cultural intelligence with sales expertise to help you create
              compelling pitches.
            </p>

            <ul className="space-y-4" aria-label="Benefits of ExportPitch AI">
              {benefits.map((benefit, index) => (
                <motion.li
                  key={index}
                  className="flex items-start"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <motion.div
                    className="flex-shrink-0 mt-1"
                    whileHover={{ scale: 1.2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Check
                      className="h-5 w-5 text-yellow-400"
                      aria-hidden="true"
                    />
                  </motion.div>
                  <p className="ml-3 text-gray-700">{benefit}</p>
                </motion.li>
              ))}
            </ul>
          </AnimatedSection>

          <AnimatedSection direction="right" className="order-1 md:order-2">
            <motion.div
              className="relative h-[400px]"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Indonesian exporter successfully presenting products to international buyers"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-yellow-400/20 rounded-lg"></div>
            </motion.div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
