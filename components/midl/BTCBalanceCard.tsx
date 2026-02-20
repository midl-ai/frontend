'use client';

import { Bitcoin } from 'lucide-react';
import { BaseCard, ErrorCard, DataRow, AddressDisplay } from './base';
import type { ToolResponse, BtcBalanceInfo } from '@/lib/ai/tools/types';

interface BTCBalanceCardProps {
  data: ToolResponse<BtcBalanceInfo>;
}

export function BTCBalanceCard({ data }: BTCBalanceCardProps) {
  if (!data.success || !data.data) {
    return <ErrorCard error={data.error || 'Failed to get balance'} toolName="BTC Balance" />;
  }

  const { address, balanceFormatted, utxoCount, explorerUrl } = data.data;

  return (
    <BaseCard 
      title="BTC Balance" 
      icon={<Bitcoin className="w-4 h-4" />}
      explorerLink={explorerUrl}
      variant="success"
    >
      <AddressDisplay address={address} label="Address" />
      <DataRow label="Balance" value={balanceFormatted} highlight mono />
      <DataRow label="UTXOs" value={utxoCount} mono />
    </BaseCard>
  );
}