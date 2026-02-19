import { Chat } from '@/components/chat/chat';
import { getMessagesByChatId } from '@/lib/db/queries';
import type { UIMessage } from '@ai-sdk/react';

interface ChatPageProps {
  params: Promise<{ id: string }>;
}

export default async function ExistingChatPage({ params }: ChatPageProps) {
  const { id } = await params;

  // Fetch existing messages
  const messages = await getMessagesByChatId(id);

  // Convert DB messages to UIMessage format
  const initialMessages: UIMessage[] = messages.map((m) => {
    // Parse stored parts - they could be string or already parsed
    let parts: unknown[];
    try {
      const parsed = typeof m.parts === 'string' ? JSON.parse(m.parts) : m.parts;
      // Ensure parts is an array
      parts = Array.isArray(parsed) ? parsed : [{ type: 'text', text: String(parsed) }];
    } catch {
      // If parsing fails, treat as plain text
      parts = [{ type: 'text', text: String(m.parts) }];
    }

    return {
      id: m.id,
      role: m.role as 'user' | 'assistant',
      parts,
    } as UIMessage;
  });

  return <Chat id={id} initialMessages={initialMessages} />;
}
