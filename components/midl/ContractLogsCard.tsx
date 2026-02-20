'use client';

import { ScrollText } from 'lucide-react';
import { BaseCard, ErrorCard, DataRow, AddressDisplay } from './base';
import type { ToolResponse, ContractLogsInfo } from '@/lib/ai/tools/types';

interface ContractLogsCardProps {
  data: ToolResponse<ContractLogsInfo>;
}

export function ContractLogsCard({ data }: ContractLogsCardProps) {
  if (!data.success || !data.data) {
    return <ErrorCard error={data.error || 'Failed to get contract logs'} toolName="Contract Logs" />;
  }

  const { contractAddress, logs, count } = data.data;

  return (
    <BaseCard title="Contract Logs" icon={<ScrollText className="w-4 h-4" />}>
      <AddressDisplay address={contractAddress} label="Contract" />
      <DataRow label="Total Logs" value={count} highlight />
      {logs.length > 0 && (
        <div className="pt-2 space-y-2 border-t border-border mt-2">
          <span className="text-xs text-foreground-muted">Recent Logs:</span>
          {logs.slice(0, 3).map((log, i) => (
            <div key={i} className="text-xs bg-background-muted p-2 rounded space-y-1">
              <div className="flex justify-between">
                <span className="text-foreground-muted">Block:</span>
                <span className="font-mono">{log.blockNumber}</span>
              </div>
              <div className="font-mono text-foreground-muted truncate">
                {log.txHash.slice(0, 16)}...
              </div>
            </div>
          ))}
          {logs.length > 3 && (
            <div className="text-xs text-foreground-muted">
              +{logs.length - 3} more logs
            </div>
          )}
        </div>
      )}
    </BaseCard>
  );
}
