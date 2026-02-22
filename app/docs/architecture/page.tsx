'use client';

import { motion } from 'framer-motion';
import {
  Layers,
  Server,
  Terminal,
  Globe,
  Shield,
  Zap,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

const architectureLayers = [
  {
    name: 'MCP Protocol Layer',
    description: 'Model Context Protocol interface for AI assistants',
    icon: Terminal,
    color: 'accent',
    points: [
      'Stdio transport for Claude Desktop & Cursor',
      'HTTP transport for REST API access',
      'Tool discovery and schema validation',
      'Structured error responses',
    ],
  },
  {
    name: 'Plugin Architecture',
    description: '9 modular plugins with isolated tool implementations',
    icon: Layers,
    color: 'secondary',
    points: [
      'PluginBase → Plugin → ToolBase inheritance',
      'One tool per file for maintainability',
      'Shared types and constants',
      'Automatic tool registration',
    ],
  },
  {
    name: 'Blockchain Clients',
    description: 'Dual-layer access to Bitcoin L1 and EVM L2',
    icon: Globe,
    color: 'tertiary',
    points: [
      'EVM operations via @midl/viem',
      'Bitcoin operations via @midl/node',
      'Server-side signing with keyPairConnector',
      'Transaction construction and broadcasting',
    ],
  },
];

const techStack = [
  { category: 'Runtime', items: ['Node.js 18+', 'TypeScript 5.9'] },
  { category: 'MCP SDK', items: ['@modelcontextprotocol/sdk'] },
  { category: 'MIDL SDK', items: ['@midl/core', '@midl/executor', '@midl/node', '@midl/viem'] },
  { category: 'Build', items: ['tsup', 'tsx'] },
];

const securityPoints = [
  'Private key loaded from environment variable',
  'Server-side signing — key never exposed to client',
  'All write operations return transaction receipts',
  'Structured error handling with revert reasons',
];

const transportComparison = [
  {
    name: 'stdio',
    description: 'Standard input/output for local AI assistants',
    useCases: ['Claude Desktop', 'Cursor IDE', 'VS Code'],
    pros: ['Zero network latency', 'Secure local communication', 'Native MCP support'],
  },
  {
    name: 'HTTP',
    description: 'REST API for remote integrations',
    useCases: ['Web dashboards', 'Bots', 'Custom integrations'],
    pros: ['Remote access', 'Easy debugging', 'Tool for any HTTP client'],
  },
];

export default function ArchitecturePage() {
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
            <Layers className="w-5 h-5 text-secondary" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold">Architecture</h1>
        <p className="text-lg text-foreground-muted">
          MIDL AI Terminal is built on the Model Context Protocol (MCP), providing a standardized
          interface for AI assistants to interact with the MIDL blockchain.
        </p>
      </motion.div>

      {/* System Layers */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="space-y-6"
      >
        <h2 className="text-2xl font-bold">System Layers</h2>
        <div className="space-y-4">
          {architectureLayers.map((layer) => (
            <div
              key={layer.name}
              className="p-6 rounded-xl bg-card border border-card-border"
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  layer.color === 'accent' ? 'bg-accent/10 text-accent' :
                  layer.color === 'secondary' ? 'bg-secondary/10 text-secondary' :
                  'bg-tertiary/10 text-tertiary'
                }`}>
                  <layer.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-1">{layer.name}</h3>
                  <p className="text-foreground-muted mb-4">{layer.description}</p>
                  <ul className="grid sm:grid-cols-2 gap-2">
                    {layer.points.map((point, pidx) => (
                      <li key={pidx} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Dual Transport */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-6"
      >
        <h2 className="text-2xl font-bold">Dual Transport</h2>
        <p className="text-foreground-muted">
          The server supports both stdio and HTTP transports, enabling use in local AI assistants
          and remote integrations.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {transportComparison.map((transport) => (
            <div
              key={transport.name}
              className="p-6 rounded-xl bg-card border border-card-border"
            >
              <div className="flex items-center gap-2 mb-3">
                <Server className="w-5 h-5 text-accent" />
                <code className="text-lg font-bold font-mono">{transport.name}</code>
              </div>
              <p className="text-sm text-foreground-muted mb-4">{transport.description}</p>
              <div className="space-y-3">
                <div>
                  <h4 className="text-xs font-semibold text-foreground-muted uppercase mb-2">Use Cases</h4>
                  <div className="flex flex-wrap gap-1">
                    {transport.useCases.map((uc) => (
                      <span key={uc} className="px-2 py-1 rounded-md bg-background-tertiary text-xs">
                        {uc}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-foreground-muted uppercase mb-2">Benefits</h4>
                  <ul className="space-y-1">
                    {transport.pros.map((pro) => (
                      <li key={pro} className="flex items-center gap-2 text-sm">
                        <Zap className="w-3 h-3 text-accent" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Security */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-success" />
          <h2 className="text-2xl font-bold">Security Model</h2>
        </div>
        <div className="p-6 rounded-xl bg-success/5 border border-success/20">
          <ul className="space-y-3">
            {securityPoints.map((point, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.section>

      {/* Tech Stack */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="space-y-4"
      >
        <h2 className="text-2xl font-bold">Technology Stack</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {techStack.map((stack) => (
            <div
              key={stack.category}
              className="p-4 rounded-xl bg-card border border-card-border"
            >
              <h3 className="text-sm font-semibold text-foreground-muted mb-3">{stack.category}</h3>
              <ul className="space-y-2">
                {stack.items.map((item) => (
                  <li key={item}>
                    <code className="text-sm px-2 py-1 rounded bg-background-tertiary">{item}</code>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Next Steps */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="p-6 rounded-xl bg-background-secondary border border-border"
      >
        <h3 className="font-bold mb-4">Learn More</h3>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/docs/mcp-server"
            className="inline-flex items-center gap-2 text-accent hover:gap-3 transition-all"
          >
            MCP Server Configuration <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="https://github.com/midl-ai/mcp-server"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-foreground-muted hover:text-accent transition-colors"
          >
            View Source on GitHub <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </motion.section>
    </div>
  );
}
