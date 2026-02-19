'use client';

import { cn } from '@/lib/utils';

interface SuggestedActionsProps {
  onSelect: (prompt: string) => void;
}

const SUGGESTED_ACTIONS = [
  {
    category: 'Balance',
    actions: [
      { title: 'Check my EVM balance', prompt: 'What is my EVM balance?' },
      { title: 'Check my BTC balance', prompt: 'What is my BTC balance?' },
    ],
  },
  {
    category: 'Network',
    actions: [
      { title: 'Network info', prompt: 'Show me the network information' },
      { title: 'Latest block', prompt: 'What is the latest block?' },
      { title: 'Fee rates', prompt: 'What are the current BTC fee rates?' },
    ],
  },
  {
    category: 'Runes',
    actions: [
      { title: 'List my runes', prompt: 'Show me my runes' },
      { title: 'Check rune balance', prompt: 'What rune balances do I have?' },
    ],
  },
  {
    category: 'Bridge',
    actions: [
      { title: 'Bridge BTC to EVM', prompt: 'Bridge 0.001 BTC to the EVM layer' },
      { title: 'Bridge status', prompt: 'Check my bridge transaction status' },
    ],
  },
  {
    category: 'Contract',
    actions: [
      { title: 'Deploy a contract', prompt: 'Help me deploy a simple counter contract' },
      { title: 'Read contract', prompt: 'How do I read from a smart contract?' },
    ],
  },
];

export function SuggestedActions({ onSelect }: SuggestedActionsProps) {
  return (
    <div className="space-y-4">
      {SUGGESTED_ACTIONS.map((category) => (
        <div key={category.category}>
          <h3 className="text-sm font-medium text-foreground-muted mb-2">
            {category.category}
          </h3>
          <div className="flex flex-wrap gap-2">
            {category.actions.map((action) => (
              <button
                key={action.title}
                onClick={() => onSelect(action.prompt)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm',
                  'bg-background-secondary border border-border',
                  'hover:bg-background-hover hover:border-border-hover',
                  'text-foreground transition-colors'
                )}
              >
                {action.title}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
