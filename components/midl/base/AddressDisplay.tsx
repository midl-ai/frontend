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
  label,
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

  const displayAddress = truncate ? truncateAddress(address) : address;

  return (
    <div className={cn('flex items-center justify-between text-sm', className)}>
      {label && <span className="text-foreground-muted">{label}</span>}
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs text-foreground">{displayAddress}</span>
        <button
          onClick={handleCopy}
          className="p-1 rounded hover:bg-background-hover text-foreground-muted hover:text-foreground transition-colors"
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
            className="p-1 rounded hover:bg-background-hover text-foreground-muted hover:text-accent transition-colors"
            title="View in explorer"
          >
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
}
