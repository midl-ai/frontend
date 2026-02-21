'use client';

import { useState } from 'react';
import { Chat } from '@/components/chat/chat';
import { generateUUID } from '@/lib/utils';

export default function ChatPage() {
  // Generate unique ID once on mount - persists across re-renders
  const [chatId] = useState(() => generateUUID());

  // key={chatId} forces complete component remount for session isolation
  return <Chat key={chatId} id={chatId} initialMessages={[]} />;
}
