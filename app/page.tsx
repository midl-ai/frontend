'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Terminal,
  MessageSquare,
  Zap,
  Shield,
  Layers,
  Bitcoin,
  Code2,
  Repeat,
  Sparkles,
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme/theme-toggle';

// Conversation examples showing MIDL capabilities
const conversations = [
  {
    user: 'What is my EVM balance?',
    ai: 'Your EVM balance is 0.5234 BTC at address 0x1a2b...3c4d',
  },
  {
    user: 'Bridge 0.01 BTC to EVM',
    ai: 'Bridge initiated. TX: btc1...xyz. Estimated time: ~10 minutes',
  },
  {
    user: 'Deploy a counter contract',
    ai: 'Contract deployed at 0xabc...def. Gas used: 21,000',
  },
];

// Feature highlights
const features = [
  {
    icon: Bitcoin,
    title: 'Bitcoin Native',
    description:
      'Interact with real Bitcoin - check balances, UTXOs, and fee rates directly.',
  },
  {
    icon: Layers,
    title: 'EVM Smart Contracts',
    description:
      'Deploy and interact with Solidity contracts on the MIDL EVM layer.',
  },
  {
    icon: Repeat,
    title: 'Seamless Bridging',
    description:
      'Bridge BTC between Bitcoin L1 and EVM L2 with simple commands.',
  },
  {
    icon: Sparkles,
    title: 'Runes Support',
    description:
      'Query, transfer, and bridge Bitcoin Runes to ERC-20 tokens.',
  },
  {
    icon: Code2,
    title: 'Contract Templates',
    description:
      'Deploy ERC-20, Counter, or custom contracts with pre-built templates.',
  },
  {
    icon: Shield,
    title: 'Non-Custodial',
    description:
      'Your keys, your Bitcoin. Connect Xverse wallet and sign transactions.',
  },
];

// Stats
const stats = [
  { value: '29+', label: 'AI Tools' },
  { value: '2', label: 'Layers (L1 + L2)' },
  { value: '100%', label: 'Bitcoin Secured' },
  { value: '0', label: 'Keys Stored' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <Bitcoin className="w-5 h-5 text-accent-foreground" />
            </div>
            MIDL<span className="text-accent">AI</span>
          </Link>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              href="/chat"
              className="px-4 py-2 rounded-lg bg-accent text-accent-foreground font-medium hover:bg-accent-hover transition-colors flex items-center gap-2"
            >
              Launch Terminal
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/30 bg-accent/10 text-accent text-sm">
                <Sparkles className="w-4 h-4" />
                <span>Bitcoin + EVM AI Terminal</span>
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-bold leading-tight text-foreground">
                  Talk to
                  <br />
                  <span className="text-accent">Bitcoin.</span>
                </h1>

                <p className="text-xl text-foreground-muted leading-relaxed max-w-lg">
                  Bridge, deploy, and interact with the MIDL blockchain through
                  natural conversation. No complex interfaces - just ask.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/chat"
                  className="px-8 py-4 rounded-xl bg-accent text-accent-foreground font-bold text-lg hover:bg-accent-hover transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  Launch Terminal
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 rounded-xl border border-border bg-background-secondary text-foreground font-bold text-lg hover:bg-background-hover transition-all flex items-center justify-center gap-2"
                >
                  View on GitHub
                </a>
              </div>

              {/* Quick Stats */}
              <div className="flex items-center gap-6 text-sm text-foreground-muted">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                  <span>29+ tools live</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                  <span>Non-custodial</span>
                </div>
              </div>
            </div>

            {/* Right - Terminal Preview */}
            <div className="bg-background-secondary border border-border rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-4 text-sm text-foreground-muted">
                <Terminal className="w-4 h-4 text-accent" />
                <span className="font-mono">midl-ai-terminal</span>
              </div>

              <div className="space-y-4">
                {conversations.map((conv, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="text-accent font-mono text-sm">$</span>
                      <span className="text-foreground font-mono text-sm">
                        {conv.user}
                      </span>
                    </div>
                    <div className="flex items-start gap-2 ml-4">
                      <MessageSquare className="w-4 h-4 text-success mt-0.5 shrink-0" />
                      <span className="text-success/80 text-sm">{conv.ai}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-foreground-muted">
                  <span className="text-accent font-mono text-sm">$</span>
                  <span className="text-foreground-muted text-sm animate-pulse">
                    Type your command...
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background-secondary border-y border-border">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-accent mb-2">
                  {stat.value}
                </div>
                <div className="text-foreground-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-32">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-xl text-foreground-muted max-w-2xl mx-auto">
              From Bitcoin L1 to EVM smart contracts - control everything
              through conversation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative p-8 rounded-xl border border-border bg-background-secondary">
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-bold">
                1
              </div>
              <Terminal className="w-12 h-12 text-accent mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Type Naturally
              </h3>
              <p className="text-foreground-muted">
                &quot;Bridge 0.01 BTC to EVM&quot; or &quot;Deploy an ERC-20
                token&quot; - just describe what you want.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative p-8 rounded-xl border border-border bg-background-secondary">
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-bold">
                2
              </div>
              <Zap className="w-12 h-12 text-accent mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                AI Processes
              </h3>
              <p className="text-foreground-muted">
                The AI understands your intent, selects the right tools, and
                prepares the transaction or query.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative p-8 rounded-xl border border-border bg-background-secondary">
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-bold">
                3
              </div>
              <Shield className="w-12 h-12 text-accent mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                You Approve
              </h3>
              <p className="text-foreground-muted">
                Review the transaction, sign with your Xverse wallet, and it
                executes on MIDL. Your keys, your control.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 md:py-32 bg-background-secondary">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-foreground-muted max-w-2xl mx-auto">
              29+ AI tools covering every aspect of the MIDL blockchain.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-xl border border-border bg-background hover:border-accent/50 transition-colors group"
              >
                <feature.icon className="w-10 h-10 text-accent mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-foreground-muted text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-accent/10 via-background to-accent/5">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Stop navigating.
            <br />
            <span className="text-accent">Start talking.</span>
          </h2>
          <p className="text-xl text-foreground-muted mb-12 max-w-2xl mx-auto">
            The entire MIDL blockchain at your fingertips. Bitcoin L1 + EVM L2,
            unified by AI.
          </p>

          <Link
            href="/chat"
            className="inline-flex items-center gap-2 px-12 py-6 rounded-xl bg-accent text-accent-foreground font-bold text-xl hover:bg-accent-hover transition-all shadow-lg hover:shadow-xl"
          >
            Launch Terminal Now
            <ArrowRight className="w-6 h-6" />
          </Link>

          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-foreground-muted">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-accent" />
              <span>Bitcoin secured</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-accent" />
              <span>Instant responses</span>
            </div>
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-accent" />
              <span>Open source</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-bold">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <Bitcoin className="w-5 h-5 text-accent-foreground" />
              </div>
              MIDL<span className="text-accent">AI</span>
            </div>

            <p className="text-sm text-foreground-muted">
              Built for the MIDL VibeHack Hackathon 2026
            </p>

            <div className="flex items-center gap-4 text-sm text-foreground-muted">
              <Link href="/chat" className="hover:text-foreground">
                Terminal
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
