'use client';

import { useEffect, useRef } from 'react';
import type { UIMessage } from '@ai-sdk/react';
import { Message } from './message';
import { ToolCallLoader } from './tool-call-loader';

interface MessagesProps {
  messages: UIMessage[];
  isLoading: boolean;
  onSuggestion?: (text: string) => void;
}

export function Messages({ messages, isLoading, onSuggestion }: MessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="h-full overflow-y-auto px-4 py-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {messages.map((message) => (
          <Message key={message.id} message={message} onSuggestion={onSuggestion} />
        ))}

        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <div className="flex justify-start">
            <ToolCallLoader />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
