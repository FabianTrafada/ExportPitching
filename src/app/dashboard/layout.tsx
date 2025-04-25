// src/app/dashboard/layout.tsx
import Sidebar from "@/components/dashboard/Sidebar";
import { DashboardLayoutProps } from "@/types/type";

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 ml-0 md:ml-20 w-full">
        {children}
      </main>
    </div>
  );
}