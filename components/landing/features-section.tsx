'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, memo } from 'react';
import {
  Layers,
  Code2,
  ShieldCheck,
  Zap,
  RefreshCw,
  Terminal,
} from 'lucide-react';

const FEATURES = [
  {
    icon: Layers,
    title: 'Multi-Layer Orchestration',
    description:
      'Seamlessly interact across Bitcoin L1 and EVM L2. One prompt handles both chains.',
    color: 'accent',
  },
  {
    icon: Code2,
    title: 'Generative Contracts',
    description:
      'Deploy complex Solidity contracts simply by describing their logic in plain English.',
    color: 'secondary',
  },
  {
    icon: ShieldCheck,
    title: 'Non-Custodial Security',
    description:
      'AI constructs transactions, you sign them. Your keys never leave your wallet.',
    color: 'tertiary',
  },
  {
    icon: Zap,
    title: 'Instant Execution',
    description:
      'From natural language to on-chain transaction in seconds. No boilerplate required.',
    color: 'accent',
  },
  {
    icon: RefreshCw,
    title: 'Cross-Chain Bridging',
    description:
      'Move assets between Bitcoin and EVM seamlessly with built-in bridge operations.',
    color: 'secondary',
  },
  {
    icon: Terminal,
    title: 'MCP Standard',
    description:
      'Built on Model Context Protocol for universal AI agent compatibility.',
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
            Capabilities
          </span>
          <h2 className="text-4xl font-bold mb-4">
            Everything you need to{' '}
            <span className="gradient-text">talk to Bitcoin</span>
          </h2>
          <p className="text-foreground-muted max-w-2xl mx-auto text-lg">
            Built on the Model Context Protocol (MCP), MIDL connects AI agents
            directly to blockchain operations.
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
