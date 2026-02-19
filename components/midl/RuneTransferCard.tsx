'use client';

import { Send, ExternalLink } from 'lucide-react';
import { BaseCard, ErrorCard, DataRow, AddressDisplay } from './base';
import type { ToolResponse, RuneTransferInfo } from '@/lib/ai/tools/types';

interface RuneTransferCardProps {
  data: ToolResponse<RuneTransferInfo>;
}

export function RuneTransferCard({ data }: RuneTransferCardProps) {
  if (!data.success || !data.data) {
    return <ErrorCard error={data.error || 'Rune transfer failed'} toolName="Rune Transfer" />;
  }

  const { txId, runeId, amount, toAddress, explorerUrl } = data.data;

  return (
    <BaseCard title="Rune Transfer Sent" icon={<Send className="w-4 h-4" />} variant="success">
      <DataRow label="Rune ID" value={runeId} />
      <DataRow label="Amount" value={amount} highlight />
      <AddressDisplay address={toAddress} label="To" />
      <DataRow label="TX ID" value={`${txId.slice(0, 12)}...${txId.slice(-8)}`} mono />
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
