'use client'

import { motion } from "framer-motion";

import { plans } from "@/constants/plans";
import AnimatedSection from "@/components/AnimatedSection";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="py-20 bg-gray-50"
      aria-labelledby="pricing-heading"
    >
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <div className="text-center mb-16">
            <h2
              id="pricing-heading"
              className="text-3xl md:text-4xl font-bold mb-4 text-gray-900"
            >
              Pricing Plans
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the right plan to elevate your export pitching skills
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <AnimatedSection
              key={index}
              delay={index * 0.2}
              direction={index === 1 ? "up" : "up"}
            >
              <motion.div
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="h-full"
              >
                <Card
                  className={`bg-white border-gray-200 shadow-sm h-full ${
                    plan.popular ? "ring-2 ring-yellow-400 relative" : ""
                  }`}
                >
                  {plan.popular && (
                    <motion.div
                      className="absolute top-0 right-0 bg-yellow-400 text-black px-3 py-1 text-sm font-medium rounded-bl-lg rounded-tr-lg"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5, duration: 0.3 }}
                    >
                      Most Popular
                    </motion.div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-2xl text-gray-900">
                      {plan.name}
                    </CardTitle>
                    <motion.div
                      className="mt-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      <span className="text-3xl font-bold text-gray-900">
                        {plan.price}
                      </span>
                      {plan.name !== "Enterprise" && (
                        <span className="text-gray-500 ml-2">/month</span>
                      )}
                    </motion.div>
                    <CardDescription className="mt-2 text-gray-600">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul
                      className="space-y-3"
                      aria-label={`Features of the ${plan.name} plan`}
                    >
                      {plan.features.map((feature, i) => (
                        <motion.li
                          key={i}
                          className="flex items-start"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * i + 0.4 }}
                          viewport={{ once: true }}
                        >
                          <motion.div
                            whileHover={{ scale: 1.2, rotate: 5 }}
                            className="flex-shrink-0 mt-0.5"
                          >
                            <Check
                              className="h-5 w-5 text-yellow-400"
                              aria-hidden="true"
                            />
                          </motion.div>
                          <span className="ml-3 text-gray-700">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <motion.div
                      className="w-full"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        className={`w-full ${
                          plan.popular
                            ? "bg-yellow-400 hover:bg-yellow-500 text-black"
                            : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                        }`}
                      >
                        {plan.buttonText}
                      </Button>
                    </motion.div>
                  </CardFooter>
                </Card>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
