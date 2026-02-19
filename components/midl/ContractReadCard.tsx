'use client';

import { FileSearch } from 'lucide-react';
import { BaseCard, ErrorCard, DataRow, AddressDisplay } from './base';
import type { ToolResponse, ReadContractInfo } from '@/lib/ai/tools/types';

interface ContractReadCardProps {
  data: ToolResponse<ReadContractInfo>;
}

function formatResult(result: unknown): string {
  if (result === null || result === undefined) return 'null';
  if (typeof result === 'bigint') return result.toString();
  if (typeof result === 'object') {
    try {
      return JSON.stringify(result, (_, v) =>
        typeof v === 'bigint' ? v.toString() : v
      , 2);
    } catch {
      return String(result);
    }
  }
  return String(result);
}

export function ContractReadCard({ data }: ContractReadCardProps) {
  if (!data.success || !data.data) {
    return <ErrorCard error={data.error || 'Contract read failed'} toolName="Contract Read" />;
  }

  const { contractAddress, functionName, result } = data.data;
  const formattedResult = formatResult(result);
  const isLongResult = formattedResult.length > 50;

  return (
    <BaseCard title="Contract Read" icon={<FileSearch className="w-4 h-4" />}>
      <AddressDisplay address={contractAddress} label="Contract" />
      <DataRow label="Function" value={functionName} mono />
      {isLongResult ? (
        <div className="pt-2 border-t border-border mt-2">
          <span className="text-xs text-foreground-muted">Result:</span>
          <pre className="text-xs font-mono text-foreground mt-1 bg-background-muted p-2 rounded overflow-x-auto max-h-32 overflow-y-auto">
            {formattedResult}
          </pre>
        </div>
      ) : (
        <DataRow label="Result" value={formattedResult} highlight mono />
      )}
    </BaseCard>
  );
}
