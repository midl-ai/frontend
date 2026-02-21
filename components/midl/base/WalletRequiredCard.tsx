'use client';

import { Wallet, AlertCircle } from 'lucide-react';
import { BaseCard } from './BaseCard';
import { DataRow } from './DataRow';

interface WalletRequiredCardProps {
  title: string;
  details?: Array<{ label: string; value: string }>;
}

/**
 * Card shown when an operation requires wallet signing
 * but server-side signing is not configured.
 */
export function WalletRequiredCard({ title, details }: WalletRequiredCardProps) {
  return (
    <BaseCard
      title={title}
      icon={<Wallet className="w-4 h-4" />}
      variant="warning"
    >
      <div className="flex items-start gap-2 mb-3">
        <AlertCircle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
        <p className="text-xs text-foreground-muted">
          This operation requires wallet signing. Server-side signing is not configured.
          Set MIDL_PRIVATE_KEY in your environment for server-side transactions,
          or wait for client-side Xverse signing support.
        </p>
      </div>
      {details?.map(({ label, value }) => (
        <DataRow key={label} label={label} value={value} mono />
      ))}
    </BaseCard>
  );
}
