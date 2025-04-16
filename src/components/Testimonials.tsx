"use client"

import { motion } from "framer-motion"

import AnimatedSection from "@/components/AnimatedSection"
import { testimonials } from "@/constants/testimonials"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Star } from "lucide-react"
import Image from "next/image"

export default function Testimonials() {
    return (
        <section id="testimonials" className="py-20 bg-white" aria-labelledby="testimonials-heading">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="text-center mb-16">
                <h2 id="testimonials-heading" className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                  Success Stories
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Hear from Indonesian exporters who have transformed their international sales approach
                </p>
              </div>
            </AnimatedSection>
    
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <AnimatedSection key={index} delay={index * 0.2}>
                  <motion.div whileHover={{ y: -10 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                    <Card className="bg-gray-50 border-gray-200 shadow-sm h-full">
                      <CardContent className="pt-6">
                        <div className="flex mb-4" aria-label={`${testimonial.stars} out of 5 stars`}>
                          {[...Array(5)].map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 * i + 0.3 }}
                            >
                              <Star
                                className={`h-5 w-5 ${
                                  i < testimonial.stars ? "text-yellow-400 fill-yellow-400" : "text-gray-600"
                                }`}
                                aria-hidden="true"
                              />
                            </motion.div>
                          ))}
                        </div>
                        <blockquote>
                          <p className="text-gray-700 italic mb-6">&quot;{testimonial.quote}&quot;</p>
                        </blockquote>
                      </CardContent>
                      <CardFooter className="border-t border-gray-200 pt-4">
                        <div className="flex items-center">
                          <motion.div
                            className="relative h-12 w-12 rounded-full overflow-hidden"
                            whileHover={{ scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                          >
                            <Image
                              src={testimonial.image || "/placeholder.svg"}
                              alt={`Portrait of ${testimonial.name}`}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </motion.div>
                          <div className="ml-4">
                            <cite className="not-italic">
                              <p className="font-medium text-gray-900">{testimonial.name}</p>
                              <p className="text-sm text-gray-500">{testimonial.company}</p>
                            </cite>
                          </div>
                        </div>
                      </CardFooter>
                    </Card>
                  </motion.div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )
}