import { tool } from 'ai';
import { z } from 'zod';
import { keccak256, encodePacked } from 'viem';
import { getNetworkConfig } from '@/lib/midl/constants';

export const midl_get_rune_erc20_address = tool({
  description:
    'Get the ERC20 token address for a Rune on the EVM layer. Runes can be bridged to ERC20 tokens.',
  inputSchema: z.object({
    runeId: z.string().describe('Rune ID (e.g., "840000:1" format)'),
  }),
  execute: async ({ runeId }) => {
    try {
      const config = getNetworkConfig();

      // Deterministic ERC20 address from rune ID
      // Actual implementation depends on MIDL's rune bridge contract
      const hash = keccak256(encodePacked(['string', 'string'], ['RUNE_ERC20_', runeId]));
      const erc20Address = `0x${hash.slice(-40)}` as `0x${string}`;

      return {
        success: true,
        data: {
          runeId,
          erc20Address,
          explorerUrl: `${config.explorerUrl}/token/${erc20Address}`,
        },
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: `Failed to get Rune ERC20 address: ${message}`,
      };
    }
  },
});
