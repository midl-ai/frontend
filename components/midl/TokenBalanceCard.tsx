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
    <BaseCard 
      title="Token Balance" 
      icon={<Coins className="w-4 h-4" />}
      variant="success"
    >
      <div className="flex items-center justify-between py-2 border-b border-border/50 mb-2">
        <div className="flex flex-col">
          <span className="text-xs text-foreground-muted uppercase">Token</span>
          <span className="font-bold text-foreground">{name}</span>
        </div>
        <div className="bg-accent/10 text-accent px-2 py-1 rounded text-xs font-mono font-bold">
          {symbol}
        </div>
      </div>

      <DataRow label="Balance" value={balanceFormatted} highlight mono />
      <DataRow label="Decimals" value={decimals} />
      
      <div className="pt-2 space-y-2">
        <AddressDisplay address={tokenAddress} label="Contract" />
        <AddressDisplay address={ownerAddress} label="Owner" />
      </div>
    </BaseCard>
  );
}