import { tool } from 'ai';
import { z } from 'zod';
import { getUtxos } from '@/lib/midl/mempool';
import { SATOSHIS_PER_BTC } from '@/lib/midl/config';

export const midl_get_utxos = tool({
  description:
    'Get unspent transaction outputs (UTXOs) for a Bitcoin address. Returns list of UTXOs with values.',
  inputSchema: z.object({
    address: z
      .string()
      .optional()
      .describe('Bitcoin address to get UTXOs for. If not provided, uses connected wallet.'),
  }),
  execute: async ({ address }) => {
    try {
      if (!address) {
        return {
          success: false,
          error: 'No address provided and no wallet connected',
        };
      }

      const utxos = await getUtxos(address);

      const totalValue = utxos.reduce((sum, utxo) => sum + utxo.value, 0);

      return {
        success: true,
        data: {
          address,
          utxos: utxos.map((utxo) => ({
            txid: utxo.txid,
            vout: utxo.vout,
            value: utxo.value,
            confirmed: utxo.status.confirmed,
            blockHeight: utxo.status.block_height,
          })),
          count: utxos.length,
          totalValue,
          totalBtc: (totalValue / SATOSHIS_PER_BTC).toFixed(8),
        },
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: `Failed to get UTXOs: ${message}`,
      };
    }
  },
});
