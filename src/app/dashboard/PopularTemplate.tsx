export const revalidate = 60

import { Card } from "@/components/ui/card";
import { db } from "@/db/neon";
import { practiceTemplates } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import Image from "next/image";

export default async function PopularTemplate() {
  const templates = await db
    .select()
    .from(practiceTemplates)
    .where(eq(practiceTemplates.isActive, true))
    .orderBy(desc(practiceTemplates.usageCount))
    .limit(1);

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">🔥 Popular Template</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="p-6 flex flex-col gap-4">
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{template.title}</h3>
              <p className="text-gray-600">{template.description}</p>
            </div>
            <div className="w-full h-40 rounded-lg relative overflow-hidden">
              {template.imageUrl ? (
                <Image
                  src={template.imageUrl}
                  alt={template.title}
                  fill
                  className="object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-lg">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
