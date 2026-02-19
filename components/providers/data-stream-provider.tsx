'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { JSONValue } from 'ai';

interface DataStreamContextType {
  data: JSONValue[] | undefined;
}

const DataStreamContext = createContext<DataStreamContextType>({
  data: undefined,
});

interface DataStreamProviderProps {
  children: ReactNode;
  data: JSONValue[] | undefined;
}

/** Provider for streaming tool results from AI SDK */
export function DataStreamProvider({ children, data }: DataStreamProviderProps) {
  return (
    <DataStreamContext.Provider value={{ data }}>
      {children}
    </DataStreamContext.Provider>
  );
}

/** Hook to access streaming data */
export function useDataStream() {
  const context = useContext(DataStreamContext);
  if (!context) {
    throw new Error('useDataStream must be used within a DataStreamProvider');
  }
  return context;
}
