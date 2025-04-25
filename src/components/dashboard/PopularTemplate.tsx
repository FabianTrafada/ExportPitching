// src/components/dashboard/PopularTemplate.tsx
export const revalidate = 60
export const dynamicParams = true
import { Card } from "@/components/ui/card";
import { db } from "@/db/neon";
import { practiceTemplates } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { ChartSpline } from "lucide-react";
import Image from "next/image";

export default async function PopularTemplate() {
  const templates = await db
    .select()
    .from(practiceTemplates)
    .where(eq(practiceTemplates.isActive, true))
    .orderBy(desc(practiceTemplates.usageCount))
    .limit(1);
  
  // Function to get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty.toLowerCase()) {
      case 'advanced':
        return 'bg-red-100 text-red-800';
      case 'intermediate':
        return 'bg-orange-100 text-orange-800';
      case 'beginner':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
    
  return (
    <div className="mb-6 md:mb-8">
      <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">🔥 Popular Template</h2>
      {templates.map((template) => (
        <Card key={template.id} className="p-4 md:p-6 overflow-hidden">
          <div className="flex flex-col gap-4 md:gap-6">
            {/* Image on top for mobile, side by side for desktop */}
            <div className="w-full h-48 md:h-auto md:hidden rounded-lg relative overflow-hidden">
              {/* Duration badge */}
              <div className="absolute top-2 right-2 z-10 bg-white px-3 py-1 rounded-full shadow-md text-sm font-medium">
                {template.duration} minutes
              </div>
              
              {template.imageUrl ? (
                <Image
                  src={template.imageUrl}
                  alt={template.title}
                  fill
                  className="object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-lg">
                  <span className="text-gray-400">Image</span>
                </div>
              )}
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <h3 className="text-lg md:text-xl font-semibold mb-2">About {template.title}</h3>
                <p className="text-sm md:text-base text-gray-600 mb-4">{template.description}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-4">
                  <div>
                    <h4 className="font-medium text-xs md:text-sm text-gray-500">Difficulty</h4>
                    <span className={`inline-block px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium ${getDifficultyColor(template.difficulty)}`}>
                      {template.difficulty}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-xs md:text-sm text-gray-500">Industry</h4>
                    <p className="text-sm md:text-base truncate">{template.industry}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-xs md:text-sm text-gray-500">Target Market</h4>
                    <div className="flex items-center gap-2">
                      <Image
                        width={20}
                        height={20}
                        src={`https://flagcdn.com/${template.targetMarketCode.toLowerCase()}.svg`} 
                        alt={template.targetMarket}
                        className="shadow-sm"
                      />
                      <span className="text-sm md:text-base">{template.targetMarket}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-xs md:text-sm text-gray-500">Usage Count</h4>
                    <div className="flex items-center gap-2">
                      <ChartSpline size={16} />
                      <span className="text-sm md:text-base">{template.usageCount} times</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Image side by side for desktop, hidden on mobile */}
              <div className="hidden md:block w-full md:w-1/3 h-56 rounded-lg relative overflow-hidden">
                {/* Duration badge */}
                <div className="absolute top-2 right-2 z-10 bg-white px-3 py-1 rounded-full shadow-md text-sm font-medium">
                  {template.duration} minutes
                </div>
                
                {template.imageUrl ? (
                  <Image
                    src={template.imageUrl}
                    alt={template.title}
                    fill
                    className="object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-lg">
                    <span className="text-gray-400">Image</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}