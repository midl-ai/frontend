'use client';

import { memo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AudioVisualizer } from './AudioVisualizer';
import { VoiceTranscriber } from './VoiceTranscriber';
import { VoiceTransactionDetails } from './VoiceTransactionDetails';
import { TransactionWrapper } from '@/components/transactions/TransactionWrapper';
import type { UseVoiceSessionReturn } from '@/hooks/useVoiceSession';

interface VoiceModeOverlayProps {
  voice: UseVoiceSessionReturn;
  onClose: () => void;
}

/**
 * Full-screen voice mode overlay
 * Shows audio visualizer, transcript, and handles transaction signing
 */
export const VoiceModeOverlay = memo(function VoiceModeOverlay({
  voice,
  onClose,
}: VoiceModeOverlayProps) {
  const {
    status,
    isActive,
    isListening,
    isSpeaking,
    transcript,
    currentVolume,
    error,
    pendingTransaction,
    stopSession,
    onTransactionComplete,
    onTransactionCancel,
  } = voice;

  const handleClose = useCallback(() => {
    stopSession();
    onClose();
  }, [stopSession, onClose]);

  const handleTransactionSuccess = useCallback(
    (result: { txHash?: string; btcTxId?: string; contractAddress?: string }) => {
      onTransactionComplete({
        success: true,
        txHash: result.txHash || result.btcTxId,
      });
    },
    [onTransactionComplete]
  );

  const handleTransactionError = useCallback(
    (err: string) => {
      onTransactionComplete({
        success: false,
        error: err,
      });
    },
    [onTransactionComplete]
  );

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Don't close if transaction signing is in progress
        if (status !== 'signing') {
          handleClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, handleClose]);

  if (!isActive && status !== 'error') {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col"
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />

        {/* Decorative grid */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Close button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          onClick={handleClose}
          className={cn(
            'absolute top-6 right-6 z-10',
            'w-12 h-12 rounded-full flex items-center justify-center',
            'bg-background-tertiary/80 border border-border',
            'text-foreground-muted hover:text-foreground hover:bg-background-hover',
            'transition-all duration-200'
          )}
        >
          <X className="w-5 h-5" />
        </motion.button>

        {/* Main content */}
        <div className="relative flex-1 flex flex-col items-center justify-center px-4">
          {/* Error state */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 flex items-center gap-3 px-4 py-3 rounded-xl bg-error/10 border border-error/20"
            >
              <AlertCircle className="w-5 h-5 text-error" />
              <span className="text-error text-sm">{error}</span>
            </motion.div>
          )}

          {/* Audio visualizer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <AudioVisualizer
              volume={currentVolume}
              isListening={isListening}
              isSpeaking={isSpeaking}
            />
          </motion.div>

          {/* Status text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Voice Mode
            </h2>
            <p className="text-foreground-muted text-sm">
              {status === 'signing'
                ? 'Transaction requires your signature...'
                : 'Speak naturally to interact with MIDL'}
            </p>
          </motion.div>
        </div>

        {/* Transcript panel at bottom */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={cn(
            'relative mx-auto w-full max-w-2xl mb-8 px-4',
            'rounded-2xl bg-background-secondary/80 backdrop-blur-sm',
            'border border-border shadow-xl'
          )}
        >
          <VoiceTranscriber transcript={transcript} />
        </motion.div>

        {/* Transaction signing modal */}
        {pendingTransaction && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-md mx-4"
            >
              <TransactionWrapper
                transaction={pendingTransaction}
                onSuccess={handleTransactionSuccess}
                onError={handleTransactionError}
                onCancel={onTransactionCancel}
              >
                <VoiceTransactionDetails transaction={pendingTransaction} />
              </TransactionWrapper>
            </motion.div>
          </div>
        )}

        {/* Keyboard hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-foreground-subtle"
        >
          Press <kbd className="px-1.5 py-0.5 rounded bg-background-tertiary border border-border">Esc</kbd> to close
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
});

export default VoiceModeOverlay;
