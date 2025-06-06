import { redirect } from "next/navigation";
import { Sidebar } from "@/components/admin/Sidebar";
import { currentUser } from "@clerk/nextjs/server";
import { isUserAdmin } from "@/actions/admin.actions";
import { Toaster } from "@/components/ui/sonner";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  
  // If user is not logged in, redirect to sign-in
  if (!user || !user.id) {
    redirect("/sign-in");
  }
  
  // Check if user is an admin directly from database
  const isAdmin = await isUserAdmin(user.id);
  
  // If not an admin, redirect to dashboard
  if (!isAdmin) {
    redirect("/dashboard");
  }
  
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <main className="p-6 md:p-8 lg:p-10">{children}</main>
        <Toaster />
      </div>
    </div>
  );
} 