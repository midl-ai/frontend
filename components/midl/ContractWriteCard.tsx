'use client';

import { FileEdit } from 'lucide-react';
import { BaseCard, ErrorCard, DataRow, AddressDisplay } from './base';
import type { ToolResponse, WriteContractInfo } from '@/lib/ai/tools/types';

interface ContractWriteCardProps {
  data: ToolResponse<WriteContractInfo>;
}

export function ContractWriteCard({ data }: ContractWriteCardProps) {
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