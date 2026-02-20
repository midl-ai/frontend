'use client';

import { Gem } from 'lucide-react';
import { BaseCard, ErrorCard, AddressDisplay } from './base';
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
    <BaseCard 
      title={`Runes (${total})`} 
      icon={<Gem className="w-4 h-4" />}
      variant="default"
    >
      <AddressDisplay address={address} label="Address" />
      
      {runes.length > 0 ? (
        <div className="pt-2 space-y-2">
          <div className="flex justify-between text-[10px] text-foreground-muted uppercase tracking-wider px-2">
            <span>Name</span>
            <span>Balance</span>
          </div>
          
          <div className="space-y-1">
            {runes.slice(0, 5).map((rune, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center p-2 rounded-lg bg-background-tertiary/50 hover:bg-background-tertiary transition-colors"
              >
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-foreground">
                    {rune.spacedName || rune.name}
                  </span>
                  <span className="text-[10px] text-foreground-muted font-mono opacity-70">
                    ID: {rune.id}
                  </span>
                </div>
                <span className="font-mono text-sm text-accent font-medium">
                  {rune.balance}
                </span>
              </div>
            ))}
          </div>

          {runes.length > 5 && (
            <div className="flex items-center justify-center pt-2 text-xs text-foreground-muted">
              <span>+{runes.length - 5} more runes</span>
            </div>
          )}
        </div>
      ) : (
        <div className="py-4 text-center text-foreground-muted text-sm italic">
          No runes found
        </div>
      )}
    </BaseCard>
  );
}