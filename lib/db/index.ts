import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL;

/** Whether the database is configured */
export const isDatabaseConfigured = !!connectionString;

// Create postgres client only if DATABASE_URL is set
const client = connectionString
  ? postgres(connectionString, {
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
    })
  : null;

// Create drizzle instance with schema (or null if no database)
export const db = client ? drizzle(client, { schema }) : null;

export type Database = NonNullable<typeof db>;

/** Helper to check if database is available before queries */
export function requireDatabase(): Database {
  if (!db) {
    throw new Error('Database not configured. Set DATABASE_URL environment variable.');
  }
  return db;
}
