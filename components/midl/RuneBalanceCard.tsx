'use client';

import { Gem } from 'lucide-react';
import { BaseCard, ErrorCard, DataRow, AddressDisplay } from './base';
import type { ToolResponse, RuneBalanceInfo } from '@/lib/ai/tools/types';

interface RuneBalanceCardProps {
  data: ToolResponse<RuneBalanceInfo>;
}

export function RuneBalanceCard({ data }: RuneBalanceCardProps) {
  if (!data.success || !data.data) {
    return <ErrorCard error={data.error || 'Failed to get rune balance'} toolName="Rune Balance" />;
  }

  const { runeId, name, balance, address } = data.data;

  return (
    <BaseCard 
      title="Rune Balance" 
      icon={<Gem className="w-4 h-4" />}
      variant="success"
    >
      <div className="flex items-center justify-between py-2 border-b border-border/50 mb-2">
        <span className="font-bold text-foreground text-lg">{name}</span>
        <span className="text-xs font-mono text-foreground-muted bg-background-tertiary px-2 py-1 rounded">
          ID: {runeId}
        </span>
      </div>

      <DataRow label="Balance" value={balance} highlight mono />
      <AddressDisplay address={address} label="Holder" />
    </BaseCard>
  );
}