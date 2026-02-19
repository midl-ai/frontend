import { getNetworkConfig } from './config';

interface UTXO {
  txid: string;
  vout: number;
  value: number;
  status: {
    confirmed: boolean;
    block_height?: number;
    block_hash?: string;
    block_time?: number;
  };
}

interface AddressInfo {
  address: string;
  chain_stats: {
    funded_txo_count: number;
    funded_txo_sum: number;
    spent_txo_count: number;
    spent_txo_sum: number;
    tx_count: number;
  };
  mempool_stats: {
    funded_txo_count: number;
    funded_txo_sum: number;
    spent_txo_count: number;
    spent_txo_sum: number;
    tx_count: number;
  };
}

interface FeeEstimates {
  [key: string]: number;
}

/** Get mempool API base URL */
function getMempoolUrl(): string {
  const { mempoolUrl } = getNetworkConfig();
  return mempoolUrl;
}

/** Fetch with error handling */
async function mempoolFetch<T>(path: string): Promise<T> {
  const baseUrl = getMempoolUrl();
  const response = await fetch(`${baseUrl}/api${path}`);

  if (!response.ok) {
    throw new Error(`Mempool API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/** Get UTXOs for a Bitcoin address */
export async function getUtxos(address: string): Promise<UTXO[]> {
  return mempoolFetch<UTXO[]>(`/address/${address}/utxo`);
}

/** Get address info (balance, tx count) */
export async function getAddressInfo(address: string): Promise<AddressInfo> {
  return mempoolFetch<AddressInfo>(`/address/${address}`);
}

/** Get BTC balance for an address */
export async function getBtcBalance(address: string): Promise<{
  confirmed: number;
  unconfirmed: number;
  total: number;
}> {
  const info = await getAddressInfo(address);

  const confirmed = info.chain_stats.funded_txo_sum - info.chain_stats.spent_txo_sum;
  const unconfirmed = info.mempool_stats.funded_txo_sum - info.mempool_stats.spent_txo_sum;

  return {
    confirmed,
    unconfirmed,
    total: confirmed + unconfirmed,
  };
}

/** Get transaction by txid */
export async function getTransaction(txid: string) {
  return mempoolFetch(`/tx/${txid}`);
}

/** Get fee estimates */
export async function getFeeEstimates(): Promise<{
  fastest: number;
  halfHour: number;
  hour: number;
  economy: number;
  minimum: number;
}> {
  const estimates = await mempoolFetch<FeeEstimates>('/v1/fees/recommended');

  return {
    fastest: estimates.fastestFee,
    halfHour: estimates.halfHourFee,
    hour: estimates.hourFee,
    economy: estimates.economyFee,
    minimum: estimates.minimumFee,
  };
}
