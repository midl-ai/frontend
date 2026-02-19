import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes with clsx */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Generate a UUID v4 */
export function generateUUID(): string {
  return crypto.randomUUID();
}

/** Truncate address for display (0x1234...5678) */
export function truncateAddress(address: string, chars = 4): string {
  if (!address) return '';
  if (address.length <= chars * 2 + 3) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/** Format BTC amount with proper decimals */
export function formatBtcAmount(satoshis: bigint | string | number): string {
  const sats = BigInt(satoshis);
  const btc = Number(sats) / 100_000_000;
  return `${btc.toFixed(8)} BTC`;
}

/** Format wei to BTC (MIDL uses 18 decimals) */
export function formatWeiToBtc(wei: bigint | string): string {
  const weiValue = BigInt(wei);
  const btc = Number(weiValue) / 1e18;
  return `${btc.toFixed(8)} BTC`;
}

/** Format timestamp to relative time */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const then = new Date(date);
  const diff = now.getTime() - then.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return then.toLocaleDateString();
}

/** Copy text to clipboard */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
