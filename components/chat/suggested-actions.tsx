'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, memo, useCallback } from 'react';
import { cn } from '@/lib/utils';
import {
  Wallet,
  Layers,
  ArrowRightLeft,
  Code2,
  Network,
  Bitcoin,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface SuggestedActionsProps {
  onSelect: (prompt: string) => void;
}

interface Category {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  actions: { title: string; description: string; prompt: string }[];
}

const CATEGORIES: Category[] = [
  {
    id: 'balance',
    label: 'Wallet',
    icon: Wallet,
    color: 'accent',
    actions: [
      {
        title: 'Check EVM Balance',
        description: 'View your L2 wallet balance',
        prompt: 'What is my EVM balance?',
      },
      {
        title: 'Check BTC Balance',
        description: 'View your Bitcoin balance',
        prompt: 'What is my BTC balance?',
      },
      {
        title: 'List All Balances',
        description: 'Show all token balances',
        prompt: 'Show me all my balances including tokens',
      },
    ],
  },
  {
    id: 'network',
    label: 'Network',
    icon: Network,
    color: 'secondary',
    actions: [
      {
        title: 'Network Status',
        description: 'Current network information',
        prompt: 'Show me the network information',
      },
      {
        title: 'Latest Block',
        description: 'Get the latest block data',
        prompt: 'What is the latest block?',
      },
      {
        title: 'Fee Rates',
        description: 'Current BTC fee estimates',
        prompt: 'What are the current BTC fee rates?',
      },
    ],
  },
  {
    id: 'bridge',
    label: 'Bridge',
    icon: ArrowRightLeft,
    color: 'tertiary',
    actions: [
      {
        title: 'Bridge BTC to EVM',
        description: 'Move BTC to the L2 layer',
        prompt: 'Bridge 0.001 BTC to the EVM layer',
      },
      {
        title: 'Bridge EVM to BTC',
        description: 'Withdraw from L2 to Bitcoin',
        prompt: 'Withdraw 0.001 BTC from EVM to my Bitcoin address',
      },
      {
        title: 'Check Bridge Status',
        description: 'View pending bridge transactions',
        prompt: 'Check my bridge transaction status',
      },
    ],
  },
  {
    id: 'runes',
    label: 'Runes',
    icon: Layers,
    color: 'warning',
    actions: [
      {
        title: 'List My Runes',
        description: 'View all your rune tokens',
        prompt: 'Show me my runes',
      },
      {
        title: 'Check Rune Balance',
        description: 'Get specific rune balances',
        prompt: 'What rune balances do I have?',
      },
      {
        title: 'Transfer Rune',
        description: 'Send runes to an address',
        prompt: 'Help me transfer runes to another address',
      },
    ],
  },
  {
    id: 'contract',
    label: 'Contracts',
    icon: Code2,
    color: 'success',
    actions: [
      {
        title: 'Deploy ERC-20',
        description: 'Create a new token contract',
        prompt: 'Deploy an ERC-20 token called "MyToken" with symbol "MTK"',
      },
      {
        title: 'Deploy Counter',
        description: 'Simple counter contract',
        prompt: 'Help me deploy a simple counter contract',
      },
      {
        title: 'Read Contract',
        description: 'Query contract state',
        prompt: 'How do I read from a smart contract?',
      },
    ],
  },
  {
    id: 'bitcoin',
    label: 'Bitcoin',
    icon: Bitcoin,
    color: 'accent',
    actions: [
      {
        title: 'Get UTXOs',
        description: 'List unspent outputs',
        prompt: 'Show me my UTXOs',
      },
      {
        title: 'Transaction History',
        description: 'View recent transactions',
        prompt: 'Show my recent Bitcoin transactions',
      },
      {
        title: 'Estimate Fees',
        description: 'Get gas/fee estimates',
        prompt: 'Estimate the gas for a transaction',
      },
    ],
  },
];

const colorClasses = {
  accent: {
    tab: 'data-[active=true]:bg-accent/10 data-[active=true]:text-accent data-[active=true]:border-accent',
    icon: 'text-accent',
    bar: 'bg-accent',
  },
  secondary: {
    tab: 'data-[active=true]:bg-secondary/10 data-[active=true]:text-secondary data-[active=true]:border-secondary',
    icon: 'text-secondary',
    bar: 'bg-secondary',
  },
  tertiary: {
    tab: 'data-[active=true]:bg-tertiary/10 data-[active=true]:text-tertiary data-[active=true]:border-tertiary',
    icon: 'text-tertiary',
    bar: 'bg-tertiary',
  },
  warning: {
    tab: 'data-[active=true]:bg-warning/10 data-[active=true]:text-warning data-[active=true]:border-warning',
    icon: 'text-warning',
    bar: 'bg-warning',
  },
  success: {
    tab: 'data-[active=true]:bg-success/10 data-[active=true]:text-success data-[active=true]:border-success',
    icon: 'text-success',
    bar: 'bg-success',
  },
};

interface ActionCardProps {
  action: Category['actions'][number];
  color: keyof typeof colorClasses;
  index: number;
  onSelect: (prompt: string) => void;
}

const ActionCard = memo(function ActionCard({
  action,
  color,
  index,
  onSelect,
}: ActionCardProps) {
  const colors = colorClasses[color];

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onClick={() => onSelect(action.prompt)}
      className="group relative flex items-center gap-4 w-full min-w-[280px] max-w-[320px] p-4 rounded-xl bg-card border border-card-border text-left transition-all duration-200 hover:border-border-hover hover:-translate-y-0.5 hover:shadow-md"
    >
      {/* Color accent bar */}
      <div
        className={cn(
          'absolute left-0 top-3 bottom-3 w-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity',
          colors.bar
        )}
      />

      {/* Content */}
      <div className="flex-1 pl-2">
        <h4 className="font-medium text-foreground mb-0.5 group-hover:text-foreground transition-colors">
          {action.title}
        </h4>
        <p className="text-sm text-foreground-muted line-clamp-1">
          {action.description}
        </p>
      </div>

      {/* Chevron */}
      <ChevronRight className="w-4 h-4 text-foreground-subtle opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5" />
    </motion.button>
  );
});

interface CategoryTabProps {
  category: Category;
  isActive: boolean;
  onCategoryClick: (id: string) => void;
}

const CategoryTab = memo(function CategoryTab({
  category,
  isActive,
  onCategoryClick,
}: CategoryTabProps) {
  const Icon = category.icon;
  const colors = colorClasses[category.color as keyof typeof colorClasses];

  const handleClick = useCallback(() => {
    onCategoryClick(category.id);
  }, [onCategoryClick, category.id]);

  return (
    <button
      onClick={handleClick}
      data-active={isActive}
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-full border border-border text-sm font-medium whitespace-nowrap transition-all',
        'hover:bg-background-hover hover:border-border-hover',
        colors.tab
      )}
    >
      <Icon className={cn('w-4 h-4', isActive ? colors.icon : 'text-foreground-muted')} />
      <span>{category.label}</span>
      <span className="text-xs text-foreground-subtle">
        {category.actions.length}
      </span>
    </button>
  );
});

/** Suggested actions grid with category tabs */
export function SuggestedActions({ onSelect }: SuggestedActionsProps) {
  const [activeCategory, setActiveCategory] = useState<string>(CATEGORIES[0].id);

  const handleSelect = useCallback(
    (prompt: string) => {
      onSelect(prompt);
    },
    [onSelect]
  );

  const handleCategoryClick = useCallback((id: string) => {
    setActiveCategory(id);
  }, []);

  const currentCategory = CATEGORIES.find((c) => c.id === activeCategory) ?? CATEGORIES[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 text-sm text-foreground-muted">
        <Sparkles className="w-4 h-4 text-accent" />
        <span>Try asking about...</span>
      </div>

      {/* Category tabs - horizontal scroll */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORIES.map((category) => (
          <CategoryTab
            key={category.id}
            category={category}
            isActive={activeCategory === category.id}
            onCategoryClick={handleCategoryClick}
          />
        ))}
      </div>

      {/* Action cards - horizontal scroll */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
        >
          {currentCategory.actions.map((action, idx) => (
            <ActionCard
              key={action.title}
              action={action}
              color={currentCategory.color as keyof typeof colorClasses}
              index={idx}
              onSelect={handleSelect}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default SuggestedActions;
