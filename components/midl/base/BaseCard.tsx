'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BaseCardProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'success' | 'warning' | 'error';
}

const variantStyles = {
  default: 'border-border',
  success: 'border-success/30 bg-success/5',
  warning: 'border-warning/30 bg-warning/5',
  error: 'border-error/30 bg-error/5',
};

export function BaseCard({
  title,
  icon,
  children,
  className,
  variant = 'default',
}: BaseCardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border p-4 bg-background-secondary',
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
        {icon && <span className="text-accent">{icon}</span>}
        <h3 className="font-semibold text-foreground text-sm">{title}</h3>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
