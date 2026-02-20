'use client';

import { motion } from 'framer-motion';
import { Bitcoin, Wallet, Zap, Layers } from 'lucide-react';
import { memo } from 'react';

interface FloatingCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  delay?: number;
  rotateDirection?: 'left' | 'right';
}

const FloatingCard = memo(function FloatingCard({
  icon,
  label,
  value,
  delay = 0,
  rotateDirection = 'left',
}: FloatingCardProps) {
  const rotateValues = rotateDirection === 'left' ? [0, -3, 0] : [0, 3, 0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="relative"
    >
      <motion.div
        animate={{
          y: [0, -8, 0],
          rotate: rotateValues,
        }}
        transition={{
          duration: 4 + delay,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="bg-card border border-card-border rounded-xl p-4 shadow-lg backdrop-blur-sm"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
            {icon}
          </div>
          <div>
            <p className="text-xs text-foreground-muted">{label}</p>
            <p className="font-mono font-semibold text-foreground">{value}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});

/** Stack of floating cards showing MIDL capabilities */
export const FloatingCardStack = memo(function FloatingCardStack() {
  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-accent/20 via-secondary/20 to-accent/20 rounded-3xl blur-3xl opacity-50" />

      {/* Cards container */}
      <div className="relative space-y-4 py-8">
        {/* Card 1 - BTC Balance */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="ml-0"
        >
          <FloatingCard
            icon={<Bitcoin className="w-5 h-5" />}
            label="BTC Balance"
            value="2.45839201"
            delay={0}
            rotateDirection="left"
          />
        </motion.div>

        {/* Card 2 - EVM Wallet */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="ml-12"
        >
          <FloatingCard
            icon={<Wallet className="w-5 h-5" />}
            label="EVM Address"
            value="0x1a2b...8f9d"
            delay={0.5}
            rotateDirection="right"
          />
        </motion.div>

        {/* Card 3 - Transaction */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="ml-4"
        >
          <FloatingCard
            icon={<Zap className="w-5 h-5" />}
            label="Last Bridge"
            value="0.5 BTC → L2"
            delay={1}
            rotateDirection="left"
          />
        </motion.div>

        {/* Card 4 - Runes */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className="ml-16"
        >
          <FloatingCard
            icon={<Layers className="w-5 h-5" />}
            label="Active Runes"
            value="3 tokens"
            delay={1.5}
            rotateDirection="right"
          />
        </motion.div>
      </div>

      {/* Connection lines (decorative) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: -1 }}
      >
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.3" />
            <stop offset="50%" stopColor="var(--secondary)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
});

export default FloatingCardStack;
