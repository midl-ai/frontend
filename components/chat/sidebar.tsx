'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  MessageSquare,
  Plus,
  Github,
  PanelLeftClose,
  PanelLeftOpen,
  Terminal,
  Trash2,
  Loader2,
  Wallet,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { useState, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSWR from 'swr';

// Types
interface Chat {
  id: string;
  title: string;
  createdAt: string;
}

interface HistoryResponse {
  chats: Chat[];
  hasMore: boolean;
  nextCursor: string | null;
}

// Fetcher for SWR
const fetcher = async (url: string): Promise<HistoryResponse> => {
  const walletAddress = localStorage.getItem('walletAddress');
  const res = await fetch(url, {
    headers: walletAddress ? { 'x-wallet-address': walletAddress } : {},
  });
  if (!res.ok) throw new Error('Failed to fetch history');
  return res.json();
};

// Group chats by date
function groupChatsByDate(chats: Chat[]): Record<string, Chat[]> {
  const groups: Record<string, Chat[]> = {
    Today: [],
    Yesterday: [],
    'Last 7 Days': [],
    'Last 30 Days': [],
    Older: [],
  };

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const lastWeek = new Date(today.getTime() - 7 * 86400000);
  const lastMonth = new Date(today.getTime() - 30 * 86400000);

  chats.forEach((chat) => {
    const date = new Date(chat.createdAt);
    if (date >= today) {
      groups.Today.push(chat);
    } else if (date >= yesterday) {
      groups.Yesterday.push(chat);
    } else if (date >= lastWeek) {
      groups['Last 7 Days'].push(chat);
    } else if (date >= lastMonth) {
      groups['Last 30 Days'].push(chat);
    } else {
      groups.Older.push(chat);
    }
  });

  return groups;
}

interface ChatItemProps {
  chat: Chat;
  isActive: boolean;
  onDelete: (id: string) => void;
}

const ChatItem = memo(function ChatItem({ chat, isActive, onDelete }: ChatItemProps) {
  const [showDelete, setShowDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (isDeleting) return;

      setIsDeleting(true);
      try {
        await fetch(`/api/chat/${chat.id}`, { method: 'DELETE' });
        onDelete(chat.id);
      } catch {
        setIsDeleting(false);
      }
    },
    [chat.id, isDeleting, onDelete]
  );

  return (
    <Link
      href={`/chat/${chat.id}`}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
      className={cn(
        'group flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all',
        isActive
          ? 'bg-accent/10 text-accent font-medium border border-accent/20'
          : 'text-foreground-muted hover:bg-sidebar-hover hover:text-foreground'
      )}
    >
      <MessageSquare className="w-4 h-4 shrink-0" />
      <span className="truncate flex-1">{chat.title || 'New conversation'}</span>

      <AnimatePresence>
        {showDelete && !isDeleting && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={handleDelete}
            className="p-1 rounded hover:bg-error/10 text-foreground-muted hover:text-error transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </motion.button>
        )}
        {isDeleting && (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-foreground-muted" />
        )}
      </AnimatePresence>
    </Link>
  );
});

interface ChatGroupProps {
  title: string;
  chats: Chat[];
  currentPath: string;
  onDelete: (id: string) => void;
}

const ChatGroup = memo(function ChatGroup({
  title,
  chats,
  currentPath,
  onDelete,
}: ChatGroupProps) {
  if (chats.length === 0) return null;

  return (
    <div className="space-y-1">
      <h3 className="px-3 text-xs font-medium text-foreground-subtle uppercase tracking-wider mb-2">
        {title}
      </h3>
      {chats.map((chat) => (
        <ChatItem
          key={chat.id}
          chat={chat}
          isActive={currentPath === `/chat/${chat.id}`}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
});

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  // Check if wallet is connected (client-side only)
  const hasWallet = typeof window !== 'undefined' && localStorage.getItem('walletAddress');

  // Fetch history with SWR
  const { data, isLoading, mutate } = useSWR<HistoryResponse>(
    hasWallet ? '/api/history?limit=50' : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const handleDelete = useCallback(
    (id: string) => {
      mutate(
        (current) =>
          current
            ? { ...current, chats: current.chats.filter((c) => c.id !== id) }
            : current,
        { revalidate: false }
      );
    },
    [mutate]
  );

  const groupedChats = data?.chats ? groupChatsByDate(data.chats) : null;

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-background border border-border shadow-sm"
        aria-label="Toggle sidebar"
      >
        {isOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <motion.aside
        initial={{ width: 280 }}
        animate={{ width: isOpen ? 280 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={cn(
          'fixed md:relative z-40 h-screen border-r border-sidebar-border bg-sidebar overflow-hidden flex flex-col',
          !isOpen && 'border-none'
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center border border-accent/20">
              <Terminal className="w-4 h-4 text-accent" />
            </div>
            <span className="whitespace-nowrap">MIDL Terminal</span>
          </Link>

          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-foreground-muted hover:text-foreground"
          >
            <PanelLeftClose className="w-5 h-5" />
          </button>
        </div>

        {/* New Chat */}
        <div className="p-4">
          <Link
            href="/chat"
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-accent text-accent-foreground font-medium hover:bg-accent-hover transition-all shadow-sm group"
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
            <span className="whitespace-nowrap">New Session</span>
          </Link>
        </div>

        {/* History */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
          {!hasWallet ? (
            <div className="px-3 py-8 text-center">
              <Wallet className="w-8 h-8 mx-auto mb-3 text-foreground-subtle" />
              <p className="text-sm text-foreground-muted mb-2">Connect wallet to view history</p>
              <p className="text-xs text-foreground-subtle">
                Your conversations will appear here
              </p>
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-foreground-muted" />
            </div>
          ) : groupedChats && Object.values(groupedChats).some((g) => g.length > 0) ? (
            <>
              {Object.entries(groupedChats).map(([title, chats]) => (
                <ChatGroup
                  key={title}
                  title={title}
                  chats={chats}
                  currentPath={pathname}
                  onDelete={handleDelete}
                />
              ))}
            </>
          ) : (
            <div className="px-3 py-8 text-center">
              <MessageSquare className="w-8 h-8 mx-auto mb-3 text-foreground-subtle" />
              <p className="text-sm text-foreground-muted">No conversations yet</p>
              <p className="text-xs text-foreground-subtle mt-1">
                Start chatting to see your history
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border space-y-2">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2 text-sm text-foreground-muted hover:bg-sidebar-hover hover:text-foreground rounded-lg transition-colors"
          >
            <Github className="w-4 h-4" />
            <span className="whitespace-nowrap">GitHub Repo</span>
          </a>

          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex items-center gap-2 text-sm text-foreground-muted">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span>System Online</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </motion.aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

export default Sidebar;
