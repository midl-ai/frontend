'use client';

import { ArrowRight, Wallet, CircleDollarSign, Code, Coins } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PreparedTransaction } from '@/lib/ai/tools/types';

interface VoiceTransactionDetailsProps {
  transaction: PreparedTransaction;
}

/** Truncate address for display */
function truncateAddress(address: string, chars = 6): string {
  if (address.length <= chars * 2 + 2) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/** Data row component */
function DataRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
      <span className="text-foreground-muted text-sm">{label}</span>
      <span className={cn('text-sm font-medium', mono && 'font-mono')}>{value}</span>
    </div>
  );
}

/** Address display with truncation */
function AddressRow({ label, address }: { label: string; address: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
      <span className="text-foreground-muted text-sm">{label}</span>
      <span className="text-sm font-mono">{truncateAddress(address)}</span>
    </div>
  );
}

/** Transaction type header with icon */
function TransactionHeader({ icon: Icon, title, subtitle }: {
  icon: typeof Wallet;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-accent" />
      </div>
      <div>
        <h3 className="font-semibold text-foreground">{title}</h3>
        {subtitle && <p className="text-xs text-foreground-muted">{subtitle}</p>}
      </div>
    </div>
  );
}

/**
 * Displays transaction details based on transaction type
 * Used in VoiceModeOverlay to show what the user is signing
 */
export function VoiceTransactionDetails({ transaction }: VoiceTransactionDetailsProps) {
  switch (transaction.type) {
    case 'evm_transfer':
      return (
        <div className="space-y-1 p-4 bg-background-secondary rounded-xl">
          <TransactionHeader icon={Wallet} title="Transfer BTC" subtitle="EVM Layer" />
          <DataRow label="Amount" value={`${transaction.amount} BTC`} />
          <AddressRow label="To" address={transaction.to} />
        </div>
      );

    case 'token_transfer':
      return (
        <div className="space-y-1 p-4 bg-background-secondary rounded-xl">
          <TransactionHeader icon={Coins} title="Transfer Token" subtitle={transaction.symbol || 'ERC-20'} />
          <DataRow label="Amount" value={`${transaction.amount} ${transaction.symbol || ''}`} />
          <AddressRow label="To" address={transaction.to} />
          <AddressRow label="Token" address={transaction.tokenAddress} />
        </div>
      );

    case 'bridge_deposit':
      return (
        <div className="space-y-1 p-4 bg-background-secondary rounded-xl">
          <TransactionHeader icon={ArrowRight} title="Bridge to EVM" subtitle="BTC → EVM" />
          <DataRow label="Amount" value={`${transaction.btcAmount} BTC`} />
          <DataRow label="Satoshis" value={transaction.satoshis} mono />
        </div>
      );

    case 'bridge_withdraw':
      return (
        <div className="space-y-1 p-4 bg-background-secondary rounded-xl">
          <TransactionHeader icon={ArrowRight} title="Bridge to Bitcoin" subtitle="EVM → BTC" />
          <DataRow label="Amount" value={`${transaction.btcAmount} BTC`} />
          <AddressRow label="BTC Address" address={transaction.btcAddress} />
        </div>
      );

    case 'contract_deploy':
      return (
        <div className="space-y-1 p-4 bg-background-secondary rounded-xl">
          <TransactionHeader icon={Code} title="Deploy Contract" subtitle={transaction.template} />
          <DataRow label="Template" value={transaction.template} />
          {transaction.params && Object.entries(transaction.params).map(([key, val]) => (
            <DataRow key={key} label={key} value={String(val)} />
          ))}
        </div>
      );

    case 'rune_transfer':
      return (
        <div className="space-y-1 p-4 bg-background-secondary rounded-xl">
          <TransactionHeader icon={CircleDollarSign} title="Transfer Rune" subtitle={transaction.runeName || transaction.runeId} />
          <DataRow label="Amount" value={transaction.amount} />
          <DataRow label="Rune ID" value={transaction.runeId} mono />
          <AddressRow label="To" address={transaction.toAddress} />
        </div>
      );

    case 'rune_to_erc20':
      return (
        <div className="space-y-1 p-4 bg-background-secondary rounded-xl">
          <TransactionHeader icon={ArrowRight} title="Bridge Rune to ERC-20" subtitle="Rune → EVM" />
          <DataRow label="Amount" value={transaction.amount} />
          <DataRow label="Rune ID" value={transaction.runeId} mono />
          {transaction.runeName && <DataRow label="Rune" value={transaction.runeName} />}
        </div>
      );

    case 'erc20_to_rune':
      return (
        <div className="space-y-1 p-4 bg-background-secondary rounded-xl">
          <TransactionHeader icon={ArrowRight} title="Bridge ERC-20 to Rune" subtitle="EVM → Rune" />
          <DataRow label="Amount" value={transaction.amount} />
          <DataRow label="Rune ID" value={transaction.runeId} mono />
          <AddressRow label="Token" address={transaction.erc20Address} />
          <AddressRow label="BTC Address" address={transaction.btcAddress} />
        </div>
      );

    default:
      return (
        <div className="p-4 bg-background-secondary rounded-xl">
          <p className="text-foreground-muted text-sm">Transaction details unavailable</p>
        </div>
      );
  }
}
