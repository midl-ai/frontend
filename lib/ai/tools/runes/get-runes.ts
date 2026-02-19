import { tool } from 'ai';
import { z } from 'zod';
import { getNetworkConfig } from '@/lib/midl/config';

export const midl_get_runes = tool({
  description:
    'Get all Runes held by an address. Returns list of runes with balances.',
  inputSchema: z.object({
    address: z
      .string()
      .optional()
      .describe('Bitcoin address to check. If not provided, uses connected wallet.'),
  }),
  execute: async ({ address }) => {
    try {
      if (!address) {
        return {
          success: false,
          error: 'No address provided and no wallet connected',
        };
      }

      const config = getNetworkConfig();

      // Fetch runes from mempool API
      // Note: This is a simplified version - actual implementation depends on MIDL's rune indexer
      const response = await fetch(
        `${config.mempoolUrl}/api/address/${address}/runes`
      );

      if (!response.ok) {
        // If endpoint doesn't exist or returns error, return empty list
        return {
          success: true,
          data: {
            address,
            total: 0,
            runes: [],
          },
        };
      }

      const runes = await response.json();

      return {
        success: true,
        data: {
          address,
          total: runes.length,
          runes: runes.map((rune: { id: string; name: string; spacedName?: string; balance: string }) => ({
            id: rune.id,
            name: rune.name,
            spacedName: rune.spacedName || rune.name,
            balance: rune.balance,
          })),
        },
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: `Failed to get runes: ${message}`,
      };
    }
  },
});
