"use server";

import { db } from "@/db/neon";
import { users, notificationPreferences, pitchFeedback, pitchingSessions } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getCurrentUserWithClerk() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return null;
  }

  const user = await db.query.users.findFirst({
    where: eq(users.clerkUserId, clerkUser.id),
  });
  
  return {
    dbUser: user,
    clerkUser,
  };
}

export async function updateUserName(name: string) {
  try {
    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      return { success: false, error: "Not authenticated" };
    }
    
    // Update user in the database
    const result = await db
      .update(users)
      .set({
        name: name,
        updatedAt: new Date(),
      })
      .where(eq(users.clerkUserId, clerkUser.id))
      .returning();
      
    if (!result || result.length === 0) {
      return { success: false, error: "Failed to update user" };
    }
    
    // Revalidate relevant paths to ensure UI updates
    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard");
    
    return { success: true };
  } catch (error) {
    console.error("Error updating user name:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
}

export async function updateUserProfile(data: { name: string; username: string }) {
  try {
    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      return { success: false, error: "Not authenticated" };
    }

    // First update the database
    const dbResult = await db
      .update(users)
      .set({
        name: data.name,
        updatedAt: new Date(),
      })
      .where(eq(users.clerkUserId, clerkUser.id))
      .returning();
      
    if (!dbResult || dbResult.length === 0) {
      return { success: false, error: "Failed to update user in database" };
    }

    // Then update the Clerk user
    const CLERK_SECRET = process.env.CLERK_SECRET_KEY;
    if (!CLERK_SECRET) {
      return { success: false, error: "Missing Clerk Secret Key" };
    }
    
    // Update user in Clerk
    const response = await fetch(
      `https://api.clerk.com/v1/users/${clerkUser.id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${CLERK_SECRET}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: data.username,
          first_name: data.name.split(' ')[0] || '',
          last_name: data.name.split(' ').slice(1).join(' ') || '',
        }),
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to update Clerk user:", errorData);
      return { 
        success: false, 
        error: errorData.errors?.[0]?.message || "Failed to update user profile" 
      };
    }
    
    // Revalidate pages to reflect changes
    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard");
    
    return { success: true };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
}

export async function updateUserEmail(email: string) {
  try {
    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      return { success: false, error: "Not authenticated" };
    }

    const primaryEmailId = clerkUser.emailAddresses.find(e => e.id === clerkUser.primaryEmailAddressId)?.id;
    
    if (!primaryEmailId) {
      return { success: false, error: "No primary email found" };
    }

    const CLERK_SECRET = process.env.CLERK_SECRET_KEY;
    if (!CLERK_SECRET) {
      return { success: false, error: "Missing Clerk Secret Key" };
    }
    
    // Create a new email address in Clerk
    const createResponse = await fetch(
      `https://api.clerk.com/v1/email_addresses`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${CLERK_SECRET}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: clerkUser.id,
          email_address: email,
        }),
      }
    );
    
    if (!createResponse.ok) {
      const errorData = await createResponse.json();
      console.error("Failed to create new email:", errorData);
      return { 
        success: false, 
        error: errorData.errors?.[0]?.message || "Failed to update email address" 
      };
    }
    
    const emailData = await createResponse.json();
    
    // Set the new email as primary
    if (emailData.id) {
      const setPrimaryResponse = await fetch(
        `https://api.clerk.com/v1/users/${clerkUser.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${CLERK_SECRET}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            primary_email_address_id: emailData.id,
          }),
        }
      );
      
      if (!setPrimaryResponse.ok) {
        const errorData = await setPrimaryResponse.json();
        console.error("Failed to set primary email:", errorData);
        return { 
          success: false, 
          error: errorData.errors?.[0]?.message || "Failed to set new email as primary" 
        };
      }
    }
    
    // Also update email in our database
    await db
      .update(users)
      .set({
        email: email,
        updatedAt: new Date(),
      })
      .where(eq(users.clerkUserId, clerkUser.id));
    
    // Revalidate paths
    revalidatePath("/dashboard/settings");
    
    return { 
      success: true, 
      message: "Email updated. Please verify your new email address." 
    };
  } catch (error) {
    console.error("Error updating user email:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
}

export async function updateNotificationPreferences(preferences: {
  emailNotifications: boolean,
  feedbackAlerts: boolean,
}) {
  try {
    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      return { success: false, error: "Not authenticated" };
    }
    
    // Get user ID
    const user = await db.query.users.findFirst({
      where: eq(users.clerkUserId, clerkUser.id),
    });
    
    if (!user) {
      return { success: false, error: "User not found" };
    }
    
    // Check if preferences record exists
    const existingPrefs = await db.query.notificationPreferences.findFirst({
      where: eq(notificationPreferences.userId, user.id),
    });
    
    if (existingPrefs) {
      // Update existing preferences
      await db
        .update(notificationPreferences)
        .set({
          emailNotifications: preferences.emailNotifications,
          feedbackAlerts: preferences.feedbackAlerts,
          updatedAt: new Date(),
        })
        .where(eq(notificationPreferences.userId, user.id));
    } else {
      // Create new preferences record
      await db.insert(notificationPreferences).values({
        userId: user.id,
        emailNotifications: preferences.emailNotifications,
        feedbackAlerts: preferences.feedbackAlerts,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    
    // Log the preferences
    console.log(`Updated notification preferences for user ${user.id}:`, preferences);
    
    // Revalidate paths
    revalidatePath("/dashboard/settings");
    
    return { success: true };
  } catch (error) {
    console.error("Error updating notification preferences:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
}

export async function getUserNotificationPreferences() {
  try {
    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      return null;
    }
    
    // Get user ID
    const user = await db.query.users.findFirst({
      where: eq(users.clerkUserId, clerkUser.id),
    });
    
    if (!user) {
      return null;
    }
    
    // Find preferences or return defaults
    const prefs = await db.query.notificationPreferences.findFirst({
      where: eq(notificationPreferences.userId, user.id),
    });
    
    if (prefs) {
      return {
        emailNotifications: prefs.emailNotifications,
        feedbackAlerts: prefs.feedbackAlerts,
      };
    }
    
    // Return default preferences if none found
    return {
      emailNotifications: true,
      feedbackAlerts: true,
    };
  } catch (error) {
    console.error("Error getting notification preferences:", error);
    // Return default preferences on error
    return {
      emailNotifications: true,
      feedbackAlerts: true,
    };
  }
}

export async function deleteUserAccount() {
  try {
    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      console.log("No Clerk user found");
      return { success: false, error: "Not authenticated" };
    }
    
    console.log("Clerk user found:", clerkUser.id);
    
    // First ensure the user exists in our database
    const createResult = await createUserIfNotExists();
    if (!createResult.success) {
      return { success: false, error: "Failed to prepare account for deletion" };
    }
    
    // Now try to find the user
    const user = await db.query.users.findFirst({
      where: eq(users.clerkUserId, clerkUser.id),
    });
    
    if (!user) {
      console.log("User still not found in database with clerkUserId:", clerkUser.id);
      
      // Try to debug by listing some users
      const allUsers = await db.select().from(users).limit(5);
      console.log("Sample of users in database:", allUsers);
      
      return { success: false, error: "User not found in database" };
    }
    
    console.log("User found in database:", user.id);
    
    // Delete all user-related data 
    // 1. Delete pitch feedback
    await db
      .delete(pitchFeedback)
      .where(eq(pitchFeedback.userId, user.id));
    
    // 2. Delete pitching sessions
    await db
      .delete(pitchingSessions)
      .where(eq(pitchingSessions.userId, user.id));
      
    // 3. Delete notification preferences
    await db
      .delete(notificationPreferences)
      .where(eq(notificationPreferences.userId, user.id));
    
    // 4. Delete user from database
    await db.delete(users).where(eq(users.id, user.id));
    
    // 5. Delete user from Clerk
    // Note: In a production app, you should handle this securely,
    // potentially through a secure admin API route
    const CLERK_SECRET = process.env.BEARER_KEY;
    if (!CLERK_SECRET) {
      return { 
        success: false, 
        error: "Missing Bearer Key - contact support to delete your account" 
      };
    }
    
    const response = await fetch(
      `https://api.clerk.com/v1/users/${clerkUser.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${CLERK_SECRET}`,
          "Content-Type": "application/json",
        },
      }
    );
    
    if (!response.ok) {
      const error = await response.json();
      console.error("Failed to delete Clerk user:", error);
      return { 
        success: false, 
        error: "Failed to delete authentication data. Please contact support." 
      };
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting user account:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
}

export async function createUserIfNotExists() {
  try {
    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      return { success: false, error: "Not authenticated" };
    }
    
    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.clerkUserId, clerkUser.id),
    });
    
    if (existingUser) {
      // User already exists
      return { success: true, user: existingUser };
    }
    
    // Create new user
    console.log('Creating new user in database for Clerk user:', clerkUser.id);
    
    const email = clerkUser.emailAddresses[0]?.emailAddress;
    const name = clerkUser.firstName && clerkUser.lastName 
      ? `${clerkUser.firstName} ${clerkUser.lastName}`
      : clerkUser.username || "User";
    const imageUrl = clerkUser.imageUrl || '';
    
    const result = await db.insert(users).values({
      email: email || 'user@example.com', // Fallback email
      name: name,
      imageUrl: imageUrl,
      clerkUserId: clerkUser.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    
    if (!result || result.length === 0) {
      return { success: false, error: "Failed to create user" };
    }
    
    console.log('User created successfully:', result[0]);
    
    return { success: true, user: result[0] };
  } catch (error) {
    console.error("Error creating user:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
}