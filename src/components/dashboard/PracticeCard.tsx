"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { PracticeCardProps } from "@/types/type";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function PracticeCard({
  id,
  title,
  description,
  duration,
  industry,
  targetMarket,
  targetMarketCode,
  difficulty,
  imageUrl,
}: PracticeCardProps) {
  const router = useRouter();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "advanced":
        return "bg-red-100 text-red-800 border border-red-200";
      case "intermediate":
      case "medium":
        return "bg-orange-100 text-orange-800 border border-orange-200";
      case "beginner":
      case "easy":
        return "bg-green-100 text-green-800 border border-green-200";
      default:
        return "bg-gray-200 text-gray-800 border border-gray-300";
    }
  };

  const handlePracticeClick = async () => {
    try {
      router.push(`/practice/${id}`);
    } catch (error) {
      console.error('Error handling practice click:', error);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 relative h-full flex flex-col p-0 border-gray-200">
        {/* Image section */}
        <div className="bg-gray-100 relative aspect-[3/2] md:aspect-[16/9] overflow-hidden">
          {imageUrl ? (
            <Image 
              src={imageUrl} 
              alt={title} 
              fill 
              className="object-cover transition-transform duration-500 hover:scale-110" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200">
              <span className="text-2xl font-bold text-gray-300">{title.charAt(0)}</span>
            </div>
          )}

          {/* Duration badge */}
          <div className="absolute top-2 left-2 text-xs bg-black/70 text-white px-2 py-1 rounded-full backdrop-blur-sm">
            {duration} minutes
          </div>

          {/* Difficulty badge */}
          <div
            className={`absolute bottom-2 left-2 text-xs px-2 py-1 rounded-full font-medium shadow-sm ${getDifficultyColor(
              difficulty
            )}`}
          >
            {difficulty}
          </div>
        </div>

        {/* Content section */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-base md:text-lg mb-2 line-clamp-1 text-gray-800">{title}</h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {description}
          </p>

          <div className="mt-auto pt-2 space-y-2">
            <div className="flex flex-wrap gap-2">
              {industry && (
                <span className="inline-flex items-center text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                  {industry}
                </span>
              )}
              
              {targetMarket && (
                <span className="inline-flex items-center text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                  {targetMarketCode && (
                    <Image
                      width={12}
                      height={9}
                      src={`https://flagcdn.com/${targetMarketCode.toLowerCase()}.svg`}
                      alt={`${targetMarket} flag`}
                      className="mr-1"
                    />
                  )}
                  {targetMarket}
                </span>
              )}
            </div>
            
            <div className="pt-3 flex justify-end">
              <Button 
                variant="default" 
                size="sm" 
                onClick={handlePracticeClick}
                className="bg-yellow-500 hover:bg-yellow-600 transition-colors"
              >
                Practice Now
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}