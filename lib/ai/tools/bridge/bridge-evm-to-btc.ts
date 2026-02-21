import { tool } from 'ai';
import { z } from 'zod';
import { getNetworkConfig, SATOSHIS_PER_BTC } from '@/lib/midl/config';
import type { BridgeWithdrawTransaction } from '../types';

export const midl_bridge_evm_to_btc = tool({
  description:
    'Bridge BTC from the EVM layer back to the Bitcoin layer. Returns prepared withdrawal transaction for wallet signing.',
  inputSchema: z.object({
    amount: z.string().describe('Amount to bridge (in BTC or satoshis)'),
    unit: z
      .enum(['btc', 'satoshis'])
      .optional()
      .describe('Unit of amount (default: btc)'),
    btcAddress: z.string().describe('Destination Bitcoin address'),
  }),
  execute: async ({ amount, unit = 'btc', btcAddress }) => {
    const config = getNetworkConfig();

    // Convert to satoshis
    let satoshis: number;
    if (unit === 'btc') {
      satoshis = Math.floor(parseFloat(amount) * SATOSHIS_PER_BTC);
    } else {
      satoshis = parseInt(amount, 10);
    }

    const btcAmount = (satoshis / SATOSHIS_PER_BTC).toFixed(8);

    const transaction: BridgeWithdrawTransaction = {
      type: 'bridge_withdraw',
      satoshis: satoshis.toString(),
      btcAmount,
      btcAddress,
      explorerUrl: config.explorerUrl,
    };

    return {
      success: true,
      transaction,
    };
  },
});
