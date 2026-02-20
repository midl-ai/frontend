import { tool } from 'ai';
import { z } from 'zod';
import { readContract } from '@/lib/midl/client';

/** Minimal ERC20 ABI for balance and metadata */
const ERC20_ABI = [
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export const midl_get_token_balance = tool({
  description:
    'Get ERC20 token balance for an address. Returns balance with token metadata.',
  inputSchema: z.object({
    tokenAddress: z.string().describe('ERC20 token contract address'),
    ownerAddress: z
      .string()
      .optional()
      .describe('Address to check balance for. If not provided, uses connected wallet.'),
  }),
  execute: async ({ tokenAddress, ownerAddress }) => {
    try {
      if (!ownerAddress) {
        return {
          success: false,
          error: 'No owner address provided and no wallet connected',
        };
      }

      const token = tokenAddress as `0x${string}`;
      const owner = ownerAddress as `0x${string}`;

      // Fetch token metadata and balance in parallel
      const [balance, symbol, name, decimals] = await Promise.all([
        readContract({
          address: token,
          abi: ERC20_ABI,
          functionName: 'balanceOf',
          args: [owner],
        }),
        readContract({ address: token, abi: ERC20_ABI, functionName: 'symbol' }),
        readContract({ address: token, abi: ERC20_ABI, functionName: 'name' }),
        readContract({ address: token, abi: ERC20_ABI, functionName: 'decimals' }),
      ]);

      const balanceBigInt = balance as bigint;
      const decimalNum = Number(decimals);
      const formatted = Number(balanceBigInt) / Math.pow(10, decimalNum);

      return {
        success: true,
        data: {
          tokenAddress,
          ownerAddress,
          balance: balanceBigInt.toString(),
          balanceFormatted: `${formatted.toLocaleString()} ${symbol}`,
          decimals: decimalNum,
          symbol: symbol as string,
          name: name as string,
        },
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: `Failed to get token balance: ${message}`,
      };
    }
  },
});
