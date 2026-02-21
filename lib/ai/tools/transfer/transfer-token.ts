import { tool } from 'ai';
import { z } from 'zod';
import { getNetworkConfig } from '@/lib/midl/config';
import type { TokenTransferTransaction } from '../types';

const DEFAULT_DECIMALS = 18;

export const midl_transfer_token = tool({
  description:
    'Transfer ERC20 tokens to another address. Returns prepared transaction for wallet signing.',
  inputSchema: z.object({
    tokenAddress: z.string().describe('ERC20 token contract address'),
    to: z.string().describe('Destination address'),
    amount: z.string().describe('Amount to send (in token units)'),
    decimals: z.number().optional().describe('Token decimals (default: 18)'),
    symbol: z.string().optional().describe('Token symbol for display'),
  }),
  execute: async ({ tokenAddress, to, amount, decimals = DEFAULT_DECIMALS, symbol }) => {
    const config = getNetworkConfig();

    // Convert to raw amount (smallest unit)
    const amountRaw = (parseFloat(amount) * Math.pow(10, decimals)).toString();

    const transaction: TokenTransferTransaction = {
      type: 'token_transfer',
      tokenAddress,
      to,
      amount,
      amountRaw,
      decimals,
      symbol,
      explorerUrl: `${config.explorerUrl}/token/${tokenAddress}`,
    };

    console.log('[transfer-token] Returning transaction:', transaction);

    return {
      success: true,
      data: {
        transaction,
      },
    };
  },
});
