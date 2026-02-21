'use client';

import { useState, useCallback } from 'react';
import { useAccounts, useEdictRune } from '@midl/react';
import {
  useAddTxIntention,
  useSignIntentions,
  useFinalizeBTCTransaction,
  useSendBTCTransactions,
  useAddCompleteTxIntention,
  useClearTxIntentions,
} from '@midl/executor-react';
import { encodeFunctionData, parseAbi } from 'viem';
import type { PreparedTransaction } from '@/lib/ai/tools/types';
import { generateUUID } from '@/lib/utils';

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
 * Uses the MIDL executor-react hooks for the full transaction flow
 */
export function useHandleTransaction() {
  const { isConnected } = useAccounts();

  // MIDL SDK hooks
  const { addTxIntentionAsync } = useAddTxIntention();
  const { signIntentionsAsync } = useSignIntentions();
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
   * 1. Add intention (already done before calling this)
   * 2. Sign with BTC wallet
   * 3. Finalize BTC transaction
   * 4. Broadcast
   */
  const executeMidlTransaction = useCallback(async (
    explorerUrl: string
  ): Promise<TransactionResult> => {
    // Generate unique txId for this transaction
    const txId = generateUUID();

    setState('signing');

    // Sign intentions - this triggers wallet popup
    await signIntentionsAsync({ txId });

    setState('broadcasting');

    // Finalize and get the BTC transaction
    const finalized = await finalizeBTCTransactionAsync({});

    // The finalized result has psbt and tx properties
    const psbtData = (finalized as { psbt: string }).psbt;
    const txData = (finalized as { tx?: { id?: string } }).tx;

    // Send the transaction
    await sendBTCTransactionsAsync({
      serializedTransactions: [],
      btcTransaction: psbtData,
    });

    // Clear intentions after successful send
    clearTxIntentions();

    setState('success');

    // Extract txId from result
    const resultTxId = txData?.id || txId;

    return {
      btcTxId: resultTxId,
      explorerUrl: `${explorerUrl}/tx/${resultTxId}`,
    };
  }, [signIntentionsAsync, finalizeBTCTransactionAsync, sendBTCTransactionsAsync, clearTxIntentions]);

  /**
   * Execute transaction based on prepared data
   */
  const executeTransaction = useCallback(async (
    transaction: PreparedTransaction
  ): Promise<TransactionResult> => {
    if (!isConnected) {
      setState('error');
      const errorResult = { error: 'Wallet not connected' };
      setResult(errorResult);
      throw new Error('Wallet not connected');
    }

    setState('preparing');

    try {
      let txResult: TransactionResult;

      switch (transaction.type) {
        case 'evm_transfer': {
          // Add EVM transfer intention
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
          txResult = await executeMidlTransaction(transaction.explorerUrl);
          break;
        }

        case 'token_transfer': {
          // Encode ERC20 transfer call
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
          txResult = await executeMidlTransaction(transaction.explorerUrl);
          break;
        }

        case 'bridge_deposit': {
          // Add deposit intention
          await addTxIntentionAsync({
            intention: {
              deposit: {
                satoshis: Number(transaction.satoshis),
              },
            },
            reset: true,
          });
          txResult = await executeMidlTransaction(transaction.explorerUrl);
          break;
        }

        case 'bridge_withdraw': {
          // Add complete tx intention for withdrawal
          // Note: btcAddress is derived from connected wallet, not passed explicitly
          await addCompleteTxIntentionAsync({
            satoshis: Number(transaction.satoshis),
          });
          txResult = await executeMidlTransaction(transaction.explorerUrl);
          break;
        }

        case 'contract_write': {
          // Parse ABI and encode function call
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
          txResult = await executeMidlTransaction(transaction.explorerUrl);
          break;
        }

        case 'contract_deploy': {
          // Contract deployment requires bytecode
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
          txResult = await executeMidlTransaction(transaction.explorerUrl);
          break;
        }

        case 'rune_transfer': {
          // Use edictRune for rune transfers
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
          // Bridge rune to ERC20 - deposit rune
          await addTxIntentionAsync({
            intention: {
              deposit: {
                runes: [{
                  id: transaction.runeId,
                  amount: BigInt(transaction.amount),
                }],
              },
            },
            reset: true,
          });
          txResult = await executeMidlTransaction(transaction.explorerUrl);
          break;
        }

        case 'erc20_to_rune': {
          // Bridge ERC20 back to rune - withdrawal
          // Note: address is ERC20 address (optional, auto-derived)
          await addCompleteTxIntentionAsync({
            runes: [{
              id: transaction.runeId,
              amount: BigInt(transaction.amount),
              address: transaction.erc20Address as `0x${string}`,
            }],
          });
          txResult = await executeMidlTransaction(transaction.explorerUrl);
          break;
        }

        default:
          throw new Error(`Unknown transaction type: ${(transaction as PreparedTransaction).type}`);
      }

      setResult(txResult);
      return txResult;
    } catch (error) {
      setState('error');
      const errorMsg = error instanceof Error ? error.message : 'Transaction failed';
      const errorResult = { error: errorMsg };
      setResult(errorResult);
      throw error;
    }
  }, [
    isConnected,
    addTxIntentionAsync,
    addCompleteTxIntentionAsync,
    edictRuneAsync,
    executeMidlTransaction,
  ]);

  return {
    state,
    result,
    isConnected,
    executeTransaction,
    resetState,
  };
}
