import { tool } from 'ai';
import { z } from 'zod';
import { getNetworkConfig } from '@/lib/midl/constants';

/** System contract addresses */
const SYSTEM_CONTRACTS = {
  gateway: '0x0000000000000000000000000000000000000001' as const,
  intentFactory: '0x0000000000000000000000000000000000000002' as const,
};

export const midl_get_system_contracts = tool({
  description:
    'Get MIDL system contract addresses including the Gateway and Intent Factory.',
  inputSchema: z.object({}),
  execute: async () => {
    try {
      const config = getNetworkConfig();

      return {
        success: true,
        data: {
          gateway: SYSTEM_CONTRACTS.gateway,
          intentFactory: SYSTEM_CONTRACTS.intentFactory,
          rpcUrl: config.rpcUrl,
          explorerUrl: config.explorerUrl,
          contracts: [
            {
              name: 'Gateway',
              address: SYSTEM_CONTRACTS.gateway,
              description: 'Main entry point for cross-layer operations',
            },
            {
              name: 'Intent Factory',
              address: SYSTEM_CONTRACTS.intentFactory,
              description: 'Creates and manages transaction intents',
            },
          ],
        },
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: `Failed to get system contracts: ${message}`,
      };
    }
  },
});
