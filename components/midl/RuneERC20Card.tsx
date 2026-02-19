'use client';

import { Gem, ExternalLink } from 'lucide-react';
import { BaseCard, ErrorCard, DataRow, AddressDisplay } from './base';
import type { ToolResponse, RuneErc20Info } from '@/lib/ai/tools/types';

interface RuneERC20CardProps {
  data: ToolResponse<RuneErc20Info>;
}

export function RuneERC20Card({ data }: RuneERC20CardProps) {
  if (!data.success || !data.data) {
    return <ErrorCard error={data.error || 'Failed to get Rune ERC20 address'} toolName="Rune ERC20" />;
  }

  const { runeId, erc20Address, explorerUrl } = data.data;

  return (
    <BaseCard title="Rune ERC20 Address" icon={<Gem className="w-4 h-4" />}>
      <DataRow label="Rune ID" value={runeId} mono />
      <AddressDisplay
        address={erc20Address}
        label="ERC20 Token"
        explorerUrl={explorerUrl}
      />
      <div className="pt-2">
        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-accent hover:underline flex items-center gap-1"
        >
          View Token <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </BaseCard>
  );
}
