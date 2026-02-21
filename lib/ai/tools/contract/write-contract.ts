import { tool } from 'ai';
import { z } from 'zod';
import { getNetworkConfig } from '@/lib/midl/config';
import type { ContractWriteTransaction } from '../types';

export const midl_write_contract = tool({
  description:
    'Write to a smart contract. Returns prepared transaction for wallet signing. Modifies blockchain state.',
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
  execute: async ({ address, abi, functionName, args, value }) => {
    const config = getNetworkConfig();

    const transaction: ContractWriteTransaction = {
      type: 'contract_write',
      contractAddress: address,
      abi,
      functionName,
      args,
      value,
      explorerUrl: `${config.explorerUrl}/address/${address}`,
    };

    return {
      success: true,
      transaction,
    };
  },
});
