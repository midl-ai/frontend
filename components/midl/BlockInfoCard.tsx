'use client';

import { Box } from 'lucide-react';
import { BaseCard, ErrorCard, DataRow } from './base';
import type { ToolResponse, BlockInfo } from '@/lib/ai/tools/types';

interface BlockInfoCardProps {
  data: ToolResponse<BlockInfo>;
}

export function BlockInfoCard({ data }: BlockInfoCardProps) {
  if (!data.success || !data.data) {
    return <ErrorCard error={data.error || 'Failed to get block'} toolName="Block Info" />;
  }

  const { number, hash, timestampFormatted, transactionCount, gasUsed, explorerUrl } = data.data;

  return (
    <BaseCard 
      title={`Block #${number}`}
      icon={<Box className="w-4 h-4" />}
      explorerLink={explorerUrl}
      variant="default"
    >
      <DataRow label="Hash" value={hash} mono copyable />
      <DataRow label="Time" value={timestampFormatted} />
      <DataRow label="Tx Count" value={transactionCount} />
      <DataRow label="Gas Used" value={gasUsed} mono />
    </BaseCard>
  );
}