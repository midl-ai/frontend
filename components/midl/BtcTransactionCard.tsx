'use client';

import { ArrowRightLeft } from 'lucide-react';
import { BaseCard, ErrorCard, DataRow } from './base';
import type { ToolResponse, BtcTxInfo } from '@/lib/ai/tools/types';

interface BtcTransactionCardProps {
  data: ToolResponse<BtcTxInfo>;
}

export function BtcTransactionCard({ data }: BtcTransactionCardProps) {
  if (!data.success || !data.data) {
    return <ErrorCard error={data.error || 'Failed to get transaction'} toolName="BTC Transaction" />;
  }

  const { txid, fee, size, confirmed, blockHeight, inputs, outputs, explorerUrl } = data.data;
  const feeBtc = (fee / 100_000_000).toFixed(8);

  return (
    <BaseCard
      title="BTC Transaction"
      icon={<ArrowRightLeft className="w-4 h-4" />}
      explorerLink={explorerUrl}
      variant={confirmed ? 'success' : 'warning'}
    >
      <DataRow label="TXID" value={txid} mono copyable />
      <DataRow 
        label="Status" 
        value={confirmed ? 'Confirmed' : 'Pending'} 
        highlight 
        className={confirmed ? 'text-success' : 'text-warning'}
      />
      {blockHeight && <DataRow label="Block" value={blockHeight.toLocaleString()} />}
      <DataRow label="Fee" value={`${feeBtc} BTC`} mono />
      <DataRow label="Size" value={`${size} bytes`} />
      <div className="flex gap-4">
        <DataRow label="Inputs" value={inputs.length} />
        <DataRow label="Outputs" value={outputs.length} />
      </div>
    </BaseCard>
  );
}