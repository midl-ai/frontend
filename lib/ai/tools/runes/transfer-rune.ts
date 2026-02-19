import { tool } from 'ai';
import { z } from 'zod';
import { getNetworkConfig } from '@/lib/midl/config';

export const midl_transfer_rune = tool({
  description:
    'Transfer Runes to another Bitcoin address. Creates a Bitcoin transaction with rune transfer.',
  inputSchema: z.object({
    runeId: z.string().describe('Rune ID to transfer'),
    amount: z.string().describe('Amount of runes to transfer'),
    toAddress: z.string().describe('Destination Bitcoin address'),
  }),
  execute: async ({ runeId, amount, toAddress }) => {
    const config = getNetworkConfig();

    // Rune transfer requires wallet - return info for frontend to handle
    return {
      success: false,
      error: 'Rune transfer requires wallet signing. Please connect your wallet.',
      data: {
        runeId,
        amount,
        toAddress,
        explorerUrl: config.mempoolUrl,
        requiresWallet: true,
      },
    };
  },
});
