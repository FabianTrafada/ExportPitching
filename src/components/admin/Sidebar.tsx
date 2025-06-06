"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  FileText, 
  Users, 
  Shield, 
  LogOut, 
  BarChart
} from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: Home,
    },
    {
      label: "Templates",
      href: "/admin/templates",
      icon: FileText,
    },
    {
      label: "Users",
      href: "/admin/users",
      icon: Users,
    },
    {
      label: "Reports",
      href: "/admin/reports",
      icon: BarChart,
    },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-full">
      <div className="flex items-center justify-center h-16 border-b border-gray-200 px-6">
        <Link href="/admin" className="flex items-center">
          <Shield className="h-6 w-6 text-yellow-500 mr-2" />
          <span className="text-lg font-semibold">Admin Portal</span>
        </Link>
      </div>
      <div className="flex flex-col flex-1 py-6 px-4">
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? "bg-yellow-50 text-yellow-700"
                    : "text-gray-700 hover:text-yellow-700 hover:bg-yellow-50"
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="pt-6 mt-6 border-t border-gray-200">
          <SignOutButton>
            <button className="flex w-full items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100">
              <LogOut className="h-5 w-5 mr-3" />
              Sign Out
            </button>
          </SignOutButton>
        </div>
      </div>
    </div>
  );
} 