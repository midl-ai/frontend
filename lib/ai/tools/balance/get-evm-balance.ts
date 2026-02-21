import { tool } from 'ai';
import { z } from 'zod';
import { getEvmBalance } from '@/lib/midl/client';
import { getNetworkConfig, WEI_PER_BTC } from '@/lib/midl/constants';

export const midl_get_evm_balance = tool({
  description: 'Get the BTC balance on the EVM layer for an address. Returns balance in BTC.',
  inputSchema: z.object({
    address: z
      .string()
      .optional()
      .describe('EVM address to check. If not provided, uses connected wallet address.'),
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
      const balance = await getEvmBalance(address as `0x${string}`);

      const btcAmount = Number(balance) / Number(WEI_PER_BTC);

      return {
        success: true,
        data: {
          address,
          balance: balance.toString(),
          balanceFormatted: `${btcAmount.toFixed(8)} BTC`,
          explorerUrl: `${config.explorerUrl}/address/${address}`,
        },
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: `Failed to get EVM balance: ${message}`,
      };
    }
  },
});
