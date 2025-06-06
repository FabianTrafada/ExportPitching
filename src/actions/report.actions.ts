"use server";

import { db } from "@/db/neon";
import { users, practiceTemplates, pitchingSessions } from "@/db/schema";
import { sql, count, desc, eq } from "drizzle-orm";
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, startOfQuarter, endOfQuarter, format } from "date-fns";

// Get user growth data (users registered over time)
export async function getUserGrowthData(timeRange: string) {
  let startDate: Date;
  const endDate = new Date();
  let formatPattern: string;
  let groupByFormat: string;
  
  // Set date ranges based on selected time period
  switch (timeRange) {
    case 'week':
      startDate = startOfWeek(new Date());
      formatPattern = 'EEE'; // Mon, Tue, etc.
      groupByFormat = 'day';
      break;
    case 'month':
      startDate = startOfMonth(new Date());
      formatPattern = 'dd'; // 01, 02, etc.
      groupByFormat = 'day';
      break;
    case 'quarter':
      startDate = startOfQuarter(new Date());
      formatPattern = 'MMM'; // Jan, Feb, etc.
      groupByFormat = 'month';
      break;
    case 'year':
      startDate = startOfYear(new Date());
      formatPattern = 'MMM'; // Jan, Feb, etc.
      groupByFormat = 'month';
      break;
    default:
      startDate = startOfMonth(new Date());
      formatPattern = 'dd'; // 01, 02, etc.
      groupByFormat = 'day';
  }

  if (groupByFormat === 'day') {
    // Query: Count users by day
    const result = await db.select({
      period: sql<string>`date_trunc('day', "created_at")::date`,
      count: count()
    })
    .from(users)
    .where(sql`"created_at" BETWEEN ${startDate.toISOString()} AND ${endDate.toISOString()}`)
    .groupBy(sql`date_trunc('day', "created_at")::date`)
    .orderBy(sql`date_trunc('day', "created_at")::date`);

    // Transform the data for the chart
    return result.map(row => ({
      period: format(new Date(row.period), formatPattern),
      users: Number(row.count)
    }));
  } else {
    // Query: Count users by month
    const result = await db.select({
      period: sql<string>`date_trunc('month', "created_at")::date`,
      count: count()
    })
    .from(users)
    .where(sql`"created_at" BETWEEN ${startDate.toISOString()} AND ${endDate.toISOString()}`)
    .groupBy(sql`date_trunc('month', "created_at")::date`)
    .orderBy(sql`date_trunc('month', "created_at")::date`);

    // Transform the data for the chart
    return result.map(row => ({
      period: format(new Date(row.period), formatPattern),
      users: Number(row.count)
    }));
  }
}

// Get sessions by day of week
export async function getSessionsByDayData(timeRange: string) {
  let startDate: Date;
  let endDate = new Date();
  
  // Set date ranges based on selected time period
  switch (timeRange) {
    case 'week':
      startDate = startOfWeek(new Date());
      endDate = endOfWeek(new Date());
      break;
    case 'month':
      startDate = startOfMonth(new Date());
      endDate = endOfMonth(new Date());
      break;
    case 'quarter':
      startDate = startOfQuarter(new Date());
      endDate = endOfQuarter(new Date());
      break;
    case 'year':
      startDate = startOfYear(new Date());
      endDate = endOfYear(new Date());
      break;
    default:
      startDate = startOfMonth(new Date());
      endDate = endOfMonth(new Date());
  }

  // Query: Count sessions by day of week
  const result = await db.select({
    day: sql<string>`to_char("created_at", 'Dy')`, // Mon, Tue, Wed, etc.
    count: count(),
  })
  .from(pitchingSessions)
  .where(sql`"created_at" BETWEEN ${startDate.toISOString()} AND ${endDate.toISOString()}`)
  .groupBy(sql`to_char("created_at", 'Dy')`)
  .orderBy(sql`
    CASE 
      WHEN to_char("created_at", 'Dy') = 'Mon' THEN 1
      WHEN to_char("created_at", 'Dy') = 'Tue' THEN 2
      WHEN to_char("created_at", 'Dy') = 'Wed' THEN 3
      WHEN to_char("created_at", 'Dy') = 'Thu' THEN 4
      WHEN to_char("created_at", 'Dy') = 'Fri' THEN 5
      WHEN to_char("created_at", 'Dy') = 'Sat' THEN 6
      WHEN to_char("created_at", 'Dy') = 'Sun' THEN 7
    END
  `);

  // Transform the data for the chart
  return result.map(row => ({
    day: row.day,
    sessions: Number(row.count)
  }));
}

// Get template usage by industry
export async function getTemplateUsageData() {
  const result = await db.select({
    industry: practiceTemplates.industry,
    count: count(),
  })
  .from(pitchingSessions)
  .innerJoin(practiceTemplates, eq(pitchingSessions.templateId, practiceTemplates.id))
  .groupBy(practiceTemplates.industry)
  .orderBy(desc(count()));

  // Transform the data for the chart
  return result.map(row => ({
    name: row.industry,
    value: Number(row.count)
  })).slice(0, 5); // Take top 5 industries
}

// Get difficulty distribution
export async function getDifficultyDistributionData() {
  const result = await db.select({
    difficulty: practiceTemplates.difficulty,
    count: count(),
  })
  .from(pitchingSessions)
  .innerJoin(practiceTemplates, eq(pitchingSessions.templateId, practiceTemplates.id))
  .groupBy(practiceTemplates.difficulty)
  .orderBy(desc(count()));

  // Transform the data for the chart
  return result.map(row => ({
    name: row.difficulty,
    value: Number(row.count)
  }));
} 