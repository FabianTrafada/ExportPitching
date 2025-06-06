'use client'

import { useEffect, useState } from 'react';
import { ChevronLeft, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { menuItems } from '@/constants/sidelinks';
import { UserButton, useUser } from '@clerk/nextjs';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { user } = useUser();
  const pathname = usePathname();

  useEffect(() => {
    document.body.setAttribute('data-sidebar', isCollapsed ? 'collapsed' : 'expanded');
  }, [isCollapsed]);

  return (
    <div
      className={cn(
        'fixed top-0 left-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col overflow-hidden z-20',
        isCollapsed ? 'w-20' : 'w-68'
      )}
    >
      {/* Header/Logo section */}
      <div className={cn('flex items-center sticky top-0 z-10 px-4 py-5 border-b border-gray-100 bg-white', isCollapsed ? 'justify-center' : 'justify-between')}>
        {!isCollapsed && (
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <motion.div
                className="relative h-8 w-8 mr-3"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <div
                  className="absolute h-8 w-8 rounded-full bg-yellow-400 shadow-sm"
                  style={{ clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 100%)" }}
                />
              </motion.div>
              <span className="text-lg font-bold">
                Export
                <span className="text-yellow-400">pitch</span>
              </span>
            </Link>
          </div>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "p-2 rounded-full hover:bg-gray-100 transition-colors"
          )}
        >
          {isCollapsed ? (
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="relative h-8 w-8"
            >
              <div
                className="absolute h-8 w-8 rounded-full bg-yellow-400 shadow-sm"
                style={{ clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 100%)" }}
              />
            </motion.div>
          ) : (
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          )}
        </button>
      </div>

      {/* Navigation section */}
      <TooltipProvider>
        <nav className="px-3 py-6 flex-1 overflow-y-auto space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || 
                            (item.href !== '/dashboard' && pathname?.startsWith(item.href));
            
            return (
              <Tooltip key={item.label}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative mb-1',
                      isCollapsed && 'justify-center',
                      isActive 
                        ? 'bg-yellow-50 text-yellow-700' 
                        : 'hover:bg-gray-50 text-gray-700'
                    )}
                  >
                    <item.icon 
                      className={cn(
                        "h-5 w-5 transition-colors",
                        isActive ? "text-yellow-500" : "text-gray-500 group-hover:text-yellow-500"
                      )} 
                    />
                    
                    {!isCollapsed && (
                      <span
                        className={cn(
                          "text-sm font-medium",
                          isActive ? "text-yellow-700" : "text-gray-700"
                        )}
                      >
                        {item.label}
                      </span>
                    )}

                    {isActive && (
                      <div
                        className={cn(
                          "absolute right-0 w-1 h-full rounded-l-full bg-yellow-400",
                          isCollapsed ? "right-0" : "right-1"
                        )}
                      />
                    )}
                  </Link>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right" className='border border-gray-200 bg-white shadow-md px-3 py-1.5 text-xs'>
                    <p>{item.label}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </nav>
      </TooltipProvider>

      {/* User profile section */}
      <TooltipProvider>
        <div className='sticky bottom-0 bg-white border-t border-gray-100 p-3'>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  'w-full flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors',
                  isCollapsed ? 'justify-center' : 'justify-between'
                )}
              >
                <div className="flex items-center gap-3">
                  <UserButton afterSignOutUrl="/" />
                  
                  {!isCollapsed && user && (
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium text-gray-800 truncate max-w-[120px]">
                        {user?.firstName} {user?.lastName}
                      </span>
                      <span className="text-xs text-gray-500 truncate max-w-[120px]">
                        {user?.emailAddresses[0]?.emailAddress}
                      </span>
                    </div>
                  )}
                </div>
                
                {!isCollapsed && (
                  <Link 
                    href="/sign-out" 
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right" className='border border-gray-200 bg-white shadow-md'>
                <p>Your Profile</p>
              </TooltipContent>
            )}
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
}