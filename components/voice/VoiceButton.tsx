'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { VoiceSessionStatus } from '@/hooks/useVoiceSession';

interface VoiceButtonProps {
  status: VoiceSessionStatus;
  isListening: boolean;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Voice mode toggle button
 * Shows microphone icon with animated states
 */
export const VoiceButton = memo(function VoiceButton({
  status,
  isListening,
  onClick,
  disabled,
  className,
}: VoiceButtonProps) {
  const isActive = status === 'connected' || status === 'processing' || status === 'signing';
  const isConnecting = status === 'connecting';

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled || isConnecting}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        'relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200',
        'border shadow-sm',
        isActive
          ? 'bg-accent text-accent-foreground border-accent hover:bg-accent-hover'
          : 'bg-background-tertiary text-foreground-muted border-border hover:border-border-hover hover:bg-background-hover',
        isConnecting && 'opacity-70 cursor-wait',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      title={isActive ? 'Stop voice mode' : 'Start voice mode (Beta)'}
    >
      {isConnecting ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : isActive ? (
        <>
          <Mic className="w-5 h-5" />
          {/* Listening indicator pulse */}
          {isListening && (
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute inset-0 rounded-xl bg-accent"
            />
          )}
        </>
      ) : (
        <MicOff className="w-5 h-5" />
      )}

      {/* Active indicator dot */}
      {isActive && (
        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-success border-2 border-background animate-pulse" />
      )}
    </motion.button>
  );
});

export default VoiceButton;
