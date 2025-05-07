import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from "@/db/schema";

const sql = neon(process.env.DATABASE_URL || "postgresql://ExportPitching_owner:npg_t8NL7dkaRmDA@ep-wandering-butterfly-a18jqw9s-pooler.ap-southeast-1.aws.neon.tech/ExportPitching?sslmode=require");
export const db = drizzle({ client: sql, schema });
