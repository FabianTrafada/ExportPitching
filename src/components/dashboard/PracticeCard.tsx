import Image from "next/image";
import { Card } from "../ui/card";
import { PracticeCardProps } from "@/types/type";

export const revalidate = 60;
export const dynamicParams = true;

export default async function PracticeCard({
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
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 relative">
      <div className="h-32 bg-gray-100 relative">
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

      <div className="p-4">
        <h3 className="font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{description}</p>

        {industry && (
          <p className="text-xs text-gray-500 mb-1">Industry: {industry}</p>
        )}

        {targetMarket && (
          <p className="text-xs text-gray-500 mb-2">
            Target Market: {targetMarket}
          </p>
        )}

        {/* Flag for target market */}
        {targetMarketCode && (
          <div className="absolute bottom-4 left-4">
            <Image
              width={24}
              height={18}
              src={`https://flagcdn.com/${targetMarketCode.toLowerCase()}.svg`}
              alt={`${targetMarket} flag`}
              className="shadow-sm"
            />
          </div>
        )}
      </div>
    </Card>
  );
}
