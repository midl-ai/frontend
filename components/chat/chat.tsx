'use client';

import { useState, useCallback } from 'react';
import { useChat, type UIMessage } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { Messages } from './messages';
import { MultimodalInput } from './multimodal-input';
import { SuggestedActions } from './suggested-actions';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { generateUUID } from '@/lib/utils';

interface ChatProps {
  id: string;
  initialMessages?: UIMessage[];
}

export function Chat({ id, initialMessages = [] }: ChatProps) {
  const [input, setInput] = useState('');

  const { messages, sendMessage, status, stop } = useChat({
    id,
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: '/api/chat',
      headers: () => ({
        'Content-Type': 'application/json',
      }),
      body: { id },
    }),
  });

  const isLoading = status === 'streaming' || status === 'submitted';
  const isEmpty = messages.length === 0;

  const handleSubmit = useCallback(
    (text: string) => {
      if (!text.trim() || isLoading) return;
      sendMessage({ text: text.trim() });
      setInput('');
    },
    [sendMessage, isLoading]
  );

  const handleSuggestion = useCallback(
    (prompt: string) => {
      sendMessage({ text: prompt });
    },
    [sendMessage]
  );

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold text-foreground">
            MIDL AI Terminal
          </h1>
          <span className="px-2 py-0.5 text-xs rounded-full bg-accent/20 text-accent">
            Beta
          </span>
        </div>
        <ThemeToggle />
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full px-4">
            <div className="max-w-2xl text-center space-y-6">
              <h2 className="text-2xl font-bold text-foreground">
                Welcome to MIDL AI
              </h2>
              <p className="text-foreground-muted">
                Your intelligent assistant for the MIDL blockchain. Check
                balances, bridge assets, deploy contracts, and more.
              </p>
              <SuggestedActions onSelect={handleSuggestion} />
            </div>
          </div>
        ) : (
          <Messages messages={messages} isLoading={isLoading} />
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-border p-4">
        <div className="max-w-3xl mx-auto">
          <MultimodalInput
            input={input}
            setInput={setInput}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            stop={stop}
            hasMessages={messages.length > 0}
          />
        </div>
      </div>
    </div>
  );
}
