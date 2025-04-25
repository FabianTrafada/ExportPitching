// src/components/dashboard/Sidebar.tsx
'use client'

import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { motion } from 'framer-motion';
import Link from 'next/link';
import { menuItems } from '@/constants/sidelinks';
import { UserButton, useUser } from '@clerk/nextjs';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useUser();

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
        if (isMobileMenuOpen) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = 'auto';
        }
      } else {
        document.body.style.overflow = 'auto';
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    document.body.setAttribute('data-sidebar', isCollapsed ? 'collapsed' : 'expanded');
  }, [isCollapsed]);

  // Toggle mobile menu and prevent body scrolling when menu is open
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Handle menu click on mobile
  const handleMobileMenuClick = () => {
    if (window.innerWidth < 768) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Mobile menu button (only visible on mobile) */}
      <button
        onClick={toggleMobileMenu}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md"
      >
        {isMobileMenuOpen ? (
          <X className="h-5 w-5 text-gray-700" />
        ) : (
          <Menu className="h-5 w-5 text-gray-700" />
        )}
      </button>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div
        className={cn(
          'fixed top-0 left-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col overflow-y-auto z-40',
          isCollapsed ? 'w-20' : 'w-68',
          // Mobile: full height sliding menu
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className={cn('flex items-center sticky top-0 z-10 p-4 border-b border-gray-200 bg-white', isCollapsed ? 'pl-[12px]' : 'justify-between')}>
          <div className={cn('flex items-center gap-3', isCollapsed && 'justify-center')}>
            {!isCollapsed && <span className="text-xl font-bold">
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
              </span>}
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-3 rounded-lg hover:bg-gray-100 transition-colors hidden md:block"
          >
            {!isCollapsed ? (
              <Menu className="h-5 w-5 text-gray-500" />
            ) : (
              <motion.div
                className="relative size-8"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <div
                  className="absolute size-8 rounded-full bg-yellow-400"
                  style={{ clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 100%)" }}
                />
              </motion.div>
            )}
          </button>
        </div>
        <TooltipProvider>
          <nav className="p-4 flex-1 overflow-y-auto">
            {menuItems.map((item) => (
              <Tooltip key={item.label}>
                <TooltipTrigger asChild>
                  <a
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors mb-2 group',
                      isCollapsed && 'justify-center'
                    )}
                    onClick={handleMobileMenuClick}
                  >
                    <item.icon className="h-5 w-5 text-gray-500 group-hover:text-yellow-400 transition-colors" />
                    {(!isCollapsed || isMobileMenuOpen) && <span className="text-gray-700">{item.label}</span>}
                  </a>
                </TooltipTrigger>
                {isCollapsed && !isMobileMenuOpen && (
                  <TooltipContent side="right" className='border border-gray-300'>
                    <p>{item.label}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            ))}
          </nav>
        </TooltipProvider>

        <TooltipProvider>
          <div className='sticky bottom-0 bg-white border-t border-gray-200 p-4 pr-1.5'>
          <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className={cn(
                    'w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors group',
                    isCollapsed && !isMobileMenuOpen && 'justify-center'
                  )}
                >
                  <UserButton/>
                  {(!isCollapsed || isMobileMenuOpen) && (
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium text-gray-700">{user?.firstName} {user?.lastName}</span>
                      <span className="text-xs text-gray-500 truncate max-w-[150px]">{user?.emailAddresses[0].emailAddress}</span>
                    </div>
                  )}
                </button>
              </TooltipTrigger>
              {isCollapsed && !isMobileMenuOpen && (
                <TooltipContent side="right">
                  <p>Profile</p>
                </TooltipContent>
              )}
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>
    </>
  );
};