/**
 * MIDL AI Tools - Export all 28 tools for AI SDK v6
 * Tools are grouped by category for organization
 */

import { type ToolSet } from 'ai';

// Network tools (3)
import { midl_get_network_info } from './network/get-network-info';
import { midl_get_block } from './network/get-block';
import { midl_get_system_contracts } from './network/get-system-contracts';

// Balance tools (3)
import { midl_get_evm_balance } from './balance/get-evm-balance';
import { midl_get_btc_balance } from './balance/get-btc-balance';
import { midl_get_token_balance } from './balance/get-token-balance';

// Bitcoin tools (4)
import { midl_get_utxos } from './bitcoin/get-utxos';
import { midl_get_transaction } from './bitcoin/get-transaction';
import { midl_get_transaction_receipt } from './bitcoin/get-transaction-receipt';
import { midl_get_fee_rate } from './bitcoin/get-fee-rate';

// Contract tools (3)
import { midl_read_contract } from './contract/read-contract';
import { midl_get_logs } from './contract/get-logs';
import { midl_verify_contract } from './contract/verify-contract';

// Transfer tools (3)
import { midl_transfer_evm } from './transfer/transfer-evm';
import { midl_transfer_token } from './transfer/transfer-token';
import { midl_send_raw_transaction } from './transfer/send-raw-transaction';

// Bridge tools (3)
import { midl_bridge_btc_to_evm } from './bridge/bridge-btc-to-evm';
import { midl_bridge_evm_to_btc } from './bridge/bridge-evm-to-btc';
import { midl_get_bridge_status } from './bridge/get-bridge-status';

// Runes tools (5)
import { midl_get_runes } from './runes/get-runes';
import { midl_get_rune_balance } from './runes/get-rune-balance';
import { midl_transfer_rune } from './runes/transfer-rune';
import { midl_bridge_rune_to_erc20 } from './runes/bridge-rune-to-erc20';
import { midl_bridge_erc20_to_rune } from './runes/bridge-erc20-to-rune';

// Deploy tools (1)
import { midl_deploy_contract } from './deploy/deploy-contract';

// Utility tools (3)
import { midl_estimate_gas } from './utility/estimate-gas';
import { midl_convert_btc_to_evm } from './utility/convert-btc-to-evm';
import { midl_get_rune_erc20_address } from './utility/get-rune-erc20-address';

// Re-export individual tools
export {
  // Network
  midl_get_network_info,
  midl_get_block,
  midl_get_system_contracts,
  // Balance
  midl_get_evm_balance,
  midl_get_btc_balance,
  midl_get_token_balance,
  // Bitcoin
  midl_get_utxos,
  midl_get_transaction,
  midl_get_transaction_receipt,
  midl_get_fee_rate,
  // Contract
  midl_read_contract,
  midl_get_logs,
  midl_verify_contract,
  // Transfer
  midl_transfer_evm,
  midl_transfer_token,
  midl_send_raw_transaction,
  // Bridge
  midl_bridge_btc_to_evm,
  midl_bridge_evm_to_btc,
  midl_get_bridge_status,
  // Runes
  midl_get_runes,
  midl_get_rune_balance,
  midl_transfer_rune,
  midl_bridge_rune_to_erc20,
  midl_bridge_erc20_to_rune,
  // Deploy
  midl_deploy_contract,
  // Utility
  midl_estimate_gas,
  midl_convert_btc_to_evm,
  midl_get_rune_erc20_address,
};

/** Combined tools object for use with streamText (29 tools total) */
export const midlTools = {
  // Network (3)
  midl_get_network_info,
  midl_get_block,
  midl_get_system_contracts,
  // Balance (3)
  midl_get_evm_balance,
  midl_get_btc_balance,
  midl_get_token_balance,
  // Bitcoin (4)
  midl_get_utxos,
  midl_get_transaction,
  midl_get_transaction_receipt,
  midl_get_fee_rate,
  // Contract (3)
  midl_read_contract,
  midl_get_logs,
  midl_verify_contract,
  // Transfer (3)
  midl_transfer_evm,
  midl_transfer_token,
  midl_send_raw_transaction,
  // Bridge (3)
  midl_bridge_btc_to_evm,
  midl_bridge_evm_to_btc,
  midl_get_bridge_status,
  // Runes (5)
  midl_get_runes,
  midl_get_rune_balance,
  midl_transfer_rune,
  midl_bridge_rune_to_erc20,
  midl_bridge_erc20_to_rune,
  // Deploy (1)
  midl_deploy_contract,
  // Utility (3)
  midl_estimate_gas,
  midl_convert_btc_to_evm,
  midl_get_rune_erc20_address,
} satisfies ToolSet;

/** Get tools as ToolSet for streamText */
export function getMidlTools(): ToolSet {
  return midlTools;
}

/** Tool count for reference */
export const TOOL_COUNT = 28;
