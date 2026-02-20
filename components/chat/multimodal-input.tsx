'use client';

import { useRef, useCallback, type KeyboardEvent } from 'react';
import { Send, Square, Paperclip, Image, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MultimodalInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (text: string) => void;
  isLoading: boolean;
  stop: () => void;
}

export function MultimodalInput({
  input,
  setInput,
  onSubmit,
  isLoading,
  stop,
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
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="relative flex flex-col gap-2 p-3 rounded-xl bg-background-secondary/80 backdrop-blur-xl border border-border shadow-2xl transition-all focus-within:border-accent/50 focus-within:ring-1 focus-within:ring-accent/20">
        
        {/* Text Area */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder="Ask MIDL to bridge, deploy, or query..."
          rows={1}
          className={cn(
            'w-full resize-none bg-transparent text-foreground placeholder:text-foreground-muted/50',
            'focus:outline-none min-h-[40px] max-h-[200px] p-2 font-mono text-sm leading-relaxed'
          )}
          disabled={isLoading}
        />

        {/* Toolbar */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-1">
            <button 
              className="p-2 rounded-lg text-foreground-muted hover:bg-background-tertiary hover:text-foreground transition-colors"
              title="Attach file (Coming Soon)"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <button 
              className="p-2 rounded-lg text-foreground-muted hover:bg-background-tertiary hover:text-foreground transition-colors"
              title="Upload Image (Coming Soon)"
            >
              <Image className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-xs text-foreground-subtle hidden sm:block mr-2">
              <span className="kbd font-sans border border-border px-1 py-0.5 rounded text-[10px]">RW</span> Return
            </div>

            {isLoading ? (
              <button
                onClick={stop}
                className="p-2 rounded-lg bg-foreground text-background hover:opacity-90 transition-opacity shadow-sm flex items-center gap-2 px-3"
              >
                <Square className="w-3 h-3 fill-current" />
                <span className="text-xs font-bold">Stop</span>
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!input.trim()}
                className={cn(
                  'p-2 rounded-lg transition-all shadow-sm flex items-center gap-2 px-3',
                  input.trim()
                    ? 'bg-accent text-accent-foreground hover:bg-accent-hover hover:shadow-accent/25'
                    : 'bg-background-tertiary text-foreground-muted cursor-not-allowed'
                )}
              >
                <span className="text-xs font-bold">Run</span>
                <Send className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Footer Info */}
      <div className="mt-3 flex items-center justify-center gap-4 text-[10px] text-foreground-muted opacity-60">
        <div className="flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          <span>Powered by Anthropic Claude 3.5 Sonnet</span>
        </div>
        <div className="w-px h-3 bg-border" />
        <div>MIDL Protocol v0.1.0</div>
      </div>
    </div>
  );
}