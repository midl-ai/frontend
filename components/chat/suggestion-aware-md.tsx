'use client';

import { memo } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

interface SuggestionAwareMarkdownProps {
  content: string;
  onSuggestion?: (suggestion: string) => void;
}

// Regex to match :suggestion[text] patterns
const SUGGESTION_REGEX = /:suggestion\[(.+?)\]/g;

// Custom markdown components for proper rendering
const createMarkdownComponents = (
  onSuggestion?: (suggestion: string) => void
): Partial<Components> => ({
  // Links - render as clickable external links
  a: ({ href, children }) => {
    // Decode any URL-encoded characters and handle malformed URLs gracefully
    let safeHref = '#';
    try {
      safeHref = href ? decodeURIComponent(href) : '#';
    } catch {
      // If decoding fails, use the raw href
      safeHref = href || '#';
    }

    // Use regular anchor for external links
    return (
      <a
        href={safeHref}
        target="_blank"
        rel="noopener noreferrer"
        className="text-accent hover:text-accent-hover underline underline-offset-2 transition-colors"
      >
        {children}
      </a>
    );
  },
  // Ordered lists
  ol: ({ children }) => (
    <ol className="list-decimal list-outside ml-4 my-2">{children}</ol>
  ),
  // Unordered lists
  ul: ({ children }) => (
    <ul className="list-disc list-outside ml-4 my-2">{children}</ul>
  ),
  // List items
  li: ({ children }) => <li className="py-0.5">{children}</li>,
  // Code blocks
  code: ({ children, className }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code className="px-1.5 py-0.5 rounded bg-background-tertiary text-sm font-mono text-accent">
          {children}
        </code>
      );
    }
    return (
      <code
        className={cn(
          'block p-3 rounded-lg bg-background-tertiary font-mono text-sm overflow-x-auto',
          className
        )}
      >
        {children}
      </code>
    );
  },
  // Pre (code block wrapper)
  pre: ({ children }) => <>{children}</>,
  // Paragraphs - handle suggestion patterns inline
  p: ({ children }) => {
    // Process children to replace suggestion patterns with buttons
    const processedChildren = processChildren(children, onSuggestion);
    return <p className="my-2 leading-relaxed">{processedChildren}</p>;
  },
  // Strong/bold
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  // Blockquotes
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-accent/50 pl-4 my-2 text-foreground-muted italic">
      {children}
    </blockquote>
  ),
});

// Process children to find and replace suggestion patterns with buttons
function processChildren(
  children: React.ReactNode,
  onSuggestion?: (suggestion: string) => void
): React.ReactNode {
  if (!children) return children;

  // Handle arrays of children
  if (Array.isArray(children)) {
    return children.map((child, i) => (
      <span key={i}>{processChildren(child, onSuggestion)}</span>
    ));
  }

  // Only process strings
  if (typeof children !== 'string') return children;

  const text = children;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  SUGGESTION_REGEX.lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = SUGGESTION_REGEX.exec(text)) !== null) {
    // Add text before match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    // Add suggestion button
    const label = match[1];
    parts.push(
      <button
        key={`suggestion-${match.index}`}
        onClick={() => onSuggestion?.(label)}
        className={cn(
          'inline-flex px-2 py-0.5 mx-0.5 rounded-md',
          'bg-accent/15 text-accent border border-accent/20',
          'hover:bg-accent/25 hover:border-accent/30',
          'text-sm font-medium cursor-pointer',
          'transition-all duration-200'
        )}
      >
        {label}
      </button>
    );

    lastIndex = SUGGESTION_REGEX.lastIndex;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

// Pre-process content to handle suggestions before markdown parsing
function preprocessContent(content: string): string {
  // Keep content as-is, suggestions will be processed by the p component
  return content;
}

export const SuggestionAwareMarkdown = memo(function SuggestionAwareMarkdown({
  content,
  onSuggestion,
}: SuggestionAwareMarkdownProps) {
  const components = createMarkdownComponents(onSuggestion);

  return (
    <div className="max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
});
