'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Chat } from '@/components/chat/chat';
import { generateUUID } from '@/lib/utils';

export default function ChatPage() {
  // Get a unique key from URL params to force remounting on navigation
  const searchParams = useSearchParams();
  const sessionKey = searchParams.get('session') || 'default';

  // Generate unique ID for this chat session, memoized by sessionKey
  const chatId = useMemo(() => generateUUID(), [sessionKey]);

  // key={chatId} forces complete component remount for session isolation
  return <Chat key={chatId} id={chatId} initialMessages={[]} />;
}
