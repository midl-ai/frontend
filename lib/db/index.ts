import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Lazy initialization to avoid build-time errors
let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

function getConnectionString(): string {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      'DATABASE_URL is required. Run "docker-compose up -d" to start PostgreSQL.'
    );
  }
  return connectionString;
}

/** Get database instance (lazy initialization) */
export function getDb() {
  if (!_db) {
    const connectionString = getConnectionString();
    const client = postgres(connectionString, {
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
    });
    _db = drizzle(client, { schema });
  }
  return _db;
}

// Export db as a getter for backwards compatibility
export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(_, prop) {
    return Reflect.get(getDb(), prop);
  },
});
