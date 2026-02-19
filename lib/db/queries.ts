import { eq, desc, lt, and, sql } from 'drizzle-orm';
import { db } from './index';
import { user, chat, message, stream } from './schema';
import type { NewUser, NewChat, NewMessage, NewStream, Chat, Message } from './schema';

// ============================================================================
// User Queries
// ============================================================================

export async function getUserById(id: string) {
  const [result] = await db.select().from(user).where(eq(user.id, id)).limit(1);
  return result ?? null;
}

export async function getUserByAddress(address: string) {
  const [result] = await db.select().from(user).where(eq(user.address, address)).limit(1);
  return result ?? null;
}

export async function createUser(data: NewUser) {
  const [result] = await db.insert(user).values(data).returning();
  return result;
}

export async function getOrCreateUserByAddress(address: string) {
  const existing = await getUserByAddress(address);
  if (existing) return existing;

  const id = crypto.randomUUID();
  return createUser({ id, address });
}

// ============================================================================
// Chat Queries
// ============================================================================

export async function getChatById(id: string) {
  const [result] = await db.select().from(chat).where(eq(chat.id, id)).limit(1);
  return result ?? null;
}

export async function createChat(data: NewChat) {
  const [result] = await db.insert(chat).values(data).returning();
  return result;
}

export async function updateChatTitle(id: string, title: string) {
  await db.update(chat).set({ title }).where(eq(chat.id, id));
}

export async function deleteChat(id: string) {
  await db.delete(chat).where(eq(chat.id, id));
}

/** Get chats with cursor-based pagination */
export async function getChatsByUserId({
  userId,
  limit = 20,
  startingAfter,
}: {
  userId: string;
  limit?: number;
  startingAfter?: string;
}): Promise<{ chats: Chat[]; hasMore: boolean; nextCursor: string | null }> {
  let query = db
    .select()
    .from(chat)
    .where(eq(chat.userId, userId))
    .orderBy(desc(chat.createdAt))
    .limit(limit + 1); // +1 to detect hasMore

  if (startingAfter) {
    const [cursor] = await db.select().from(chat).where(eq(chat.id, startingAfter)).limit(1);
    if (cursor) {
      query = db
        .select()
        .from(chat)
        .where(and(eq(chat.userId, userId), lt(chat.createdAt, cursor.createdAt)))
        .orderBy(desc(chat.createdAt))
        .limit(limit + 1);
    }
  }

  const results = await query;
  const hasMore = results.length > limit;
  const chats = results.slice(0, limit);

  return {
    chats,
    hasMore,
    nextCursor: hasMore && chats.length > 0 ? chats[chats.length - 1].id : null,
  };
}

// ============================================================================
// Message Queries
// ============================================================================

export async function getMessagesByChatId(chatId: string): Promise<Message[]> {
  return db.select().from(message).where(eq(message.chatId, chatId)).orderBy(message.createdAt);
}

export async function createMessage(data: NewMessage) {
  const [result] = await db.insert(message).values(data).returning();
  return result;
}

export async function saveMessages({
  chatId,
  messages: msgs,
}: {
  chatId: string;
  messages: Array<{ id: string; role: string; parts: unknown[] }>;
}) {
  if (msgs.length === 0) return;

  const values: NewMessage[] = msgs.map((m) => ({
    id: m.id,
    chatId,
    role: m.role,
    parts: JSON.stringify(m.parts),
    createdAt: new Date(),
  }));

  await db.insert(message).values(values).onConflictDoNothing();
}

export async function deleteMessagesByChatId(chatId: string) {
  await db.delete(message).where(eq(message.chatId, chatId));
}

// ============================================================================
// Stream Queries
// ============================================================================

export async function saveStream(data: NewStream) {
  const [result] = await db.insert(stream).values(data).returning();
  return result;
}

export async function getStreamIdsByChatId(chatId: string): Promise<string[]> {
  const results = await db
    .select({ id: stream.id })
    .from(stream)
    .where(eq(stream.chatId, chatId))
    .orderBy(stream.createdAt);

  return results.map((r) => r.id);
}

export async function deleteStreamsByChatId(chatId: string) {
  await db.delete(stream).where(eq(stream.chatId, chatId));
}

// ============================================================================
// Utility Queries
// ============================================================================

/** Generate chat title from first message */
export function generateChatTitle(firstMessage: string): string {
  const maxLength = 50;
  const cleaned = firstMessage.replace(/\n/g, ' ').trim();
  if (cleaned.length <= maxLength) return cleaned;
  return cleaned.slice(0, maxLength - 3) + '...';
}
