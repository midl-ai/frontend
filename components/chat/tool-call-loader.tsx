'use client';

import { Loader2 } from 'lucide-react';

export function ToolCallLoader() {
  return (
    <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-background-secondary border border-border">
      <Loader2 className="w-4 h-4 animate-spin text-accent" />
      <span className="text-sm text-foreground-muted">Thinking...</span>
    </div>
  );
}
