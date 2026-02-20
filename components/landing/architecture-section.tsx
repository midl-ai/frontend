'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';

const ARCHITECTURE_POINTS = [
  'Universal MCP Server compatibility',
  'Built-in safety checks for transactions',
  'Context-aware wallet management',
  'Extensible plugin architecture',
  'Dual transport (stdio + HTTP)',
  'Rich UI responses with cards',
];

const CODE_EXAMPLE = `{
  "agent": "MIDL-Core",
  "version": "1.0.0",
  "tools": [
    "btc_balance",
    "evm_deploy",
    "runes_transfer",
    "bridge_btc_to_evm"
  ],
  "safety": "strict",
  "transport": ["stdio", "http"]
}`;

/** Architecture showcase section */
export function ArchitectureSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} id="architecture" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex-1 space-y-8"
          >
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
                Architecture
              </span>
              <h2 className="text-4xl font-bold mb-4">
                Standardized{' '}
                <span className="gradient-text-secondary">Intelligence</span>
              </h2>
              <p className="text-foreground-muted text-lg max-w-xl">
                MIDL is not just a chatbot. It is a standard interface for AI agents
                to interact with Bitcoin infrastructure.
              </p>
            </div>

            {/* Checklist */}
            <ul className="space-y-4">
              {ARCHITECTURE_POINTS.map((point, idx) => (
                <motion.li
                  key={point}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.1 + idx * 0.05 }}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center text-success group-hover:scale-110 transition-transform">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-foreground">{point}</span>
                </motion.li>
              ))}
            </ul>

            {/* Link */}
            <motion.a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="inline-flex items-center gap-2 text-accent font-medium hover:gap-3 transition-all"
            >
              <span>Explore the MCP Server</span>
              <ArrowRight className="w-4 h-4" />
            </motion.a>
          </motion.div>

          {/* Right - Code Preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 w-full"
          >
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-secondary/20 via-accent/20 to-secondary/20 rounded-3xl blur-2xl opacity-50" />

              {/* Code block */}
              <div className="relative bg-card border border-card-border rounded-2xl overflow-hidden shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-background-tertiary/50">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-error/80" />
                    <div className="w-3 h-3 rounded-full bg-warning/80" />
                    <div className="w-3 h-3 rounded-full bg-success/80" />
                  </div>
                  <span className="text-xs text-foreground-muted font-mono">
                    config.json
                  </span>
                </div>

                {/* Code */}
                <pre className="p-6 overflow-x-auto">
                  <code className="text-sm font-mono">
                    {CODE_EXAMPLE.split('\n').map((line, idx) => (
                      <div key={idx} className="leading-relaxed">
                        {line.includes('"') ? (
                          <>
                            {line.split('"').map((part, pidx) =>
                              pidx % 2 === 1 ? (
                                <span key={pidx} className="text-success">
                                  &quot;{part}&quot;
                                </span>
                              ) : (
                                <span key={pidx} className="text-foreground-muted">
                                  {part}
                                </span>
                              )
                            )}
                          </>
                        ) : (
                          <span className="text-foreground-muted">{line}</span>
                        )}
                      </div>
                    ))}
                  </code>
                </pre>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default ArchitectureSection;
