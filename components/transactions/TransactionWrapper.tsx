'use client';

import { ReactNode, useState } from 'react';
import { Zap, Loader2, XCircle, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import { useAccounts } from '@midl/react';
import { useHandleTransaction, type TransactionState, type TransactionResult } from '@/hooks/useHandleTransaction';
import type { PreparedTransaction } from '@/lib/ai/tools/types';

interface TransactionWrapperProps {
  children?: ReactNode;
  transaction: PreparedTransaction;
  buttonText?: string;
  onSuccess?: (result: TransactionResult) => void;
  onError?: (error: string) => void;
  onCancel?: () => void;
}

/** Button styling by state */
const getButtonStyles = (state: TransactionState, isConnected: boolean) => {
  if (!isConnected) {
    return 'bg-zinc-600 cursor-not-allowed';
  }
  switch (state) {
    case 'success':
      return 'bg-green-600 hover:bg-green-700';
    case 'error':
      return 'bg-red-600 hover:bg-red-700';
    default:
      return 'bg-accent hover:bg-accent/90';
  }
};

/**
 * Wraps transaction details with signing UI
 * Shows Sign & Submit button and handles the full transaction flow
 */
export function TransactionWrapper({
  children,
  transaction,
  buttonText = 'Sign & Submit',
  onSuccess,
  onError,
  onCancel,
}: TransactionWrapperProps) {
  const { isConnected } = useAccounts();
  const { state, result, executeTransaction, resetState } = useHandleTransaction();
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSign = async () => {
    if (!isConnected) {
      setLocalError('Please connect your wallet first');
      return;
    }

    setLocalError(null);

    try {
      const txResult = await executeTransaction(transaction);
      onSuccess?.(txResult);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Transaction failed';
      setLocalError(errorMsg);
      onError?.(errorMsg);
    }
  };

  const handleReset = () => {
    resetState();
    setLocalError(null);
  };

  // Show success receipt
  if (state === 'success' && result) {
    const txId = result.txHash || result.btcTxId;
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-green-400">Transaction Submitted</p>
            {txId && (
              <p className="text-xs text-zinc-400 font-mono truncate">
                {txId.slice(0, 16)}...{txId.slice(-8)}
              </p>
            )}
          </div>
          {result.explorerUrl && (
            <a
              href={result.explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 hover:text-green-300"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Show contract address for deployments */}
        {result.contractAddress && (
          <div className="p-3 bg-zinc-800/50 border border-zinc-700 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-zinc-400">Contract Address</p>
              {result.evmExplorerUrl && (
                <a
                  href={result.evmExplorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-accent hover:text-accent/80 flex items-center gap-1"
                >
                  View on Explorer <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <p className="text-sm font-mono text-white break-all">{result.contractAddress}</p>
          </div>
        )}

        <button
          onClick={handleReset}
          className="w-full py-2 text-sm text-zinc-400 hover:text-white transition-colors"
        >
          Dismiss
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Transaction details */}
      {children}

      {/* Wallet connection warning */}
      {!isConnected && (
        <div className="flex items-center gap-2 p-2.5 bg-amber-900/20 border border-amber-500/30 rounded-lg">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <p className="text-xs text-amber-300">
            Connect your wallet to sign this transaction
          </p>
        </div>
      )}

      {/* Error display */}
      {(localError || (state === 'error' && result?.error)) && (
        <div className="flex items-start gap-2 p-2.5 bg-red-900/20 border border-red-500/30 rounded-lg">
          <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs font-medium text-red-400">Transaction Failed</p>
            <p className="text-xs text-red-300 mt-0.5">
              {localError || result?.error}
            </p>
          </div>
        </div>
      )}

      {/* Sign & Submit button */}
      <div className={onCancel ? 'flex gap-2' : ''}>
        {onCancel && state === 'idle' && (
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 px-4 rounded-lg font-medium text-sm bg-zinc-700 hover:bg-zinc-600 text-white transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          onClick={state === 'error' ? handleReset : handleSign}
          disabled={!isConnected || (state !== 'idle' && state !== 'error')}
          className={`
            ${onCancel ? 'flex-1' : 'w-full'} flex items-center justify-center gap-2
            py-2.5 px-4 rounded-lg font-medium text-sm
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            ${getButtonStyles(state, isConnected)}
          `}
        >
        {state === 'idle' && (
          <>
            <Zap className="w-4 h-4" />
            {buttonText}
          </>
        )}
        {state === 'preparing' && (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Preparing...
          </>
        )}
        {state === 'signing' && (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Waiting for signature...
          </>
        )}
        {state === 'broadcasting' && (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Broadcasting...
          </>
        )}
        {state === 'error' && (
          <>
            <XCircle className="w-4 h-4" />
            Try Again
          </>
        )}
        </button>
      </div>
    </div>
  );
}
