'use client';

import { ArrowDownToLine, ExternalLink } from 'lucide-react';
import { BaseCard, ErrorCard, DataRow } from './base';
import type { ToolResponse, BridgeBtcToEvmInfo } from '@/lib/ai/tools/types';

interface BridgeDepositCardProps {
  data: ToolResponse<BridgeBtcToEvmInfo>;
}

export function BridgeDepositCard({ data }: BridgeDepositCardProps) {
  if (!data.success || !data.data) {
    return <ErrorCard error={data.error || 'Bridge deposit failed'} toolName="Bridge Deposit" />;
  }

  const { btcTxId, satoshis, btcAmount, explorerUrl, status } = data.data;

  return (
    <BaseCard
      title="BTC → EVM Bridge"
      icon={<ArrowDownToLine className="w-4 h-4" />}
      variant={status === 'pending' ? 'warning' : 'success'}
    >
      <DataRow label="Amount" value={`${btcAmount} BTC`} highlight />
      <DataRow label="Satoshis" value={Number(satoshis).toLocaleString()} mono />
      <DataRow label="Status" value={status} />
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
