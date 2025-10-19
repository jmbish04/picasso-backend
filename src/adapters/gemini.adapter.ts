import type { ProviderAdapter } from './provider.types';

export const geminiAdapter: ProviderAdapter = {
  id: 'gemini',
  supports: ['generate', 'edit', 'inpaint', 'outpaint'],
  async run(op, context) {
    // TODO(Jules): integrate Gemini image generation, handle streaming responses, and capture safety metadata.
    context;
    op;
    throw new Error('geminiAdapter.run not implemented');
  },
};
