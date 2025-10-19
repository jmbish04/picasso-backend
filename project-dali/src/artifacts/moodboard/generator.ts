/**
 * Moodboard Generator
 * Inputs: curated tile set with tones, labels, and optional palette metadata.
 * Output: HTML collage deployed to R2.
 */
import type { ArtifactGenerator } from '@/artifacts/registry';

export const moodboardGenerator: ArtifactGenerator = {
  id: 'moodboard',
  name: 'Moodboard',
  output: 'html',
  async generate(env, args) {
    // TODO(Jules): compute palette, map delivery URLs, and render template to R2.
    env;
    args;
    throw new Error('moodboardGenerator.generate not implemented');
  },
};
