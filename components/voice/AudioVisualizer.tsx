'use client';

import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AudioVisualizerProps {
  volume: number;
  isListening: boolean;
  isSpeaking: boolean;
  className?: string;
}

/** Base bar heights for idle state */
const IDLE_HEIGHTS = [0.3, 0.5, 0.4, 0.6, 0.35, 0.55, 0.45, 0.5, 0.4, 0.55, 0.35, 0.5];

/**
 * Audio visualizer component
 * Shows animated bars responding to volume
 */
export const AudioVisualizer = memo(function AudioVisualizer({
  volume,
  isListening,
  isSpeaking,
  className,
}: AudioVisualizerProps) {
  // Calculate bar heights based on volume (use index-based variation instead of time)
  const barHeights = useMemo(() => {
    return IDLE_HEIGHTS.map((base, i) => {
      // Add variation based on index for visual interest
      const variation = Math.sin(i * 0.7) * 0.1;
      const volumeFactor = volume * 2; // Amplify volume effect
      return Math.min(1, base + variation + volumeFactor);
    });
  }, [volume]);

  const isActive = isListening || isSpeaking;

  return (
    <div className={cn('flex items-center justify-center', className)}>
      {/* Central orb */}
      <div className="relative">
        {/* Outer glow ring */}
        <motion.div
          animate={{
            scale: isActive ? [1, 1.2, 1] : 1,
            opacity: isActive ? [0.3, 0.6, 0.3] : 0.2,
          }}
          transition={{
            duration: isActive ? 1.5 : 0,
            repeat: isActive ? Infinity : 0,
            ease: 'easeInOut',
          }}
          className={cn(
            'absolute -inset-8 rounded-full',
            isSpeaking ? 'bg-accent/20' : 'bg-secondary/20'
          )}
        />

        {/* Middle ring */}
        <motion.div
          animate={{
            scale: isActive ? [1, 1.1, 1] : 1,
            opacity: isActive ? [0.4, 0.7, 0.4] : 0.3,
          }}
          transition={{
            duration: isActive ? 1 : 0,
            repeat: isActive ? Infinity : 0,
            ease: 'easeInOut',
            delay: 0.2,
          }}
          className={cn(
            'absolute -inset-4 rounded-full',
            isSpeaking ? 'bg-accent/30' : 'bg-secondary/30'
          )}
        />

        {/* Central orb with bars */}
        <div
          className={cn(
            'relative w-32 h-32 rounded-full flex items-end justify-center gap-1 p-4',
            'bg-gradient-to-br shadow-xl',
            isSpeaking
              ? 'from-accent/80 to-accent shadow-accent/30'
              : isListening
              ? 'from-secondary/80 to-secondary shadow-secondary/30'
              : 'from-foreground-muted/50 to-foreground-subtle/50'
          )}
        >
          {/* Audio bars */}
          {barHeights.map((height, i) => (
            <motion.div
              key={i}
              animate={{ height: `${height * 100}%` }}
              transition={{
                duration: 0.1,
                ease: 'easeOut',
              }}
              className={cn(
                'w-1.5 rounded-full',
                isActive ? 'bg-white/90' : 'bg-white/50'
              )}
              style={{ minHeight: '4px' }}
            />
          ))}
        </div>

        {/* Status indicator */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
          <span
            className={cn(
              'text-sm font-medium',
              isSpeaking
                ? 'text-accent'
                : isListening
                ? 'text-secondary'
                : 'text-foreground-muted'
            )}
          >
            {isSpeaking ? 'AI Speaking' : isListening ? 'Listening...' : 'Ready'}
          </span>
        </div>
      </div>
    </div>
  );
});

export default AudioVisualizer;
