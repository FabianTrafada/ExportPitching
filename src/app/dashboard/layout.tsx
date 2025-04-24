import Sidebar from "@/components/dashboard/Sidebar";
import { DashboardLayoutProps } from "@/types/type";

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
