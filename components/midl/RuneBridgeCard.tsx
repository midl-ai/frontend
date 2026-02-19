'use client';

import { ArrowRightLeft, ExternalLink } from 'lucide-react';
import { BaseCard, ErrorCard, DataRow, AddressDisplay } from './base';
import type { ToolResponse, RuneBridgeInfo } from '@/lib/ai/tools/types';

interface RuneBridgeCardProps {
  data: ToolResponse<RuneBridgeInfo>;
}

export function RuneBridgeCard({ data }: RuneBridgeCardProps) {
  if (!data.success || !data.data) {
    return <ErrorCard error={data.error || 'Rune bridge failed'} toolName="Rune Bridge" />;
  }

  const { btcTxId, runeId, amount, erc20Address, explorerUrl, status } = data.data;

  return (
    <BaseCard
      title="Rune → ERC20 Bridge"
      icon={<ArrowRightLeft className="w-4 h-4" />}
      variant={status === 'pending' ? 'warning' : 'success'}
    >
      <DataRow label="Rune ID" value={runeId} />
      <DataRow label="Amount" value={amount} highlight />
      <DataRow label="Status" value={status} />
      {erc20Address && (
        <AddressDisplay address={erc20Address} label="ERC20 Token" />
      )}
      <DataRow label="BTC TX" value={`${btcTxId.slice(0, 12)}...${btcTxId.slice(-8)}`} mono />
      <div className="pt-2">
        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-accent hover:underline flex items-center gap-1"
        >
          View on Explorer <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </BaseCard>
  );
}
