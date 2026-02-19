'use client';

import { ArrowRightLeft, ExternalLink } from 'lucide-react';
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
      variant={confirmed ? 'success' : 'warning'}
    >
      <DataRow label="TXID" value={`${txid.slice(0, 12)}...${txid.slice(-8)}`} mono />
      <DataRow label="Status" value={confirmed ? 'Confirmed' : 'Pending'} highlight />
      {blockHeight && <DataRow label="Block" value={blockHeight.toLocaleString()} />}
      <DataRow label="Fee" value={`${feeBtc} BTC`} />
      <DataRow label="Size" value={`${size} bytes`} />
      <DataRow label="Inputs" value={inputs.length} />
      <DataRow label="Outputs" value={outputs.length} />
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
