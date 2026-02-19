'use client';

import type { UIMessage } from '@ai-sdk/react';
import { User, Bot, Loader2 } from 'lucide-react';
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
            <p key={index} className="whitespace-pre-wrap">
              {part.text}
            </p>
          );
        }
        return <SuggestionAwareMarkdown key={index} content={part.text} />;
      }

      // Reasoning parts (for models that support thinking)
      if (part.type === 'reasoning') {
        return (
          <div
            key={index}
            className="my-2 p-3 rounded-lg bg-background-tertiary/50 border border-border italic text-foreground-muted text-sm"
          >
            <p className="font-medium text-foreground mb-1">Thinking...</p>
            <p className="whitespace-pre-wrap">{part.text}</p>
          </div>
        );
      }

      // Tool call parts - show loading state
      if (isToolCallPart(part)) {
        return (
          <div
            key={index}
            className="my-2 p-3 rounded-lg bg-background-tertiary border border-border"
          >
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-accent" />
              <p className="text-sm text-foreground-muted">
                Calling{' '}
                <span className="font-mono text-accent">{part.toolName}</span>
                ...
              </p>
            </div>
          </div>
        );
      }

      // Tool result parts - route to appropriate card component
      if (isToolResultPart(part)) {
        // Use the ToolResultRenderer to display the appropriate card
        return (
          <div key={index} className="my-2">
            <ToolResultRenderer toolName={part.toolName} result={part.result} />
          </div>
        );
      }

      // Handle generic tool parts (during streaming)
      if (typeof part.type === 'string' && part.type.startsWith('tool-')) {
        const toolPart = part as { type: string; toolCallId?: string; state?: string };
        return (
          <div
            key={index}
            className="my-2 p-3 rounded-lg bg-background-tertiary border border-border"
          >
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-accent" />
              <p className="text-sm text-foreground-muted">
                Processing tool...
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
      className={cn('flex gap-3', isUser ? 'flex-row-reverse' : 'flex-row')}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
          isUser
            ? 'bg-accent text-accent-foreground'
            : 'bg-background-secondary border border-border'
        )}
      >
        {isUser ? (
          <User className="w-4 h-4" />
        ) : (
          <Bot className="w-4 h-4 text-foreground-muted" />
        )}
      </div>

      {/* Message Content */}
      <div
        className={cn(
          'flex-1 max-w-[80%] rounded-lg px-4 py-3',
          isUser
            ? 'bg-accent text-accent-foreground'
            : 'bg-background-secondary border border-border text-foreground'
        )}
      >
        {renderParts()}
      </div>
    </div>
  );
}
