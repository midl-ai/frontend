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
  const isLongResult = formattedResult.length > 40 || formattedResult.includes('\n');

  return (
    <BaseCard title="Contract Read" icon={<FileSearch className="w-4 h-4" />}>
      <div className="mb-3">
        <AddressDisplay address={contractAddress} label="Target Contract" />
      </div>
      
      <DataRow label="Function" value={functionName} mono highlight />
      
      {isLongResult ? (
        <div className="pt-2 mt-2 border-t border-border/50">
          <span className="text-[10px] text-foreground-muted uppercase tracking-wider font-semibold">Result</span>
          <div className="mt-1 bg-background-tertiary rounded-lg p-3 overflow-x-auto border border-border/50">
            <pre className="text-xs font-mono text-foreground whitespace-pre-wrap break-all">
              {formattedResult}
            </pre>
          </div>
        </div>
      ) : (
        <DataRow label="Result" value={formattedResult} highlight mono copyable />
      )}
    </BaseCard>
  );
}