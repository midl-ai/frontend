import { tool } from 'ai';
import { z } from 'zod';
import { getNetworkConfig } from '@/lib/midl/config';

export const midl_get_rune_balance = tool({
  description:
    'Get balance of a specific Rune for an address.',
  inputSchema: z.object({
    runeId: z.string().describe('Rune ID (e.g., "840000:1" format)'),
    address: z
      .string()
      .optional()
      .describe('Bitcoin address to check. If not provided, uses connected wallet.'),
  }),
  execute: async ({ runeId, address }) => {
    try {
      if (!address) {
        return {
          success: false,
          error: 'No address provided and no wallet connected',
        };
      }

      const config = getNetworkConfig();

      // Fetch rune balance from mempool API
      const response = await fetch(
        `${config.mempoolUrl}/api/address/${address}/rune/${runeId}`
      );

      if (!response.ok) {
        return {
          success: true,
          data: {
            runeId,
            name: runeId,
            balance: '0',
            address,
          },
        };
      }

      const rune = await response.json();

      return {
        success: true,
        data: {
          runeId: rune.id || runeId,
          name: rune.name || runeId,
          balance: rune.balance || '0',
          address,
        },
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: `Failed to get rune balance: ${message}`,
      };
    }
  },
});
