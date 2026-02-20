'use client';

import { cn } from '@/lib/utils';
import { Copy, Check } from 'lucide-react';
import { useState, useCallback } from 'react';

interface DataRowProps {
  label: string;
  value: string | number | null | undefined;
  className?: string;
  mono?: boolean;
  highlight?: boolean;
  copyable?: boolean;
}

/** Key-value display row with optional copy functionality */
export function DataRow({
  label,
  value,
  className,
  mono = false,
  highlight = false,
  copyable = false,
}: DataRowProps) {
  const [copied, setCopied] = useState(false);
  const displayValue = value ?? '-';

  const handleCopy = useCallback(() => {
    if (!value) return;
    navigator.clipboard.writeText(String(value));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [value]);

  return (
    <div className={cn('flex justify-between items-center py-1.5 group', className)}>
      <span className="text-foreground-muted text-xs font-medium uppercase tracking-wide">
        {label}
      </span>
      <div className="flex items-center gap-2 max-w-[70%]">
        <span
          className={cn(
            'text-foreground text-right truncate',
            mono && 'font-mono text-xs',
            highlight && 'text-accent font-semibold'
          )}
        >
          {displayValue}
        </span>

        {copyable && value && (
          <button
            onClick={handleCopy}
            className={cn(
              'p-1 rounded transition-all',
              copied
                ? 'text-success'
                : 'text-foreground-subtle opacity-0 group-hover:opacity-100 hover:text-accent hover:bg-accent/10'
            )}
            title={copied ? 'Copied!' : 'Copy to clipboard'}
          >
            {copied ? (
              <Check className="w-3 h-3" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default DataRow;
