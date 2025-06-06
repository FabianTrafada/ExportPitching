"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { navItems } from "@/constants/navlinks";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const signInClick = () => {
    router.push("/sign-in");
  };
  const signUpClick = () => {
    router.push("/sign-up");
  };
  return (
    <motion.nav
      className="sticky top-0 z-50 bg-white/50 backdrop-blur-md shadow-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link href="/" className="flex items-center">
              <motion.div
                className="relative size-8 mr-2"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <div
                  className="absolute size-8 rounded-full bg-yellow-400"
                  style={{ clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 100%)" }}
                />
              </motion.div>
              <span className="text-xl font-bold">
                Export
                <motion.span
                  className="text-yellow-400"
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                >
                  pitch
                </motion.span>
              </span>
            </Link>
          </motion.div>

          {/* Dekstop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index * 0.3 }}
              >
                <Link
                  href={item.href}
                  className="text-gray-800 hover:text-yellow-500 transition-colors"
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
            <SignedIn>
              <Link
                href={"/dashboard"}
                className="text-gray-800 hover:text-yellow-500 transition-colors"
              >
                Dashboard
              </Link>
            </SignedIn>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="space-x-4"
            >
              <SignedOut>
                <Button
                  onClick={signInClick}
                  variant="outline"
                  className="border-2 border-yellow-400 bg-white text-gray-800 font-medium"
                >
                  Log In
                </Button>
                <Button
                  onClick={signUpClick}
                  className="bg-yellow-400 hover:bg-yellow-500 text-white font-medium"
                >
                  Sign Up
                </Button>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <motion.div
            className="md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-800 focus:outline-none"
              whileTap={{ scale: 0.9 }}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </motion.div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden mt-4 pb-4 space-y-4"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * index }}
                >
                  <Link
                    href={item.href}
                    className="block text-gray-800 hover:text-yellow-500 py-2 transition-colors"
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
              <SignedIn>
                <Link
                  href={"/dashboard"}
                  className="text-gray-800 hover:text-yellow-500 transition-colors"
                >
                  Dashboard
                </Link>
              </SignedIn>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="space-x-4"
              >
                <SignedOut>
                  <Button
                    onClick={signInClick}
                    variant="outline"
                    className="border-2 border-yellow-400 bg-white text-gray-800 font-medium"
                  >
                    Log In
                  </Button>
                  <Button
                    onClick={signUpClick}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white font-medium"
                  >
                    Sign Up
                  </Button>
                </SignedOut>
                <div className="mt-4">
                  <SignedIn>
                    <UserButton />
                  </SignedIn>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
