import { tool } from 'ai';
import { z } from 'zod';
import { getPublicClient } from '@/lib/midl/client';
import { getNetworkConfig } from '@/lib/midl/config';

export const midl_send_raw_transaction = tool({
  description:
    'Broadcast a signed raw transaction to the network. Transaction must be pre-signed.',
  inputSchema: z.object({
    signedTx: z.string().describe('Signed transaction hex (0x prefixed)'),
  }),
  execute: async ({ signedTx }) => {
    try {
      const client = getPublicClient();
      const config = getNetworkConfig();

      const hash = await client.sendRawTransaction({
        serializedTransaction: signedTx as `0x${string}`,
      });

      return {
        success: true,
        data: {
          txHash: hash,
          explorerUrl: `${config.explorerUrl}/tx/${hash}`,
        },
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: `Failed to send transaction: ${message}`,
      };
    }
  },
});
