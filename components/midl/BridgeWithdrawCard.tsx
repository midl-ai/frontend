'use client';

import { ArrowUpFromLine, ExternalLink } from 'lucide-react';
import { BaseCard, ErrorCard, DataRow, AddressDisplay } from './base';
import type { ToolResponse, BridgeEvmToBtcInfo } from '@/lib/ai/tools/types';

interface BridgeWithdrawCardProps {
  data: ToolResponse<BridgeEvmToBtcInfo>;
}

export function BridgeWithdrawCard({ data }: BridgeWithdrawCardProps) {
  if (!data.success || !data.data) {
    return <ErrorCard error={data.error || 'Bridge withdrawal failed'} toolName="Bridge Withdrawal" />;
  }

  const { btcTxId, satoshis, btcAmount, btcAddress, explorerUrl, status } = data.data;

  return (
    <BaseCard
      title="EVM → BTC Bridge"
      icon={<ArrowUpFromLine className="w-4 h-4" />}
      variant={status === 'pending' ? 'warning' : 'success'}
    >
      <DataRow label="Amount" value={`${btcAmount} BTC`} highlight />
      <DataRow label="Satoshis" value={Number(satoshis).toLocaleString()} mono />
      <AddressDisplay address={btcAddress} label="BTC Address" />
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
