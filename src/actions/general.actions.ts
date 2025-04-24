"use server"

import { db } from "@/db/neon";
import { practiceTemplates, users } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server"
import { eq } from "drizzle-orm";

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

export async function getPracticeTemplates() {
    const templates = await db.query.practiceTemplates.findMany({
        where: eq(practiceTemplates.isActive, true),
        orderBy: (templates, { asc }) => [asc(templates.difficulty)],
    })
    
    return templates
}