/**
 * Review Board Generator
 * Inputs: judge feedback, reviewer comments, pin coordinates.
 * Output: HTML board served from R2.
 */
import type { ArtifactGenerator } from '@/artifacts/registry';

export const reviewBoardGenerator: ArtifactGenerator = {
  id: 'review-board',
  name: 'Review Board',
  output: 'html',
  async generate(env, args) {
    // TODO(Jules): merge judge + reviewer notes, annotate template, and upload HTML to R2.
    env;
    args;
    throw new Error('reviewBoardGenerator.generate not implemented');
  },
};
