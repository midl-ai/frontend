'use client';

import { useState } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { cn, truncateAddress } from '@/lib/utils';

interface AddressDisplayProps {
  address: string;
  label?: string;
  explorerUrl?: string;
  truncate?: boolean;
  className?: string;
}

export function AddressDisplay({
  address,
  label = 'Address',
  explorerUrl,
  truncate = true,
  className,
}: AddressDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayAddress = truncate ? truncateAddress(address, 6) : address;

  return (
    <div className={cn('bg-background-tertiary/50 rounded-lg p-3 border border-border/50', className)}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-semibold text-foreground-muted uppercase tracking-wider">
          {label}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            className="p-1 rounded-md hover:bg-background-hover text-foreground-muted hover:text-foreground transition-all"
            title="Copy address"
          >
            {copied ? (
              <Check className="w-3 h-3 text-success" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </button>
          {explorerUrl && (
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded-md hover:bg-background-hover text-foreground-muted hover:text-accent transition-all"
              title="View in explorer"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
      
      <div className="font-mono text-xs text-foreground break-all select-all">
        {displayAddress}
      </div>
    </div>
  );
}