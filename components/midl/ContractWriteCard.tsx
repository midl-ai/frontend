'use client';

import { FileEdit } from 'lucide-react';
import { BaseCard, ErrorCard, DataRow, AddressDisplay, WalletRequiredCard } from './base';
import type { ToolResponse, WriteContractInfo } from '@/lib/ai/tools/types';

// Extended type to handle requiresWallet case
interface WriteContractData extends WriteContractInfo {
  requiresWallet?: boolean;
}

interface ContractWriteCardProps {
  data: ToolResponse<WriteContractData>;
}

export function ContractWriteCard({ data }: ContractWriteCardProps) {
  // Handle requiresWallet case
  if (!data.success && data.data?.requiresWallet) {
    const { functionName, contractAddress } = data.data;
    const details: Array<{ label: string; value: string }> = [];
    if (functionName) details.push({ label: 'Function', value: functionName });
    if (contractAddress) details.push({ label: 'Contract', value: `${contractAddress.slice(0, 10)}...` });
    return (
      <WalletRequiredCard
        title="Contract Write Pending"
        details={details.length > 0 ? details : undefined}
      />
    );
  }

  if (!data.success || !data.data) {
    return <ErrorCard error={data.error || 'Contract write failed'} toolName="Contract Write" />;
  }

  const { txHash, blockNumber, gasUsed, contractAddress, functionName, explorerUrl } = data.data;

  return (
    <BaseCard 
      title="Contract Write" 
      icon={<FileEdit className="w-4 h-4" />} 
      explorerLink={explorerUrl}
      variant="success"
    >
      <DataRow label="Function" value={functionName} mono highlight />
      <div className="py-2">
        <AddressDisplay address={contractAddress} label="Contract" />
      </div>
      <DataRow label="TX Hash" value={txHash} mono copyable />
      <DataRow label="Block" value={blockNumber.toLocaleString()} />
      <DataRow label="Gas Used" value={gasUsed} mono />
    </BaseCard>
  );
}