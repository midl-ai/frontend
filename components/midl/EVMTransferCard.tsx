'use client';

import { Send, ExternalLink } from 'lucide-react';
import { BaseCard, ErrorCard, DataRow, AddressDisplay } from './base';
import { TransactionWrapper } from '@/components/transactions';
import type { ToolResponse, EVMTransferTransaction } from '@/lib/ai/tools/types';

interface TransferToolResult {
  transaction?: EVMTransferTransaction;
  txHash?: string;
  from?: string;
  to?: string;
  amount?: string;
  explorerUrl?: string;
}

interface EVMTransferCardProps {
  data: ToolResponse<TransferToolResult>;
}

export function EVMTransferCard({ data }: EVMTransferCardProps) {
  if (!data.success || !data.data) {
    return <ErrorCard error={data.error || 'Transfer failed'} toolName="EVM Transfer" />;
  }

  const { transaction, txHash } = data.data;

  // Show signing UI when we have a prepared transaction
  if (transaction && !txHash) {
    return (
      <BaseCard title="EVM Transfer" icon={<Send className="w-4 h-4" />} variant="default">
        <TransactionWrapper transaction={transaction} buttonText="Sign & Transfer">
          <div className="space-y-2 mb-3">
            <DataRow label="Amount" value={transaction.amount} highlight />
            <AddressDisplay address={transaction.to} label="To" />
          </div>
        </TransactionWrapper>
      </BaseCard>
    );
  }

  // Show success receipt
  if (txHash) {
    const { from, to, amount, explorerUrl } = data.data;
    return (
      <BaseCard title="Transfer Sent" icon={<Send className="w-4 h-4" />} variant="success">
        <DataRow label="Amount" value={amount || ''} highlight />
        {from && <AddressDisplay address={from} label="From" />}
        {to && <AddressDisplay address={to} label="To" />}
        <DataRow label="TX Hash" value={`${txHash.slice(0, 12)}...${txHash.slice(-8)}`} mono />
        {explorerUrl && (
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
        )}
      </BaseCard>
    );
  }

  return <ErrorCard error="Invalid transfer data" toolName="EVM Transfer" />;
}
