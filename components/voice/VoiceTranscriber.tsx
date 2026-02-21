'use client';

import { memo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Bot, Wrench, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TranscriptEntry } from '@/hooks/useVoiceSession';

interface VoiceTranscriberProps {
  transcript: TranscriptEntry[];
  className?: string;
}

/** Single transcript entry component */
const TranscriptItem = memo(function TranscriptItem({
  entry,
}: {
  entry: TranscriptEntry;
}) {
  const isUser = entry.role === 'user';
  const isAssistant = entry.role === 'assistant';
  const isTool = entry.role === 'tool';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'flex gap-3 px-4 py-2',
        isUser && 'justify-end',
        isAssistant && 'justify-start',
        isTool && 'justify-center'
      )}
    >
      {/* Avatar for assistant */}
      {isAssistant && (
        <div className="shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
          <Bot className="w-4 h-4 text-accent" />
        </div>
      )}

      {/* Tool icon */}
      {isTool && (
        <div className="shrink-0 w-6 h-6 rounded-full bg-warning/20 flex items-center justify-center">
          {entry.isFinal ? (
            <Wrench className="w-3 h-3 text-warning" />
          ) : (
            <Loader2 className="w-3 h-3 text-warning animate-spin" />
          )}
        </div>
      )}

      {/* Message content */}
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-2',
          isUser && 'bg-secondary/20 text-foreground',
          isAssistant && 'bg-accent/10 text-foreground',
          isTool && 'bg-warning/10 text-warning text-sm',
          !entry.isFinal && 'opacity-70'
        )}
      >
        <p className="text-sm leading-relaxed">
          {entry.text || (entry.status === 'speaking' ? '...' : '')}
        </p>
        {!entry.isFinal && entry.role !== 'tool' && (
          <span className="inline-block w-1.5 h-4 ml-1 bg-current animate-pulse" />
        )}
      </div>

      {/* Avatar for user */}
      {isUser && (
        <div className="shrink-0 w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
          <User className="w-4 h-4 text-secondary" />
        </div>
      )}
    </motion.div>
  );
});

/**
 * Voice transcriber component
 * Shows live conversation transcript with auto-scroll
 */
export const VoiceTranscriber = memo(function VoiceTranscriber({
  transcript,
  className,
}: VoiceTranscriberProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when transcript updates
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript]);

  if (transcript.length === 0) {
    return (
      <div className={cn('flex items-center justify-center py-8', className)}>
        <p className="text-sm text-foreground-muted">
          Start speaking to begin the conversation...
        </p>
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className={cn(
        'overflow-y-auto scrollbar-hide',
        'max-h-[200px] py-2',
        className
      )}
    >
      <AnimatePresence mode="popLayout">
        {transcript.map((entry) => (
          <TranscriptItem key={entry.id} entry={entry} />
        ))}
      </AnimatePresence>
    </div>
  );
});

export default VoiceTranscriber;
