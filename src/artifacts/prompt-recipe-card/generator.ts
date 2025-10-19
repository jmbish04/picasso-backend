/**
 * Prompt Recipe Card Generator
 * Inputs: final prompt, iterations, judge feedback.
 * Output: PDF (via HTML template) stored in R2.
 */
import type { ArtifactGenerator } from '@/artifacts/registry';

export const promptRecipeCardGenerator: ArtifactGenerator = {
  id: 'prompt-recipe-card',
  name: 'Prompt Recipe Card',
  output: 'pdf',
  async generate(env, args) {
    // TODO(Jules): generate HTML, transform to PDF via service, and upload to R2.
    env;
    args;
    throw new Error('promptRecipeCardGenerator.generate not implemented');
  },
};
