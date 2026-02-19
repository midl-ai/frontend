import { createAnthropic } from '@ai-sdk/anthropic';

/** Create Anthropic provider with API key */
export function getAnthropicProvider() {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY environment variable is required');
  }

  return createAnthropic({
    apiKey,
  });
}

/** Default model for chat */
export const DEFAULT_MODEL = 'claude-sonnet-4-20250514';
