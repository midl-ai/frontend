'use client';

import { Coins, ExternalLink } from 'lucide-react';
import { BaseCard, ErrorCard, DataRow, AddressDisplay } from './base';
import type { ToolResponse, TransferInfo } from '@/lib/ai/tools/types';

interface TokenTransferCardProps {
  data: ToolResponse<TransferInfo>;
}

export function TokenTransferCard({ data }: TokenTransferCardProps) {
  if (!data.success || !data.data) {
    return <ErrorCard error={data.error || 'Token transfer failed'} toolName="Token Transfer" />;
  }

  const { txHash, from, to, amount, explorerUrl } = data.data;

  return (
    <BaseCard title="Token Transfer Sent" icon={<Coins className="w-4 h-4" />} variant="success">
      <DataRow label="Amount" value={amount} highlight />
      <AddressDisplay address={from} label="From" />
      <AddressDisplay address={to} label="To" />
      <DataRow label="TX Hash" value={`${txHash.slice(0, 12)}...${txHash.slice(-8)}`} mono />
      <div className="pt-2">
        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-accent hover:underline flex items-center gap-1"
        >
          View Transaction <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </BaseCard>
  );
}
