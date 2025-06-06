import { Layout, FileText, Users } from "lucide-react";
import { db } from "@/db/neon";
import { practiceTemplates, users, pitchingSessions } from "@/db/schema";
import { count } from "drizzle-orm";

export default async function AdminDashboardPage() {
  // Fetch counts from database
  const [templateCount] = await db.select({ count: count() }).from(practiceTemplates);
  const [userCount] = await db.select({ count: count() }).from(users);
  const [sessionCount] = await db.select({ count: count() }).from(pitchingSessions);

  return (
    <>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <QuickStatCard 
          title="Total Templates"
          value={templateCount.count.toString()}
          icon={FileText}
          bgColor="bg-blue-500"
          href="/admin/templates"
        />
        
        <QuickStatCard 
          title="Users"
          value={userCount.count.toString()}
          icon={Users}
          bgColor="bg-green-500"
          href="/admin/users"
        />
        
        <QuickStatCard 
          title="Practice Sessions"
          value={sessionCount.count.toString()}
          icon={Layout}
          bgColor="bg-purple-500"
          href="/admin/sessions"
        />
      </div>
      
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuickAction 
            title="Create Template"
            description="Add a new practice template"
            href="/admin/templates/create"
          />
          <QuickAction 
            title="View Reports"
            description="See platform analytics"
            href="/admin/reports"
          />
          <QuickAction 
            title="Manage Settings"
            description="Configure system settings"
            href="/admin/settings"
          />
        </div>
      </div>
    </>
  );
}

function QuickStatCard({ 
  title, 
  value, 
  icon: Icon, 
  bgColor,
  href 
}: { 
  title: string;
  value: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  bgColor: string;
  href: string;
}) {
  return (
    <a 
      href={href}
      className="block p-6 rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${bgColor}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </a>
  );
}

function QuickAction({ title, description, href }: { title: string; description: string; href: string }) {
  return (
    <a
      href={href}
      className="flex flex-col p-6 rounded-lg border border-gray-200 bg-white hover:border-yellow-300 hover:shadow-md transition-all"
    >
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </a>
  );
} 