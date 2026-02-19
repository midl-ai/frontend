import { tool } from 'ai';
import { z } from 'zod';
import { getPublicClient } from '@/lib/midl/client';

export const midl_get_logs = tool({
  description:
    'Get event logs from a smart contract. Filter by event name or block range.',
  inputSchema: z.object({
    address: z.string().describe('Contract address'),
    event: z.string().optional().describe('Event name to filter (optional)'),
    fromBlock: z
      .number()
      .optional()
      .describe('Starting block number (default: latest - 1000)'),
    toBlock: z
      .number()
      .optional()
      .describe('Ending block number (default: latest)'),
  }),
  execute: async ({ address, fromBlock, toBlock }) => {
    try {
      const client = getPublicClient();
      const latestBlock = await client.getBlockNumber();

      const from = fromBlock ? BigInt(fromBlock) : latestBlock - BigInt(1000);
      const to = toBlock ? BigInt(toBlock) : latestBlock;

      const logs = await client.getLogs({
        address: address as `0x${string}`,
        fromBlock: from,
        toBlock: to,
      });

      return {
        success: true,
        data: {
          contractAddress: address,
          logs: logs.slice(0, 50).map((log) => ({
            blockNumber: Number(log.blockNumber),
            txHash: log.transactionHash,
            logIndex: log.logIndex,
            topics: log.topics,
            data: log.data,
          })),
          count: logs.length,
          fromBlock: Number(from),
          toBlock: Number(to),
        },
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: `Failed to get logs: ${message}`,
      };
    }
  },
});
