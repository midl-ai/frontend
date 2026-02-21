import { tool } from 'ai';
import { z } from 'zod';
import { getBlock } from '@/lib/midl/client';
import { getNetworkConfig } from '@/lib/midl/constants';

export const midl_get_block = tool({
  description: 'Get block information by number or "latest" for the most recent block.',
  inputSchema: z.object({
    blockNumber: z
      .union([z.number().int().nonnegative(), z.literal('latest')])
      .default('latest')
      .describe('Block number or "latest" for most recent block'),
  }),
  execute: async ({ blockNumber }) => {
    try {
      const config = getNetworkConfig();
      const block = await getBlock(blockNumber);

      if (!block) {
        return {
          success: false,
          error: `Block not found: ${blockNumber}`,
        };
      }

      return {
        success: true,
        data: {
          number: Number(block.number),
          hash: block.hash,
          timestamp: Number(block.timestamp),
          timestampFormatted: new Date(Number(block.timestamp) * 1000).toISOString(),
          transactionCount: block.transactions.length,
          gasUsed: block.gasUsed.toString(),
          gasLimit: block.gasLimit.toString(),
          baseFeePerGas: block.baseFeePerGas?.toString() ?? null,
          parentHash: block.parentHash,
          explorerUrl: `${config.explorerUrl}/block/${block.number}`,
        },
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: `Failed to get block: ${message}`,
      };
    }
  },
});
