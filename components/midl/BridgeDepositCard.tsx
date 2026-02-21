'use client';

import { ArrowDownToLine } from 'lucide-react';
import { BaseCard, ErrorCard, DataRow, WalletRequiredCard } from './base';
import type { ToolResponse, BridgeBtcToEvmInfo } from '@/lib/ai/tools/types';

// Extended type to handle requiresWallet case
interface BridgeDepositData extends BridgeBtcToEvmInfo {
  requiresWallet?: boolean;
  amount?: string;
}

interface BridgeDepositCardProps {
  data: ToolResponse<BridgeDepositData>;
}

export function BridgeDepositCard({ data }: BridgeDepositCardProps) {
  // Handle requiresWallet case
  if (!data.success && data.data?.requiresWallet) {
    const { amount } = data.data;
    return (
      <WalletRequiredCard
        title="Bridge Deposit Pending"
        details={amount ? [{ label: 'Amount', value: `${amount} BTC` }] : undefined}
      />
    );
  }

  if (!data.success || !data.data) {
    return <ErrorCard error={data.error || 'Bridge deposit failed'} toolName="Bridge Deposit" />;
  }

  const { btcTxId, satoshis, btcAmount, explorerUrl, status } = data.data;

  return (
    <BaseCard
      title="BTC → EVM Bridge"
      icon={<ArrowDownToLine className="w-4 h-4" />}
      explorerLink={explorerUrl}
      variant={status === 'pending' ? 'warning' : 'success'}
    >
      <DataRow label="Amount" value={`${btcAmount} BTC`} highlight />
      <DataRow label="Satoshis" value={Number(satoshis).toLocaleString()} mono />
      <DataRow 
        label="Status" 
        value={status.toUpperCase()} 
        className={status === 'pending' ? 'text-warning' : 'text-success'}
      />
      <DataRow label="BTC TX" value={btcTxId} mono copyable />
    </BaseCard>
  );
}