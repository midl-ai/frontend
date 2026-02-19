import { tool } from 'ai';
import { z } from 'zod';
import { getFeeEstimates } from '@/lib/midl/mempool';

export const midl_get_fee_rate = tool({
  description:
    'Get current Bitcoin fee rate estimates. Returns recommended fees for different confirmation targets.',
  inputSchema: z.object({}),
  execute: async () => {
    try {
      const fees = await getFeeEstimates();

      return {
        success: true,
        data: {
          fastestFee: fees.fastest,
          halfHourFee: fees.halfHour,
          hourFee: fees.hour,
          economyFee: fees.economy,
          minimumFee: fees.minimum,
          unit: 'sat/vB',
        },
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: `Failed to get fee rates: ${message}`,
      };
    }
  },
});
