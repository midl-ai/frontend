'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle,
  ChevronDown,
  Shield,
  Settings,
  Wrench,
  MessageCircle,
} from 'lucide-react';

type Category = 'general' | 'setup' | 'tools' | 'security';

const categories: { id: Category; name: string; icon: React.ElementType; color: string }[] = [
  { id: 'general', name: 'General', icon: MessageCircle, color: 'accent' },
  { id: 'setup', name: 'Setup', icon: Settings, color: 'secondary' },
  { id: 'tools', name: 'Tools', icon: Wrench, color: 'tertiary' },
  { id: 'security', name: 'Security', icon: Shield, color: 'success' },
];

const faqData: Record<Category, { q: string; a: string }[]> = {
  general: [
    {
      q: 'What is MIDL AI Terminal?',
      a: 'MIDL AI Terminal is an MCP (Model Context Protocol) server that enables AI assistants like Claude to interact with the MIDL blockchain through natural language. It provides 27 tools for querying balances, deploying contracts, transferring assets, and bridging between Bitcoin L1 and EVM L2.',
    },
    {
      q: 'What makes MIDL different from other blockchains?',
      a: 'MIDL is a hybrid Bitcoin L1 + EVM L2 chain. It uses Bitcoin for settlement and security while providing full EVM compatibility. BTC is the native currency (with 18 decimals on EVM), and you can bridge Bitcoin-native assets like Runes to ERC20 tokens.',
    },
    {
      q: 'Do I need to know Solidity to use MIDL?',
      a: 'No! You can deploy contracts using natural language. Just describe what you want (e.g., "Deploy an ERC20 token called BitcoinCoffee with 1M supply") and the MCP server handles compilation and deployment.',
    },
    {
      q: 'Which AI assistants are supported?',
      a: 'Any MCP-compatible client works, including Claude Desktop, Cursor IDE, VS Code with MCP extensions, and custom integrations via the HTTP transport.',
    },
  ],
  setup: [
    {
      q: 'What are the prerequisites?',
      a: 'You need Node.js 18+ and pnpm installed. For Claude Desktop, you also need a MIDL private key (which you can generate or use from an existing wallet).',
    },
    {
      q: 'How do I configure Claude Desktop?',
      a: 'Add the MIDL MCP server to your claude_desktop_config.json file. Set the command to "node", args to ["dist/index.js"], cwd to your mcp-server directory, and include your MIDL_PRIVATE_KEY in the env object.',
    },
    {
      q: 'Can I use this with Cursor IDE?',
      a: 'Yes! Cursor supports MCP servers through its settings. The configuration is similar to Claude Desktop — just point it to the built MCP server with your private key.',
    },
    {
      q: 'How do I switch between testnet and mainnet?',
      a: 'Set the MIDL_RPC_URL environment variable to the appropriate RPC endpoint. The staging/regtest URL is https://rpc.staging.midl.xyz, and mainnet is https://rpc.midl.xyz.',
    },
    {
      q: 'What if the MCP server fails to start?',
      a: 'Check that you\'ve run "pnpm build" first, verify your MIDL_PRIVATE_KEY is set correctly (hex format with 0x prefix), and ensure Node.js 18+ is installed. Check the Claude Desktop logs for specific error messages.',
    },
  ],
  tools: [
    {
      q: 'How many tools are available?',
      a: 'There are 27 tools across 9 categories: Network (3), Balance (3), Runes (4), Contract (4), Bitcoin (4), Deploy (1), Transfer (3), Bridge (2), and Utility (3).',
    },
    {
      q: 'Can I deploy any Solidity contract?',
      a: 'Currently, the deploy tool supports pre-defined templates (ERC20, Counter, Storage). For custom contracts, you can compile locally and use the write_contract tool with your bytecode.',
    },
    {
      q: 'What\'s the difference between midl_get_evm_balance and midl_get_btc_balance?',
      a: 'midl_get_evm_balance returns your BTC balance on the EVM layer (18 decimals, in wei). midl_get_btc_balance returns your Bitcoin UTXO balance on L1 (in satoshis).',
    },
    {
      q: 'Can I interact with any smart contract?',
      a: 'Yes! Use midl_read_contract for view functions and midl_write_contract for state-changing calls. You\'ll need the contract address and the function name with arguments.',
    },
    {
      q: 'How do Rune operations work?',
      a: 'Runes are Bitcoin-native tokens. You can query balances with midl_get_runes, transfer them with midl_transfer_rune, and bridge them to ERC20 tokens on the EVM layer with midl_bridge_rune_to_erc20.',
    },
  ],
  security: [
    {
      q: 'Is my private key safe?',
      a: 'Your private key is stored in an environment variable and never leaves your local machine. The MCP server runs locally, and all signing happens server-side. The key is never sent to Claude or any external service.',
    },
    {
      q: 'Can Claude access my private key?',
      a: 'No. Claude only sees the tool interfaces and results. It sends instructions like "transfer 0.001 BTC to address X" and the MCP server handles signing locally. Claude never receives your private key.',
    },
    {
      q: 'What happens if I use the wrong network?',
      a: 'The MCP server validates network compatibility. If you try to interact with contracts on the wrong network, you\'ll get an error. Always verify your MIDL_RPC_URL matches your intended network.',
    },
    {
      q: 'Are transactions reversible?',
      a: 'No. Like all blockchain transactions, MIDL transactions are irreversible once confirmed. The AI will confirm transaction details before executing, but always double-check addresses and amounts.',
    },
    {
      q: 'Should I use this on mainnet with real funds?',
      a: 'Start with testnet/regtest to familiarize yourself with the tools. When moving to mainnet, use small amounts first and always verify transaction details. The AI provides confirmations, but you\'re responsible for approving transactions.',
    },
  ],
};

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-card-border rounded-xl overflow-hidden bg-card">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-background-hover transition-colors"
      >
        <span className="font-medium pr-4">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-foreground-muted" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-4 pb-4 text-foreground-muted text-sm leading-relaxed border-t border-card-border pt-4">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const colorClasses = {
  accent: 'bg-accent/10 text-accent border-accent/20',
  secondary: 'bg-secondary/10 text-secondary border-secondary/20',
  tertiary: 'bg-tertiary/10 text-tertiary border-tertiary/20',
  success: 'bg-success/10 text-success border-success/20',
};

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('general');

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
            <HelpCircle className="w-5 h-5 text-accent" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold">FAQ</h1>
        <p className="text-lg text-foreground-muted">
          Common questions about MIDL AI Terminal, setup, tools, and security.
        </p>
      </motion.div>

      {/* Category Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-wrap gap-2"
      >
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
              activeCategory === cat.id
                ? colorClasses[cat.color as keyof typeof colorClasses]
                : 'bg-background-tertiary border-border text-foreground-muted hover:border-accent/20'
            }`}
          >
            <cat.icon className="w-4 h-4" />
            <span className="text-sm font-medium">{cat.name}</span>
          </button>
        ))}
      </motion.div>

      {/* FAQ Items */}
      <motion.section
        key={activeCategory}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-3"
      >
        {faqData[activeCategory].map((faq, idx) => (
          <FAQItem key={idx} question={faq.q} answer={faq.a} />
        ))}
      </motion.section>

      {/* Still Have Questions */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="p-6 rounded-xl bg-gradient-to-r from-accent/5 via-secondary/5 to-tertiary/5 border border-border"
      >
        <h3 className="font-bold mb-2">Still have questions?</h3>
        <p className="text-sm text-foreground-muted mb-4">
          Check out our GitHub discussions or reach out on Twitter.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="https://github.com/midl-ai/mcp-server/discussions"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-background text-sm font-medium hover:bg-accent/90 transition-colors"
          >
            GitHub Discussions
          </a>
          <a
            href="https://x.com/midl_xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-background-tertiary border border-border text-sm font-medium hover:border-accent/20 transition-colors"
          >
            @midl_xyz on X
          </a>
        </div>
      </motion.section>
    </div>
  );
}
