'use client';

import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import { useRef, useEffect, memo } from 'react';
import { Wrench, FolderTree, ArrowLeftRight, Gem } from 'lucide-react';

interface StatProps {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  icon: React.ReactNode;
  delay?: number;
}

const AnimatedNumber = memo(function AnimatedNumber({
  value,
  suffix = '',
  prefix = '',
}: {
  value: number;
  suffix?: string;
  prefix?: string;
}) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      animate(count, value, {
        duration: 2,
        ease: 'easeOut',
      });
    }
  }, [isInView, value, count]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
});

const Stat = memo(function Stat({ value, suffix, prefix, label, icon, delay = 0 }: StatProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, rotateX: -30 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{
        duration: 0.6,
        delay,
        type: 'spring',
        stiffness: 100,
      }}
      className="relative group"
    >
      <div className="bg-card border border-card-border rounded-2xl p-6 transition-all duration-300 group-hover:border-accent/30 group-hover:shadow-glow">
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-4 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>

        {/* Value */}
        <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          <AnimatedNumber value={value} suffix={suffix} prefix={prefix} />
        </div>

        {/* Label */}
        <p className="text-sm text-foreground-muted">{label}</p>

        {/* Hover glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    </motion.div>
  );
});

/** Grid of animated statistics */
export const AnimatedStats = memo(function AnimatedStats() {
  const stats = [
    {
      value: 27,
      label: 'MCP Tools',
      icon: <Wrench className="w-6 h-6" />,
    },
    {
      value: 9,
      label: 'Categories',
      icon: <FolderTree className="w-6 h-6" />,
    },
    {
      value: 2,
      label: 'Transports',
      icon: <ArrowLeftRight className="w-6 h-6" />,
    },
    {
      value: 4,
      label: 'Rune Operations',
      icon: <Gem className="w-6 h-6" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {stats.map((stat, index) => (
        <Stat
          key={stat.label}
          {...stat}
          delay={index * 0.1}
        />
      ))}
    </div>
  );
});

export default AnimatedStats;
