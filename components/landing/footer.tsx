'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Github, Twitter } from 'lucide-react';
import { useTheme } from 'next-themes';

const FOOTER_LINKS = {
  Product: [
    { label: 'Terminal', href: '/chat' },
    { label: 'Documentation', href: '/docs' },
    { label: 'Tools Reference', href: '/docs/tools' },
  ],
  Resources: [
    { label: 'Getting Started', href: '/docs/getting-started' },
    { label: 'Examples', href: '/docs/examples' },
    { label: 'MCP Server', href: 'https://github.com/midl-ai/mcp-server' },
  ],
  Community: [
    { label: 'GitHub', href: 'https://github.com/midl-ai' },
    { label: 'Twitter', href: 'https://x.com/midl_xyz' },
    { label: 'MIDL Network', href: 'https://midl.xyz' },
  ],
};

/** Site footer */
export function Footer() {
  const { resolvedTheme } = useTheme();

  return (
    <footer className="border-t border-border bg-background-secondary py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-16">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center">
              <Image
                src={resolvedTheme === 'dark' ? '/midl-ai-wordmark.svg' : '/midl-ai-wordmark-light.svg'}
                alt="MIDL.AI"
                width={120}
                height={32}
                className="h-8 w-auto"
              />
            </Link>
            <p className="text-sm text-foreground-muted max-w-xs">
              The first MCP for Bitcoin+EVM. Deploy contracts, transfer tokens, and bridge assets through natural language.
            </p>
            {/* Social */}
            <div className="flex gap-3 pt-2">
              <a
                href="https://github.com/midl-ai"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-background-tertiary flex items-center justify-center text-foreground-muted hover:text-foreground hover:bg-background-hover transition-all"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://x.com/midl_xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-background-tertiary flex items-center justify-center text-foreground-muted hover:text-foreground hover:bg-background-hover transition-all"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-sm text-foreground mb-4">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-foreground-muted hover:text-foreground transition-colors"
                      target={link.href.startsWith('http') ? '_blank' : undefined}
                      rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-foreground-muted">
            © 2026 MIDL Protocol. Open Source under MIT License.
          </p>
          <p className="text-sm text-foreground-muted">
            Built for{' '}
            <span className="text-accent font-medium">VibeHack 2026</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
