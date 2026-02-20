'use client';

import Link from 'next/link';
import { Plus, Terminal, PanelLeftOpen } from 'lucide-react';
import { ConnectButton } from '@/components/wallet/connect-button';
import { ThemeToggle } from '@/components/theme/theme-toggle';

interface ChatHeaderProps {
  showNewChat?: boolean;
  onToggleSidebar?: () => void;
}

/** Chat interface header with wallet connection and navigation */
export function ChatHeader({ showNewChat = true, onToggleSidebar }: ChatHeaderProps) {
  return (
    <header className="h-14 px-4 border-b border-border bg-background/80 backdrop-blur-sm flex items-center justify-between gap-4 shrink-0">
      {/* Left section */}
      <div className="flex items-center gap-3">
        {/* Mobile sidebar toggle */}
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-lg hover:bg-background-hover transition-colors"
            aria-label="Toggle sidebar"
          >
            <PanelLeftOpen className="w-5 h-5" />
          </button>
        )}

        {/* Logo/Home link */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-lg hover:opacity-80 transition-opacity"
        >
          <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center border border-accent/20">
            <Terminal className="w-4 h-4 text-accent" />
          </div>
          <span className="hidden sm:inline">
            MIDL<span className="text-accent">.AI</span>
          </span>
        </Link>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        {showNewChat && (
          <Link
            href="/chat"
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-sm font-medium hover:bg-background-hover hover:border-border-hover transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </Link>
        )}

        <ThemeToggle />
        <ConnectButton />
      </div>
    </header>
  );
}

export default ChatHeader;
