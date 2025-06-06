"use server";

import { db } from "@/db/neon";
import { practiceTemplates, users } from "@/db/schema";
import { eq, sql, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";

// Get all users with their roles
export async function getAllUsers(page = 1, pageSize = 10) {
  try {
    await verifyAdmin();
    
    const offset = (page - 1) * pageSize;
    
    const usersList = await db.query.users.findMany({
      orderBy: desc(users.createdAt),
      limit: pageSize,
      offset: offset,
      columns: {
        id: true,
        email: true,
        name: true,
        imageUrl: true,
        role: true,
        clerkUserId: true,
        createdAt: true
      }
    });
    
    const countResult = await db.select({ count: sql`count(*)` }).from(users);
    const totalCount = Number(countResult[0].count);
    
    return {
      users: usersList,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize)
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

// Get user role by Clerk user ID
export async function getUserRole(clerkUserId: string) {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.clerkUserId, clerkUserId),
      columns: { role: true }
    });
    
    return user?.role || "user";
  } catch (error) {
    console.error('Error fetching user role:', error);
    return "user"; // Default fallback
  }
}

// Check if a user is an admin
export async function isUserAdmin(clerkUserId: string) {
  try {
    const role = await getUserRole(clerkUserId);
    return role === "admin";
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

// Update user role
export async function updateUserRole(userId: number, newRole: "user" | "admin") {
  try {
    await verifyAdmin();
    
    const result = await db.update(users)
      .set({ 
        role: newRole,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
      
    revalidatePath('/admin/users');
    
    return { success: true, user: result[0] };
  } catch (error) {
    console.error('Error updating user role:', error);
    return { success: false, error: 'Failed to update role' };
  }
}

// Middleware to verify the user is an admin
export async function verifyAdmin() {
  try {
    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      throw new Error('Unauthorized: Admin access required');
    }
    
    // Get user from database to check role
    const user = await db.query.users.findFirst({
      where: eq(users.clerkUserId, clerkUser.id),
    });
    
    if (!user || user.role !== 'admin') {
      throw new Error('Unauthorized: Admin access required');
    }
    
    return true;
  } catch (error) {
    console.error('Admin verification failed:', error);
    throw new Error('Unauthorized: Admin access required');
  }
}

// Get template by ID
export async function getTemplateById(id: number) {
  try {
    await verifyAdmin();

    const template = await db.query.practiceTemplates.findFirst({
      where: eq(practiceTemplates.id, id),
    });

    return template;
  } catch (error) {
    console.error('Error fetching template:', error);
    throw error;
  }
}

// Create new template
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createTemplate(templateData: any) {
  try {
    await verifyAdmin();

    const result = await db.insert(practiceTemplates).values({
      title: templateData.title,
      description: templateData.description,
      questions: templateData.questions,
      difficulty: templateData.difficulty,
      duration: templateData.duration,
      industry: templateData.industry,
      targetMarket: templateData.targetMarket,
      targetMarketCode: templateData.targetMarketCode,
      imageUrl: templateData.imageUrl || null,
      isActive: true,
      usageCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    revalidatePath('/admin/templates');
    revalidatePath('/dashboard');

    return {
      success: true,
      template: result[0],
    };
  } catch (error) {
    console.error('Error creating template:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create template',
    };
  }
}

// Update template
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateTemplate(templateData: any) {
  try {
    await verifyAdmin();

    if (!templateData.id) {
      throw new Error('Template ID is required');
    }

    const result = await db.update(practiceTemplates)
      .set({
        title: templateData.title,
        description: templateData.description,
        questions: templateData.questions,
        difficulty: templateData.difficulty,
        duration: templateData.duration,
        industry: templateData.industry,
        targetMarket: templateData.targetMarket,
        targetMarketCode: templateData.targetMarketCode,
        imageUrl: templateData.imageUrl || null,
        isActive: templateData.isActive,
        updatedAt: new Date(),
      })
      .where(eq(practiceTemplates.id, templateData.id))
      .returning();

    revalidatePath('/admin/templates');
    revalidatePath('/dashboard');
    revalidatePath(`/practice/${templateData.id}`);

    return {
      success: true,
      template: result[0],
    };
  } catch (error) {
    console.error('Error updating template:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update template',
    };
  }
}

// Delete template
export async function deleteTemplate(id: number) {
  try {
    await verifyAdmin();

    await db.delete(practiceTemplates)
      .where(eq(practiceTemplates.id, id));

    revalidatePath('/admin/templates');
    revalidatePath('/dashboard');

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error deleting template:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete template',
    };
  }
}

// Get admin dashboard stats
export async function getAdminDashboardStats() {
  try {
    await verifyAdmin();

    // Get template count
    const templateCount = await db
      .select({ count: sql`COUNT(*)` })
      .from(practiceTemplates);

    // More stats can be added here

    return {
      templateCount: templateCount[0].count,
      // Other stats
    };
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return {
      error: error instanceof Error ? error.message : 'Failed to fetch admin stats',
    };
  }
} 