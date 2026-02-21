import { tool } from 'ai';
import { z } from 'zod';
import { readContract } from '@/lib/midl/client';
import { getNetworkConfig } from '@/lib/midl/config';

/** ERC20 ABI - standard token interface */
const ERC20_ABI = [
  { type: 'function', name: 'name', inputs: [], outputs: [{ type: 'string' }], stateMutability: 'view' },
  { type: 'function', name: 'symbol', inputs: [], outputs: [{ type: 'string' }], stateMutability: 'view' },
  { type: 'function', name: 'decimals', inputs: [], outputs: [{ type: 'uint8' }], stateMutability: 'view' },
  { type: 'function', name: 'totalSupply', inputs: [], outputs: [{ type: 'uint256' }], stateMutability: 'view' },
  { type: 'function', name: 'balanceOf', inputs: [{ name: 'account', type: 'address' }], outputs: [{ type: 'uint256' }], stateMutability: 'view' },
] as const;

/** Counter ABI - simple counter contract */
const COUNTER_ABI = [
  { type: 'function', name: 'getCount', inputs: [], outputs: [{ type: 'uint256' }], stateMutability: 'view' },
] as const;

/** Map contract type to ABI */
const CONTRACT_ABIS = {
  erc20: ERC20_ABI,
  counter: COUNTER_ABI,
} as const;

/** Valid functions per contract type */
const VALID_FUNCTIONS = {
  erc20: ['name', 'symbol', 'decimals', 'totalSupply', 'balanceOf'],
  counter: ['getCount'],
} as const;

export const midl_read_contract = tool({
  description: `Read data from a smart contract. Supports two contract types:
- erc20: Read token info (name, symbol, decimals, totalSupply, balanceOf)
- counter: Read counter value (getCount)
Note: balanceOf requires an address argument.`,
  inputSchema: z.object({
    contractType: z.enum(['erc20', 'counter']).describe('Type of contract to read'),
    address: z.string().describe('Contract address'),
    functionName: z.string().describe('Function to call: name, symbol, decimals, totalSupply, balanceOf (erc20) or getCount (counter)'),
    args: z.array(z.string()).optional().describe('Function arguments (e.g., address for balanceOf)'),
  }),
  execute: async ({ contractType, address, functionName, args }) => {
    const config = getNetworkConfig();

    // Validate function name for contract type
    const validFunctions = VALID_FUNCTIONS[contractType];
    if (!validFunctions.includes(functionName as never)) {
      return {
        success: false,
        error: `Invalid function '${functionName}' for ${contractType}. Valid functions: ${validFunctions.join(', ')}`,
      };
    }

    // Validate balanceOf requires address argument
    if (functionName === 'balanceOf' && (!args || args.length === 0)) {
      return {
        success: false,
        error: 'balanceOf requires an address argument',
      };
    }

    try {
      const abi = CONTRACT_ABIS[contractType];
      const result: unknown = await readContract({
        address: address as `0x${string}`,
        abi,
        functionName,
        args: args || [],
      });

      // Format result based on type
      let formattedResult: string | number;
      if (typeof result === 'bigint') {
        formattedResult = result.toString();
      } else {
        formattedResult = result as string | number;
      }

      return {
        success: true,
        data: {
          contractType,
          contractAddress: address,
          functionName,
          result: formattedResult,
          explorerUrl: `${config.explorerUrl}/address/${address}`,
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
