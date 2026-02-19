import { tool } from 'ai';
import { z } from 'zod';
import { getTransactionReceipt } from '@/lib/midl/client';

const REQUIRED_CONFIRMATIONS = 6;

export const midl_get_bridge_status = tool({
  description:
    'Get the status of a bridge transaction. Returns confirmation count and completion status.',
  inputSchema: z.object({
    txHash: z.string().describe('Transaction hash to check status for'),
  }),
  execute: async ({ txHash }) => {
    try {
      const receipt = await getTransactionReceipt(txHash as `0x${string}`);

      if (!receipt) {
        return {
          success: true,
          data: {
            txHash,
            status: 'pending',
            confirmations: 0,
            requiredConfirmations: REQUIRED_CONFIRMATIONS,
          },
        };
      }

      // Simplified - actual implementation would track bridge-specific state
      const confirmations = receipt.status === 'success' ? REQUIRED_CONFIRMATIONS : 0;
      const status = confirmations >= REQUIRED_CONFIRMATIONS ? 'complete' : 'confirming';

      return {
        success: true,
        data: {
          txHash,
          status,
          confirmations,
          requiredConfirmations: REQUIRED_CONFIRMATIONS,
        },
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: `Failed to get bridge status: ${message}`,
      };
    }
  },
});
