"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function Hero() {
    return (
        <section className="relative overflow-hidden">
            {/* Background with overlay */}
            <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center">
                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/70" />
            </div>

            <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <motion.h2
                            className="text-yellow-400 text-xl md:text-2xl font-bold mb-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2}}
                        >
                            EXPORTPITCHING AI
                        </motion.h2>
                        <motion.h1
                            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-gray-900"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.4}}
                        >
                            Master Your Export Pitch With AI Training
                        </motion.h1>
                        <motion.p
                            className="text-lg md:text-xl text-gray-600 mb-8"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                        >
                            Elevate your international sales skills and confidently present Indonesian products to global markets with
                            our AI-powered pitch training.
                        </motion.p>
                        <motion.div
                            className="flex flex-col sm:flex-row gap-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.8 }}
                        >
                            <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium text-lg px-8 py-6">
                                Get Started
                            </Button>
                            <Button 
                                variant="outline"
                                className="border-yellow-400 text-yellow-400 hover:bg-yellow-400/10 font-medium text-lg px-8 py-6"
                            >
                                Learn More
                            </Button>
                        </motion.div>
                    </motion.div>
                    <motion.div
                        className="relative"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        <div className="relative h-[400px] md:h-[500px] w-full">
                            <Image 
                                src="/placeholder.svg?height=500&width=500"
                                alt="AI Export Pitch Training"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}