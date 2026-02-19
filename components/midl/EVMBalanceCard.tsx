'use client';

import { Wallet } from 'lucide-react';
import { BaseCard, ErrorCard, DataRow, AddressDisplay } from './base';
import type { ToolResponse, BalanceInfo } from '@/lib/ai/tools/types';

interface EVMBalanceCardProps {
  data: ToolResponse<BalanceInfo>;
}

export function EVMBalanceCard({ data }: EVMBalanceCardProps) {
  if (!data.success || !data.data) {
    return <ErrorCard error={data.error || 'Failed to get balance'} toolName="EVM Balance" />;
  }

  const { address, balanceFormatted, explorerUrl } = data.data;

  return (
    <BaseCard title="EVM Balance" icon={<Wallet className="w-4 h-4" />}>
      <AddressDisplay address={address} label="Address" explorerUrl={explorerUrl} />
      <DataRow label="Balance" value={balanceFormatted} highlight />
    </BaseCard>
  );
}
