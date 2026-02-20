import { defineChain } from 'viem';
import { createConfig, regtest } from '@midl/core';
import { xverseConnector } from '@midl/connectors';

/** MIDL SDK configuration with Xverse wallet connector */
export const midlConfig = createConfig({
  networks: [regtest],
  connectors: [xverseConnector()],
  persist: true,
});

/** Bitcoin explorer URL */
export const BTC_EXPLORER_URL = 'https://mempool.staging.midl.xyz';

/** Faucet URL for getting test BTC */
export const FAUCET_URL = 'https://faucet.midl.xyz';

/** MIDL Regtest chain configuration */
export const midlRegtest = defineChain({
  id: 14969,
  name: 'MIDL Regtest',
  nativeCurrency: {
    name: 'Bitcoin',
    symbol: 'BTC',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [process.env.MIDL_RPC_URL || 'https://rpc.staging.midl.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: process.env.MIDL_EXPLORER_URL || 'https://blockscout.staging.midl.xyz',
    },
  },
});

/** MIDL Mainnet chain configuration */
export const midlMainnet = defineChain({
  id: 1500,
  name: 'MIDL',
  nativeCurrency: {
    name: 'Bitcoin',
    symbol: 'BTC',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.midl.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: 'https://blockscout.midl.xyz',
    },
  },
});

/** Network configuration from environment */
export function getNetworkConfig() {
  const network = process.env.MIDL_NETWORK || 'regtest';

  return {
    chain: network === 'mainnet' ? midlMainnet : midlRegtest,
    rpcUrl: process.env.MIDL_RPC_URL || 'https://rpc.staging.midl.xyz',
    explorerUrl: process.env.MIDL_EXPLORER_URL || 'https://blockscout.staging.midl.xyz',
    mempoolUrl: process.env.MIDL_MEMPOOL_URL || 'https://mempool.staging.midl.xyz',
    chainId: network === 'mainnet' ? 1500 : 14969,
  };
}

/** Constants */
export const SATOSHIS_PER_BTC = 100_000_000;
export const WEI_PER_BTC = BigInt(1e18);
export const SATOSHI_TO_WEI = BigInt(1e10); // 1 satoshi = 10^10 wei

/** Convert satoshis to wei */
export function satoshisToWei(satoshis: bigint): bigint {
  return satoshis * SATOSHI_TO_WEI;
}

/** Convert wei to satoshis */
export function weiToSatoshis(wei: bigint): bigint {
  return wei / SATOSHI_TO_WEI;
}
