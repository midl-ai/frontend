'use client';

import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Terminal, Github } from 'lucide-react';

/** Call-to-action section before footer */
export function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-32 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-accent/5 to-background pointer-events-none" />

      {/* Decorative orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent/20 rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/20 rounded-full blur-3xl opacity-30" />

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Badge */}
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium border border-accent/20">
            <Terminal className="w-4 h-4" />
            Ready to deploy
          </span>

          {/* Headline */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            Join the future of{' '}
            <span className="gradient-text">Bitcoin development</span>
          </h2>

          {/* Subtext */}
          <p className="text-xl text-foreground-muted max-w-2xl mx-auto">
            No more boilerplate. No more context switching.
            Just describe what you want, and let MIDL handle the rest.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="/chat"
              className="group px-10 py-5 rounded-2xl bg-foreground text-background font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-xl hover:scale-105 hover:shadow-2xl"
            >
              Launch Terminal
              <Terminal className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            </Link>

            <a
              href="https://github.com/midl-ai/mcp-server"
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-5 rounded-2xl border border-border bg-background/50 backdrop-blur-sm hover:bg-background-hover transition-all flex items-center justify-center gap-3 font-medium hover:border-accent/30"
            >
              <Github className="w-5 h-5" />
              Star on GitHub
            </a>
          </div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="pt-8 flex items-center justify-center gap-8 text-sm text-foreground-muted flex-wrap"
          >
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success" />
              Open Source
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent" />
              MIT Licensed
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-secondary" />
              No Wallet Required to Try
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default CTASection;
