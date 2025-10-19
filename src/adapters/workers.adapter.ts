import type { ProviderAdapter } from './provider.types';

export const workersAdapter: ProviderAdapter = {
  id: 'workers',
  supports: ['generate', 'upscale'],
  async run(op, context) {
    // TODO(Jules): call Cloudflare Workers AI image endpoints, handle asset uploads, and store original bytes to R2.
    context;
    op;
    throw new Error('workersAdapter.run not implemented');
  },
};
