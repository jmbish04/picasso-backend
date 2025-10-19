/**
 * Seed Replay Script Generator
 * Inputs: list of jobs, prompts, provider configs.
 * Output: JSON script to replay generation runs.
 */
import type { ArtifactGenerator } from '@/artifacts/registry';

export const seedReplayScriptGenerator: ArtifactGenerator = {
  id: 'seed-replay-script',
  name: 'Seed Replay Script',
  output: 'json',
  async generate(env, args) {
    // TODO(Jules): build replay instructions, include deterministic seeds, and upload JSON to R2.
    env;
    args;
    throw new Error('seedReplayScriptGenerator.generate not implemented');
  },
};
