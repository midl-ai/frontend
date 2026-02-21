'use client';

import { ArrowUpFromLine } from 'lucide-react';
import { BaseCard, ErrorCard, DataRow, AddressDisplay } from './base';
import { TransactionWrapper } from '@/components/transactions';
import type { ToolResponse, BridgeWithdrawTransaction } from '@/lib/ai/tools/types';

interface BridgeWithdrawToolResult {
  transaction?: BridgeWithdrawTransaction;
  btcTxId?: string;
  satoshis?: string;
  btcAmount?: string;
  btcAddress?: string;
  explorerUrl?: string;
  status?: string;
}

interface BridgeWithdrawCardProps {
  data: ToolResponse<BridgeWithdrawToolResult>;
}

export function BridgeWithdrawCard({ data }: BridgeWithdrawCardProps) {
  if (!data.success || !data.data) {
    return <ErrorCard error={data.error || 'Bridge withdrawal failed'} toolName="Bridge Withdrawal" />;
  }

  const { transaction, btcTxId } = data.data;

  // Show signing UI when we have a prepared transaction
  if (transaction && !btcTxId) {
    return (
      <BaseCard title="EVM → BTC Bridge" icon={<ArrowUpFromLine className="w-4 h-4" />} variant="default">
        <TransactionWrapper transaction={transaction} buttonText="Sign & Withdraw">
          <div className="space-y-2 mb-3">
            <DataRow label="Amount" value={`${transaction.btcAmount} BTC`} highlight />
            <DataRow label="Satoshis" value={Number(transaction.satoshis).toLocaleString()} mono />
            <AddressDisplay address={transaction.btcAddress} label="Recipient" />
          </div>
        </TransactionWrapper>
      </BaseCard>
    );
  }

  // Show success receipt
  if (btcTxId) {
    const { satoshis, btcAmount, btcAddress, explorerUrl, status } = data.data;
    return (
      <BaseCard
        title="EVM → BTC Bridge"
        icon={<ArrowUpFromLine className="w-4 h-4" />}
        explorerLink={explorerUrl}
        variant={status === 'pending' ? 'warning' : 'success'}
      >
        <DataRow label="Amount" value={`${btcAmount} BTC`} highlight />
        <DataRow label="Satoshis" value={Number(satoshis || '0').toLocaleString()} mono />
        {btcAddress && <AddressDisplay address={btcAddress} label="Recipient" />}
        <DataRow
          label="Status"
          value={(status || 'pending').toUpperCase()}
          className={status === 'pending' ? 'text-warning' : 'text-success'}
        />
        <DataRow label="BTC TX" value={btcTxId} mono copyable />
      </BaseCard>
    );
  }

  return <ErrorCard error="Invalid bridge withdrawal data" toolName="Bridge Withdrawal" />;
}