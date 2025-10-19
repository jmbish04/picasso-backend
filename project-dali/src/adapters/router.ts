import { openaiAdapter } from './openai.adapter';
import { geminiAdapter } from './gemini.adapter';
import { workersAdapter } from './workers.adapter';
import type { ProviderAdapter, ProviderRegistry, ProviderRouter } from './provider.types';

const registry: ProviderRegistry = {
  openai: openaiAdapter,
  gemini: geminiAdapter,
  workers: workersAdapter,
};

export const providerRouter: ProviderRouter = {
  async run(op, context) {
    const adapter = registry[context.providerId];
    if (!adapter) {
      throw new Error(`Unknown provider: ${context.providerId}`);
    }

    // TODO(Jules): add prompt de-duplication, knowledge base tip injection, and retry/backoff logic.
    const result = await adapter.run(op, context);
    return { ...result, providerId: adapter.id };
  },
};

export const availableProviders = Object.keys(registry) as ProviderAdapter['id'][];

// TODO(Jules): expose helper to select provider by capability & latency metrics from D1 once available.
