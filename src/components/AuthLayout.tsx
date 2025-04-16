"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { AuthLayoutProps } from "@/types/type"

export default function AuthLayout({
  children,
  title,
  description,
  backUrl = "/",
  backLabel = "Back to home",
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md px-4">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center"
          >
            <Link href="/" className="flex items-center">
              <motion.div
                className="relative h-10 w-10 mr-2"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <div
                  className="absolute h-10 w-10 rounded-full bg-yellow-400"
                  style={{ clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 100%)" }}
                ></div>
              </motion.div>
              <span className="text-2xl font-bold text-black">
                Export<span className="text-yellow-400">pitch</span>
              </span>
            </Link>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 text-3xl font-extrabold text-gray-900"
          >
            {title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-2 text-sm text-gray-600"
          >
            {description}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8"
        >
          <div className="py-8 px-2">{children}</div>

          <div className="mt-6 text-center">
            <Link
              href={backUrl}
              className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-yellow-500 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {backLabel}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
