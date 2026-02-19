import { tool } from 'ai';
import { z } from 'zod';
import { getNetworkConfig } from '@/lib/midl/config';

export const midl_write_contract = tool({
  description:
    'Write to a smart contract. Requires wallet signing. This action modifies blockchain state.',
  inputSchema: z.object({
    address: z.string().describe('Contract address'),
    abi: z.string().describe('Contract ABI as JSON string'),
    functionName: z.string().describe('Function name to call'),
    args: z
      .array(z.string())
      .optional()
      .describe('Function arguments as strings'),
    value: z
      .string()
      .optional()
      .describe('Value to send in wei (for payable functions)'),
  }),
  execute: async ({ address, functionName }) => {
    // Note: Write operations require wallet integration
    // This returns a placeholder that the frontend will handle
    const config = getNetworkConfig();

    return {
      success: false,
      error:
        'Contract write operations require wallet signing. Please connect your wallet and try again.',
      data: {
        contractAddress: address,
        functionName,
        explorerUrl: `${config.explorerUrl}/address/${address}`,
        requiresWallet: true,
      },
    };
  },
});
