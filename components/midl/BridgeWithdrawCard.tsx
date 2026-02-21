'use client';

import { ArrowUpFromLine } from 'lucide-react';
import { BaseCard, ErrorCard, DataRow, AddressDisplay, WalletRequiredCard } from './base';
import type { ToolResponse, BridgeEvmToBtcInfo } from '@/lib/ai/tools/types';

// Extended type to handle requiresWallet case
interface BridgeWithdrawData extends BridgeEvmToBtcInfo {
  requiresWallet?: boolean;
  amount?: string;
}

interface BridgeWithdrawCardProps {
  data: ToolResponse<BridgeWithdrawData>;
}

export function BridgeWithdrawCard({ data }: BridgeWithdrawCardProps) {
  // Handle requiresWallet case
  if (!data.success && data.data?.requiresWallet) {
    const { amount, btcAddress } = data.data;
    const details: Array<{ label: string; value: string }> = [];
    if (amount) details.push({ label: 'Amount', value: `${amount} BTC` });
    if (btcAddress) details.push({ label: 'To', value: `${btcAddress.slice(0, 10)}...` });
    return (
      <WalletRequiredCard
        title="Bridge Withdrawal Pending"
        details={details.length > 0 ? details : undefined}
      />
    );
  }

  if (!data.success || !data.data) {
    return <ErrorCard error={data.error || 'Bridge withdrawal failed'} toolName="Bridge Withdrawal" />;
  }

  const { btcTxId, satoshis, btcAmount, btcAddress, explorerUrl, status } = data.data;

  return (
    <BaseCard
      title="EVM → BTC Bridge"
      icon={<ArrowUpFromLine className="w-4 h-4" />}
      explorerLink={explorerUrl}
      variant={status === 'pending' ? 'warning' : 'success'}
    >
      <DataRow label="Amount" value={`${btcAmount} BTC`} highlight />
      <DataRow label="Satoshis" value={Number(satoshis).toLocaleString()} mono />
      <AddressDisplay address={btcAddress} label="Recipient" />
      <DataRow 
        label="Status" 
        value={status.toUpperCase()} 
        className={status === 'pending' ? 'text-warning' : 'text-success'}
      />
      <DataRow label="BTC TX" value={btcTxId} mono copyable />
    </BaseCard>
  );
}