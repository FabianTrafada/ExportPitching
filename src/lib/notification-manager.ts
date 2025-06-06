'use server';

import { 
  sendFeedbackReadyEmail, 
  sendPracticeReminderEmail, 
  sendCreditUpdateEmail 
} from './email-service';
import { db } from '@/db/neon';
import { users, notificationPreferences } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { 
  NotificationPreferences, 
  FeedbackNotificationData,
  CreditNotificationData,
  PracticeNotificationData
} from '@/types/type';

// Get user notification preferences from the database
async function getUserPreferences(userId: string): Promise<NotificationPreferences> {
  try {
    // First, find the user's numeric ID from the clerkUserId
    const user = await db.query.users.findFirst({
      where: eq(users.clerkUserId, userId),
    });
    
    if (!user) {
      console.error(`User not found: ${userId}`);
      // Return default preferences if user not found
      return {
        emailNotifications: true,
        feedbackAlerts: true,
      };
    }
    
    // Query the notification_preferences table for this user's preferences
    const preferences = await db.query.notificationPreferences.findFirst({
      where: eq(notificationPreferences.userId, user.id),
    });
    
    if (!preferences) {
      console.log(`No stored preferences for user ${userId}, using defaults`);
      // If no preferences are stored, return default values
      return {
        emailNotifications: true,
        feedbackAlerts: true,
      };
    }
    
    // Return the stored preferences
    return {
      emailNotifications: preferences.emailNotifications,
      feedbackAlerts: preferences.feedbackAlerts,
    };
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    // Return default preferences on error
    return {
      emailNotifications: true,
      feedbackAlerts: true,
    };
  }
}

// Get user email by their ID
async function getUserEmail(userId: string): Promise<string | null> {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.clerkUserId, userId),
    });
    
    if (!user) {
      console.error(`User not found: ${userId}`);
      return null;
    }
    
    return user.email;
  } catch (error) {
    console.error('Error fetching user email:', error);
    return null;
  }
}

// Send feedback ready notification if user has enabled relevant preferences
export async function notifyFeedbackReady(
  userId: string,
  feedbackData: FeedbackNotificationData
) {
  try {
    // Get user preferences
    const preferences = await getUserPreferences(userId);
    
    // Check if user wants email notifications and feedback alerts
    if (preferences.emailNotifications && preferences.feedbackAlerts) {
      const userEmail = await getUserEmail(userId);
      
      if (!userEmail) {
        console.error(`Could not find email for user ${userId}`);
        return { success: false, error: 'User email not found' };
      }
      
      // Get user name
      const user = await db.query.users.findFirst({
        where: eq(users.clerkUserId, userId),
      });
      
      if (!user) {
        console.error(`User not found: ${userId}`);
        return { success: false, error: 'User not found' };
      }
      
      // Send the email
      return await sendFeedbackReadyEmail(userEmail, {
        userName: user.name,
        templateName: feedbackData.templateName,
        feedbackId: feedbackData.feedbackId,
        score: feedbackData.score,
        strengths: feedbackData.strengths,
        improvements: feedbackData.improvements,
        date: new Date().toLocaleDateString(),
      });
    }
    
    return { success: true, message: 'User has disabled notifications' };
  } catch (error) {
    console.error('Error sending feedback ready notification:', error);
    return { success: false, error };
  }
}

// Send practice reminder notification if user has enabled relevant preferences
export async function notifyPracticeReminder(
  userId: string,
  data: PracticeNotificationData
) {
  try {
    // Get user preferences
    const preferences = await getUserPreferences(userId);
    
    // Check if user wants email notifications
    if (preferences.emailNotifications) {
      const userEmail = await getUserEmail(userId);
      
      if (!userEmail) {
        console.error(`Could not find email for user ${userId}`);
        return { success: false, error: 'User email not found' };
      }
      
      // Get user name
      const user = await db.query.users.findFirst({
        where: eq(users.clerkUserId, userId),
      });
      
      if (!user) {
        console.error(`User not found: ${userId}`);
        return { success: false, error: 'User not found' };
      }
      
      // Send the email
      return await sendPracticeReminderEmail(userEmail, {
        userName: user.name,
        daysSinceLastPractice: data.daysSinceLastPractice,
        suggestedTemplates: data.suggestedTemplates,
        tipOfTheDay: data.tipOfTheDay,
      });
    }
    
    return { success: true, message: 'User has disabled notifications' };
  } catch (error) {
    console.error('Error sending practice reminder notification:', error);
    return { success: false, error };
  }
}

// Send credit update notification if user has enabled relevant preferences
export async function notifyCreditUpdate(
  userId: string,
  creditData: CreditNotificationData
) {
  try {
    // Get user preferences
    const preferences = await getUserPreferences(userId);
    
    // Check if user wants email notifications
    if (preferences.emailNotifications) {
      const userEmail = await getUserEmail(userId);
      
      if (!userEmail) {
        console.error(`Could not find email for user ${userId}`);
        return { success: false, error: 'User email not found' };
      }
      
      // Get user name
      const user = await db.query.users.findFirst({
        where: eq(users.clerkUserId, userId),
      });
      
      if (!user) {
        console.error(`User not found: ${userId}`);
        return { success: false, error: 'User not found' };
      }
      
      // Send the email
      return await sendCreditUpdateEmail(userEmail, {
        userName: user.name,
        ...creditData,
      });
    }
    
    return { success: true, message: 'User has disabled notifications' };
  } catch (error) {
    console.error('Error sending credit update notification:', error);
    return { success: false, error };
  }
} 