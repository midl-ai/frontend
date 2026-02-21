import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

/** User table - stores wallet addresses */
export const user = pgTable('User', {
  id: text('id').primaryKey(),
  address: text('address').notNull().unique(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
});

/** Chat table - stores chat sessions */
export const chat = pgTable('Chat', {
  id: text('id').primaryKey(),
  userId: text('userId').references(() => user.id),
  title: text('title').notNull(),
  visibility: text('visibility').default('private').notNull(),
  createdAt: timestamp('createdAt').notNull(),
});

/** Message table - stores chat messages with parts (AI SDK v6 format) */
export const message = pgTable('Message_v2', {
  id: text('id').primaryKey(),
  chatId: text('chatId').references(() => chat.id, { onDelete: 'cascade' }),
  role: text('role').notNull(), // 'user' | 'assistant' | 'system' | 'tool'
  parts: text('parts').notNull(), // JSON stringified array of message parts
  createdAt: timestamp('createdAt').notNull(),
});

/** Stream table - tracks resumable streams for Redis */
export const stream = pgTable('Stream', {
  id: text('id').primaryKey(), // streamId
  chatId: text('chatId').references(() => chat.id, { onDelete: 'cascade' }),
  createdAt: timestamp('createdAt').notNull(),
});

/** Contact table - stores saved wallet addresses with names for voice mode */
export const contact = pgTable('Contact', {
  id: text('id').primaryKey(),
  userId: text('userId').references(() => user.id, { onDelete: 'cascade' }),
  name: text('name').notNull(), // "Alex", "John"
  evmAddress: text('evmAddress'), // 0x...
  btcAddress: text('btcAddress'), // bc1...
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

/** Type exports for use in queries */
export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
export type Chat = typeof chat.$inferSelect;
export type NewChat = typeof chat.$inferInsert;
export type Message = typeof message.$inferSelect;
export type NewMessage = typeof message.$inferInsert;
export type Stream = typeof stream.$inferSelect;
export type NewStream = typeof stream.$inferInsert;
export type Contact = typeof contact.$inferSelect;
export type NewContact = typeof contact.$inferInsert;
