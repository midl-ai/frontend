'use client';

import { Gauge } from 'lucide-react';
import { BaseCard, ErrorCard, DataRow } from './base';
import type { ToolResponse, FeeRateInfo } from '@/lib/ai/tools/types';

interface FeeRateCardProps {
  data: ToolResponse<FeeRateInfo>;
}

export function FeeRateCard({ data }: FeeRateCardProps) {
  if (!data.success || !data.data) {
    return <ErrorCard error={data.error || 'Failed to get fee rates'} toolName="Fee Rates" />;
  }

  const { fastestFee, halfHourFee, hourFee, economyFee, minimumFee } = data.data;

  return (
    <BaseCard title="BTC Fee Rates" icon={<Gauge className="w-4 h-4" />}>
      <DataRow label="Fastest (~10 min)" value={`${fastestFee} sat/vB`} highlight />
      <DataRow label="Half Hour" value={`${halfHourFee} sat/vB`} />
      <DataRow label="Hour" value={`${hourFee} sat/vB`} />
      <DataRow label="Economy" value={`${economyFee} sat/vB`} />
      <DataRow label="Minimum" value={`${minimumFee} sat/vB`} />
    </BaseCard>
  );
}
