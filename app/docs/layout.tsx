'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Rocket,
  Wrench,
  Layers,
  Code,
  Server,
  HelpCircle,
  Menu,
  X,
  Terminal,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const docsNavigation = [
  {
    name: 'Getting Started',
    href: '/docs/getting-started',
    icon: Rocket,
    description: 'Installation and setup guide',
  },
  {
    name: 'Tools Reference',
    href: '/docs/tools',
    icon: Wrench,
    description: '27 tools across 9 categories',
  },
  {
    name: 'Architecture',
    href: '/docs/architecture',
    icon: Layers,
    description: 'MCP protocol and plugin system',
  },
  {
    name: 'Examples',
    href: '/docs/examples',
    icon: Code,
    description: 'Sample prompts and workflows',
  },
  {
    name: 'MCP Server',
    href: '/docs/mcp-server',
    icon: Server,
    description: 'Configuration and transport options',
  },
  {
    name: 'FAQ',
    href: '/docs/faq',
    icon: HelpCircle,
    description: 'Common questions answered',
  },
];

function NavLink({ item, onClick }: { item: typeof docsNavigation[0]; onClick?: () => void }) {
  const pathname = usePathname();
  const isActive = pathname === item.href;

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group',
        isActive
          ? 'bg-accent/10 text-accent border border-accent/20'
          : 'text-foreground-muted hover:bg-background-hover hover:text-foreground'
      )}
    >
      <item.icon className={cn('w-5 h-5', isActive ? 'text-accent' : 'text-foreground-muted group-hover:text-foreground')} />
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm">{item.name}</div>
        <div className="text-xs text-foreground-muted truncate">{item.description}</div>
      </div>
      {isActive && <ChevronRight className="w-4 h-4 text-accent" />}
    </Link>
  );
}

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center border border-accent/20">
              <Terminal className="w-4 h-4 text-accent" />
            </div>
            <span>MIDL<span className="text-accent">.AI</span></span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-background-hover transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden fixed inset-x-0 top-14 z-40 bg-background border-b border-border p-4 space-y-2"
          >
            {docsNavigation.map((item) => (
              <NavLink key={item.href} item={item} onClick={() => setMobileMenuOpen(false)} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block fixed top-0 left-0 w-72 h-screen border-r border-border bg-background-secondary/50 overflow-y-auto">
        <div className="p-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg mb-8">
            <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center border border-accent/20">
              <Terminal className="w-5 h-5 text-accent" />
            </div>
            <span>MIDL<span className="text-accent">.AI</span></span>
          </Link>

          {/* Docs home link */}
          <Link
            href="/docs"
            className="flex items-center gap-2 px-4 py-2 mb-4 text-sm font-medium text-foreground-muted hover:text-foreground transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
            Documentation
          </Link>

          {/* Navigation */}
          <nav className="space-y-2">
            {docsNavigation.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </nav>

          {/* Back to app */}
          <div className="mt-8 pt-8 border-t border-border">
            <Link
              href="/chat"
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-accent text-accent-foreground font-medium text-sm hover:opacity-90 transition-opacity"
            >
              <Terminal className="w-4 h-4" />
              Launch Terminal
            </Link>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:ml-72 min-h-screen pt-14 lg:pt-0">
        <div className="max-w-4xl mx-auto px-6 py-12">
          {children}
        </div>
      </main>
    </div>
  );
}
