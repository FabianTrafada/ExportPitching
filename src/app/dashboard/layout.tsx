// src/app/dashboard/layout.tsx
import Sidebar from "@/components/dashboard/Sidebar";
import { DashboardLayoutProps } from "@/types/type";

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen h-full bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      <main className="flex-1 p-4 pt-6 md:p-8 md:pt-10 ml-0 md:ml-20 w-full">
        <div className="min-h-[calc(100vh-2rem)] md:min-h-[calc(100vh-4rem)] max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}