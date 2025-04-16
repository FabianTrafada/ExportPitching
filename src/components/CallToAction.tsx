"use client"

import { motion } from "framer-motion"

import AnimatedSection from "@/components/AnimatedSection"
import { Button } from "@/components/ui/button"

export default function CallToAction() {
    return (
        <section className="py-20 bg-white" aria-labelledby="cta-heading">
            <div className="container mx-auto px-4">
                <AnimatedSection>
                    <motion.div
                        className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8 md:p-12 relative overflow-hidden shadow-sm"
                        whileHover={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.div
                            className="absolute top-0 right-0 w-1/3 h-full bg-yellow-400/10 transform skew-x-12"
                            animate={{
                                skewX: ["12deg", "10deg", "12deg"],
                                opacity: [0.1, 0.15, 0.1],
                            }}
                            transition={{
                                duration: 5,
                                repeat: Number.POSITIVE_INFINITY,
                                repeatType: "reverse"
                            }}
                            aria-hidden="true"
                        ></motion.div>

                        <div className="relative z-10 max-w-3xl">
                            <motion.h2
                                id="cta-heading"
                                className="text-3xl md:text-4xl font-bold mb-6 text-gray-900"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true }}
                            >
                                Ready to Transform Your Export Pitch?
                            </motion.h2>
                            <motion.p
                                className="text-xl text-gray-600 mb-8"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                viewport={{ once: true }}
                            >
                                Join thousands of Indonesian exporters who are using AI to perfect their international sales approach
                                and win more business.
                            </motion.p>
                            <motion.div
                                className="flex flex-col sm:flex-row gap-4"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                viewport={{ once: true }}
                            >
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{scale: 0.95 }}
                                >
                                    <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium text-lg px-8 py-6">
                                        Start Free Trial
                                    </Button>
                                </motion.div>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{scale: 0.95 }}
                                >
                                    <Button
                                        variant={"outline"}
                                        className="border-gray-800 text-gray-800 hover:bg-gray-100 font-medium text-lg px-8 py-6"
                                    >
                                        Schedule Demo
                                    </Button>
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.div>
                </AnimatedSection>
            </div>
        </section>
    )
}