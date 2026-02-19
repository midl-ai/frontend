'use client';

import { Fuel } from 'lucide-react';
import { BaseCard, ErrorCard, DataRow } from './base';
import type { ToolResponse, GasEstimateInfo } from '@/lib/ai/tools/types';

interface GasEstimateCardProps {
  data: ToolResponse<GasEstimateInfo>;
}

export function GasEstimateCard({ data }: GasEstimateCardProps) {
  if (!data.success || !data.data) {
    return <ErrorCard error={data.error || 'Gas estimation failed'} toolName="Gas Estimate" />;
  }

  const { gasEstimate, gasPriceGwei, estimatedCostWei, estimatedCostBtc } = data.data;

  return (
    <BaseCard title="Gas Estimate" icon={<Fuel className="w-4 h-4" />}>
      <DataRow label="Gas Limit" value={gasEstimate} mono />
      <DataRow label="Gas Price" value={`${gasPriceGwei} Gwei`} mono />
      <DataRow label="Cost (wei)" value={estimatedCostWei} mono />
      <DataRow label="Cost (BTC)" value={`${estimatedCostBtc} BTC`} highlight />
    </BaseCard>
  );
}
