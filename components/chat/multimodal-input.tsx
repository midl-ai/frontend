'use client';

import { useRef, useCallback, type KeyboardEvent } from 'react';
import { Send, Square, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MultimodalInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (text: string) => void;
  isLoading: boolean;
  stop: () => void;
  hasMessages: boolean;
}

export function MultimodalInput({
  input,
  setInput,
  onSubmit,
  isLoading,
  stop,
  hasMessages,
}: MultimodalInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = useCallback(() => {
    if (!input.trim() || isLoading) return;
    onSubmit(input.trim());

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [input, isLoading, onSubmit]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  };

  return (
    <div className="relative">
      <div className="flex items-end gap-2 p-3 rounded-xl bg-background-secondary border border-border focus-within:border-accent transition-colors">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder="Ask anything about MIDL..."
          rows={1}
          className={cn(
            'flex-1 resize-none bg-transparent text-foreground placeholder:text-foreground-muted',
            'focus:outline-none min-h-[24px] max-h-[200px]'
          )}
          disabled={isLoading}
        />

        <div className="flex items-center gap-1">
          {/* Send/Stop button */}
          {isLoading ? (
            <button
              onClick={stop}
              className="p-2 rounded-lg bg-error hover:bg-error/80 text-white transition-colors"
              title="Stop generation"
            >
              <Square className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!input.trim()}
              className={cn(
                'p-2 rounded-lg transition-colors',
                input.trim()
                  ? 'bg-accent hover:bg-accent-hover text-accent-foreground'
                  : 'bg-background-tertiary text-foreground-subtle cursor-not-allowed'
              )}
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <p className="mt-2 text-xs text-center text-foreground-subtle">
        MIDL AI can make mistakes. Verify important information.
      </p>
    </div>
  );
}
