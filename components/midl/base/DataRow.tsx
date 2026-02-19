'use client';

import { cn } from '@/lib/utils';

interface DataRowProps {
  label: string;
  value: string | number | null | undefined;
  className?: string;
  mono?: boolean;
  highlight?: boolean;
}

export function DataRow({
  label,
  value,
  className,
  mono = false,
  highlight = false,
}: DataRowProps) {
  const displayValue = value ?? '-';

  return (
    <div className={cn('flex justify-between items-center text-sm', className)}>
      <span className="text-foreground-muted">{label}</span>
      <span
        className={cn(
          'text-foreground',
          mono && 'font-mono text-xs',
          highlight && 'text-accent font-semibold'
        )}
      >
        {displayValue}
      </span>
    </div>
  );
}
