import { tool } from 'ai';
import { z } from 'zod';
import { getNetworkConfig } from '@/lib/midl/config';
import type { RuneToERC20Transaction } from '../types';

export const midl_bridge_rune_to_erc20 = tool({
  description:
    'Bridge Runes from Bitcoin to ERC20 tokens on the EVM layer. Returns prepared transaction for wallet signing.',
  inputSchema: z.object({
    runeId: z.string().describe('Rune ID to bridge'),
    runeName: z.string().optional().describe('Rune name for display'),
    amount: z.string().describe('Amount of runes to bridge'),
  }),
  execute: async ({ runeId, runeName, amount }) => {
    const config = getNetworkConfig();

    const transaction: RuneToERC20Transaction = {
      type: 'rune_to_erc20',
      runeId,
      runeName,
      amount,
      explorerUrl: config.mempoolUrl,
    };

    console.log('[bridge-rune-to-erc20] Returning transaction:', transaction);

    return {
      success: true,
      data: {
        transaction,
      },
    };
  },
});
