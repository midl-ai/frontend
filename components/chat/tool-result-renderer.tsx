'use client';

import type { ToolResponse } from '@/lib/ai/tools/types';
import {
  // Network
  NetworkInfoCard,
  BlockInfoCard,
  SystemContractsCard,
  // Balance
  EVMBalanceCard,
  BTCBalanceCard,
  TokenBalanceCard,
  // Bitcoin
  UTXOsCard,
  BtcTransactionCard,
  TxReceiptCard,
  FeeRateCard,
  // Transfer
  EVMTransferCard,
  TokenTransferCard,
  RawTxCard,
  // Bridge
  BridgeDepositCard,
  BridgeWithdrawCard,
  BridgeStatusCard,
  // Runes
  RunesListCard,
  RuneBalanceCard,
  RuneTransferCard,
  RuneBridgeCard,
  ERC20ToRuneCard,
  // Contract
  ContractReadCard,
  ContractWriteCard,
  ContractLogsCard,
  VerifyContractCard,
  DeploymentCard,
  // Utility
  AddressConvertCard,
  RuneERC20Card,
  GasEstimateCard,
  // Base
  ErrorCard,
} from '@/components/midl';

interface ToolResultRendererProps {
  toolName: string;
  result: unknown;
}

/** Maps tool names to their corresponding card components */
export function ToolResultRenderer({ toolName, result }: ToolResultRendererProps) {
  // Handle null/undefined result (e.g., when loading from history with missing output)
  if (result === null || result === undefined) {
    return (
      <ErrorCard
        error="Tool result not available. This may happen when loading from history."
        toolName={toolName}
      />
    );
  }

  // Cast result to ToolResponse for type safety
  const data = result as ToolResponse<unknown>;

  // Route to appropriate card based on tool name
  switch (toolName) {
    // Network tools
    case 'midl_get_network_info':
      return <NetworkInfoCard data={data as ToolResponse<never>} />;
    case 'midl_get_block':
      return <BlockInfoCard data={data as ToolResponse<never>} />;
    case 'midl_get_system_contracts':
      return <SystemContractsCard data={data as ToolResponse<never>} />;

    // Balance tools
    case 'midl_get_evm_balance':
      return <EVMBalanceCard data={data as ToolResponse<never>} />;
    case 'midl_get_btc_balance':
      return <BTCBalanceCard data={data as ToolResponse<never>} />;
    case 'midl_get_token_balance':
      return <TokenBalanceCard data={data as ToolResponse<never>} />;

    // Bitcoin tools
    case 'midl_get_utxos':
      return <UTXOsCard data={data as ToolResponse<never>} />;
    case 'midl_get_transaction':
      return <BtcTransactionCard data={data as ToolResponse<never>} />;
    case 'midl_get_transaction_receipt':
      return <TxReceiptCard data={data as ToolResponse<never>} />;
    case 'midl_get_fee_rate':
      return <FeeRateCard data={data as ToolResponse<never>} />;

    // Transfer tools
    case 'midl_transfer_evm':
      return <EVMTransferCard data={data as ToolResponse<never>} />;
    case 'midl_transfer_token':
      return <TokenTransferCard data={data as ToolResponse<never>} />;
    case 'midl_send_raw_transaction':
      return <RawTxCard data={data as ToolResponse<never>} />;

    // Bridge tools
    case 'midl_bridge_btc_to_evm':
      return <BridgeDepositCard data={data as ToolResponse<never>} />;
    case 'midl_bridge_evm_to_btc':
      return <BridgeWithdrawCard data={data as ToolResponse<never>} />;
    case 'midl_get_bridge_status':
      return <BridgeStatusCard data={data as ToolResponse<never>} />;

    // Runes tools
    case 'midl_get_runes':
      return <RunesListCard data={data as ToolResponse<never>} />;
    case 'midl_get_rune_balance':
      return <RuneBalanceCard data={data as ToolResponse<never>} />;
    case 'midl_transfer_rune':
      return <RuneTransferCard data={data as ToolResponse<never>} />;
    case 'midl_bridge_rune_to_erc20':
      return <RuneBridgeCard data={data as ToolResponse<never>} />;
    case 'midl_bridge_erc20_to_rune':
      return <ERC20ToRuneCard data={data as ToolResponse<never>} />;

    // Contract tools
    case 'midl_read_contract':
      return <ContractReadCard data={data as ToolResponse<never>} />;
    case 'midl_write_contract':
      return <ContractWriteCard data={data as ToolResponse<never>} />;
    case 'midl_get_logs':
      return <ContractLogsCard data={data as ToolResponse<never>} />;
    case 'midl_verify_contract':
      return <VerifyContractCard data={data as ToolResponse<never>} />;
    case 'midl_deploy_contract':
      return <DeploymentCard data={data as ToolResponse<never>} />;

    // Utility tools
    case 'midl_convert_btc_to_evm':
      return <AddressConvertCard data={data as ToolResponse<never>} />;
    case 'midl_get_rune_erc20_address':
      return <RuneERC20Card data={data as ToolResponse<never>} />;
    case 'midl_estimate_gas':
      return <GasEstimateCard data={data as ToolResponse<never>} />;

    // Unknown tool - show error
    default:
      return (
        <ErrorCard
          error={`Unknown tool: ${toolName}`}
          toolName={toolName}
        />
      );
  }
}
