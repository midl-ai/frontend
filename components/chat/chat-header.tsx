'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Plus, PanelLeftOpen } from 'lucide-react';
import { ConnectButton } from '@/components/wallet/connect-button';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { useTheme } from 'next-themes';

interface ChatHeaderProps {
  showNewChat?: boolean;
  onToggleSidebar?: () => void;
}

/** Chat interface header with wallet connection and navigation */
export function ChatHeader({ showNewChat = true, onToggleSidebar }: ChatHeaderProps) {
  const router = useRouter();
  const { theme, resolvedTheme } = useTheme();

  const handleNewChat = useCallback(() => {
    // Add unique session key to force component remount
    const sessionKey = Date.now().toString(36);
    router.push(`/chat?session=${sessionKey}`);
  }, [router]);

  return (
    <header className="h-14 px-4 border-b border-border bg-background/80 backdrop-blur-sm flex items-center justify-between gap-4 shrink-0 relative z-50">
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
          className="flex items-center hover:opacity-80 transition-opacity"
        >
          <Image
            src={resolvedTheme === 'dark' ? '/midl-ai-wordmark.svg' : '/midl-ai-wordmark-light.svg'}
            alt="MIDL.AI"
            width={100}
            height={28}
            className="h-7 w-auto"
            priority
          />
        </Link>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        {showNewChat && (
          <button
            onClick={handleNewChat}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-sm font-medium hover:bg-background-hover hover:border-border-hover transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </button>
        )}

        <ThemeToggle />
        <ConnectButton />
      </div>
    </header>
  );
}

export default ChatHeader;
