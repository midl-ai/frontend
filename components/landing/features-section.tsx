'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, memo } from 'react';
import {
  Layers,
  Code2,
  Gem,
  Zap,
  ArrowLeftRight,
  LayoutGrid,
} from 'lucide-react';

const FEATURES = [
  {
    icon: Layers,
    title: 'Bitcoin + EVM Unified',
    description:
      'One conversation controls both layers. Query BTC balances, deploy EVM contracts, bridge assets — all in the same chat.',
    color: 'accent',
  },
  {
    icon: Gem,
    title: 'Rune Operations',
    description:
      'Full Runes support: check balances, transfer between addresses, and bridge Runes to ERC20 tokens on the EVM layer.',
    color: 'secondary',
  },
  {
    icon: Code2,
    title: 'Smart Contract Deployment',
    description:
      '"Deploy an ERC20 called BitcoinCoffee" → live contract in seconds. No Hardhat, no config, no boilerplate.',
    color: 'tertiary',
  },
  {
    icon: ArrowLeftRight,
    title: 'Cross-Layer Bridging',
    description:
      'Move BTC between layers seamlessly. Deposit satoshis to EVM, withdraw back to Bitcoin — built-in bridge operations.',
    color: 'accent',
  },
  {
    icon: Zap,
    title: 'MCP Protocol',
    description:
      'Works in Claude Desktop, Cursor, VS Code, and any MCP-compatible client. Dual transport: stdio + HTTP.',
    color: 'secondary',
  },
  {
    icon: LayoutGrid,
    title: 'Generative UI',
    description:
      'Rich visual cards for every response — balance displays, transaction receipts, Rune portfolios. Not plain text.',
    color: 'tertiary',
  },
];

const colorClasses = {
  accent: {
    bg: 'bg-accent/10',
    text: 'text-accent',
    border: 'group-hover:border-accent/50',
    glow: 'group-hover:shadow-[0_0_30px_rgba(249,115,22,0.15)]',
  },
  secondary: {
    bg: 'bg-secondary/10',
    text: 'text-secondary',
    border: 'group-hover:border-secondary/50',
    glow: 'group-hover:shadow-[0_0_30px_rgba(167,139,250,0.15)]',
  },
  tertiary: {
    bg: 'bg-tertiary/10',
    text: 'text-tertiary',
    border: 'group-hover:border-tertiary/50',
    glow: 'group-hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]',
  },
};

interface FeatureCardProps {
  feature: (typeof FEATURES)[number];
  index: number;
}

const FeatureCard = memo(function FeatureCard({ feature, index }: FeatureCardProps) {
  const colors = colorClasses[feature.color as keyof typeof colorClasses];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`group relative p-8 rounded-2xl bg-card border border-card-border transition-all duration-300 ${colors.border} ${colors.glow} hover:-translate-y-1`}
    >
      {/* Icon */}
      <div
        className={`w-14 h-14 rounded-xl ${colors.bg} flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
      >
        <feature.icon className={`w-7 h-7 ${colors.text}`} />
      </div>

      {/* Content */}
      <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
      <p className="text-foreground-muted leading-relaxed">{feature.description}</p>

      {/* Hover accent line */}
      <div
        className={`absolute bottom-0 left-8 right-8 h-0.5 ${colors.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      />
    </motion.div>
  );
});

/** Features grid with staggered animations */
export function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} id="features" className="py-24 border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            27 Tools · 9 Categories
          </span>
          <h2 className="text-4xl font-bold mb-4">
            Full blockchain access via{' '}
            <span className="gradient-text">natural language</span>
          </h2>
          <p className="text-foreground-muted max-w-2xl mx-auto text-lg">
            Query balances, deploy contracts, transfer tokens, bridge assets, manage Runes —
            all through conversation in Claude Desktop or Cursor.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, idx) => (
            <FeatureCard key={feature.title} feature={feature} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
