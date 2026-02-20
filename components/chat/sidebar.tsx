'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  MessageSquare,
  Plus,
  PanelLeftClose,
  PanelLeftOpen,
  Trash2,
  Loader2,
  Wallet,
  Sparkles,
  Clock,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, memo, useCallback, useEffect } from 'react';
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
    'This Week': [],
    'This Month': [],
    Earlier: [],
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
      groups['This Week'].push(chat);
    } else if (date >= lastMonth) {
      groups['This Month'].push(chat);
    } else {
      groups.Earlier.push(chat);
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
        'group flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl transition-all duration-200',
        isActive
          ? 'bg-gradient-to-r from-accent/15 to-accent/5 text-accent border border-accent/20 shadow-sm'
          : 'text-foreground-muted hover:bg-white/5 hover:text-foreground'
      )}
    >
      <div
        className={cn(
          'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors',
          isActive ? 'bg-accent/20' : 'bg-white/5 group-hover:bg-white/10'
        )}
      >
        <MessageSquare className="w-4 h-4" />
      </div>
      <span className="truncate flex-1 font-medium">{chat.title || 'New conversation'}</span>

      <AnimatePresence>
        {showDelete && !isDeleting && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={handleDelete}
            className="p-1.5 rounded-lg hover:bg-error/10 text-foreground-muted hover:text-error transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </motion.button>
        )}
        {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin text-foreground-muted" />}
      </AnimatePresence>
    </Link>
  );
});

interface ChatGroupProps {
  title: string;
  chats: Chat[];
  currentPath: string;
  onDelete: (id: string) => void;
  icon: React.ReactNode;
}

const ChatGroup = memo(function ChatGroup({
  title,
  chats,
  currentPath,
  onDelete,
  icon,
}: ChatGroupProps) {
  if (chats.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-1.5"
    >
      <div className="flex items-center gap-2 px-3 mb-2">
        <span className="text-foreground-subtle">{icon}</span>
        <h3 className="text-xs font-semibold text-foreground-subtle uppercase tracking-wider">
          {title}
        </h3>
        <span className="text-xs text-foreground-subtle/50 ml-auto">{chats.length}</span>
      </div>
      {chats.map((chat, i) => (
        <motion.div
          key={chat.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.03 }}
        >
          <ChatItem
            chat={chat}
            isActive={currentPath === `/chat/${chat.id}`}
            onDelete={onDelete}
          />
        </motion.div>
      ))}
    </motion.div>
  );
});

// Icon mapping for groups
const groupIcons: Record<string, React.ReactNode> = {
  Today: <Sparkles className="w-3.5 h-3.5" />,
  Yesterday: <Clock className="w-3.5 h-3.5" />,
  'This Week': <Zap className="w-3.5 h-3.5" />,
  'This Month': <Clock className="w-3.5 h-3.5" />,
  Earlier: <Clock className="w-3.5 h-3.5" />,
};

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const [hasWallet, setHasWallet] = useState(false);

  // Check wallet on mount (client-side only)
  useEffect(() => {
    setHasWallet(!!localStorage.getItem('walletAddress'));
  }, []);

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
          current ? { ...current, chats: current.chats.filter((c) => c.id !== id) } : current,
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
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-background/80 backdrop-blur-sm border border-border shadow-lg"
        aria-label="Toggle sidebar"
      >
        {isOpen ? (
          <PanelLeftClose className="w-5 h-5" />
        ) : (
          <PanelLeftOpen className="w-5 h-5" />
        )}
      </button>

      {/* Sidebar */}
      <motion.aside
        initial={{ width: 300 }}
        animate={{ width: isOpen ? 300 : 0 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className={cn(
          'fixed md:relative z-40 h-screen bg-sidebar overflow-hidden flex flex-col',
          'border-r border-sidebar-border/50',
          !isOpen && 'border-none'
        )}
      >
        {/* New Session Button - Main CTA */}
        <div className="p-4">
          <Link
            href="/chat"
            className={cn(
              'flex items-center justify-center gap-2.5 w-full px-4 py-3 rounded-xl',
              'bg-gradient-to-r from-accent to-accent/80 text-accent-foreground',
              'font-semibold hover:shadow-lg hover:shadow-accent/20 transition-all duration-300',
              'group border border-accent/20'
            )}
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            <span>New Session</span>
          </Link>
        </div>

        {/* History Section */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6 scrollbar-thin scrollbar-thumb-border/50">
          {!hasWallet ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-3 py-12 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center mx-auto mb-4 border border-accent/10">
                <Wallet className="w-8 h-8 text-accent/60" />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">Connect your wallet</p>
              <p className="text-xs text-foreground-subtle">to view your chat history</p>
            </motion.div>
          ) : isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-accent" />
              <span className="text-xs text-foreground-subtle">Loading history...</span>
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
                  icon={groupIcons[title]}
                />
              ))}
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-3 py-12 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] flex items-center justify-center mx-auto mb-4 border border-white/5">
                <MessageSquare className="w-8 h-8 text-foreground-subtle" />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">No conversations yet</p>
              <p className="text-xs text-foreground-subtle">Start a session to begin</p>
            </motion.div>
          )}
        </div>

        {/* Footer - Minimal Status */}
        <div className="p-4 border-t border-sidebar-border/50">
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-white/[0.02]">
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-success" />
              <div className="absolute inset-0 w-2 h-2 rounded-full bg-success animate-ping opacity-75" />
            </div>
            <span className="text-xs text-foreground-muted font-medium">MIDL Network</span>
            <span className="text-xs text-success ml-auto">Connected</span>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default Sidebar;
