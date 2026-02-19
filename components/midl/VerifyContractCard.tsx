'use client';

import { ShieldCheck, ShieldX, ExternalLink } from 'lucide-react';
import { BaseCard, ErrorCard, DataRow, AddressDisplay } from './base';
import type { ToolResponse, VerifyContractInfo } from '@/lib/ai/tools/types';

interface VerifyContractCardProps {
  data: ToolResponse<VerifyContractInfo>;
}

export function VerifyContractCard({ data }: VerifyContractCardProps) {
  if (!data.success || !data.data) {
    return <ErrorCard error={data.error || 'Contract verification failed'} toolName="Verify Contract" />;
  }

  const { address, verified, explorerUrl, message } = data.data;

  return (
    <BaseCard
      title="Contract Verification"
      icon={verified ? <ShieldCheck className="w-4 h-4" /> : <ShieldX className="w-4 h-4" />}
      variant={verified ? 'success' : 'error'}
    >
      <DataRow label="Status" value={verified ? '✓ Verified' : '✗ Not Verified'} highlight />
      <AddressDisplay address={address} label="Contract" />
      <DataRow label="Message" value={message} />
      <div className="pt-2">
        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-accent hover:underline flex items-center gap-1"
        >
          View on Explorer <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </BaseCard>
  );
}
