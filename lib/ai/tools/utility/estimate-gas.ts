import { tool } from 'ai';
import { z } from 'zod';
import { estimateGas, getPublicClient } from '@/lib/midl/client';
import { WEI_PER_BTC } from '@/lib/midl/constants';

export const midl_estimate_gas = tool({
  description:
    'Estimate gas for a transaction. Returns gas limit and estimated cost.',
  inputSchema: z.object({
    to: z.string().describe('Destination address'),
    data: z.string().optional().describe('Transaction data (hex encoded)'),
    value: z.string().optional().describe('Value to send in wei'),
  }),
  execute: async ({ to, data, value }) => {
    try {
      const client = getPublicClient();

      const gasEstimate = await estimateGas({
        to: to as `0x${string}`,
        data: data as `0x${string}` | undefined,
        value: value ? BigInt(value) : undefined,
      });

      const gasPrice = await client.getGasPrice();
      const estimatedCost = gasEstimate * gasPrice;
      const costBtc = Number(estimatedCost) / Number(WEI_PER_BTC);

      return {
        success: true,
        data: {
          gasEstimate: gasEstimate.toString(),
          gasPriceGwei: (Number(gasPrice) / 1e9).toFixed(2),
          estimatedCostWei: estimatedCost.toString(),
          estimatedCostBtc: costBtc.toFixed(8),
        },
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: `Gas estimation failed: ${message}`,
      };
    }
  },
});
