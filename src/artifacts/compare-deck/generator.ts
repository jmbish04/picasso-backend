/**
 * Compare Deck Generator
 * Inputs: per-provider metrics, selected images, and narrative bullets.
 * Output: HTML slide deck stored in R2.
 */
import type { ArtifactGenerator } from '@/artifacts/registry';

export const compareDeckGenerator: ArtifactGenerator = {
  id: 'compare-deck',
  name: 'Compare Deck',
  output: 'html',
  async generate(env, args) {
    // TODO(Jules): compile comparison data, map template placeholders, and upload to R2.
    env;
    args;
    throw new Error('compareDeckGenerator.generate not implemented');
  },
};
