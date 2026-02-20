'use client';

import { Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { BaseCard, ErrorCard, DataRow } from './base';
import type { ToolResponse, BridgeStatusInfo } from '@/lib/ai/tools/types';

interface BridgeStatusCardProps {
  data: ToolResponse<BridgeStatusInfo>;
}

export function BridgeStatusCard({ data }: BridgeStatusCardProps) {
  if (!data.success || !data.data) {
    return <ErrorCard error={data.error || 'Failed to get bridge status'} toolName="Bridge Status" />;
  }

  const { txHash, status, confirmations, requiredConfirmations } = data.data;
  const isComplete = confirmations >= requiredConfirmations;
  const isPending = status === 'pending';

  const getIcon = () => {
    if (isComplete) return <CheckCircle className="w-4 h-4" />;
    if (isPending) return <Clock className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
  };

  const getVariant = () => {
    if (isComplete) return 'success' as const;
    if (isPending) return 'warning' as const;
    return 'error' as const;
  };

  return (
    <BaseCard title="Bridge Status" icon={getIcon()} variant={getVariant()}>
      <DataRow 
        label="Status" 
        value={status.toUpperCase()} 
        highlight 
        className={isComplete ? 'text-success' : 'text-warning'}
      />
      <DataRow
        label="Confirmations"
        value={`${confirmations} / ${requiredConfirmations}`}
        mono
      />
      <DataRow label="TX Hash" value={txHash} mono copyable />
      
      {!isComplete && (
        <div className="mt-3 p-2 bg-background-tertiary rounded text-[10px] text-foreground-muted text-center animate-pulse">
          Waiting for network confirmation...
        </div>
      )}
    </BaseCard>
  );
}