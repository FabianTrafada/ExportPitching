"use server"

import { db } from "@/db/neon";
import { practiceTemplates, users } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server"
import { and, eq, ilike, count, } from "drizzle-orm";

export async function getCurrentUser() {
    const clerkUser = await currentUser();

    if(!clerkUser) {
        return null;
    }

    const user = await db.query.users.findFirst({
        where: eq(users.clerkUserId, clerkUser.id),
    })

    return user
}

export async function getPracticeTemplates(
    search?: string,
    difficulty?: string,
    industry?: string,
    page: number = 1,
    pageSize: number = 8
) {
    const whereConditions = [eq(practiceTemplates.isActive, true)];
    
    if (search && search.trim() !== '') {
        whereConditions.push(
            ilike(practiceTemplates.title, `%${search}%`)
        );
    }
    
    if (difficulty && difficulty.trim() !== '') {
        whereConditions.push(
            eq(practiceTemplates.difficulty, difficulty)
        );
    }
    
    if (industry && industry.trim() !== '') {
        whereConditions.push(
            eq(practiceTemplates.industry, industry)
        );
    }

    const countResult = await db
        .select({ value: count() })
        .from(practiceTemplates)
        .where(and(...whereConditions));
    
    const totalCount = countResult[0].value;
    
    const templates = await db.query.practiceTemplates.findMany({
        where: and(...whereConditions),
        orderBy: (templates, { asc }) => [asc(templates.difficulty)],
        limit: pageSize,
        offset: (page - 1) * pageSize,
    });
    
    return {
        templates,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize)
    }
}

export async function getUniqueDifficulties() {
    const result = await db
        .selectDistinct({ difficulty: practiceTemplates.difficulty })
        .from(practiceTemplates)
        .where(eq(practiceTemplates.isActive, true));
    
    return result.map(r => r.difficulty);
}

export async function getUniqueIndustries() {
    const result = await db
        .selectDistinct({ industry: practiceTemplates.industry })
        .from(practiceTemplates)
        .where(eq(practiceTemplates.isActive, true));
    
    return result.map(r => r.industry);
}