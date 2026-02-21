import { tool } from 'ai';
import { z } from 'zod';
import { getNetworkConfig, WEI_PER_BTC } from '@/lib/midl/config';
import type { EVMTransferTransaction } from '../types';

export const midl_transfer_evm = tool({
  description:
    'Transfer BTC on the EVM layer to another address. Returns prepared transaction for wallet signing.',
  inputSchema: z.object({
    to: z.string().describe('Destination EVM address'),
    amount: z.string().describe('Amount to send (in BTC or wei)'),
    unit: z
      .enum(['btc', 'wei'])
      .optional()
      .describe('Unit of amount (default: btc)'),
  }),
  execute: async ({ to, amount, unit = 'btc' }) => {
    const config = getNetworkConfig();

    // Convert to wei if needed
    let amountWei: string;
    let displayAmount: string;
    if (unit === 'btc') {
      amountWei = (parseFloat(amount) * Number(WEI_PER_BTC)).toString();
      displayAmount = `${amount} BTC`;
    } else {
      amountWei = amount;
      displayAmount = `${(parseFloat(amount) / Number(WEI_PER_BTC)).toFixed(8)} BTC`;
    }

    const transaction: EVMTransferTransaction = {
      type: 'evm_transfer',
      to,
      amount: displayAmount,
      amountWei,
      explorerUrl: config.explorerUrl,
      mempoolUrl: config.mempoolUrl,
    };

    console.log('[transfer-evm] Returning transaction:', transaction);

    return {
      success: true,
      data: {
        transaction,
      },
    };
  },
});
