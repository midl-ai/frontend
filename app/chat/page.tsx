import { Chat } from '@/components/chat/chat';
import { generateUUID } from '@/lib/utils';

export default function ChatPage() {
  // Generate a new chat ID for fresh conversations
  const chatId = generateUUID();

  return <Chat id={chatId} initialMessages={[]} />;
}
