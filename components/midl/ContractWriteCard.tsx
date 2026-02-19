'use client';

import { FileEdit, ExternalLink } from 'lucide-react';
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
    <BaseCard title="Contract Write" icon={<FileEdit className="w-4 h-4" />} variant="success">
      <DataRow label="Function" value={functionName} mono highlight />
      <AddressDisplay address={contractAddress} label="Contract" />
      <DataRow label="TX Hash" value={`${txHash.slice(0, 12)}...${txHash.slice(-8)}`} mono />
      <DataRow label="Block" value={blockNumber.toLocaleString()} />
      <DataRow label="Gas Used" value={gasUsed} mono />
      <div className="pt-2">
        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-accent hover:underline flex items-center gap-1"
        >
          View Transaction <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </BaseCard>
  );
}
