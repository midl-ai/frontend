'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { AnimatedStats } from '@/components/ui/animated-stats';

/** Stats section with animated counters */
export function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      ref={ref}
      className="py-20 bg-background-secondary border-y border-border relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-dots opacity-30 dark:opacity-20 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-3">Protocol at a Glance</h2>
          <p className="text-foreground-muted">
            One conversation to rule all blockchain operations
          </p>
        </motion.div>

        {/* Stats Grid */}
        <AnimatedStats />

        {/* Additional info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-foreground-muted">
            Supporting{' '}
            <span className="text-accent font-medium">Bitcoin Mainnet</span>,{' '}
            <span className="text-secondary font-medium">MIDL L2</span>, and{' '}
            <span className="text-tertiary font-medium">Runes Protocol</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default StatsSection;
