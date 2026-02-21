import { createAnthropic } from '@ai-sdk/anthropic';
import { createOpenAI } from '@ai-sdk/openai';

export type AIProvider = 'anthropic' | 'openai';

/** Get the configured AI provider based on available API keys */
export function getConfiguredProvider(): AIProvider {
  // Prefer OpenAI if key is available, otherwise use Anthropic
  if (process.env.OPENAI_API_KEY) {
    return 'openai';
  }
  if (process.env.ANTHROPIC_API_KEY) {
    return 'anthropic';
  }
  throw new Error('No AI provider configured. Set OPENAI_API_KEY or ANTHROPIC_API_KEY.');
}

/** Create Anthropic provider with API key */
export function getAnthropicProvider() {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY environment variable is required');
  }

  return createAnthropic({ apiKey });
}

/** Create OpenAI provider with API key */
export function getOpenAIProvider() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is required');
  }

  return createOpenAI({ apiKey });
}

/** Get the appropriate model provider based on configuration */
export function getModelProvider() {
  const provider = getConfiguredProvider();

  if (provider === 'openai') {
    return getOpenAIProvider();
  }
  return getAnthropicProvider();
}

/** Default models for each provider */
export const DEFAULT_MODELS = {
  anthropic: 'claude-sonnet-4-20250514',
  openai: 'gpt-4o',
} as const;

/** Get the default model for the current provider */
export function getDefaultModel(): string {
  const provider = getConfiguredProvider();
  return DEFAULT_MODELS[provider];
}

/** Legacy export for backwards compatibility */
export const DEFAULT_MODEL = 'claude-sonnet-4-20250514';
