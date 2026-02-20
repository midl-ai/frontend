'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Terminal, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface BaseCardProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'success' | 'warning' | 'error';
  explorerLink?: string;
}

const variantStyles = {
  default: {
    container: 'border-card-border bg-card',
    header: 'border-border bg-background-tertiary/50',
    icon: 'text-accent',
    glow: 'group-hover:shadow-[0_0_30px_rgba(249,115,22,0.1)]',
  },
  success: {
    container: 'border-success/30 bg-success-muted',
    header: 'border-success/20 bg-success/10 text-success',
    icon: 'text-success',
    glow: 'group-hover:shadow-[0_0_30px_rgba(34,197,94,0.15)]',
  },
  warning: {
    container: 'border-warning/30 bg-warning-muted',
    header: 'border-warning/20 bg-warning/10 text-warning',
    icon: 'text-warning',
    glow: 'group-hover:shadow-[0_0_30px_rgba(251,191,36,0.15)]',
  },
  error: {
    container: 'border-error/30 bg-error-muted',
    header: 'border-error/20 bg-error/10 text-error',
    icon: 'text-error',
    glow: 'group-hover:shadow-[0_0_30px_rgba(248,113,113,0.15)]',
  },
};

/** Base card component for tool result rendering */
export function BaseCard({
  title,
  icon,
  children,
  className,
  variant = 'default',
  explorerLink,
}: BaseCardProps) {
  const styles = variantStyles[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'group rounded-xl border overflow-hidden transition-all duration-300',
        styles.container,
        styles.glow,
        'hover:border-border-hover',
        className
      )}
    >
      {/* Header */}
      <div
        className={cn(
          'px-4 py-3 flex items-center justify-between border-b',
          styles.header
        )}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              'w-7 h-7 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110',
              variant === 'default' ? 'bg-accent/10' : `bg-${variant}/10`
            )}
          >
            {icon ? (
              <span className={cn('w-4 h-4', styles.icon)}>{icon}</span>
            ) : (
              <Terminal className={cn('w-4 h-4', styles.icon)} />
            )}
          </div>
          <h3 className="text-xs font-semibold uppercase tracking-wider font-mono">
            {title}
          </h3>
        </div>

        {explorerLink && (
          <a
            href={explorerLink}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'flex items-center gap-1.5 text-[10px] uppercase font-bold transition-colors',
              variant === 'default' ? 'text-accent hover:text-accent-hover' : styles.icon,
              'hover:opacity-80'
            )}
          >
            <span>Explorer</span>
            <ExternalLink className="w-3 h-3" />
            <span className="sr-only">(opens in new tab)</span>
          </a>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3 text-sm">{children}</div>
    </motion.div>
  );
}

export default BaseCard;
