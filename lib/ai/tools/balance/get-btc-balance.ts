import { tool } from 'ai';
import { z } from 'zod';
import { getBtcBalance, getUtxos } from '@/lib/midl/mempool';
import { getNetworkConfig, SATOSHIS_PER_BTC } from '@/lib/midl/config';

export const midl_get_btc_balance = tool({
  description: 'Get the BTC balance on the Bitcoin layer for an address. Returns confirmed and unconfirmed balance.',
  inputSchema: z.object({
    address: z
      .string()
      .optional()
      .describe('Bitcoin address to check. If not provided, uses connected wallet address.'),
  }),
  execute: async ({ address }) => {
    try {
      if (!address) {
        return {
          success: false,
          error: 'No address provided and no wallet connected',
        };
      }

      const config = getNetworkConfig();
      const [balance, utxos] = await Promise.all([
        getBtcBalance(address),
        getUtxos(address),
      ]);

      const btcAmount = balance.total / SATOSHIS_PER_BTC;

      return {
        success: true,
        data: {
          address,
          balance: balance.total.toString(),
          balanceFormatted: `${btcAmount.toFixed(8)} BTC`,
          confirmedBalance: balance.confirmed.toString(),
          unconfirmedBalance: balance.unconfirmed.toString(),
          utxoCount: utxos.length,
          explorerUrl: `${config.mempoolUrl}/address/${address}`,
        },
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: `Failed to get BTC balance: ${message}`,
      };
    }
  },
});
