'use client';

import { ArrowUpFromLine } from 'lucide-react';
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
      explorerLink={explorerUrl}
      variant={status === 'pending' ? 'warning' : 'success'}
    >
      <DataRow label="Amount" value={`${btcAmount} BTC`} highlight />
      <DataRow label="Satoshis" value={Number(satoshis).toLocaleString()} mono />
      <AddressDisplay address={btcAddress} label="Recipient" />
      <DataRow 
        label="Status" 
        value={status.toUpperCase()} 
        className={status === 'pending' ? 'text-warning' : 'text-success'}
      />
      <DataRow label="BTC TX" value={btcTxId} mono copyable />
    </BaseCard>
  );
}