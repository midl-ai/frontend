'use client';

import { Send, ExternalLink } from 'lucide-react';
import { BaseCard, ErrorCard, DataRow, AddressDisplay, WalletRequiredCard } from './base';
import type { ToolResponse, TransferInfo } from '@/lib/ai/tools/types';

// Extended type to handle requiresWallet case
interface TransferData extends TransferInfo {
  requiresWallet?: boolean;
  weiAmount?: string;
  unit?: string;
}

interface EVMTransferCardProps {
  data: ToolResponse<TransferData>;
}

export function EVMTransferCard({ data }: EVMTransferCardProps) {
  // Handle requiresWallet case - show pending signing card
  if (!data.success && data.data?.requiresWallet) {
    const { to, amount, unit } = data.data;
    return (
      <WalletRequiredCard
        title="Transfer Pending"
        details={[
          { label: 'To', value: `${to.slice(0, 10)}...${to.slice(-8)}` },
          { label: 'Amount', value: `${amount} ${unit || 'BTC'}` },
        ]}
      />
    );
  }

  if (!data.success || !data.data) {
    return <ErrorCard error={data.error || 'Transfer failed'} toolName="EVM Transfer" />;
  }

  const { txHash, from, to, amount, explorerUrl } = data.data;

  return (
    <BaseCard title="Transfer Sent" icon={<Send className="w-4 h-4" />} variant="success">
      <DataRow label="Amount" value={amount} highlight />
      <AddressDisplay address={from} label="From" />
      <AddressDisplay address={to} label="To" />
      <DataRow label="TX Hash" value={`${txHash.slice(0, 12)}...${txHash.slice(-8)}`} mono />
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
