import { pgTable, serial, varchar, integer, timestamp, text, boolean, decimal } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    name: varchar('name', { length: 100 }).notNull(),
    password: varchar('password', { length: 255 }),
    imageUrl: varchar('image_url', { length: 255 }).notNull(),
    clerkUserId: varchar('clerk_user_id', { length: 255 }).notNull().unique(),
    credit: integer('credit').notNull().default(50  ),
    role: varchar('role', { length: 20 }).notNull().default('user'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const notificationPreferences = pgTable('notification_preferences', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id).notNull(),
    emailNotifications: boolean('email_notifications').notNull().default(true),
    feedbackAlerts: boolean('feedback_alerts').notNull().default(true),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const practiceTemplates = pgTable("practice_templates", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    questions: text("questions").notNull(),
    difficulty: text("difficulty").notNull(), // beginner, intermediate, advanced
    duration: integer("duration").notNull(), // in minutes
    industry: text("industry").notNull(),
    targetMarket: text("target_market").notNull(),
    targetMarketCode: text("target_market_code").notNull(),
    imageUrl: text("image_url"),
    isActive: boolean("is_active").notNull().default(true),
    usageCount: integer("usage_count").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
})

export const pitchingSessions = pgTable("pitching_sessions", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id).notNull(),
    templateId: integer("template_id").references(() => practiceTemplates.id).notNull(),
    status: varchar("status", { length: 50 }).notNull().default("in_progress"),
    createdAt: timestamp("created_at").defaultNow(),
    completedAt: timestamp("completed_at"),
})

export const pitchFeedback = pgTable("pitch_feedback", {
    id: serial("id").primaryKey(),
    pitchingId: integer("pitching_id").references(() => pitchingSessions.id).notNull(),
    userId: integer("user_id").references(() => users.id).notNull(),
    totalScore: decimal("total_score", { precision: 5, scale: 2 }).notNull(),
    categoryScores: text("category_scores").notNull(), // Stored as JSON string
    strengths: text("strengths").notNull(), // Stored as JSON array string
    areasForImprovement: text("areas_for_improvement").notNull(), // Stored as JSON array string
    finalAssessment: text("final_assessment").notNull(),
    transcript: text("transcript").notNull(), // Store the full transcript
    createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
    pitchingSessions: many(pitchingSessions),
    pitchFeedback: many(pitchFeedback),
    notificationPreferences: many(notificationPreferences),
}));

export const practiceTemplatesRelations = relations(practiceTemplates, ({ many }) => ({
    pitchingSessions: many(pitchingSessions),
}));

export const pitchingSessionsRelations = relations(pitchingSessions, ({ one, many }) => ({
    user: one(users, {
        fields: [pitchingSessions.userId],
        references: [users.id],
    }),
    template: one(practiceTemplates, {
        fields: [pitchingSessions.templateId],
        references: [practiceTemplates.id],
    }),
    feedback: many(pitchFeedback),
}));

export const pitchFeedbackRelations = relations(pitchFeedback, ({ one }) => ({
    user: one(users, {
        fields: [pitchFeedback.userId],
        references: [users.id],
    }),
    pitchingSession: one(pitchingSessions, {
        fields: [pitchFeedback.pitchingId],
        references: [pitchingSessions.id],
    }),
}));

export const notificationPreferencesRelations = relations(notificationPreferences, ({ one }) => ({
    user: one(users, {
        fields: [notificationPreferences.userId],
        references: [users.id],
    }),
}));