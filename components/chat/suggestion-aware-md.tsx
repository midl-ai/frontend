'use client';

import { Fragment } from 'react';
import { cn } from '@/lib/utils';

interface SuggestionAwareMarkdownProps {
  content: string;
  onSuggestion?: (suggestion: string) => void;
}

const SUGGESTION_REGEX = /:suggestion\[(.+?)\]/g;

export function SuggestionAwareMarkdown({
  content,
  onSuggestion,
}: SuggestionAwareMarkdownProps) {
  // Split content by suggestion pattern
  const parts = content.split(SUGGESTION_REGEX);

  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      {parts.map((part, index) => {
        // Odd indices are the captured suggestion text
        if (index % 2 === 1) {
          return (
            <button
              key={index}
              onClick={() => onSuggestion?.(part)}
              className={cn(
                'inline-flex px-2 py-0.5 mx-1 rounded',
                'bg-accent/20 text-accent',
                'hover:bg-accent/30',
                'text-sm font-medium cursor-pointer',
                'transition-colors'
              )}
            >
              {part}
            </button>
          );
        }

        // Even indices are regular text - render with basic formatting
        return (
          <Fragment key={index}>
            {part.split('\n').map((line, lineIndex) => {
              if (line.trim() === '') {
                return <br key={lineIndex} />;
              }

              // Simple markdown-like formatting
              // Bold: **text**
              let formatted = line.replace(
                /\*\*(.+?)\*\*/g,
                '<strong>$1</strong>'
              );

              // Code: `text`
              formatted = formatted.replace(
                /`(.+?)`/g,
                '<code class="px-1 py-0.5 rounded bg-background-tertiary text-sm font-mono">$1</code>'
              );

              return (
                <span
                  key={lineIndex}
                  dangerouslySetInnerHTML={{ __html: formatted }}
                />
              );
            })}
          </Fragment>
        );
      })}
    </div>
  );
}
