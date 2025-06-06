"use client";

import Link from "next/link";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Play, Clock } from "lucide-react";
import { RecentPracticeSessionsProps } from "@/types/type";

export default function RecentPracticeSessions({
  sessions,
  isLoading = false,
}: RecentPracticeSessionsProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "advanced":
        return "bg-red-100 text-red-800";
      case "intermediate":
      case "medium":
        return "bg-orange-100 text-orange-800";
      case "beginner":
      case "easy":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (sessions.length === 0) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="font-medium mb-2">Recent Practice Sessions</h3>
        <p className="text-sm text-gray-500 mb-4">
          You haven&apos;t started any practice sessions yet.
        </p>
        <Link href="/dashboard">
          <Button size="sm" variant="outline" className="w-full">
            Browse Templates
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <h3 className="font-medium mb-3">Recent Practice Sessions</h3>
      <div className="space-y-3">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <div className="relative h-12 w-12 flex-shrink-0 rounded-md overflow-hidden bg-gray-200">
              {session.template.imageUrl ? (
                <Image
                  src={session.template.imageUrl}
                  alt={session.template.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Play size={16} />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm truncate">
                {session.template.title}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="outline"
                  className={`text-xs px-1.5 py-0 ${getDifficultyColor(
                    session.template.difficulty
                  )}`}
                >
                  {session.template.difficulty}
                </Badge>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock size={12} />
                  {session.createdAt 
                    ? format(new Date(session.createdAt), "MMM d")
                    : "N/A"}
                </span>
              </div>
            </div>

            <div>
              {session.status === "in_progress" ? (
                <Link href={`/practice/${session.template.id}`}>
                  <Button size="sm" variant="default" className="h-8 text-xs">
                    Continue
                  </Button>
                </Link>
              ) : (
                <Link href={`/practice/${session.template.id}/feedback`}>
                  <Button size="sm" variant="outline" className="h-8 text-xs">
                    View Results
                  </Button>
                </Link>
              )}
            </div>
          </div>
        ))}
        
        <div className="pt-2">
          <Link href="/dashboard/my-feedback">
            <Button variant="link" size="sm" className="text-yellow-700 h-auto p-0">
              View all practice sessions →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 