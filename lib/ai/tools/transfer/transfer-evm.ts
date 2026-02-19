import { tool } from 'ai';
import { z } from 'zod';
import { getNetworkConfig, WEI_PER_BTC } from '@/lib/midl/config';

export const midl_transfer_evm = tool({
  description:
    'Transfer BTC on the EVM layer to another address. Requires wallet signing.',
  inputSchema: z.object({
    to: z.string().describe('Destination EVM address'),
    amount: z.string().describe('Amount to send (in BTC or wei)'),
    unit: z
      .enum(['btc', 'wei'])
      .optional()
      .describe('Unit of amount (default: btc)'),
  }),
  execute: async ({ to, amount, unit = 'btc' }) => {
    const config = getNetworkConfig();

    // Convert to wei if needed
    let weiAmount: string;
    if (unit === 'btc') {
      weiAmount = (parseFloat(amount) * Number(WEI_PER_BTC)).toString();
    } else {
      weiAmount = amount;
    }

    // Transfer requires wallet - return info for frontend to handle
    return {
      success: false,
      error: 'Transfer requires wallet signing. Please connect your wallet.',
      data: {
        to,
        amount,
        unit,
        weiAmount,
        explorerUrl: config.explorerUrl,
        requiresWallet: true,
      },
    };
  },
});
