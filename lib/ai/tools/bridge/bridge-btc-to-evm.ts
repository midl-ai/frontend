import { tool } from 'ai';
import { z } from 'zod';
import { getNetworkConfig, SATOSHIS_PER_BTC } from '@/lib/midl/config';

export const midl_bridge_btc_to_evm = tool({
  description:
    'Bridge BTC from the Bitcoin layer to the EVM layer. Creates a deposit transaction.',
  inputSchema: z.object({
    amount: z.string().describe('Amount to bridge (in BTC or satoshis)'),
    unit: z
      .enum(['btc', 'satoshis'])
      .optional()
      .describe('Unit of amount (default: btc)'),
  }),
  execute: async ({ amount, unit = 'btc' }) => {
    const config = getNetworkConfig();

    // Convert to satoshis
    let satoshis: number;
    if (unit === 'btc') {
      satoshis = Math.floor(parseFloat(amount) * SATOSHIS_PER_BTC);
    } else {
      satoshis = parseInt(amount, 10);
    }

    const btcAmount = (satoshis / SATOSHIS_PER_BTC).toFixed(8);

    // Bridge requires wallet - return info for frontend to handle
    return {
      success: false,
      error: 'Bridge deposit requires wallet signing. Please connect your wallet.',
      data: {
        satoshis: satoshis.toString(),
        btcAmount,
        explorerUrl: config.mempoolUrl,
        status: 'pending_wallet',
        requiresWallet: true,
      },
    };
  },
});
