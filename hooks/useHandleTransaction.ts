'use client';

import { useState, useCallback } from 'react';
import { useAccounts, useEdictRune } from '@midl/react';
import {
  useAddTxIntention,
  useSignIntention,
  useFinalizeBTCTransaction,
  useSendBTCTransactions,
  useAddCompleteTxIntention,
  useClearTxIntentions,
  useEVMAddress,
} from '@midl/executor-react';
import { encodeFunctionData, parseAbi, zeroAddress } from 'viem';
import type { PreparedTransaction } from '@/lib/ai/tools/types';

export type TransactionState = 'idle' | 'preparing' | 'signing' | 'broadcasting' | 'success' | 'error';

export interface TransactionResult {
  txHash?: string;
  btcTxId?: string;
  contractAddress?: string;
  explorerUrl?: string;
  error?: string;
}

/**
 * Hook for handling MIDL transactions with wallet signing
 * Follows the MIDL flow: Add Intention → Finalize BTC → Sign → Broadcast
 */
export function useHandleTransaction() {
  const { isConnected } = useAccounts();
  const evmAddress = useEVMAddress();

  // MIDL SDK hooks
  const { addTxIntentionAsync, txIntentions } = useAddTxIntention();
  const { signIntentionAsync } = useSignIntention();
  const { finalizeBTCTransactionAsync } = useFinalizeBTCTransaction();
  const { sendBTCTransactionsAsync } = useSendBTCTransactions();
  const { addCompleteTxIntentionAsync } = useAddCompleteTxIntention();
  const clearTxIntentions = useClearTxIntentions();
  const { edictRuneAsync } = useEdictRune();

  const [state, setState] = useState<TransactionState>('idle');
  const [result, setResult] = useState<TransactionResult | null>(null);

  const resetState = useCallback(() => {
    setState('idle');
    setResult(null);
  }, []);

  /**
   * Execute the full MIDL transaction flow:
   * 1. Finalize BTC transaction (creates PSBT)
   * 2. Sign each intention
   * 3. Broadcast
   */
  const executeMidlFlow = useCallback(async (
    explorerUrl: string
  ): Promise<TransactionResult> => {
    console.log('[useHandleTransaction] Starting MIDL flow, intentions:', txIntentions);

    if (txIntentions.length === 0) {
      throw new Error('No transaction intentions to process');
    }

    setState('preparing');

    // Step 1: Finalize BTC transaction - creates the PSBT
    console.log('[useHandleTransaction] Finalizing BTC transaction...');
    const finalized = await finalizeBTCTransactionAsync({});
    console.log('[useHandleTransaction] Finalized:', finalized);

    const btcTxId = finalized.tx?.id;
    const btcTxHex = finalized.tx?.hex;

    if (!btcTxId || !btcTxHex) {
      throw new Error('Failed to finalize BTC transaction');
    }

    setState('signing');

    // Step 2: Sign each intention
    console.log('[useHandleTransaction] Signing intentions...');
    for (const intention of txIntentions) {
      console.log('[useHandleTransaction] Signing intention:', intention);
      await signIntentionAsync({
        intention,
        txId: btcTxId,
      });
    }

    setState('broadcasting');

    // Step 3: Broadcast
    console.log('[useHandleTransaction] Broadcasting...');
    const signedTxs = txIntentions
      .filter(it => it.signedEvmTransaction)
      .map(it => it.signedEvmTransaction as `0x${string}`);

    await sendBTCTransactionsAsync({
      serializedTransactions: signedTxs,
      btcTransaction: btcTxHex,
    });

    // Clear intentions after successful send
    clearTxIntentions();

    setState('success');

    return {
      btcTxId,
      explorerUrl: `${explorerUrl}/tx/${btcTxId}`,
    };
  }, [txIntentions, finalizeBTCTransactionAsync, signIntentionAsync, sendBTCTransactionsAsync, clearTxIntentions]);

  /**
   * Execute transaction based on prepared data
   */
  const executeTransaction = useCallback(async (
    transaction: PreparedTransaction
  ): Promise<TransactionResult> => {
    console.log('[useHandleTransaction] executeTransaction called with:', transaction);

    if (!isConnected) {
      setState('error');
      const errorResult = { error: 'Wallet not connected' };
      setResult(errorResult);
      throw new Error('Wallet not connected');
    }

    if (!evmAddress || evmAddress === zeroAddress) {
      setState('error');
      const errorResult = { error: 'EVM address not available - please connect wallet' };
      setResult(errorResult);
      throw new Error('EVM address not available - please connect wallet');
    }

    setState('preparing');

    try {
      let txResult: TransactionResult;

      switch (transaction.type) {
        case 'evm_transfer': {
          console.log('[useHandleTransaction] Adding EVM transfer intention...');
          await addTxIntentionAsync({
            intention: {
              evmTransaction: {
                to: transaction.to as `0x${string}`,
                value: BigInt(transaction.amountWei),
                data: '0x',
              },
            },
            reset: true,
          });
          txResult = await executeMidlFlow(transaction.explorerUrl);
          break;
        }

        case 'token_transfer': {
          console.log('[useHandleTransaction] Adding token transfer intention...');
          const data = encodeFunctionData({
            abi: parseAbi(['function transfer(address to, uint256 amount) returns (bool)']),
            functionName: 'transfer',
            args: [transaction.to as `0x${string}`, BigInt(transaction.amountRaw)],
          });

          await addTxIntentionAsync({
            intention: {
              evmTransaction: {
                to: transaction.tokenAddress as `0x${string}`,
                value: BigInt(0),
                data,
              },
            },
            reset: true,
          });
          txResult = await executeMidlFlow(transaction.explorerUrl);
          break;
        }

        case 'bridge_deposit': {
          // For deposits, we need an EVM transaction (even if minimal)
          // The deposit field adds BTC to our EVM balance
          console.log('[useHandleTransaction] Adding bridge deposit intention...');
          await addTxIntentionAsync({
            intention: {
              evmTransaction: {
                // Self-transfer of 0 wei - just to have an EVM tx
                to: evmAddress as `0x${string}`,
                value: BigInt(0),
                data: '0x',
              },
              deposit: {
                satoshis: Number(transaction.satoshis),
              },
            },
            reset: true,
          });
          txResult = await executeMidlFlow(transaction.explorerUrl);
          break;
        }

        case 'bridge_withdraw': {
          console.log('[useHandleTransaction] Adding bridge withdrawal intention...');
          // addCompleteTxIntention creates the proper EVM tx for withdrawal
          await addCompleteTxIntentionAsync({
            satoshis: Number(transaction.satoshis),
          });
          txResult = await executeMidlFlow(transaction.explorerUrl);
          break;
        }

        case 'contract_write': {
          console.log('[useHandleTransaction] Adding contract write intention...');
          const parsedAbi = JSON.parse(transaction.abi);
          const data = encodeFunctionData({
            abi: parsedAbi,
            functionName: transaction.functionName,
            args: transaction.args || [],
          });

          await addTxIntentionAsync({
            intention: {
              evmTransaction: {
                to: transaction.contractAddress as `0x${string}`,
                value: transaction.value ? BigInt(transaction.value) : BigInt(0),
                data,
              },
            },
            reset: true,
          });
          txResult = await executeMidlFlow(transaction.explorerUrl);
          break;
        }

        case 'contract_deploy': {
          console.log('[useHandleTransaction] Adding contract deploy intention...');
          if (!transaction.bytecode) {
            throw new Error('Bytecode required for contract deployment');
          }

          await addTxIntentionAsync({
            intention: {
              evmTransaction: {
                data: transaction.bytecode as `0x${string}`,
              },
            },
            reset: true,
          });
          txResult = await executeMidlFlow(transaction.explorerUrl);
          break;
        }

        case 'rune_transfer': {
          console.log('[useHandleTransaction] Transferring rune...');
          setState('signing');
          const runeResult = await edictRuneAsync({
            transfers: [{
              runeId: transaction.runeId,
              amount: BigInt(transaction.amount),
              receiver: transaction.toAddress,
            }],
          });

          setState('success');
          txResult = {
            btcTxId: runeResult.tx.id,
            explorerUrl: `${transaction.explorerUrl}/tx/${runeResult.tx.id}`,
          };
          break;
        }

        case 'rune_to_erc20': {
          console.log('[useHandleTransaction] Bridging rune to ERC20...');
          // Rune deposit needs EVM tx + rune deposit
          await addTxIntentionAsync({
            intention: {
              evmTransaction: {
                to: evmAddress as `0x${string}`,
                value: BigInt(0),
                data: '0x',
              },
              deposit: {
                runes: [{
                  id: transaction.runeId,
                  amount: BigInt(transaction.amount),
                }],
              },
            },
            reset: true,
          });
          txResult = await executeMidlFlow(transaction.explorerUrl);
          break;
        }

        case 'erc20_to_rune': {
          console.log('[useHandleTransaction] Bridging ERC20 to rune...');
          await addCompleteTxIntentionAsync({
            runes: [{
              id: transaction.runeId,
              amount: BigInt(transaction.amount),
              address: transaction.erc20Address as `0x${string}`,
            }],
          });
          txResult = await executeMidlFlow(transaction.explorerUrl);
          break;
        }

        default:
          throw new Error(`Unknown transaction type: ${(transaction as PreparedTransaction).type}`);
      }

      setResult(txResult);
      return txResult;
    } catch (error) {
      console.error('[useHandleTransaction] Error:', error);
      setState('error');
      const errorMsg = error instanceof Error ? error.message : 'Transaction failed';
      const errorResult = { error: errorMsg };
      setResult(errorResult);
      throw error;
    }
  }, [
    isConnected,
    evmAddress,
    addTxIntentionAsync,
    addCompleteTxIntentionAsync,
    edictRuneAsync,
    executeMidlFlow,
  ]);

  return {
    state,
    result,
    isConnected,
    executeTransaction,
    resetState,
  };
}
