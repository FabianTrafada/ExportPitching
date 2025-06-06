import * as z from "zod";

export const nameUpdateSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
});

export type NameUpdateFormValues = z.infer<typeof nameUpdateSchema>;

export const notificationPreferencesSchema = z.object({
  emailNotifications: z.boolean(),
  feedbackAlerts: z.boolean(),
});

export type NotificationPreferencesFormValues = {
  emailNotifications: boolean;
  feedbackAlerts: boolean;
};

export const userProfileUpdateSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be less than 50 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens"),
});

export type UserProfileUpdateFormValues = z.infer<typeof userProfileUpdateSchema>;

export const emailUpdateSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address"),
});

export type EmailUpdateFormValues = z.infer<typeof emailUpdateSchema>; 