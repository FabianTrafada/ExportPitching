import { Suspense } from 'react';
import { getCurrentUser } from '@/actions/general.actions';
import { getUserPracticeSessions, getRecommendedTemplates } from '@/actions/practice.actions';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import RecentPracticeSessions from "@/components/dashboard/RecentPracticeSessions";
import RecommendedTemplates from "@/components/dashboard/RecommendedTemplates";
import Link from "next/link";
import { Search } from "lucide-react";
import { notFound } from 'next/navigation';

export default async function PracticePage() {
  const user = await getCurrentUser();
  
  if (!user) {
    return notFound();
  }

  const userSessions = await getUserPracticeSessions(user.id);
  const recommendedTemplates = await getRecommendedTemplates(user.id);

  return (
    <div className="dashboard-content transition-all duration-300 pt-12 md:pt-0">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Practice</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Start Practicing</h2>
              <p className="text-gray-600">
                Select a template and start practicing your pitch. Record yourself, get feedback, and improve.
              </p>
            </div>

            <Link href="/dashboard" className="mt-4 md:mt-0">
              <Button className="w-full md:w-auto">
                <Search size={18} className="mr-2" />
                Browse All Templates
              </Button>
            </Link>
          </div>

          {/* User's remaining credits */}
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100 mb-6 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-yellow-800">Your Credits</h3>
              <p className="text-sm text-yellow-700">
                You have <span className="font-semibold">{user.credit}</span> practice {user.credit === 1 ? "credit" : "credits"} remaining
              </p>
            </div>
            
            {user.credit < 3 && (
              <Link href="/pricing">
                <Button variant="outline" size="sm" className="border-yellow-300 text-yellow-700 hover:bg-yellow-100">
                  Get More Credits
                </Button>
              </Link>
            )}
          </div>
          
          <Suspense fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          }>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <RecentPracticeSessions sessions={userSessions} />
              <RecommendedTemplates templates={recommendedTemplates} />
            </div>
          </Suspense>
        </div>

        {/* Tips and guidance section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Pitching Tips</h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-medium mb-1">Know Your Audience</h3>
              <p className="text-sm text-gray-600">Research your buyer&apos;s background, interests, and needs before your pitch.</p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-medium mb-1">Focus on Benefits, Not Features</h3>
              <p className="text-sm text-gray-600">Emphasize how your product solves problems rather than just listing technical specs.</p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-medium mb-1">Practice Makes Perfect</h3>
              <p className="text-sm text-gray-600">Regular practice with different scenarios will build confidence and adaptability.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
} 