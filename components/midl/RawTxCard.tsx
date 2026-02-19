'use client';

import { FileCode, ExternalLink } from 'lucide-react';
import { BaseCard, ErrorCard, DataRow } from './base';
import type { ToolResponse } from '@/lib/ai/tools/types';

interface RawTxResult {
  txHash: string;
  explorerUrl: string;
}

interface RawTxCardProps {
  data: ToolResponse<RawTxResult>;
}

export function RawTxCard({ data }: RawTxCardProps) {
  if (!data.success || !data.data) {
    return <ErrorCard error={data.error || 'Raw transaction failed'} toolName="Raw Transaction" />;
  }

  const { txHash, explorerUrl } = data.data;

  return (
    <BaseCard title="Transaction Broadcast" icon={<FileCode className="w-4 h-4" />} variant="success">
      <DataRow label="Status" value="✓ Broadcast" highlight />
      <DataRow label="TX Hash" value={`${txHash.slice(0, 16)}...${txHash.slice(-12)}`} mono />
      <div className="pt-2">
        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-accent hover:underline flex items-center gap-1"
        >
          View Transaction <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </BaseCard>
  );
}
