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
    <BaseCard title="Rune Balance" icon={<Gem className="w-4 h-4" />}>
      <DataRow label="Rune" value={name} highlight />
      <DataRow label="Balance" value={balance} mono />
      <DataRow label="Rune ID" value={runeId} mono />
      <AddressDisplay address={address} label="Address" />
    </BaseCard>
  );
}
