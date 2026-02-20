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
    <BaseCard 
      title="Contract Deployed" 
      icon={<Rocket className="w-4 h-4" />} 
      explorerLink={`${explorerUrl}/address/${contractAddress}`}
      variant="success"
    >
      <div className="mb-4 bg-success/10 border border-success/20 rounded-lg p-3 text-center">
        <span className="text-xs text-success font-bold uppercase tracking-wider">Deployment Successful</span>
      </div>

      <AddressDisplay
        address={contractAddress}
        label="New Contract Address"
      />
      
      <div className="mt-4 pt-4 border-t border-border/50 space-y-2">
        <DataRow label="TX Hash" value={txHash} mono copyable />
        <DataRow label="Block" value={blockNumber.toLocaleString()} />
        <DataRow label="Gas Used" value={gasUsed} mono />
        
        {btcTxId && (
          <div className="pt-2 mt-2 border-t border-border/50">
             <DataRow label="BTC Anchor TX" value={btcTxId} mono copyable />
             {btcExplorerUrl && (
               <a 
                 href={btcExplorerUrl}
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-[10px] flex items-center gap-1 text-foreground-muted hover:text-accent mt-1 justify-end"
               >
                 View BTC Transaction <ExternalLink className="w-3 h-3" />
               </a>
             )}
          </div>
        )}
      </div>
    </BaseCard>
  );
}