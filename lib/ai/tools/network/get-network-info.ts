import { tool } from 'ai';
import { z } from 'zod';
import { getNetworkConfig } from '@/lib/midl/config';

export const midl_get_network_info = tool({
  description: 'Get information about the MIDL network including chain ID, RPC URL, and explorer URLs.',
  inputSchema: z.object({}),
  execute: async () => {
    try {
      const config = getNetworkConfig();

      return {
        success: true,
        data: {
          chainId: config.chainId,
          chainName: config.chain.name,
          rpcUrl: config.rpcUrl,
          explorerUrl: config.explorerUrl,
          mempoolUrl: config.mempoolUrl,
          nativeCurrency: {
            name: 'Bitcoin',
            symbol: 'BTC',
            decimals: 18,
          },
        },
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: `Failed to get network info: ${message}`,
      };
    }
  },
});
