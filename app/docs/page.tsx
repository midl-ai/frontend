'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Rocket,
  Wrench,
  Layers,
  Code,
  Server,
  HelpCircle,
  ArrowRight,
  Terminal,
  Copy,
  Check,
} from 'lucide-react';
import { useState } from 'react';

const quickStartSteps = [
  {
    step: 1,
    title: 'Clone the MCP Server',
    command: 'git clone https://github.com/midl-ai/mcp-server.git',
    description: 'Get the MIDL MCP server source code',
  },
  {
    step: 2,
    title: 'Install Dependencies',
    command: 'cd mcp-server && pnpm install',
    description: 'Install all required packages',
  },
  {
    step: 3,
    title: 'Configure Claude Desktop',
    command: 'Add to claude_desktop_config.json',
    description: 'Connect the MCP server to Claude',
  },
];

const featuredDocs = [
  {
    title: 'Getting Started',
    description: 'Set up MIDL in Claude Desktop or Cursor in under 5 minutes.',
    href: '/docs/getting-started',
    icon: Rocket,
    color: 'accent',
  },
  {
    title: 'Tools Reference',
    description: 'Explore all 27 tools across 9 categories for blockchain operations.',
    href: '/docs/tools',
    icon: Wrench,
    color: 'secondary',
  },
  {
    title: 'Architecture',
    description: 'Understand the MCP protocol, plugin system, and dual transport.',
    href: '/docs/architecture',
    icon: Layers,
    color: 'tertiary',
  },
  {
    title: 'Examples',
    description: 'Copy-paste prompts for common blockchain operations.',
    href: '/docs/examples',
    icon: Code,
    color: 'accent',
  },
];

const additionalDocs = [
  {
    title: 'MCP Server',
    description: 'Configuration, environment variables, and transport options.',
    href: '/docs/mcp-server',
    icon: Server,
  },
  {
    title: 'FAQ',
    description: 'Common questions about security, wallets, and usage.',
    href: '/docs/faq',
    icon: HelpCircle,
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

export default function DocsPage() {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-4"
      >
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium border border-accent/20">
          <Terminal className="w-4 h-4" />
          Documentation
        </span>
        <h1 className="text-4xl md:text-5xl font-bold">
          Build with <span className="gradient-text">MIDL</span>
        </h1>
        <p className="text-lg text-foreground-muted max-w-2xl mx-auto">
          Everything you need to interact with Bitcoin L1 + EVM L2 through natural language.
          From setup to advanced usage.
        </p>
      </motion.div>

      {/* Quick Start */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="space-y-6"
      >
        <h2 className="text-2xl font-bold">Quick Start</h2>
        <div className="grid gap-4">
          {quickStartSteps.map((item, idx) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + idx * 0.1 }}
              className="flex items-start gap-4 p-4 rounded-xl bg-card border border-card-border"
            >
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-sm flex-shrink-0">
                {item.step}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-foreground-muted mb-2">{item.description}</p>
                <div className="flex items-center gap-2 bg-background-tertiary rounded-lg px-3 py-2 font-mono text-sm">
                  <code className="flex-1 truncate text-foreground-muted">{item.command}</code>
                  <CopyButton text={item.command} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <Link
          href="/docs/getting-started"
          className="inline-flex items-center gap-2 text-accent font-medium hover:gap-3 transition-all"
        >
          Full setup guide
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.section>

      {/* Featured Docs */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="space-y-6"
      >
        <h2 className="text-2xl font-bold">Featured</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {featuredDocs.map((doc) => (
            <Link
              key={doc.href}
              href={doc.href}
              className="group p-6 rounded-xl bg-card border border-card-border hover:border-accent/30 hover:shadow-glow transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-4 group-hover:scale-110 transition-transform">
                <doc.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2 group-hover:text-accent transition-colors">
                {doc.title}
              </h3>
              <p className="text-foreground-muted text-sm">{doc.description}</p>
            </Link>
          ))}
        </div>
      </motion.section>

      {/* Additional Docs */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="space-y-6"
      >
        <h2 className="text-2xl font-bold">More Resources</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {additionalDocs.map((doc) => (
            <Link
              key={doc.href}
              href={doc.href}
              className="group flex items-center gap-4 p-4 rounded-xl bg-card border border-card-border hover:border-accent/30 transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-background-tertiary flex items-center justify-center text-foreground-muted group-hover:text-accent transition-colors">
                <doc.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold group-hover:text-accent transition-colors">{doc.title}</h3>
                <p className="text-sm text-foreground-muted">{doc.description}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-foreground-muted group-hover:text-accent transition-colors" />
            </Link>
          ))}
        </div>
      </motion.section>

      {/* Help CTA */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="p-8 rounded-2xl bg-gradient-to-r from-accent/10 via-secondary/10 to-accent/10 border border-accent/20 text-center"
      >
        <h2 className="text-xl font-bold mb-2">Need help?</h2>
        <p className="text-foreground-muted mb-4">
          Jump into the terminal and ask MIDL directly, or check the FAQ.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/chat"
            className="px-6 py-3 rounded-xl bg-accent text-accent-foreground font-medium hover:opacity-90 transition-opacity"
          >
            Launch Terminal
          </Link>
          <Link
            href="/docs/faq"
            className="px-6 py-3 rounded-xl border border-border hover:bg-background-hover transition-colors font-medium"
          >
            View FAQ
          </Link>
        </div>
      </motion.section>
    </div>
  );
}
