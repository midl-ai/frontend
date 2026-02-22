'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Code,
  Copy,
  Check,
  Wallet,
  Send,
  FileCode,
  ArrowLeftRight,
  Globe,
} from 'lucide-react';

const exampleCategories = [
  {
    name: 'Balance Queries',
    icon: Wallet,
    color: 'accent',
    examples: [
      {
        prompt: 'What is my BTC balance?',
        description: 'Get your Bitcoin balance on the EVM layer',
      },
      {
        prompt: 'What is the BTC balance of 0x1234...?',
        description: 'Check any address balance',
      },
      {
        prompt: 'Show me my Rune balances',
        description: 'List all Runes you own',
      },
      {
        prompt: 'What is my balance of the USDC token at 0xA0b8...?',
        description: 'Check ERC20 token balance',
      },
    ],
  },
  {
    name: 'Transfers',
    icon: Send,
    color: 'secondary',
    examples: [
      {
        prompt: 'Transfer 0.001 BTC to 0x9876...',
        description: 'Send BTC on the EVM layer',
      },
      {
        prompt: 'Send 100 USDC to 0xABCD...',
        description: 'Transfer ERC20 tokens',
      },
      {
        prompt: 'Transfer 10 RUNE•EXAMPLE to bc1q...',
        description: 'Send Runes to a Bitcoin address',
      },
    ],
  },
  {
    name: 'Contract Deployment',
    icon: FileCode,
    color: 'tertiary',
    examples: [
      {
        prompt: 'Deploy an ERC20 token called BitcoinCoffee with symbol BCOF and 1000000 initial supply',
        description: 'Deploy a new ERC20 token',
      },
      {
        prompt: 'Deploy a counter contract',
        description: 'Deploy a simple counter',
      },
      {
        prompt: 'Deploy a storage contract',
        description: 'Deploy a key-value storage',
      },
    ],
  },
  {
    name: 'Bridging',
    icon: ArrowLeftRight,
    color: 'accent',
    examples: [
      {
        prompt: 'Bridge 10000 satoshis from Bitcoin to my EVM address',
        description: 'Deposit BTC to EVM layer',
      },
      {
        prompt: 'Withdraw 0.0001 BTC from EVM to bc1q...',
        description: 'Withdraw from EVM to Bitcoin',
      },
      {
        prompt: 'Bridge my RUNE•EXAMPLE to an ERC20 token',
        description: 'Convert Rune to ERC20',
      },
    ],
  },
  {
    name: 'Contract Interaction',
    icon: Code,
    color: 'secondary',
    examples: [
      {
        prompt: 'Read the totalSupply from the contract at 0x1234...',
        description: 'Call a view function',
      },
      {
        prompt: 'What is the name and symbol of the token at 0x5678...?',
        description: 'Read multiple values',
      },
      {
        prompt: 'Call the increment function on the counter at 0xABCD...',
        description: 'Execute a write function',
      },
      {
        prompt: 'Get the recent Transfer events from 0x1234...',
        description: 'Query contract logs',
      },
    ],
  },
  {
    name: 'Network & Utils',
    icon: Globe,
    color: 'tertiary',
    examples: [
      {
        prompt: 'What network am I connected to?',
        description: 'Get network info',
      },
      {
        prompt: 'What are the MIDL system contract addresses?',
        description: 'List system contracts',
      },
      {
        prompt: 'Get the latest block',
        description: 'Fetch recent block',
      },
      {
        prompt: 'What is the current fee rate?',
        description: 'Check transaction fees',
      },
    ],
  },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded-md hover:bg-background-hover transition-colors opacity-0 group-hover:opacity-100"
      aria-label="Copy to clipboard"
    >
      {copied ? (
        <Check className="w-4 h-4 text-success" />
      ) : (
        <Copy className="w-4 h-4 text-foreground-muted" />
      )}
    </button>
  );
}

const colorClasses = {
  accent: 'bg-accent/10 text-accent',
  secondary: 'bg-secondary/10 text-secondary',
  tertiary: 'bg-tertiary/10 text-tertiary',
};

export default function ExamplesPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <Code className="w-5 h-5 text-accent" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold">Examples</h1>
        <p className="text-lg text-foreground-muted">
          Copy-paste prompts for common blockchain operations. Just type these in Claude Desktop
          or Cursor to interact with the MIDL blockchain.
        </p>
      </motion.div>

      {/* Example Categories */}
      <div className="space-y-10">
        {exampleCategories.map((category, catIdx) => (
          <motion.section
            key={category.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 + catIdx * 0.05 }}
            className="space-y-4"
          >
            {/* Category Header */}
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClasses[category.color as keyof typeof colorClasses]}`}>
                <category.icon className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold">{category.name}</h2>
            </div>

            {/* Examples */}
            <div className="grid gap-3">
              {category.examples.map((example, idx) => (
                <div
                  key={idx}
                  className="group flex items-start gap-4 p-4 rounded-xl bg-card border border-card-border hover:border-accent/20 transition-colors"
                >
                  <Code className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <code className="text-sm font-medium block mb-1">{example.prompt}</code>
                    <p className="text-xs text-foreground-muted">{example.description}</p>
                  </div>
                  <CopyButton text={example.prompt} />
                </div>
              ))}
            </div>
          </motion.section>
        ))}
      </div>

      {/* Tips */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="p-6 rounded-xl bg-gradient-to-r from-accent/5 via-secondary/5 to-tertiary/5 border border-border"
      >
        <h3 className="font-bold mb-4">Tips</h3>
        <ul className="space-y-2 text-sm text-foreground-muted">
          <li className="flex items-start gap-2">
            <span className="text-accent">•</span>
            You can use natural language — MIDL understands context and intent.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent">•</span>
            For addresses, you can paste full addresses or use shorthand like &quot;my address&quot;.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent">•</span>
            Chain multiple operations: &quot;Deploy a token and then transfer 100 to 0x...&quot;
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent">•</span>
            Ask follow-up questions: &quot;What was the gas used?&quot; after a transaction.
          </li>
        </ul>
      </motion.section>
    </div>
  );
}
