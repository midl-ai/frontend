'use client';

import { ArrowRightLeft, ExternalLink } from 'lucide-react';
import { BaseCard, ErrorCard, DataRow, AddressDisplay } from './base';
import { TransactionWrapper } from '@/components/transactions';
import type { ToolResponse, RuneToERC20Transaction } from '@/lib/ai/tools/types';

interface RuneBridgeToolResult {
  transaction?: RuneToERC20Transaction;
  btcTxId?: string;
  runeId?: string;
  amount?: string;
  erc20Address?: string;
  explorerUrl?: string;
  status?: string;
}

interface RuneBridgeCardProps {
  data: ToolResponse<RuneBridgeToolResult>;
}

export function RuneBridgeCard({ data }: RuneBridgeCardProps) {
  if (!data.success || !data.data) {
    return <ErrorCard error={data.error || 'Rune bridge failed'} toolName="Rune Bridge" />;
  }

  const { transaction, btcTxId } = data.data;

  // Show signing UI when we have a prepared transaction
  if (transaction && !btcTxId) {
    return (
      <BaseCard title="Rune → ERC20 Bridge" icon={<ArrowRightLeft className="w-4 h-4" />} variant="default">
        <TransactionWrapper transaction={transaction} buttonText="Sign & Bridge">
          <div className="space-y-2 mb-3">
            <DataRow label="Rune ID" value={transaction.runeId} mono />
            {transaction.runeName && (
              <DataRow label="Rune" value={transaction.runeName} highlight />
            )}
            <DataRow label="Amount" value={transaction.amount} highlight />
          </div>
        </TransactionWrapper>
      </BaseCard>
    );
  }

  // Show success receipt
  if (btcTxId) {
    const { runeId, amount, erc20Address, explorerUrl, status } = data.data;
    return (
      <BaseCard
        title="Rune → ERC20 Bridge"
        icon={<ArrowRightLeft className="w-4 h-4" />}
        explorerLink={explorerUrl}
        variant={status === 'pending' ? 'warning' : 'success'}
      >
        <DataRow label="Rune ID" value={runeId || ''} mono />
        <DataRow label="Amount" value={amount || ''} highlight />
        <DataRow
          label="Status"
          value={(status || 'pending').toUpperCase()}
          className={status === 'pending' ? 'text-warning' : 'text-success'}
        />
        {erc20Address && (
          <AddressDisplay address={erc20Address} label="ERC20 Token" />
        )}
        <DataRow label="BTC TX" value={btcTxId} mono copyable />
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

  return <ErrorCard error="Invalid rune bridge data" toolName="Rune Bridge" />;
}
