// src/components/dashboard/PracticeCard.tsx
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { PracticeCardProps } from "@/types/type";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const revalidate = 60;
export const dynamicParams = true;

export default async function PracticeCard({
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
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 relative h-full flex flex-col p-0">
      {/* Image section with better aspect ratio for mobile */}
      <div className="bg-gray-100 relative aspect-[3/2] md:aspect-[16/9]">
        {imageUrl ? (
          <Image src={imageUrl} alt={title} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-400">Image</span>
          </div>
        )}

        {/* Duration badge */}
        <div className="absolute top-2 right-2 text-xs bg-white px-2 py-1 rounded shadow-sm">
          {duration} minutes
        </div>

        {/* Difficulty badge */}
        <div
          className={`absolute bottom-2 right-2 text-xs px-2 py-1 rounded ${getDifficultyColor(
            difficulty
          )}`}
        >
          {difficulty}
        </div>
      </div>

      {/* Content section */}
      <div className="p-3 md:p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-base md:text-lg mb-1 md:mb-2 line-clamp-1">{title}</h3>
        <p className="text-xs md:text-sm text-gray-600 mb-2 md:mb-3 line-clamp-2">
          {description}
        </p>

        <div className="mt-auto pt-1 md:pt-2">
          {industry && (
            <p className="text-xs text-gray-500 mb-1">Industry: {industry}</p>
          )}

          {targetMarket && (
            <p className="text-xs text-gray-500 mb-1 md:mb-2">
              Target Market: {targetMarket}
            </p>
          )}

          {/* Flag for target market */}
          {targetMarketCode && (
            <div className="mt-1 md:mt-2">
              <Image
                width={20}
                height={15}
                src={`https://flagcdn.com/${targetMarketCode.toLowerCase()}.svg`}
                alt={`${targetMarket} flag`}
                className="shadow-sm"
              />
            </div>
          )}
          <div className="mt-auto pt-4 text-right">
          <Link href={`/practice/${id}`}>
            <Button size="sm" variant="default">
              Practice
            </Button>
          </Link>
        </div>
        </div>
      </div>
    </Card>
  );
}