'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Server,
  Copy,
  Check,
  Terminal,
  Globe,
  Key,
  Settings,
  ExternalLink,
} from 'lucide-react';

const envVariables = [
  {
    name: 'MIDL_PRIVATE_KEY',
    required: true,
    description: 'Private key for signing transactions (hex format with 0x prefix)',
    example: '0x...',
  },
  {
    name: 'MIDL_RPC_URL',
    required: false,
    description: 'EVM RPC endpoint (defaults to mainnet)',
    example: 'https://rpc.midl.xyz',
  },
  {
    name: 'MIDL_BTC_RPC_URL',
    required: false,
    description: 'Bitcoin RPC endpoint',
    example: 'https://btc.midl.xyz',
  },
  {
    name: 'MIDL_MEMPOOL_URL',
    required: false,
    description: 'Mempool API for transaction broadcast',
    example: 'https://mempool.midl.xyz',
  },
  {
    name: 'PORT',
    required: false,
    description: 'HTTP server port (for HTTP transport)',
    example: '3001',
  },
];

const stdioConfig = `{
  "mcpServers": {
    "midl": {
      "command": "node",
      "args": ["dist/index.js"],
      "cwd": "/path/to/mcp-server",
      "env": {
        "MIDL_PRIVATE_KEY": "0x..."
      }
    }
  }
}`;

const httpConfig = `# Live hosted MCP endpoint (no setup required):
https://mcp.midl-ai.xyz/mcp

# Or run locally:
pnpm start:http

# Server runs on http://localhost:3001
# Test with curl:
curl http://localhost:3001/tools`;

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
    </div>
  );
}

export default function McpServerPage() {
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
          <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
            <Server className="w-5 h-5 text-secondary" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold">MCP Server</h1>
        <p className="text-lg text-foreground-muted">
          Configuration reference for the MIDL MCP server. Learn about transports,
          environment variables, and deployment options.
        </p>
      </motion.div>

      {/* What is MCP */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="space-y-4"
      >
        <h2 className="text-2xl font-bold">What is MCP?</h2>
        <p className="text-foreground-muted">
          The <strong>Model Context Protocol (MCP)</strong> is an open standard that enables AI assistants
          to securely connect to external tools and data sources. MIDL implements an MCP server that
          exposes 27 blockchain tools to any MCP-compatible client.
        </p>
        <div className="flex flex-wrap gap-4">
          <a
            href="https://modelcontextprotocol.io"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-accent hover:underline"
          >
            MCP Documentation <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://github.com/midl-ai/mcp-server"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-accent hover:underline"
          >
            MIDL MCP Server <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </motion.section>

      {/* Transport Options */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-6"
      >
        <h2 className="text-2xl font-bold">Transport Options</h2>

        {/* stdio */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Terminal className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-semibold">stdio Transport</h3>
            <span className="px-2 py-0.5 rounded-full bg-success/10 text-success text-xs">Recommended</span>
          </div>
          <p className="text-foreground-muted">
            Standard input/output transport for local AI assistants like Claude Desktop and Cursor.
          </p>
          <CodeBlock code={stdioConfig} filename="claude_desktop_config.json" />
        </div>

        {/* HTTP */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-secondary" />
            <h3 className="text-lg font-semibold">HTTP Transport</h3>
          </div>
          <p className="text-foreground-muted">
            REST API for remote integrations, dashboards, and bots. Use our hosted endpoint or self-host.
          </p>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/10 border border-secondary/20">
            <Globe className="w-4 h-4 text-secondary flex-shrink-0" />
            <span className="text-sm text-foreground-muted">Live endpoint:</span>
            <a
              href="https://mcp.midl-ai.xyz/mcp"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-mono text-secondary hover:underline"
            >
              https://mcp.midl-ai.xyz/mcp
            </a>
            <ExternalLink className="w-3 h-3 text-secondary" />
          </div>
          <CodeBlock code={httpConfig} filename="Terminal" />
        </div>
      </motion.section>

      {/* Environment Variables */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3">
          <Key className="w-5 h-5 text-tertiary" />
          <h2 className="text-2xl font-bold">Environment Variables</h2>
        </div>
        <div className="space-y-3">
          {envVariables.map((env) => (
            <div
              key={env.name}
              className="p-4 rounded-xl bg-card border border-card-border"
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <code className="text-sm font-mono text-accent">{env.name}</code>
                {env.required ? (
                  <span className="px-2 py-0.5 rounded-full bg-error/10 text-error text-xs flex-shrink-0">
                    Required
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-foreground-muted/10 text-foreground-muted text-xs flex-shrink-0">
                    Optional
                  </span>
                )}
              </div>
              <p className="text-sm text-foreground-muted mb-2">{env.description}</p>
              <code className="text-xs px-2 py-1 rounded bg-background-tertiary text-foreground-muted">
                Example: {env.example}
              </code>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Commands */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3">
          <Settings className="w-5 h-5 text-accent" />
          <h2 className="text-2xl font-bold">Available Commands</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { cmd: 'pnpm build', desc: 'Build TypeScript to dist/' },
            { cmd: 'pnpm start', desc: 'Start stdio server' },
            { cmd: 'pnpm start:http', desc: 'Start HTTP server' },
            { cmd: 'pnpm dev', desc: 'Development mode with watch' },
            { cmd: 'pnpm lint', desc: 'Run ESLint' },
            { cmd: 'pnpm typecheck', desc: 'Check TypeScript types' },
          ].map((item) => (
            <div
              key={item.cmd}
              className="flex items-center justify-between p-3 rounded-lg bg-background-tertiary border border-border"
            >
              <div>
                <code className="text-sm font-mono text-accent">{item.cmd}</code>
                <p className="text-xs text-foreground-muted mt-1">{item.desc}</p>
              </div>
              <CopyButton text={item.cmd} />
            </div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
