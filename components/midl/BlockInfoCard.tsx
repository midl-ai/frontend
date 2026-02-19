'use client';

import { Box, ExternalLink } from 'lucide-react';
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
    <BaseCard title="Block Info" icon={<Box className="w-4 h-4" />}>
      <DataRow label="Block" value={`#${number.toLocaleString()}`} highlight />
      <DataRow label="Hash" value={`${hash.slice(0, 10)}...${hash.slice(-8)}`} mono />
      <DataRow label="Time" value={timestampFormatted} />
      <DataRow label="Transactions" value={transactionCount} />
      <DataRow label="Gas Used" value={gasUsed} mono />
      <div className="pt-2">
        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-accent hover:underline flex items-center gap-1"
        >
          View in Explorer <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </BaseCard>
  );
}
