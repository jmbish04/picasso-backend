/**
 * Storyboard Generator
 * Inputs: ordered frames with captions and timing metadata.
 * Output: HTML storyboard uploaded to R2 and optionally PDF via future service.
 */
import type { ArtifactGenerator } from '@/artifacts/registry';

export const storyboardGenerator: ArtifactGenerator = {
  id: 'storyboard',
  name: 'Storyboard',
  output: 'html',
  async generate(env, args) {
    // TODO(Jules): merge project frames, populate template, and track delivery/original image keys.
    env;
    args;
    throw new Error('storyboardGenerator.generate not implemented');
  },
};
