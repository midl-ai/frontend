import { createPublicClient, http, type PublicClient } from 'viem';
import { getNetworkConfig } from './config';

let publicClient: PublicClient | null = null;

/** Get or create viem public client singleton */
export function getPublicClient(): PublicClient {
  if (publicClient) {
    return publicClient;
  }

  const { chain, rpcUrl } = getNetworkConfig();

  publicClient = createPublicClient({
    chain,
    transport: http(rpcUrl),
  });

  return publicClient;
}

/** Get EVM balance for an address */
export async function getEvmBalance(address: `0x${string}`) {
  const client = getPublicClient();
  return client.getBalance({ address });
}

/** Get block by number or 'latest' */
export async function getBlock(blockNumber: number | 'latest') {
  const client = getPublicClient();

  if (blockNumber === 'latest') {
    return client.getBlock({ blockTag: 'latest' });
  }

  return client.getBlock({ blockNumber: BigInt(blockNumber) });
}

/** Get transaction receipt */
export async function getTransactionReceipt(hash: `0x${string}`) {
  const client = getPublicClient();
  return client.getTransactionReceipt({ hash });
}

/** Read contract */
export async function readContract({
  address,
  abi,
  functionName,
  args = [],
}: {
  address: `0x${string}`;
  abi: readonly unknown[];
  functionName: string;
  args?: readonly unknown[];
}) {
  const client = getPublicClient();
  return client.readContract({
    address,
    abi: abi as never,
    functionName,
    args: args as never,
  });
}

/** Estimate gas for a transaction */
export async function estimateGas({
  to,
  data,
  value,
}: {
  to?: `0x${string}`;
  data?: `0x${string}`;
  value?: bigint;
}) {
  const client = getPublicClient();
  return client.estimateGas({
    to,
    data,
    value,
  });
}
