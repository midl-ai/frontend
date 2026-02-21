'use client';

import { memo, Fragment } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface SuggestionAwareMarkdownProps {
  content: string;
  onSuggestion?: (suggestion: string) => void;
}

// Regex to match :suggestion[text] patterns
const SUGGESTION_REGEX = /:suggestion\[(.+?)\]/g;

// Custom markdown components for proper rendering
const createMarkdownComponents = (): Partial<Components> => ({
  // Links - render as clickable external links
  a: ({ href, children, ...props }) => (
    <Link
      href={href || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className="text-accent hover:text-accent-hover underline underline-offset-2 transition-colors"
      {...props}
    >
      {children}
    </Link>
  ),
  // Ordered lists
  ol: ({ children, ...props }) => (
    <ol className="list-decimal list-outside ml-4 my-2" {...props}>
      {children}
    </ol>
  ),
  // Unordered lists
  ul: ({ children, ...props }) => (
    <ul className="list-disc list-outside ml-4 my-2" {...props}>
      {children}
    </ul>
  ),
  // List items
  li: ({ children, ...props }) => (
    <li className="py-0.5" {...props}>
      {children}
    </li>
  ),
  // Code blocks
  code: ({ children, className, ...props }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code
          className="px-1.5 py-0.5 rounded bg-background-tertiary text-sm font-mono text-accent"
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code className={cn('block p-3 rounded-lg bg-background-tertiary font-mono text-sm overflow-x-auto', className)} {...props}>
        {children}
      </code>
    );
  },
  // Pre (code block wrapper)
  pre: ({ children }) => <>{children}</>,
  // Paragraphs
  p: ({ children, ...props }) => (
    <p className="my-2 leading-relaxed" {...props}>
      {children}
    </p>
  ),
  // Strong/bold
  strong: ({ children, ...props }) => (
    <strong className="font-semibold text-foreground" {...props}>
      {children}
    </strong>
  ),
  // Blockquotes
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="border-l-2 border-accent/50 pl-4 my-2 text-foreground-muted italic"
      {...props}
    >
      {children}
    </blockquote>
  ),
});

// Memoized markdown component - wrap in div since v10 doesn't support className
const Markdown = memo(function Markdown({ children }: { children: string }) {
  return (
    <div className="max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={createMarkdownComponents()}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
});

// Suggestion pill button
function SuggestionPill({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex px-2.5 py-1 mx-0.5 rounded-lg',
        'bg-accent/15 text-accent border border-accent/20',
        'hover:bg-accent/25 hover:border-accent/30',
        'text-sm font-medium cursor-pointer',
        'transition-all duration-200'
      )}
    >
      {label}
    </button>
  );
}

export function SuggestionAwareMarkdown({
  content,
  onSuggestion,
}: SuggestionAwareMarkdownProps) {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  // Reset regex state
  SUGGESTION_REGEX.lastIndex = 0;

  while ((match = SUGGESTION_REGEX.exec(content)) !== null) {
    // Push preceding markdown text
    if (match.index > lastIndex) {
      const chunk = content.slice(lastIndex, match.index);
      if (chunk.trim()) {
        parts.push(<Markdown key={`md-${lastIndex}`}>{chunk}</Markdown>);
      }
    }

    // Push suggestion pill
    const label = match[1];
    parts.push(
      <SuggestionPill
        key={`pill-${match.index}`}
        label={label}
        onClick={() => onSuggestion?.(label)}
      />
    );

    lastIndex = SUGGESTION_REGEX.lastIndex;
  }

  // Push trailing markdown text
  if (lastIndex < content.length) {
    const tail = content.slice(lastIndex);
    if (tail.trim()) {
      parts.push(<Markdown key="md-tail">{tail}</Markdown>);
    }
  }

  // If no parts were created, render the entire content as markdown
  if (parts.length === 0) {
    return <Markdown>{content}</Markdown>;
  }

  return <div className="space-y-1">{parts}</div>;
}
