'use client';

import { Coins } from 'lucide-react';
import { BaseCard, ErrorCard, DataRow, AddressDisplay } from './base';
import type { ToolResponse, TokenBalanceInfo } from '@/lib/ai/tools/types';

interface TokenBalanceCardProps {
  data: ToolResponse<TokenBalanceInfo>;
}

export function TokenBalanceCard({ data }: TokenBalanceCardProps) {
  if (!data.success || !data.data) {
    return <ErrorCard error={data.error || 'Failed to get token balance'} toolName="Token Balance" />;
  }

  const { tokenAddress, ownerAddress, balanceFormatted, symbol, name, decimals } = data.data;

  return (
    <BaseCard title="Token Balance" icon={<Coins className="w-4 h-4" />}>
      <DataRow label="Token" value={`${name} (${symbol})`} highlight />
      <AddressDisplay address={tokenAddress} label="Contract" />
      <AddressDisplay address={ownerAddress} label="Owner" />
      <DataRow label="Balance" value={balanceFormatted} highlight />
      <DataRow label="Decimals" value={decimals} />
    </BaseCard>
  );
}
