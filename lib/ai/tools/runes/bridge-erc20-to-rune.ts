import { tool } from 'ai';
import { z } from 'zod';
import { getNetworkConfig } from '@/lib/midl/constants';
import type { ERC20ToRuneTransaction } from '../types';

export const midl_bridge_erc20_to_rune = tool({
  description:
    'Bridge ERC20 tokens back to Runes on the Bitcoin layer. Returns prepared transaction for wallet signing.',
  inputSchema: z.object({
    runeId: z.string().describe('Rune ID to receive'),
    runeName: z.string().optional().describe('Rune name for display'),
    erc20Address: z.string().describe('ERC20 token contract address'),
    amount: z.string().describe('Amount of ERC20 tokens to bridge'),
    btcAddress: z.string().describe('Destination Bitcoin address for runes'),
  }),
  execute: async ({ runeId, runeName, erc20Address, amount, btcAddress }) => {
    const config = getNetworkConfig();

    const transaction: ERC20ToRuneTransaction = {
      type: 'erc20_to_rune',
      runeId,
      runeName,
      erc20Address,
      amount,
      btcAddress,
      explorerUrl: config.explorerUrl,
      mempoolUrl: config.mempoolUrl,
    };

    console.log('[bridge-erc20-to-rune] Returning transaction:', transaction);

    return {
      success: true,
      data: {
        transaction,
      },
    };
  },
});
