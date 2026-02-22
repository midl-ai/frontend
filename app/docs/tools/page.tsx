'use client';

import { motion } from 'framer-motion';
import {
  Wrench,
  Globe,
  Wallet,
  Gem,
  FileCode,
  Bitcoin,
  Send,
  ArrowLeftRight,
  Settings,
} from 'lucide-react';

const toolCategories = [
  {
    name: 'Network',
    icon: Globe,
    color: 'accent',
    description: 'Query network state and system information',
    tools: [
      { name: 'midl_get_network_info', description: 'Get chain ID, RPC URL, and network details' },
      { name: 'midl_get_system_contracts', description: 'List MIDL system contract addresses' },
      { name: 'midl_get_block', description: 'Fetch block by number or hash' },
    ],
  },
  {
    name: 'Balance',
    icon: Wallet,
    color: 'secondary',
    description: 'Check balances across BTC and EVM layers',
    tools: [
      { name: 'midl_get_evm_balance', description: 'Get BTC balance on EVM layer (18 decimals)' },
      { name: 'midl_get_btc_balance', description: 'Get Bitcoin UTXO balance (satoshis)' },
      { name: 'midl_get_token_balance', description: 'Get ERC20 token balance' },
    ],
  },
  {
    name: 'Runes',
    icon: Gem,
    color: 'tertiary',
    description: 'Manage Runes on the Bitcoin layer',
    tools: [
      { name: 'midl_get_runes', description: 'List all Runes for an address' },
      { name: 'midl_get_rune_balance', description: 'Get balance of a specific Rune' },
      { name: 'midl_transfer_rune', description: 'Transfer Runes between addresses' },
      { name: 'midl_bridge_rune_to_erc20', description: 'Bridge a Rune to ERC20 on EVM' },
    ],
  },
  {
    name: 'Contract',
    icon: FileCode,
    color: 'accent',
    description: 'Read and write smart contracts',
    tools: [
      { name: 'midl_read_contract', description: 'Call view/pure contract functions' },
      { name: 'midl_write_contract', description: 'Execute state-changing contract calls' },
      { name: 'midl_get_logs', description: 'Query contract event logs' },
      { name: 'midl_verify_contract', description: 'Verify contract source on Blockscout' },
    ],
  },
  {
    name: 'Bitcoin',
    icon: Bitcoin,
    color: 'secondary',
    description: 'Access Bitcoin layer data',
    tools: [
      { name: 'midl_get_utxos', description: 'List UTXOs for a Bitcoin address' },
      { name: 'midl_get_transaction', description: 'Fetch Bitcoin transaction details' },
      { name: 'midl_get_transaction_receipt', description: 'Get transaction receipt and status' },
      { name: 'midl_get_fee_rate', description: 'Current recommended fee rate (sat/vB)' },
    ],
  },
  {
    name: 'Deploy',
    icon: Wrench,
    color: 'tertiary',
    description: 'Deploy smart contracts from templates',
    tools: [
      { name: 'midl_deploy_contract', description: 'Deploy from template (ERC20, Counter, Storage)' },
    ],
    templates: [
      { name: 'erc20', params: 'name, symbol, initialSupply' },
      { name: 'counter', params: 'none' },
      { name: 'storage', params: 'none' },
    ],
  },
  {
    name: 'Transfer',
    icon: Send,
    color: 'accent',
    description: 'Send assets across the network',
    tools: [
      { name: 'midl_transfer_evm', description: 'Send BTC on EVM layer' },
      { name: 'midl_transfer_token', description: 'Transfer ERC20 tokens' },
      { name: 'midl_send_raw_transaction', description: 'Broadcast a signed transaction' },
    ],
  },
  {
    name: 'Bridge',
    icon: ArrowLeftRight,
    color: 'secondary',
    description: 'Move assets between layers',
    tools: [
      { name: 'midl_bridge_btc_to_evm', description: 'Deposit BTC from L1 to EVM L2' },
      { name: 'midl_bridge_evm_to_btc', description: 'Withdraw from EVM L2 to BTC L1' },
    ],
  },
  {
    name: 'Utility',
    icon: Settings,
    color: 'tertiary',
    description: 'Helper functions and conversions',
    tools: [
      { name: 'midl_convert_btc_to_evm', description: 'Convert BTC address to EVM format' },
      { name: 'midl_get_rune_erc20_address', description: 'Get ERC20 address for a bridged Rune' },
      { name: 'midl_estimate_gas', description: 'Estimate gas for a transaction' },
    ],
  },
];

const colorClasses = {
  accent: 'bg-accent/10 text-accent border-accent/20',
  secondary: 'bg-secondary/10 text-secondary border-secondary/20',
  tertiary: 'bg-tertiary/10 text-tertiary border-tertiary/20',
};

export default function ToolsPage() {
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
            <Wrench className="w-5 h-5 text-accent" />
          </div>
          <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium">
            27 tools
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold">Tools Reference</h1>
        <p className="text-lg text-foreground-muted">
          Complete list of MCP tools available for interacting with the MIDL blockchain.
          All tools follow the <code className="px-1.5 py-0.5 rounded bg-background-tertiary text-sm">midl_</code> naming convention.
        </p>
      </motion.div>

      {/* Categories */}
      <div className="space-y-8">
        {toolCategories.map((category, catIdx) => (
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
              <div>
                <h2 className="text-xl font-bold">{category.name}</h2>
                <p className="text-sm text-foreground-muted">{category.description}</p>
              </div>
              <span className="ml-auto px-2 py-1 rounded-full bg-background-tertiary text-xs text-foreground-muted">
                {category.tools.length} tools
              </span>
            </div>

            {/* Tools List */}
            <div className="grid gap-2 pl-13">
              {category.tools.map((tool) => (
                <div
                  key={tool.name}
                  className="flex items-start gap-4 p-4 rounded-xl bg-card border border-card-border hover:border-accent/20 transition-colors"
                >
                  <code className="flex-shrink-0 px-2 py-1 rounded-md bg-background-tertiary text-sm font-mono text-accent">
                    {tool.name}
                  </code>
                  <p className="text-sm text-foreground-muted">{tool.description}</p>
                </div>
              ))}
            </div>

            {/* Templates (for Deploy category) */}
            {category.templates && (
              <div className="pl-13 mt-4">
                <h4 className="text-sm font-semibold mb-2 text-foreground-muted">Available Templates:</h4>
                <div className="flex flex-wrap gap-2">
                  {category.templates.map((template) => (
                    <div
                      key={template.name}
                      className="px-3 py-2 rounded-lg bg-background-tertiary border border-border"
                    >
                      <code className="text-sm font-mono text-accent">{template.name}</code>
                      <span className="text-xs text-foreground-muted ml-2">({template.params})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.section>
        ))}
      </div>

      {/* Summary */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="p-6 rounded-xl bg-gradient-to-r from-accent/5 via-secondary/5 to-tertiary/5 border border-border"
      >
        <h3 className="font-bold mb-4">Tool Annotations</h3>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-success mt-1.5 flex-shrink-0" />
            <div>
              <span className="font-medium">Read-only tools</span>
              <p className="text-foreground-muted">Balance queries, contract reads, network info</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-warning mt-1.5 flex-shrink-0" />
            <div>
              <span className="font-medium">Write tools</span>
              <p className="text-foreground-muted">Transfers, deployments, contract writes</p>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
