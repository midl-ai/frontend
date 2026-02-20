'use client';

import { Receipt } from 'lucide-react';
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
      explorerLink={explorerUrl}
      variant={status === 'success' ? 'success' : 'error'}
    >
      <DataRow 
        label="Status" 
        value={status === 'success' ? 'Success' : 'Reverted'} 
        highlight 
        className={status === 'success' ? 'text-success' : 'text-error'}
      />
      <DataRow label="Hash" value={txHash} mono copyable />
      <DataRow label="Block" value={blockNumber.toLocaleString()} />
      <DataRow label="Gas Used" value={gasUsed} mono />
      <DataRow label="Logs" value={logsCount} />
      
      <div className="pt-2 space-y-2 border-t border-border/50">
        <AddressDisplay address={from} label="From" />
        <AddressDisplay address={to} label="To" />
      </div>
    </BaseCard>
  );
}