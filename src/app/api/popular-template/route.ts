import { db } from "@/db/neon";
import { practiceTemplates } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const templates = await db
      .select()
      .from(practiceTemplates)
      .where(eq(practiceTemplates.isActive, true))
      .orderBy(desc(practiceTemplates.usageCount))
      .limit(1);

    return NextResponse.json(templates);
  } catch (error) {
    console.error('Error fetching popular template:', error);
    return NextResponse.json(
      { error: 'Failed to fetch popular template' },
      { status: 500 }
    );
  }
} 