"use client";

import Link from "next/link";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { RecommendedTemplatesProps } from "@/types/type";

export default function RecommendedTemplates({
  templates,
  isLoading = false,
}: RecommendedTemplatesProps) {
  const router = useRouter();
  
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

  const handlePracticeClick = async (id: number) => {
    try {
      router.push(`/practice/${id}`);
    } catch (error) {
      console.error('Error handling practice click:', error);
    }
  };

  if (isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (templates.length === 0) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="font-medium mb-2">Recommended Templates</h3>
        <p className="text-sm text-gray-500 mb-4">
          Explore templates on the dashboard to get started.
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
      <h3 className="font-medium mb-3">Recommended Templates</h3>
      <div className="space-y-3">
        {templates.map((template) => (
          <div
            key={template.id}
            className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <div className="relative h-12 w-12 flex-shrink-0 rounded-md overflow-hidden bg-gray-200">
              {template.imageUrl ? (
                <Image
                  src={template.imageUrl}
                  alt={template.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-yellow-100 text-yellow-600">
                  {template.title.charAt(0)}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm truncate">
                {template.title}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="outline"
                  className={`text-xs px-1.5 py-0 ${getDifficultyColor(
                    template.difficulty
                  )}`}
                >
                  {template.difficulty}
                </Badge>
                <span className="text-xs text-gray-500">
                  {template.industry}
                </span>
              </div>
            </div>

            <Button 
              size="sm" 
              variant="default" 
              className="h-8 text-xs"
              onClick={() => handlePracticeClick(template.id)}
            >
              Practice
            </Button>
          </div>
        ))}
        
        <div className="pt-2">
          <Link href="/dashboard">
            <Button variant="link" size="sm" className="text-yellow-700 h-auto p-0">
              View all templates →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 