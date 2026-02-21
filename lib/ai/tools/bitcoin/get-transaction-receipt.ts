import { tool } from 'ai';
import { z } from 'zod';
import { getTransactionReceipt } from '@/lib/midl/client';
import { getNetworkConfig } from '@/lib/midl/constants';

export const midl_get_transaction_receipt = tool({
  description:
    'Get EVM transaction receipt by hash. Returns status, gas used, and logs.',
  inputSchema: z.object({
    txHash: z.string().describe('EVM transaction hash (0x prefixed, 66 characters)'),
  }),
  execute: async ({ txHash }) => {
    try {
      const config = getNetworkConfig();
      const receipt = await getTransactionReceipt(txHash as `0x${string}`);

      if (!receipt) {
        return {
          success: false,
          error: 'Transaction not found or not yet mined',
        };
      }

      return {
        success: true,
        data: {
          txHash: receipt.transactionHash,
          blockNumber: Number(receipt.blockNumber),
          status: receipt.status === 'success' ? 'success' : 'reverted',
          gasUsed: receipt.gasUsed.toString(),
          from: receipt.from,
          to: receipt.to || '',
          logsCount: receipt.logs.length,
          explorerUrl: `${config.explorerUrl}/tx/${txHash}`,
        },
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: `Failed to get transaction receipt: ${message}`,
      };
    }
  },
});
