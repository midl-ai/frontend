'use client';

import { Gem } from 'lucide-react';
import { BaseCard, ErrorCard, DataRow, AddressDisplay } from './base';
import type { ToolResponse, RunesListInfo } from '@/lib/ai/tools/types';

interface RunesListCardProps {
  data: ToolResponse<RunesListInfo>;
}

export function RunesListCard({ data }: RunesListCardProps) {
  if (!data.success || !data.data) {
    return <ErrorCard error={data.error || 'Failed to get runes'} toolName="Runes List" />;
  }

  const { address, total, runes } = data.data;

  return (
    <BaseCard title="Runes" icon={<Gem className="w-4 h-4" />}>
      <AddressDisplay address={address} label="Address" />
      <DataRow label="Total Runes" value={total} highlight />
      {runes.length > 0 && (
        <div className="pt-2 space-y-2 border-t border-border mt-2">
          <span className="text-xs text-foreground-muted">Holdings:</span>
          {runes.slice(0, 5).map((rune) => (
            <div
              key={rune.id}
              className="flex justify-between items-center text-xs"
            >
              <span className="font-medium text-foreground">
                {rune.spacedName || rune.name}
              </span>
              <span className="font-mono text-foreground-muted">
                {rune.balance}
              </span>
            </div>
          ))}
          {runes.length > 5 && (
            <div className="text-xs text-foreground-muted">
              +{runes.length - 5} more runes
            </div>
          )}
        </div>
      )}
    </BaseCard>
  );
}
