'use client';

import { Database } from 'lucide-react';
import { BaseCard, ErrorCard, DataRow, AddressDisplay } from './base';
import type { ToolResponse, UtxosInfo } from '@/lib/ai/tools/types';

interface UTXOsCardProps {
  data: ToolResponse<UtxosInfo>;
}

export function UTXOsCard({ data }: UTXOsCardProps) {
  if (!data.success || !data.data) {
    return <ErrorCard error={data.error || 'Failed to get UTXOs'} toolName="UTXOs" />;
  }

  const { address, utxos, count, totalValue } = data.data;
  const totalBtc = (totalValue / 100_000_000).toFixed(8);

  return (
    <BaseCard title="UTXOs" icon={<Database className="w-4 h-4" />}>
      <AddressDisplay address={address} label="Address" />
      <DataRow label="Total UTXOs" value={count} />
      <DataRow label="Total Value" value={`${totalBtc} BTC`} highlight />
      {utxos.length > 0 && (
        <div className="pt-2 space-y-1 border-t border-border mt-2">
          <span className="text-xs text-foreground-muted">Recent UTXOs:</span>
          {utxos.slice(0, 3).map((utxo, i) => (
            <div key={i} className="text-xs font-mono text-foreground-muted">
              {utxo.txid.slice(0, 8)}...:{utxo.vout} = {(utxo.value / 100_000_000).toFixed(8)} BTC
              {utxo.confirmed ? ' ✓' : ' ⏳'}
            </div>
          ))}
        </div>
      )}
    </BaseCard>
  );
}
