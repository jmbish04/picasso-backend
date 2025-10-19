import type { ProviderAdapter } from './provider.types';

export const openaiAdapter: ProviderAdapter = {
  id: 'openai',
  supports: ['generate', 'edit', 'variation'],
  async run(op, context) {
    // TODO(Jules): call OpenAI Images API, apply knowledge base tip refinements, and emit progress via context.onProgress.
    context;
    op;
    throw new Error('openaiAdapter.run not implemented');
  },
};
