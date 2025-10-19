/**
 * Walkthrough Reel Generator
 * Inputs: ordered image frames + narration script.
 * Output: Video (mp4/gif) generated via external service, manifest stored in R2.
 */
import type { ArtifactGenerator } from '@/artifacts/registry';

export const walkthroughReelGenerator: ArtifactGenerator = {
  id: 'walkthrough-reel',
  name: 'Walkthrough Reel',
  output: 'video',
  async generate(env, args) {
    // TODO(Jules): call out to Cloudflare Service/container for video assembly and persist resulting manifest.
    env;
    args;
    throw new Error('walkthroughReelGenerator.generate not implemented');
  },
};

// TODO(Jules): add service binding in wrangler.toml when container workflow is introduced.
