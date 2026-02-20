import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/midl';

// Only throw in production runtime if missing, but allow build
if (!process.env.DATABASE_URL && process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
  console.warn('DATABASE_URL is missing in production build context');
}

// Create postgres client with connection pooling
const client = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

// Create drizzle instance with schema
export const db = drizzle(client, { schema });

export type Database = typeof db;
