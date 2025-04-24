import { pgTable, serial, varchar, integer, timestamp, text, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    name: varchar('name', { length: 100 }).notNull(),
    password: varchar('password', { length: 255 }),
    imageUrl: varchar('image_url', { length: 255 }).notNull(),
    clerkUserId: varchar('clerk_user_id', { length: 255 }).notNull().unique(),
    credit: integer('credit').notNull().default(5),
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