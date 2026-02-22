'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Rocket,
  CheckCircle2,
  Terminal,
  Code,
  ArrowRight,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';
import { useState } from 'react';

const prerequisites = [
  'Node.js 18+ installed',
  'pnpm package manager',
  'Claude Desktop or Cursor IDE',
  'A MIDL private key (for write operations)',
];

const installSteps = [
  {
    title: 'Clone the Repository',
    command: 'git clone https://github.com/midl-ai/mcp-server.git\ncd mcp-server',
  },
  {
    title: 'Install Dependencies',
    command: 'pnpm install',
  },
  {
    title: 'Set Environment Variables',
    command: 'cp .env.example .env\n# Edit .env with your MIDL_PRIVATE_KEY',
  },
  {
    title: 'Build the Server',
    command: 'pnpm build',
  },
];

const claudeConfig = `{
  "mcpServers": {
    "midl": {
      "command": "node",
      "args": ["dist/index.js"],
      "cwd": "/path/to/mcp-server",
      "env": {
        "MIDL_PRIVATE_KEY": "0x...",
        "MIDL_RPC_URL": "https://rpc.midl.xyz"
      }
    }
  }
}`;

const firstCommands = [
  { prompt: 'What is the current network info?', category: 'Network' },
  { prompt: 'What is my BTC balance?', category: 'Balance' },
  { prompt: 'Show me my Rune balances', category: 'Runes' },
  { prompt: 'Deploy an ERC20 called TestToken with 1000000 supply', category: 'Deploy' },
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
      className="p-1.5 rounded-md hover:bg-background-hover transition-colors"
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

function CodeBlock({ code, filename }: { code: string; filename?: string }) {
  return (
    <div className="rounded-xl bg-background-tertiary border border-border overflow-hidden">
      {filename && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-background-secondary">
          <span className="text-xs text-foreground-muted font-mono">{filename}</span>
          <CopyButton text={code} />
        </div>
      )}
      <pre className="p-4 overflow-x-auto">
        <code className="text-sm font-mono text-foreground-muted">{code}</code>
      </pre>
      {!filename && (
        <div className="absolute top-2 right-2">
          <CopyButton text={code} />
        </div>
      )}
    </div>
  );
}

export default function GettingStartedPage() {
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
            <Rocket className="w-5 h-5 text-accent" />
          </div>
          <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium">
            5 min setup
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold">Getting Started</h1>
        <p className="text-lg text-foreground-muted">
          Set up MIDL AI Terminal in Claude Desktop or Cursor to start interacting with
          the Bitcoin L1 + EVM L2 blockchain through natural language.
        </p>
      </motion.div>

      {/* Prerequisites */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="space-y-4"
      >
        <h2 className="text-xl font-bold">Prerequisites</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {prerequisites.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-card border border-card-border">
              <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
              <span className="text-sm">{item}</span>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Installation */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-6"
      >
        <h2 className="text-xl font-bold">Installation</h2>
        <div className="space-y-4">
          {installSteps.map((step, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-accent/10 text-accent text-sm font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                <h3 className="font-semibold">{step.title}</h3>
              </div>
              <CodeBlock code={step.command} />
            </div>
          ))}
        </div>
      </motion.section>

      {/* Claude Desktop Configuration */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="space-y-4"
      >
        <h2 className="text-xl font-bold">Configure Claude Desktop</h2>
        <p className="text-foreground-muted">
          Add the following to your Claude Desktop configuration file:
        </p>
        <ul className="text-sm text-foreground-muted space-y-1 mb-4">
          <li>• macOS: <code className="px-1.5 py-0.5 rounded bg-background-tertiary">~/Library/Application Support/Claude/claude_desktop_config.json</code></li>
          <li>• Windows: <code className="px-1.5 py-0.5 rounded bg-background-tertiary">%APPDATA%\Claude\claude_desktop_config.json</code></li>
        </ul>
        <CodeBlock code={claudeConfig} filename="claude_desktop_config.json" />
        <p className="text-sm text-foreground-muted">
          Replace <code className="px-1.5 py-0.5 rounded bg-background-tertiary">/path/to/mcp-server</code> with the actual path to your cloned repository.
        </p>
      </motion.section>

      {/* First Commands */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="space-y-4"
      >
        <h2 className="text-xl font-bold">Try These First</h2>
        <p className="text-foreground-muted">
          Once configured, restart Claude Desktop and try these prompts:
        </p>
        <div className="grid gap-3">
          {firstCommands.map((cmd, idx) => (
            <div key={idx} className="flex items-center gap-3 p-4 rounded-xl bg-card border border-card-border group hover:border-accent/30 transition-all">
              <Code className="w-5 h-5 text-accent flex-shrink-0" />
              <div className="flex-1">
                <code className="text-sm">{cmd.prompt}</code>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-background-tertiary text-foreground-muted">
                {cmd.category}
              </span>
              <CopyButton text={cmd.prompt} />
            </div>
          ))}
        </div>
      </motion.section>

      {/* Next Steps */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="space-y-4"
      >
        <h2 className="text-xl font-bold">Next Steps</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            href="/docs/tools"
            className="group p-5 rounded-xl bg-card border border-card-border hover:border-accent/30 transition-all"
          >
            <h3 className="font-semibold mb-2 group-hover:text-accent transition-colors">
              Explore All 27 Tools
            </h3>
            <p className="text-sm text-foreground-muted mb-3">
              See the full list of available operations across 9 categories.
            </p>
            <span className="inline-flex items-center gap-1 text-sm text-accent">
              View tools <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
          <Link
            href="/docs/examples"
            className="group p-5 rounded-xl bg-card border border-card-border hover:border-accent/30 transition-all"
          >
            <h3 className="font-semibold mb-2 group-hover:text-accent transition-colors">
              Browse Examples
            </h3>
            <p className="text-sm text-foreground-muted mb-3">
              Copy-paste prompts for common blockchain workflows.
            </p>
            <span className="inline-flex items-center gap-1 text-sm text-accent">
              View examples <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </div>
      </motion.section>

      {/* External Links */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="p-6 rounded-xl bg-background-secondary border border-border"
      >
        <h3 className="font-semibold mb-3">Useful Links</h3>
        <div className="flex flex-wrap gap-4">
          <a
            href="https://github.com/midl-ai/mcp-server"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-foreground-muted hover:text-accent transition-colors"
          >
            <Terminal className="w-4 h-4" />
            MCP Server Repo
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://midl.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-foreground-muted hover:text-accent transition-colors"
          >
            MIDL Network
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://blockscout.midl.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-foreground-muted hover:text-accent transition-colors"
          >
            Block Explorer
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </motion.section>
    </div>
  );
}
