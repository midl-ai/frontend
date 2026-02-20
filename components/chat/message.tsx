'use client';

import type { UIMessage } from '@ai-sdk/react';
import { User, Loader2, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SuggestionAwareMarkdown } from './suggestion-aware-md';
import { ToolResultRenderer } from './tool-result-renderer';

interface MessageProps {
  message: UIMessage;
}

// Type guard for tool parts
interface ToolCallPart {
  type: string;
  toolName: string;
  toolCallId: string;
  args?: unknown;
}

interface ToolResultPart {
  type: string;
  toolName: string;
  toolCallId: string;
  result: unknown;
}

function isToolCallPart(part: unknown): part is ToolCallPart {
  return (
    typeof part === 'object' &&
    part !== null &&
    'type' in part &&
    typeof (part as ToolCallPart).type === 'string' &&
    (part as ToolCallPart).type === 'tool-call' &&
    'toolName' in part
  );
}

function isToolResultPart(part: unknown): part is ToolResultPart {
  return (
    typeof part === 'object' &&
    part !== null &&
    'type' in part &&
    typeof (part as ToolResultPart).type === 'string' &&
    (part as ToolResultPart).type === 'tool-result' &&
    'result' in part
  );
}

export function Message({ message }: MessageProps) {
  const isUser = message.role === 'user';

  // Render message parts
  const renderParts = () => {
    return message.parts.map((part, index) => {
      // Text parts
      if (part.type === 'text') {
        if (isUser) {
          return (
            <p key={index} className="whitespace-pre-wrap text-sm leading-relaxed">
              {part.text}
            </p>
          );
        }
        return (
          <div key={index} className="prose dark:prose-invert prose-sm max-w-none">
            <SuggestionAwareMarkdown content={part.text} />
          </div>
        );
      }

      // Reasoning parts (for models that support thinking)
      if (part.type === 'reasoning') {
        return (
          <div
            key={index}
            className="my-2 p-3 rounded-md bg-background-tertiary/50 border border-dashed border-border text-foreground-muted text-xs font-mono"
          >
            <div className="flex items-center gap-2 mb-1 opacity-70">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span>Thinking...</span>
            </div>
            <p className="whitespace-pre-wrap opacity-80">{part.text}</p>
          </div>
        );
      }

      // Tool call parts - show terminal-like loading state
      if (isToolCallPart(part)) {
        return (
          <div
            key={index}
            className="my-3 rounded-md bg-background-tertiary border border-border overflow-hidden font-mono text-xs"
          >
            <div className="flex items-center gap-2 px-3 py-2 bg-background-hover/50 border-b border-border">
              <Terminal className="w-3 h-3 text-accent" />
              <span className="font-semibold text-foreground">Function Call</span>
            </div>
            <div className="p-3 flex items-center gap-3">
              <Loader2 className="w-4 h-4 animate-spin text-accent" />
              <div className="flex flex-col gap-1">
                <span className="text-foreground-muted">Executing:</span>
                <span className="text-accent font-bold">{part.toolName}</span>
              </div>
            </div>
          </div>
        );
      }

      // Tool result parts - route to appropriate card component
      if (isToolResultPart(part)) {
        return (
          <div key={index} className="my-3">
            <ToolResultRenderer toolName={part.toolName} result={part.result} />
          </div>
        );
      }

      // Handle generic tool parts (during streaming)
      if (typeof part.type === 'string' && part.type.startsWith('tool-')) {
        return (
          <div
            key={index}
            className="my-2 p-3 rounded-md bg-background-tertiary border border-border animate-pulse"
          >
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-accent" />
              <p className="text-xs font-mono text-foreground-muted">
                Processing tool output...
              </p>
            </div>
          </div>
        );
      }

      return null;
    });
  };

  return (
    <div
      className={cn(
        'group flex gap-4 md:gap-6 py-4 transition-colors hover:bg-background-tertiary/30 -mx-4 px-4 rounded-xl',
        isUser ? 'bg-transparent' : ''
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border shadow-sm',
          isUser
            ? 'bg-background text-foreground border-border'
            : 'bg-accent/10 text-accent border-accent/20'
        )}
      >
        {isUser ? (
          <User className="w-4 h-4" />
        ) : (
          <Terminal className="w-4 h-4" />
        )}
      </div>

      {/* Message Content */}
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-foreground">
            {isUser ? 'You' : 'MIDL AI'}
          </span>
          {!isUser && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-accent/10 text-accent uppercase tracking-wider border border-accent/20">
              Bot
            </span>
          )}
        </div>
        
        <div className={cn('text-foreground', isUser ? 'text-foreground-muted' : '')}>
          {renderParts()}
        </div>
      </div>
    </div>
  );
}