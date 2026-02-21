import { tool } from 'ai';
import { z } from 'zod';
import { getTransaction } from '@/lib/midl/mempool';
import { getNetworkConfig, SATOSHIS_PER_BTC } from '@/lib/midl/constants';

interface BtcTransaction {
  txid: string;
  fee: number;
  size: number;
  status: {
    confirmed: boolean;
    block_height?: number;
    block_time?: number;
  };
  vin: Array<{ txid: string; vout: number; prevout?: { value: number } }>;
  vout: Array<{ value: number; scriptpubkey_address?: string }>;
}

export const midl_get_transaction = tool({
  description:
    'Get details of a Bitcoin transaction by its txid. Returns inputs, outputs, fee, and confirmation status.',
  inputSchema: z.object({
    txid: z.string().describe('Bitcoin transaction ID (64 hex characters)'),
  }),
  execute: async ({ txid }) => {
    try {
      const config = getNetworkConfig();
      const tx = (await getTransaction(txid)) as BtcTransaction;

      const inputs = tx.vin.map((input) => ({
        txid: input.txid,
        vout: input.vout,
        value: input.prevout?.value || 0,
      }));

      const outputs = tx.vout.map((output) => ({
        value: output.value,
        address: output.scriptpubkey_address,
      }));

      return {
        success: true,
        data: {
          txid: tx.txid,
          fee: tx.fee,
          feeBtc: (tx.fee / SATOSHIS_PER_BTC).toFixed(8),
          size: tx.size,
          confirmed: tx.status.confirmed,
          blockHeight: tx.status.block_height,
          blockTime: tx.status.block_time,
          inputs,
          outputs,
          explorerUrl: `${config.mempoolUrl}/tx/${txid}`,
        },
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: `Failed to get transaction: ${message}`,
      };
    }
  },
});
