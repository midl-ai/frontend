'use client';

import { FileCode } from 'lucide-react';
import { BaseCard, ErrorCard, AddressDisplay } from './base';
import type { ToolResponse, SystemContractsInfo } from '@/lib/ai/tools/types';

interface SystemContractsCardProps {
  data: ToolResponse<SystemContractsInfo>;
}

export function SystemContractsCard({ data }: SystemContractsCardProps) {
  if (!data.success || !data.data) {
    return <ErrorCard error={data.error || 'Failed to get system contracts'} toolName="System Contracts" />;
  }

  const { gateway, intentFactory, contracts, explorerUrl } = data.data;

  return (
    <BaseCard title="System Contracts" icon={<FileCode className="w-4 h-4" />}>
      <AddressDisplay
        address={gateway}
        label="Gateway"
        explorerUrl={`${explorerUrl}/address/${gateway}`}
      />
      <AddressDisplay
        address={intentFactory}
        label="Intent Factory"
        explorerUrl={`${explorerUrl}/address/${intentFactory}`}
      />
      {contracts.length > 0 && (
        <div className="pt-2 space-y-1">
          <span className="text-xs text-foreground-muted">Other Contracts:</span>
          {contracts.slice(0, 3).map((c) => (
            <AddressDisplay
              key={c.address}
              address={c.address}
              label={c.name}
              explorerUrl={`${explorerUrl}/address/${c.address}`}
            />
          ))}
        </div>
      )}
    </BaseCard>
  );
}
