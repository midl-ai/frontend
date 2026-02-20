'use client';

import { useState, useCallback } from 'react';
import { useChat, type UIMessage } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { Messages } from './messages';
import { MultimodalInput } from './multimodal-input';
import { SuggestedActions } from './suggested-actions';
import { Terminal } from 'lucide-react';

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
      headers: () => {
        // Include wallet addresses in headers for API auth
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (typeof window !== 'undefined') {
          const walletAddress = localStorage.getItem('walletAddress');
          const evmAddress = localStorage.getItem('evmAddress');
          const btcAddress = localStorage.getItem('btcAddress');
          if (walletAddress) headers['x-wallet-address'] = walletAddress;
          if (evmAddress) headers['x-evm-address'] = evmAddress;
          if (btcAddress) headers['x-btc-address'] = btcAddress;
        }
        return headers;
      },
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
    <div className="flex flex-col h-full relative">
      {/* Messages Area */}
      <div className="flex-1 overflow-hidden relative">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full px-4 animate-fade-in">
            <div className="max-w-2xl text-center space-y-8">
              <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto border border-accent/20">
                <Terminal className="w-8 h-8 text-accent" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">
                  MIDL Terminal
                </h2>
                <p className="text-foreground-muted text-lg max-w-lg mx-auto">
                  Execute Bitcoin L1 and EVM L2 operations using natural language.
                </p>
              </div>

              <SuggestedActions onSelect={handleSuggestion} />
            </div>
          </div>
        ) : (
          <Messages messages={messages} isLoading={isLoading} />
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 md:p-6 bg-gradient-to-t from-background via-background to-transparent z-10">
        <div className="max-w-3xl mx-auto">
          <MultimodalInput
            input={input}
            setInput={setInput}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            stop={stop}
          />
        </div>
      </div>
    </div>
  );
}