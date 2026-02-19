/**
 * MIDL AI Tools - Export all tools for AI SDK v6
 * Tools are grouped by category for organization
 */

import { type ToolSet } from 'ai';
import { midl_get_evm_balance } from './balance/get-evm-balance';
import { midl_get_btc_balance } from './balance/get-btc-balance';
import { midl_get_network_info } from './network/get-network-info';
import { midl_get_block } from './network/get-block';

// Re-export individual tools for direct use
export {
  midl_get_evm_balance,
  midl_get_btc_balance,
  midl_get_network_info,
  midl_get_block,
};

/** Combined tools object for use with streamText */
export const midlTools = {
  midl_get_evm_balance,
  midl_get_btc_balance,
  midl_get_network_info,
  midl_get_block,
} satisfies ToolSet;

/** Get tools as ToolSet for streamText */
export function getMidlTools(): ToolSet {
  return midlTools;
}
