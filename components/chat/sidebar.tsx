'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  MessageSquare,
  Plus,
  ChevronLeft,
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
import { useDefaultAccount } from '@midl/react';
import { useEVMAddress } from '@midl/executor-react';

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
          ? 'bg-accent/15 text-accent border border-accent/20'
          : 'text-foreground-muted hover:bg-white/5 hover:text-foreground'
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
            className="p-1 rounded-lg hover:bg-error/10 text-foreground-muted hover:text-error transition-colors"
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
    <div className="space-y-1">
      <div className="flex items-center gap-2 px-3 mb-2">
        <span className="text-foreground-subtle">{icon}</span>
        <h3 className="text-xs font-semibold text-foreground-subtle uppercase tracking-wider">
          {title}
        </h3>
        <span className="text-xs text-foreground-subtle/50 ml-auto">{chats.length}</span>
      </div>
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

// Icon mapping for groups
const groupIcons: Record<string, React.ReactNode> = {
  Today: <Sparkles className="w-3.5 h-3.5" />,
  Yesterday: <Clock className="w-3.5 h-3.5" />,
  'This Week': <Zap className="w-3.5 h-3.5" />,
  'This Month': <Clock className="w-3.5 h-3.5" />,
  Earlier: <Clock className="w-3.5 h-3.5" />,
};

const SIDEBAR_WIDTH = 280;

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

  // Get wallet state directly from MIDL hooks (not localStorage)
  const account = useDefaultAccount();
  const evmAddress = useEVMAddress();

  const isConnected = !!account;
  const walletAddress = evmAddress || account?.address;

  // Debug logging
  useEffect(() => {
    console.log('[Sidebar] Wallet state:', { isConnected, account, evmAddress, walletAddress });
  }, [isConnected, account, evmAddress, walletAddress]);

  // Fetcher that adds wallet headers
  const fetcher = useCallback(
    async (url: string): Promise<HistoryResponse> => {
      if (!walletAddress) {
        return { chats: [], hasMore: false, nextCursor: null };
      }
      const res = await fetch(url, {
        headers: { 'x-wallet-address': walletAddress },
      });
      if (!res.ok) throw new Error('Failed to fetch history');
      return res.json();
    },
    [walletAddress]
  );

  // Fetch history with SWR - key includes wallet address to refetch on connect
  const { data, isLoading, mutate } = useSWR<HistoryResponse>(
    walletAddress ? `/api/history?limit=50&wallet=${walletAddress}` : null,
    fetcher,
    { revalidateOnFocus: true, refreshInterval: 5000 }
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

  const handleNewSession = useCallback(() => {
    router.push('/chat');
    router.refresh(); // Force refresh to clear cache
  }, [router]);

  const groupedChats = data?.chats ? groupChatsByDate(data.chats) : null;

  return (
    <div className="relative h-full flex">
      {/* Sidebar Panel */}
      <motion.aside
        initial={false}
        animate={{ width: isOpen ? SIDEBAR_WIDTH : 0 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="h-full overflow-hidden"
      >
        <div
          className={cn(
            'h-full flex flex-col',
            'bg-sidebar/95 backdrop-blur-xl',
            'border-r border-sidebar-border/30',
            'm-3 mr-0 rounded-2xl',
            'shadow-xl shadow-black/10'
          )}
          style={{ width: SIDEBAR_WIDTH - 24 }}
        >
          {/* New Session Button */}
          <div className="p-4">
            <button
              onClick={handleNewSession}
              className={cn(
                'flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl',
                'bg-accent text-accent-foreground font-semibold',
                'hover:bg-accent-hover transition-all duration-200',
                'shadow-lg shadow-accent/20 group'
              )}
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              <span>New Session</span>
            </button>
          </div>

          {/* History Section */}
          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
            {!isConnected ? (
              <div className="px-3 py-8 text-center">
                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-3 border border-accent/10">
                  <Wallet className="w-7 h-7 text-accent/60" />
                </div>
                <p className="text-sm font-medium text-foreground mb-1">Connect wallet</p>
                <p className="text-xs text-foreground-subtle">to view history</p>
              </div>
            ) : isLoading ? (
              <div className="flex flex-col items-center justify-center py-8 gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-accent" />
                <span className="text-xs text-foreground-subtle">Loading...</span>
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
              <div className="px-3 py-8 text-center">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-3 border border-white/5">
                  <MessageSquare className="w-7 h-7 text-foreground-subtle" />
                </div>
                <p className="text-sm font-medium text-foreground mb-1">No conversations</p>
                <p className="text-xs text-foreground-subtle">Start a session</p>
              </div>
            )}
          </div>

          {/* Footer Status */}
          <div className="p-3 border-t border-sidebar-border/30">
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-white/[0.03]">
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-success" />
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-success animate-ping opacity-50" />
              </div>
              <span className="text-xs text-foreground-muted">MIDL Network</span>
              <span className="text-xs text-success ml-auto">Live</span>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Edge Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'absolute top-1/2 -translate-y-1/2 z-50',
          'w-6 h-16 flex items-center justify-center',
          'bg-sidebar/90 backdrop-blur-sm',
          'border border-sidebar-border/50',
          'hover:bg-sidebar-hover transition-all duration-200',
          'shadow-lg shadow-black/10',
          isOpen ? 'rounded-r-xl' : 'rounded-xl',
          'hover:w-8'
        )}
        style={{
          left: isOpen ? SIDEBAR_WIDTH - 12 : 0,
          transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        <motion.div animate={{ rotate: isOpen ? 0 : 180 }} transition={{ duration: 0.2 }}>
          <ChevronLeft className="w-4 h-4 text-foreground-muted" />
        </motion.div>
      </button>
    </div>
  );
}

export default Sidebar;
