import { tool } from 'ai';
import { z } from 'zod';
import { getNetworkConfig } from '@/lib/midl/config';
import type { RuneTransferTransaction } from '../types';

export const midl_transfer_rune = tool({
  description:
    'Transfer Runes to another Bitcoin address. Returns prepared transaction for wallet signing.',
  inputSchema: z.object({
    runeId: z.string().describe('Rune ID to transfer'),
    runeName: z.string().optional().describe('Rune name for display'),
    amount: z.string().describe('Amount of runes to transfer'),
    toAddress: z.string().describe('Destination Bitcoin address'),
  }),
  execute: async ({ runeId, runeName, amount, toAddress }) => {
    const config = getNetworkConfig();

    const transaction: RuneTransferTransaction = {
      type: 'rune_transfer',
      runeId,
      runeName,
      amount,
      toAddress,
      explorerUrl: config.explorerUrl,
      mempoolUrl: config.mempoolUrl,
    };

    console.log('[transfer-rune] Returning transaction:', transaction);

    return {
      success: true,
      data: {
        transaction,
      },
    };
  },
});
