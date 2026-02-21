'use client';

import { Send, ExternalLink } from 'lucide-react';
import { BaseCard, ErrorCard, DataRow, AddressDisplay } from './base';
import { TransactionWrapper } from '@/components/transactions';
import type { ToolResponse, RuneTransferTransaction } from '@/lib/ai/tools/types';

interface RuneTransferToolResult {
  transaction?: RuneTransferTransaction;
  txId?: string;
  runeId?: string;
  amount?: string;
  toAddress?: string;
  explorerUrl?: string;
}

interface RuneTransferCardProps {
  data: ToolResponse<RuneTransferToolResult>;
}

export function RuneTransferCard({ data }: RuneTransferCardProps) {
  if (!data.success || !data.data) {
    return <ErrorCard error={data.error || 'Rune transfer failed'} toolName="Rune Transfer" />;
  }

  const { transaction, txId } = data.data;

  // Show signing UI when we have a prepared transaction
  if (transaction && !txId) {
    return (
      <BaseCard title="Rune Transfer" icon={<Send className="w-4 h-4" />} variant="default">
        <TransactionWrapper transaction={transaction} buttonText="Sign & Send">
          <div className="space-y-2 mb-3">
            <DataRow label="Rune ID" value={transaction.runeId} mono />
            {transaction.runeName && (
              <DataRow label="Rune" value={transaction.runeName} highlight />
            )}
            <DataRow label="Amount" value={transaction.amount} highlight />
            <AddressDisplay address={transaction.toAddress} label="To" />
          </div>
        </TransactionWrapper>
      </BaseCard>
    );
  }

  // Show success receipt
  if (txId) {
    const { runeId, amount, toAddress, explorerUrl } = data.data;
    return (
      <BaseCard
        title="Rune Transfer Sent"
        icon={<Send className="w-4 h-4" />}
        explorerLink={explorerUrl}
        variant="success"
      >
        <DataRow label="Rune ID" value={runeId || ''} mono />
        <DataRow label="Amount" value={amount || ''} highlight />
        {toAddress && <AddressDisplay address={toAddress} label="To" />}
        <DataRow label="TX ID" value={txId} mono copyable />
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

  return <ErrorCard error="Invalid rune transfer data" toolName="Rune Transfer" />;
}
