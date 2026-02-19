import { tool } from 'ai';
import { z } from 'zod';
import { getNetworkConfig } from '@/lib/midl/config';
import { keccak256, encodePacked } from 'viem';

export const midl_bridge_rune_to_erc20 = tool({
  description:
    'Bridge Runes from Bitcoin to ERC20 tokens on the EVM layer.',
  inputSchema: z.object({
    runeId: z.string().describe('Rune ID to bridge'),
    amount: z.string().describe('Amount of runes to bridge'),
  }),
  execute: async ({ runeId, amount }) => {
    const config = getNetworkConfig();

    // Calculate expected ERC20 address
    const hash = keccak256(encodePacked(['string', 'string'], ['RUNE_ERC20_', runeId]));
    const erc20Address = `0x${hash.slice(-40)}`;

    // Bridge requires wallet - return info for frontend to handle
    return {
      success: false,
      error: 'Rune bridge requires wallet signing. Please connect your wallet.',
      data: {
        runeId,
        amount,
        erc20Address,
        explorerUrl: config.mempoolUrl,
        status: 'pending_wallet',
        requiresWallet: true,
      },
    };
  },
});
