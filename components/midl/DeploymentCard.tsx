'use client';

import { Rocket, ExternalLink } from 'lucide-react';
import { BaseCard, ErrorCard, DataRow, AddressDisplay } from './base';
import { TransactionWrapper } from '@/components/transactions';
import type { ToolResponse, ContractDeployTransaction } from '@/lib/ai/tools/types';

interface DeployToolResult {
  transaction?: ContractDeployTransaction;
  contractAddress?: string;
  txHash?: string;
  blockNumber?: number;
  gasUsed?: string;
  explorerUrl?: string;
  btcTxId?: string;
  btcExplorerUrl?: string;
}

interface DeploymentCardProps {
  data: ToolResponse<DeployToolResult>;
}

export function DeploymentCard({ data }: DeploymentCardProps) {
  if (!data.success || !data.data) {
    return <ErrorCard error={data.error || 'Deployment failed'} toolName="Contract Deploy" />;
  }

  const { transaction, txHash } = data.data;

  // Show signing UI when we have a prepared transaction
  if (transaction && !txHash) {
    return (
      <BaseCard title="Deploy Contract" icon={<Rocket className="w-4 h-4" />} variant="default">
        <TransactionWrapper transaction={transaction} buttonText="Sign & Deploy">
          <div className="space-y-2 mb-3">
            <DataRow label="Template" value={transaction.template} highlight />
            {Object.entries(transaction.params).map(([key, value]) => (
              <DataRow key={key} label={key} value={String(value)} mono />
            ))}
          </div>
        </TransactionWrapper>
      </BaseCard>
    );
  }

  // Show success receipt
  if (txHash) {
    const { contractAddress, blockNumber, gasUsed, explorerUrl, btcTxId, btcExplorerUrl } = data.data;
    return (
      <BaseCard
        title="Contract Deployed"
        icon={<Rocket className="w-4 h-4" />}
        explorerLink={contractAddress ? `${explorerUrl}/address/${contractAddress}` : undefined}
        variant="success"
      >
        <div className="mb-4 bg-success/10 border border-success/20 rounded-lg p-3 text-center">
          <span className="text-xs text-success font-bold uppercase tracking-wider">Deployment Successful</span>
        </div>

        {contractAddress && (
          <AddressDisplay address={contractAddress} label="New Contract Address" />
        )}

        <div className="mt-4 pt-4 border-t border-border/50 space-y-2">
          <DataRow label="TX Hash" value={txHash} mono copyable />
          {blockNumber && <DataRow label="Block" value={blockNumber.toLocaleString()} />}
          {gasUsed && <DataRow label="Gas Used" value={gasUsed} mono />}

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

  return <ErrorCard error="Invalid deployment data" toolName="Contract Deploy" />;
}