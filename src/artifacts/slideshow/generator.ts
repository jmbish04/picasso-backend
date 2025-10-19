/**
 * Slideshow Generator
 * Inputs: ordered slide data with captions and autoplay settings.
 * Output: HTML slideshow stored in R2.
 */
import type { ArtifactGenerator } from '@/artifacts/registry';

export const slideshowGenerator: ArtifactGenerator = {
  id: 'slideshow',
  name: 'Slideshow',
  output: 'html',
  async generate(env, args) {
    // TODO(Jules): populate template with delivery URLs, respect autoplay options, and upload HTML to R2.
    env;
    args;
    throw new Error('slideshowGenerator.generate not implemented');
  },
};
