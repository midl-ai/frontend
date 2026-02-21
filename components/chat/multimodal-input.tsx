'use client';

import { useRef, useCallback, type KeyboardEvent } from 'react';
import { Send, Square, Terminal, Mic, MicOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MultimodalInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (text: string) => void;
  isLoading: boolean;
  stop: () => void;
  /** Voice mode status */
  voiceActive?: boolean;
  /** Voice mode toggle handler */
  onVoiceToggle?: () => void;
}

export function MultimodalInput({
  input,
  setInput,
  onSubmit,
  isLoading,
  stop,
  voiceActive = false,
  onVoiceToggle,
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
    <div className="relative w-full max-w-3xl mx-auto">
      <div
        className={cn(
          'relative flex items-start gap-3 p-4 rounded-2xl',
          'bg-gradient-to-b from-background-secondary to-background-secondary/80',
          'border border-border/80 shadow-xl',
          'transition-all duration-200',
          'focus-within:border-accent/60 focus-within:shadow-accent/10 focus-within:shadow-2xl'
        )}
      >
        {/* Terminal icon indicator */}
        <div className="shrink-0 mt-1">
          <div
            className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center',
              'bg-accent/10 border border-accent/20',
              isLoading && 'animate-pulse'
            )}
          >
            <Terminal className="w-4 h-4 text-accent" />
          </div>
        </div>

        {/* Input area */}
        <div className="flex-1 min-w-0">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            placeholder="What would you like to do on MIDL?"
            rows={1}
            className={cn(
              'w-full resize-none bg-transparent text-foreground',
              'placeholder:text-foreground-muted/60',
              'focus:outline-none min-h-[28px] max-h-[200px]',
              'text-[15px] leading-relaxed'
            )}
            disabled={isLoading}
          />

          {/* Hint text */}
          <div className="flex items-center gap-3 mt-2 text-xs text-foreground-subtle">
            <span>Bridge • Deploy • Query • Transfer</span>
            <span className="hidden sm:inline text-foreground-muted">
              ⏎ to send
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="shrink-0 flex items-center gap-2">
          {/* Voice toggle button */}
          {onVoiceToggle && (
            <button
              type="button"
              onClick={onVoiceToggle}
              disabled={isLoading}
              className={cn(
                'flex items-center justify-center w-10 h-10 rounded-xl transition-all',
                'border shadow-sm',
                voiceActive
                  ? 'bg-accent text-accent-foreground border-accent'
                  : 'bg-background-tertiary text-foreground-muted border-border hover:border-border-hover'
              )}
              title={voiceActive ? 'Stop voice mode' : 'Start voice mode'}
            >
              {voiceActive ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>
          )}

          {/* Submit/Stop button */}
          {isLoading ? (
            <button
              onClick={stop}
              className={cn(
                'flex items-center justify-center gap-2 px-4 py-2 rounded-xl',
                'bg-foreground text-background font-medium text-sm',
                'hover:opacity-90 transition-opacity',
                'shadow-sm'
              )}
            >
              <Square className="w-3 h-3 fill-current" />
              <span>Stop</span>
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!input.trim()}
              className={cn(
                'flex items-center justify-center gap-2 px-4 py-2 rounded-xl',
                'font-medium text-sm transition-all duration-200',
                'shadow-sm',
                input.trim()
                  ? 'bg-accent text-accent-foreground hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/20 hover:-translate-y-0.5'
                  : 'bg-background-tertiary text-foreground-muted cursor-not-allowed'
              )}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Run</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
