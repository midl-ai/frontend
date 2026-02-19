'use client';

import { ArrowRightLeft } from 'lucide-react';
import { BaseCard, ErrorCard, AddressDisplay } from './base';
import type { ToolResponse, AddressConvertInfo } from '@/lib/ai/tools/types';

interface AddressConvertCardProps {
  data: ToolResponse<AddressConvertInfo>;
}

export function AddressConvertCard({ data }: AddressConvertCardProps) {
  if (!data.success || !data.data) {
    return <ErrorCard error={data.error || 'Address conversion failed'} toolName="Address Convert" />;
  }

  const { btcAddress, evmAddress } = data.data;

  return (
    <BaseCard title="Address Conversion" icon={<ArrowRightLeft className="w-4 h-4" />}>
      <AddressDisplay address={btcAddress} label="BTC Address" />
      <div className="flex items-center justify-center py-1">
        <ArrowRightLeft className="w-3 h-3 text-foreground-muted" />
      </div>
      <AddressDisplay address={evmAddress} label="EVM Address" />
    </BaseCard>
  );
}
