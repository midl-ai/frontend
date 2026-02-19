'use client';

import { Receipt, ExternalLink } from 'lucide-react';
import { BaseCard, ErrorCard, DataRow, AddressDisplay } from './base';
import type { ToolResponse, TxReceiptInfo } from '@/lib/ai/tools/types';

interface TxReceiptCardProps {
  data: ToolResponse<TxReceiptInfo>;
}

export function TxReceiptCard({ data }: TxReceiptCardProps) {
  if (!data.success || !data.data) {
    return <ErrorCard error={data.error || 'Failed to get receipt'} toolName="Transaction Receipt" />;
  }

  const { txHash, blockNumber, status, gasUsed, from, to, logsCount, explorerUrl } = data.data;

  return (
    <BaseCard
      title="Transaction Receipt"
      icon={<Receipt className="w-4 h-4" />}
      variant={status === 'success' ? 'success' : 'error'}
    >
      <DataRow label="Status" value={status === 'success' ? '✓ Success' : '✗ Reverted'} highlight />
      <DataRow label="Hash" value={`${txHash.slice(0, 12)}...${txHash.slice(-8)}`} mono />
      <DataRow label="Block" value={blockNumber.toLocaleString()} />
      <AddressDisplay address={from} label="From" />
      <AddressDisplay address={to} label="To" />
      <DataRow label="Gas Used" value={gasUsed} mono />
      <DataRow label="Logs" value={logsCount} />
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
