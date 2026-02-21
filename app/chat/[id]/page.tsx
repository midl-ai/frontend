import { Chat } from '@/components/chat/chat';
import { getMessagesByChatId, isDatabaseAvailable } from '@/lib/db/queries';
import type { UIMessage } from '@ai-sdk/react';

interface ChatPageProps {
  params: Promise<{ id: string }>;
}

export default async function ExistingChatPage({ params }: ChatPageProps) {
  const { id } = await params;

  // Skip database fetch if not available
  let initialMessages: UIMessage[] = [];

  if (isDatabaseAvailable()) {
    try {
      const messages = await getMessagesByChatId(id);

      // Convert DB messages to UIMessage format
      initialMessages = messages.map((m) => {
        let parts: unknown[];
        try {
          const parsed = typeof m.parts === 'string' ? JSON.parse(m.parts) : m.parts;
          parts = Array.isArray(parsed) ? parsed : [{ type: 'text', text: String(parsed) }];
        } catch {
          parts = [{ type: 'text', text: String(m.parts) }];
        }

        return {
          id: m.id,
          role: m.role as 'user' | 'assistant',
          parts,
        } as UIMessage;
      });
    } catch {
      // Database error - start with empty messages
      initialMessages = [];
    }
  }

  return <Chat id={id} initialMessages={initialMessages} />;
}
