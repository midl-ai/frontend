import { createResumableStreamContext, type ResumableStreamContext } from 'resumable-stream';
import { after } from 'next/server';

let globalStreamContext: ResumableStreamContext | null = null;

/**
 * Get or create the resumable stream context singleton.
 * Uses Redis for backing storage to enable stream resume across requests.
 */
export function getStreamContext(): ResumableStreamContext {
  if (!globalStreamContext) {
    globalStreamContext = createResumableStreamContext({
      // Next.js 16 `after` function for cleanup when request completes
      waitUntil: after,
    });
  }
  return globalStreamContext;
}
