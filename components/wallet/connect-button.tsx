'use client';

import { useState, useCallback, memo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Wallet,
  LogOut,
  Copy,
  Check,
  ChevronDown,
  ExternalLink,
  AlertCircle,
  Download,
} from 'lucide-react';
import { useConnect, useDisconnect, useAccounts } from '@midl/react';
import { useEVMAddress } from '@midl/executor-react';
import { AddressPurpose } from '@midl/core';

/** Check if Xverse wallet extension is installed */
function isXverseInstalled(): boolean {
  if (typeof window === 'undefined') return false;
  return !!(window as unknown as { XverseProviders?: unknown }).XverseProviders;
}

/** Truncate address for display */
function truncateAddress(address: string, chars = 4): string {
  if (address.length <= chars * 2 + 3) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

interface WalletDropdownProps {
  evmAddress: string | undefined;
  btcAddress: string | undefined;
  onDisconnect: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const WalletDropdown = memo(function WalletDropdown({
  evmAddress,
  btcAddress,
  onDisconnect,
  isOpen,
  onClose,
}: WalletDropdownProps) {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const copyAddress = useCallback((address: string, type: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(type);
    setTimeout(() => setCopiedAddress(null), 2000);
  }, []);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Dropdown */}
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className="absolute right-0 top-full mt-2 w-72 rounded-xl border border-border bg-card shadow-lg z-50 overflow-hidden"
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-border bg-background-tertiary/50">
          <p className="text-xs text-foreground-muted uppercase tracking-wider font-medium">
            Connected Wallet
          </p>
        </div>

        {/* Addresses */}
        <div className="p-3 space-y-2">
          {evmAddress && (
            <div className="flex items-center justify-between p-2 rounded-lg bg-background-tertiary/30 group">
              <div>
                <p className="text-xs text-foreground-muted">EVM Address</p>
                <p className="font-mono text-sm text-foreground">
                  {truncateAddress(evmAddress)}
                </p>
              </div>
              <button
                onClick={() => copyAddress(evmAddress, 'evm')}
                className="p-1.5 rounded-lg text-foreground-muted hover:text-accent hover:bg-accent/10 transition-all"
              >
                {copiedAddress === 'evm' ? (
                  <Check className="w-4 h-4 text-success" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          )}

          {btcAddress && (
            <div className="flex items-center justify-between p-2 rounded-lg bg-background-tertiary/30 group">
              <div>
                <p className="text-xs text-foreground-muted">BTC Address</p>
                <p className="font-mono text-sm text-foreground">
                  {truncateAddress(btcAddress)}
                </p>
              </div>
              <button
                onClick={() => copyAddress(btcAddress, 'btc')}
                className="p-1.5 rounded-lg text-foreground-muted hover:text-accent hover:bg-accent/10 transition-all"
              >
                {copiedAddress === 'btc' ? (
                  <Check className="w-4 h-4 text-success" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-3 border-t border-border space-y-1">
          <a
            href="https://blockscout.staging.midl.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground-muted hover:text-foreground hover:bg-background-hover rounded-lg transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View on Explorer
          </a>
          <button
            onClick={onDisconnect}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-error hover:bg-error/10 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Disconnect
          </button>
        </div>
      </motion.div>
    </>
  );
});

/** Wallet connect button with dropdown using real Xverse connection */
export function ConnectButton() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Real MIDL SDK hooks - useAccounts is reactive, useDefaultAccount is not
  const { connect, connectors } = useConnect({
    purposes: [AddressPurpose.Payment, AddressPurpose.Ordinals],
  });
  const { disconnect } = useDisconnect();
  const { paymentAccount, isConnected, isConnecting } = useAccounts();
  const rawEvmAddress = useEVMAddress();

  // Filter out zero address (returned when not connected)
  const evmAddress = rawEvmAddress && rawEvmAddress !== '0x0000000000000000000000000000000000000000'
    ? rawEvmAddress
    : undefined;

  // Use payment account's BTC address as primary identifier
  const btcAddress = paymentAccount?.address;
  const displayAddress = evmAddress || btcAddress;

  // Debug logging
  useEffect(() => {
    console.log('[Wallet] State:', { isConnected, paymentAccount, evmAddress, btcAddress, rawEvmAddress });
  }, [isConnected, paymentAccount, evmAddress, btcAddress, rawEvmAddress]);

  // Persist addresses to localStorage for API calls
  useEffect(() => {
    if (isConnected) {
      // Use BTC address as primary identifier if EVM not yet available
      const primaryAddress = evmAddress || btcAddress;
      if (primaryAddress) {
        localStorage.setItem('walletAddress', primaryAddress);
      }
      if (evmAddress) {
        localStorage.setItem('evmAddress', evmAddress);
      }
      if (btcAddress) {
        localStorage.setItem('btcAddress', btcAddress);
      }
      console.log('[Wallet] Saved to localStorage:', { primaryAddress, evmAddress, btcAddress });
    } else {
      localStorage.removeItem('walletAddress');
      localStorage.removeItem('evmAddress');
      localStorage.removeItem('btcAddress');
      console.log('[Wallet] Cleared localStorage');
    }
  }, [isConnected, evmAddress, btcAddress]);

  const handleConnect = useCallback(async () => {
    setError(null);

    // Check if Xverse is installed
    if (!isXverseInstalled()) {
      setShowInstallPrompt(true);
      return;
    }

    // Use Xverse connector (first in the list)
    const xverseConnector = connectors[0];
    console.log('[Wallet] Connecting with:', xverseConnector);

    if (xverseConnector) {
      try {
        await connect({ id: xverseConnector.id });
        console.log('[Wallet] Connection successful');
      } catch (err) {
        console.error('[Wallet] Connection error:', err);
        setError(err instanceof Error ? err.message : 'Failed to connect wallet');
      }
    } else {
      console.error('[Wallet] No connectors available:', connectors);
      setError('No wallet connector available');
    }
  }, [connect, connectors]);

  const handleDisconnect = useCallback(() => {
    disconnect();
    setIsDropdownOpen(false);
  }, [disconnect]);

  // Show connected state if we have an account (even without EVM address yet)
  if (isConnected && displayAddress) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg border transition-all',
            isDropdownOpen
              ? 'border-accent bg-accent/10 text-accent'
              : 'border-border bg-card hover:border-border-hover'
          )}
        >
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="font-mono text-sm">
            {truncateAddress(displayAddress, 4)}
          </span>
          <ChevronDown
            className={cn(
              'w-4 h-4 transition-transform',
              isDropdownOpen && 'rotate-180'
            )}
          />
        </button>

        <AnimatePresence>
          {isDropdownOpen && (
            <WalletDropdown
              evmAddress={evmAddress}
              btcAddress={btcAddress}
              onDisconnect={handleDisconnect}
              isOpen={isDropdownOpen}
              onClose={() => setIsDropdownOpen(false)}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Show install prompt
  if (showInstallPrompt) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowInstallPrompt(false)}
          className={cn(
            'flex items-center gap-2 px-5 py-2 rounded-lg font-medium transition-all',
            'bg-warning/10 text-warning border border-warning/20'
          )}
        >
          <AlertCircle className="w-4 h-4" />
          <span>Install Xverse</span>
        </button>

        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute right-0 top-full mt-2 w-72 rounded-xl border border-border bg-card shadow-lg z-50 overflow-hidden"
          >
            <div className="p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                  <Wallet className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Xverse Wallet Required</p>
                  <p className="text-sm text-foreground-muted mt-1">
                    Install Xverse to connect your Bitcoin wallet to MIDL.
                  </p>
                </div>
              </div>
              <a
                href="https://www.xverse.app/download"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-accent text-accent-foreground font-medium hover:bg-accent-hover transition-all"
              >
                <Download className="w-4 h-4" />
                Install Xverse
              </a>
              <button
                onClick={() => setShowInstallPrompt(false)}
                className="w-full px-4 py-2 text-sm text-foreground-muted hover:text-foreground transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={handleConnect}
        disabled={isConnecting}
        className={cn(
          'flex items-center gap-2 px-5 py-2 rounded-lg font-medium transition-all',
          'bg-accent text-accent-foreground hover:bg-accent-hover',
          'shadow-sm hover:shadow-glow',
          isConnecting && 'opacity-80 cursor-wait',
          error && 'bg-error/10 text-error border border-error/20'
        )}
      >
        {isConnecting ? (
          <>
            <div className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
            <span>Connecting...</span>
          </>
        ) : error ? (
          <>
            <AlertCircle className="w-4 h-4" />
            <span>Try Again</span>
          </>
        ) : (
          <>
            <Wallet className="w-4 h-4" />
            <span>Connect Wallet</span>
          </>
        )}
      </button>

      {/* Error tooltip */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute right-0 top-full mt-2 w-64 p-3 rounded-lg border border-error/20 bg-error/5 text-sm text-error"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ConnectButton;
