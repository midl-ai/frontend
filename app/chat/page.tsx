'use client';

import { Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Chat } from '@/components/chat/chat';
import { generateUUID } from '@/lib/utils';

function ChatContent() {
  // Get a unique key from URL params to force remounting on navigation
  const searchParams = useSearchParams();
  const sessionKey = searchParams.get('session') || 'default';

  // Generate unique ID for this chat session, memoized by sessionKey
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const chatId = useMemo(() => generateUUID(), [sessionKey]);

  // key={chatId} forces complete component remount for session isolation
  return <Chat key={chatId} id={chatId} initialMessages={[]} />;
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="flex h-full items-center justify-center">Loading...</div>}>
      <ChatContent />
    </Suspense>
  );
}
