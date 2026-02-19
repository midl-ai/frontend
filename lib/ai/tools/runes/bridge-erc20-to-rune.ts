import { tool } from 'ai';
import { z } from 'zod';
import { getNetworkConfig } from '@/lib/midl/config';

export const midl_bridge_erc20_to_rune = tool({
  description:
    'Bridge ERC20 tokens back to Runes on the Bitcoin layer.',
  inputSchema: z.object({
    runeId: z.string().describe('Rune ID to receive'),
    amount: z.string().describe('Amount of ERC20 tokens to bridge'),
  }),
  execute: async ({ runeId, amount }) => {
    const config = getNetworkConfig();

    // Bridge requires wallet - return info for frontend to handle
    return {
      success: false,
      error: 'ERC20 to Rune bridge requires wallet signing. Please connect your wallet.',
      data: {
        runeId,
        amount,
        explorerUrl: config.explorerUrl,
        status: 'pending_wallet',
        requiresWallet: true,
      },
    };
  },
});
