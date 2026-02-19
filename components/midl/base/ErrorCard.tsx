'use client';

import { AlertCircle } from 'lucide-react';
import { BaseCard } from './BaseCard';

interface ErrorCardProps {
  error: string;
  toolName?: string;
}

export function ErrorCard({ error, toolName }: ErrorCardProps) {
  return (
    <BaseCard
      title={toolName ? `Error: ${toolName}` : 'Error'}
      icon={<AlertCircle className="w-4 h-4" />}
      variant="error"
    >
      <p className="text-sm text-error">{error}</p>
    </BaseCard>
  );
}
