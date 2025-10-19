/**
 * Lookbook Generator
 * Inputs: projectIds[], options { title, description, imageIds[] }
 * Output: HTML stored in R2 and served via /public/lookbook/:slug
 */
import type { ArtifactGenerator } from '@/artifacts/registry';

export const lookbookGenerator: ArtifactGenerator = {
  id: 'lookbook',
  name: 'Lookbook',
  output: 'html',
  async generate(env, args) {
    // TODO(Jules): fetch project imagery, inject into template.html, store HTML in R2, and return slug.
    env;
    args;
    throw new Error('lookbookGenerator.generate not implemented');
  },
};

// TODO(Jules): register this generator in artifactRegistry once implementation is ready (currently stubbed inline).
