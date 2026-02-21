'use client';

import { FileEdit } from 'lucide-react';
import { BaseCard, ErrorCard, DataRow, AddressDisplay } from './base';
import { TransactionWrapper } from '@/components/transactions';
import type { ToolResponse, ContractWriteTransaction } from '@/lib/ai/tools/types';

interface ContractWriteToolResult {
  transaction?: ContractWriteTransaction;
  txHash?: string;
  blockNumber?: number;
  gasUsed?: string;
  contractAddress?: string;
  functionName?: string;
  explorerUrl?: string;
}

interface ContractWriteCardProps {
  data: ToolResponse<ContractWriteToolResult>;
}

export function ContractWriteCard({ data }: ContractWriteCardProps) {
  if (!data.success || !data.data) {
    return <ErrorCard error={data.error || 'Contract write failed'} toolName="Contract Write" />;
  }

  const { transaction, txHash } = data.data;

  // Show signing UI when we have a prepared transaction
  if (transaction && !txHash) {
    return (
      <BaseCard title="Contract Write" icon={<FileEdit className="w-4 h-4" />} variant="default">
        <TransactionWrapper transaction={transaction} buttonText="Sign & Execute">
          <div className="space-y-2 mb-3">
            <DataRow label="Function" value={transaction.functionName} mono highlight />
            <AddressDisplay address={transaction.contractAddress} label="Contract" />
            {transaction.value && transaction.value !== '0' && (
              <DataRow label="Value" value={`${transaction.value} wei`} mono />
            )}
          </div>
        </TransactionWrapper>
      </BaseCard>
    );
  }

  // Show success receipt
  if (txHash) {
    const { blockNumber, gasUsed, contractAddress, functionName, explorerUrl } = data.data;
    return (
      <BaseCard
        title="Contract Write"
        icon={<FileEdit className="w-4 h-4" />}
        explorerLink={explorerUrl}
        variant="success"
      >
        <DataRow label="Function" value={functionName || ''} mono highlight />
        {contractAddress && (
          <div className="py-2">
            <AddressDisplay address={contractAddress} label="Contract" />
          </div>
        )}
        <DataRow label="TX Hash" value={txHash} mono copyable />
        {blockNumber && <DataRow label="Block" value={blockNumber.toLocaleString()} />}
        {gasUsed && <DataRow label="Gas Used" value={gasUsed} mono />}
      </BaseCard>
    );
  }

  return <ErrorCard error="Invalid contract write data" toolName="Contract Write" />;
}