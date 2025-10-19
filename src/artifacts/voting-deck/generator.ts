/**
 * Voting Deck Generator
 * Inputs: shortlist of images, pitch summaries, poll settings.
 * Output: HTML interactive deck stored in R2.
 */
import type { ArtifactGenerator } from '@/artifacts/registry';

export const votingDeckGenerator: ArtifactGenerator = {
  id: 'voting-deck',
  name: 'Voting Deck',
  output: 'html',
  async generate(env, args) {
    // TODO(Jules): assemble slides, wire placeholder vote actions, and persist HTML to R2.
    env;
    args;
    throw new Error('votingDeckGenerator.generate not implemented');
  },
};
