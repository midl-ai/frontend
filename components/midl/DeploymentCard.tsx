'use client';

import { Rocket, ExternalLink } from 'lucide-react';
import { BaseCard, ErrorCard, DataRow, AddressDisplay } from './base';
import type { ToolResponse, DeployInfo } from '@/lib/ai/tools/types';

interface DeploymentCardProps {
  data: ToolResponse<DeployInfo>;
}

export function DeploymentCard({ data }: DeploymentCardProps) {
  if (!data.success || !data.data) {
    return <ErrorCard error={data.error || 'Deployment failed'} toolName="Contract Deploy" />;
  }

  const { contractAddress, txHash, blockNumber, gasUsed, explorerUrl, btcTxId, btcExplorerUrl } = data.data;

  return (
    <BaseCard title="Contract Deployed" icon={<Rocket className="w-4 h-4" />} variant="success">
      <AddressDisplay
        address={contractAddress}
        label="Contract"
        explorerUrl={`${explorerUrl}/address/${contractAddress}`}
      />
      <DataRow label="TX Hash" value={`${txHash.slice(0, 12)}...${txHash.slice(-8)}`} mono />
      <DataRow label="Block" value={blockNumber.toLocaleString()} />
      <DataRow label="Gas Used" value={gasUsed} mono />
      {btcTxId && (
        <DataRow label="BTC TX" value={`${btcTxId.slice(0, 12)}...`} mono />
      )}
      <div className="pt-2 flex gap-4">
        <a
          href={`${explorerUrl}/address/${contractAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-accent hover:underline flex items-center gap-1"
        >
          View Contract <ExternalLink className="w-3 h-3" />
        </a>
        {btcExplorerUrl && (
          <a
            href={btcExplorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-accent hover:underline flex items-center gap-1"
          >
            BTC TX <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </BaseCard>
  );
}
