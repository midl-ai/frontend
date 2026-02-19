import { tool } from 'ai';
import { z } from 'zod';
import { readContract } from '@/lib/midl/client';

export const midl_read_contract = tool({
  description:
    'Read data from a smart contract. Call view/pure functions without gas.',
  inputSchema: z.object({
    address: z.string().describe('Contract address'),
    abi: z
      .string()
      .describe('Contract ABI as JSON string or array'),
    functionName: z.string().describe('Function name to call'),
    args: z
      .array(z.string())
      .optional()
      .describe('Function arguments as strings'),
  }),
  execute: async ({ address, abi, functionName, args }) => {
    try {
      // Parse ABI if it's a string
      let parsedAbi: readonly unknown[];
      try {
        parsedAbi = typeof abi === 'string' ? JSON.parse(abi) : abi;
      } catch {
        return {
          success: false,
          error: 'Invalid ABI format. Must be valid JSON.',
        };
      }

      const result: unknown = await readContract({
        address: address as `0x${string}`,
        abi: parsedAbi,
        functionName,
        args: args || [],
      });

      // Handle BigInt serialization
      let serializedResult: unknown = result;
      if (typeof result === 'bigint') {
        serializedResult = (result as bigint).toString();
      }

      return {
        success: true,
        data: {
          contractAddress: address,
          functionName,
          result: serializedResult,
        },
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: `Contract read failed: ${message}`,
      };
    }
  },
});
