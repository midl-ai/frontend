'use client';

import { ReactNode, useState } from 'react';
import { MidlProvider } from '@midl/react';
import { WagmiMidlProvider } from '@midl/executor-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { midlConfig } from './config';

interface MidlProvidersProps {
  children: ReactNode;
}

/** Wrapper providing MIDL SDK context to the app */
export function MidlProviders({ children }: MidlProvidersProps) {
  // Create QueryClient once per component instance
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <MidlProvider config={midlConfig}>
      <QueryClientProvider client={queryClient}>
        <WagmiMidlProvider>{children}</WagmiMidlProvider>
      </QueryClientProvider>
    </MidlProvider>
  );
}
