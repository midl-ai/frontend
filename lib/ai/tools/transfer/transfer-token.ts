import { tool } from 'ai';
import { z } from 'zod';
import { getNetworkConfig } from '@/lib/midl/config';

export const midl_transfer_token = tool({
  description:
    'Transfer ERC20 tokens to another address. Requires wallet signing.',
  inputSchema: z.object({
    tokenAddress: z.string().describe('ERC20 token contract address'),
    to: z.string().describe('Destination address'),
    amount: z.string().describe('Amount to send (in token units)'),
  }),
  execute: async ({ tokenAddress, to, amount }) => {
    const config = getNetworkConfig();

    // Transfer requires wallet - return info for frontend to handle
    return {
      success: false,
      error: 'Token transfer requires wallet signing. Please connect your wallet.',
      data: {
        tokenAddress,
        to,
        amount,
        explorerUrl: `${config.explorerUrl}/token/${tokenAddress}`,
        requiresWallet: true,
      },
    };
  },
});
