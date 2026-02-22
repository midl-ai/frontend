'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Terminal } from 'lucide-react';
import { FloatingCardStack } from '@/components/ui/floating-cards';
import { BeamsBackground } from '@/components/ui/beams-background';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

/** Hero section with animated background and floating cards */
export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Animated background */}
      <BeamsBackground />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background pointer-events-none" />

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-grid opacity-[0.02] dark:opacity-[0.03] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          {/* Left Content */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="flex-1 space-y-8"
          >
            {/* Badge */}
            <motion.div variants={fadeInUp} transition={{ duration: 0.5 }}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium border border-accent/20 backdrop-blur-sm">
                <Zap className="w-4 h-4" />
                <span>VibeHack 2026 Finalist</span>
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeInUp}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]"
            >
              The First MCP for
              <br />
              <span className="gradient-text">Bitcoin+EVM</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={fadeInUp}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-foreground-muted max-w-xl leading-relaxed"
            >
              Deploy contracts, transfer tokens, and bridge assets through{' '}
              <span className="text-foreground font-medium">natural language</span>.
              No SDK. No setup. Just ask.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeInUp}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Link
                href="/chat"
                className="group px-8 py-4 rounded-xl bg-accent text-accent-foreground font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-glow-lg hover:scale-[1.02]"
              >
                Launch Terminal
                <Terminal className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              </Link>

              <a
                href="https://github.com/midl-ai/mcp-server"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-xl border border-border bg-background hover:bg-background-hover transition-all flex items-center justify-center gap-2 font-medium hover:border-accent/30"
              >
                View Source
                <ArrowRight className="w-5 h-5" />
              </a>
            </motion.div>

            {/* Status indicators */}
            <motion.div
              variants={fadeInUp}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="pt-8 flex flex-wrap items-center gap-6 text-sm text-foreground-muted"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span>Bitcoin L1 + EVM L2</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent" />
                <span>27 Tools</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-secondary" />
                <span>9 Categories</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-tertiary" />
                <span>Runes Support</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Floating Cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex-1 w-full"
          >
            <FloatingCardStack />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
