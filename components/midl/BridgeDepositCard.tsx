'use client';

import { ArrowDownToLine } from 'lucide-react';
import { BaseCard, ErrorCard, DataRow } from './base';
import { TransactionWrapper } from '@/components/transactions';
import type { ToolResponse, BridgeDepositTransaction } from '@/lib/ai/tools/types';

interface BridgeDepositToolResult {
  transaction?: BridgeDepositTransaction;
  btcTxId?: string;
  satoshis?: string;
  btcAmount?: string;
  explorerUrl?: string;
  status?: string;
}

interface BridgeDepositCardProps {
  data: ToolResponse<BridgeDepositToolResult>;
}

export function BridgeDepositCard({ data }: BridgeDepositCardProps) {
  if (!data.success || !data.data) {
    return <ErrorCard error={data.error || 'Bridge deposit failed'} toolName="Bridge Deposit" />;
  }

  const { transaction, btcTxId } = data.data;

  // Show signing UI when we have a prepared transaction
  if (transaction && !btcTxId) {
    return (
      <BaseCard title="BTC → EVM Bridge" icon={<ArrowDownToLine className="w-4 h-4" />} variant="default">
        <TransactionWrapper transaction={transaction} buttonText="Sign & Deposit">
          <div className="space-y-2 mb-3">
            <DataRow label="Amount" value={`${transaction.btcAmount} BTC`} highlight />
            <DataRow label="Satoshis" value={Number(transaction.satoshis).toLocaleString()} mono />
          </div>
        </TransactionWrapper>
      </BaseCard>
    );
  }

  // Show success receipt
  if (btcTxId) {
    const { satoshis, btcAmount, explorerUrl, status } = data.data;
    return (
      <BaseCard
        title="BTC → EVM Bridge"
        icon={<ArrowDownToLine className="w-4 h-4" />}
        explorerLink={explorerUrl}
        variant={status === 'pending' ? 'warning' : 'success'}
      >
        <DataRow label="Amount" value={`${btcAmount} BTC`} highlight />
        <DataRow label="Satoshis" value={Number(satoshis || '0').toLocaleString()} mono />
        <DataRow
          label="Status"
          value={(status || 'pending').toUpperCase()}
          className={status === 'pending' ? 'text-warning' : 'text-success'}
        />
        <DataRow label="BTC TX" value={btcTxId} mono copyable />
      </BaseCard>
    );
  }

  return <ErrorCard error="Invalid bridge deposit data" toolName="Bridge Deposit" />;
}