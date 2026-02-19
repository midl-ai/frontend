'use client';

import { Globe } from 'lucide-react';
import { BaseCard, ErrorCard, DataRow } from './base';
import type { ToolResponse, NetworkInfo } from '@/lib/ai/tools/types';

interface NetworkInfoCardProps {
  data: ToolResponse<NetworkInfo>;
}

export function NetworkInfoCard({ data }: NetworkInfoCardProps) {
  if (!data.success || !data.data) {
    return <ErrorCard error={data.error || 'Failed to get network info'} toolName="Network Info" />;
  }

  const { chainId, chainName, rpcUrl, explorerUrl, mempoolUrl, nativeCurrency } = data.data;

  return (
    <BaseCard title="Network Info" icon={<Globe className="w-4 h-4" />}>
      <DataRow label="Chain" value={chainName} highlight />
      <DataRow label="Chain ID" value={chainId} mono />
      <DataRow label="Currency" value={`${nativeCurrency.symbol} (${nativeCurrency.decimals} decimals)`} />
      <DataRow label="RPC" value={rpcUrl} mono />
      <DataRow label="Explorer" value={explorerUrl} mono />
      <DataRow label="Mempool" value={mempoolUrl} mono />
    </BaseCard>
  );
}
