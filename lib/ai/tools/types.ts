/**
 * Tool result types for MIDL frontend
 * Mirrors the MCP server result types
 */

/** Standard tool response wrapper */
export interface ToolResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/** Balance response */
export interface BalanceInfo {
  address: string;
  balance: string;
  balanceFormatted: string;
  explorerUrl: string;
}

/** BTC balance info */
export interface BtcBalanceInfo {
  address: string;
  balance: string;
  balanceFormatted: string;
  confirmedBalance: string;
  unconfirmedBalance: string;
  utxoCount: number;
  explorerUrl: string;
}

/** Network info */
export interface NetworkInfo {
  chainId: number;
  chainName: string;
  rpcUrl: string;
  explorerUrl: string;
  mempoolUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

/** Block info */
export interface BlockInfo {
  number: number;
  hash: string;
  timestamp: number;
  timestampFormatted: string;
  transactionCount: number;
  gasUsed: string;
  gasLimit: string;
  baseFeePerGas: string | null;
  parentHash: string;
  explorerUrl: string;
}

/** Token balance */
export interface TokenBalanceInfo {
  tokenAddress: string;
  ownerAddress: string;
  balance: string;
  balanceFormatted: string;
  decimals: number;
  symbol: string;
  name: string;
}

/** System contracts */
export interface SystemContractsInfo {
  gateway: string;
  intentFactory: string;
  rpcUrl: string;
  explorerUrl: string;
  contracts: Array<{
    name: string;
    address: string;
    description: string;
  }>;
}

/** Fee rate result */
export interface FeeRateInfo {
  fastestFee: number;
  halfHourFee: number;
  hourFee: number;
  economyFee: number;
  minimumFee: number;
}

/** UTXO result */
export interface UtxosInfo {
  address: string;
  utxos: Array<{
    txid: string;
    vout: number;
    value: number;
    confirmed: boolean;
    blockHeight?: number;
  }>;
  count: number;
  totalValue: number;
}

/** Bitcoin transaction */
export interface BtcTxInfo {
  txid: string;
  fee: number;
  size: number;
  confirmed: boolean;
  blockHeight?: number;
  blockTime?: number;
  inputs: Array<{ txid: string; vout: number; value: number }>;
  outputs: Array<{ value: number; address?: string }>;
  explorerUrl: string;
}

/** EVM transaction receipt */
export interface TxReceiptInfo {
  txHash: string;
  blockNumber: number;
  status: 'success' | 'reverted';
  gasUsed: string;
  from: string;
  to: string;
  logsCount: number;
  explorerUrl: string;
}

/** Contract read result */
export interface ReadContractInfo {
  contractAddress: string;
  functionName: string;
  result: unknown;
}

/** Contract write result */
export interface WriteContractInfo {
  txHash: string;
  blockNumber: number;
  gasUsed: string;
  contractAddress: string;
  functionName: string;
  explorerUrl: string;
}

/** Contract logs */
export interface ContractLogsInfo {
  contractAddress: string;
  logs: Array<{
    blockNumber: number;
    txHash: string;
    logIndex: number;
    topics: string[];
    data: string;
  }>;
  count: number;
}

/** Deploy result */
export interface DeployInfo {
  contractAddress: string;
  txHash: string;
  blockNumber: number;
  gasUsed: string;
  explorerUrl: string;
  btcTxId?: string;
  btcExplorerUrl?: string;
}

/** Transfer result */
export interface TransferInfo {
  txHash: string;
  from: string;
  to: string;
  amount: string;
  explorerUrl: string;
}

/** Bridge BTC to EVM result */
export interface BridgeBtcToEvmInfo {
  btcTxId: string;
  satoshis: string;
  btcAmount: string;
  explorerUrl: string;
  status: string;
}

/** Bridge EVM to BTC result */
export interface BridgeEvmToBtcInfo {
  btcTxId: string;
  satoshis: string;
  btcAmount: string;
  btcAddress: string;
  explorerUrl: string;
  status: string;
}

/** Bridge status */
export interface BridgeStatusInfo {
  txHash: string;
  status: string;
  confirmations: number;
  requiredConfirmations: number;
}

/** Rune list */
export interface RunesListInfo {
  address: string;
  total: number;
  runes: Array<{
    id: string;
    name: string;
    spacedName: string;
    balance: string;
  }>;
}

/** Rune balance */
export interface RuneBalanceInfo {
  runeId: string;
  name: string;
  balance: string;
  address: string;
}

/** Rune transfer */
export interface RuneTransferInfo {
  txId: string;
  runeId: string;
  amount: string;
  toAddress: string;
  explorerUrl: string;
}

/** Rune bridge result */
export interface RuneBridgeInfo {
  btcTxId: string;
  runeId: string;
  amount: string;
  erc20Address?: string;
  explorerUrl: string;
  status: string;
}

/** Address conversion */
export interface AddressConvertInfo {
  btcAddress: string;
  evmAddress: string;
}

/** Rune ERC20 address */
export interface RuneErc20Info {
  runeId: string;
  erc20Address: string;
  explorerUrl: string;
}

/** Gas estimate */
export interface GasEstimateInfo {
  gasEstimate: string;
  gasPriceGwei: string;
  estimatedCostWei: string;
  estimatedCostBtc: string;
}

/** Verify contract */
export interface VerifyContractInfo {
  address: string;
  verified: boolean;
  explorerUrl: string;
  message: string;
}

// ============================================
// Transaction Types (for client-side signing)
// ============================================

/** Base transaction type */
interface BaseTransaction {
  /** EVM explorer URL (Blockscout) */
  explorerUrl: string;
  /** BTC explorer URL (Mempool) */
  mempoolUrl: string;
}

/** EVM transfer transaction */
export interface EVMTransferTransaction extends BaseTransaction {
  type: 'evm_transfer';
  to: string;
  amount: string;
  amountWei: string;
}

/** Token transfer transaction */
export interface TokenTransferTransaction extends BaseTransaction {
  type: 'token_transfer';
  tokenAddress: string;
  to: string;
  amount: string;
  amountRaw: string;
  decimals: number;
  symbol?: string;
}

/** Bridge deposit (BTC → EVM) transaction */
export interface BridgeDepositTransaction extends BaseTransaction {
  type: 'bridge_deposit';
  satoshis: string;
  btcAmount: string;
}

/** Bridge withdraw (EVM → BTC) transaction */
export interface BridgeWithdrawTransaction extends BaseTransaction {
  type: 'bridge_withdraw';
  satoshis: string;
  btcAmount: string;
  btcAddress: string;
}

/** Contract deploy transaction */
export interface ContractDeployTransaction extends BaseTransaction {
  type: 'contract_deploy';
  template: string;
  params: Record<string, string>;
  bytecode?: string;
}

/** Rune transfer transaction */
export interface RuneTransferTransaction extends BaseTransaction {
  type: 'rune_transfer';
  runeId: string;
  runeName?: string;
  amount: string;
  toAddress: string;
}

/** Rune to ERC20 bridge transaction */
export interface RuneToERC20Transaction extends BaseTransaction {
  type: 'rune_to_erc20';
  runeId: string;
  runeName?: string;
  amount: string;
}

/** ERC20 to Rune bridge transaction */
export interface ERC20ToRuneTransaction extends BaseTransaction {
  type: 'erc20_to_rune';
  runeId: string;
  runeName?: string;
  erc20Address: string;
  amount: string;
  btcAddress: string;
}

/** Union of all transaction types */
export type PreparedTransaction =
  | EVMTransferTransaction
  | TokenTransferTransaction
  | BridgeDepositTransaction
  | BridgeWithdrawTransaction
  | ContractDeployTransaction
  | RuneTransferTransaction
  | RuneToERC20Transaction
  | ERC20ToRuneTransaction;

/** Tool response with prepared transaction */
export interface TransactionToolResponse<T = unknown> {
  success: true;
  transaction: PreparedTransaction;
  data?: T;
}
