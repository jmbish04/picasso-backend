/**
 * R2 Archive Manifest Generator
 * Inputs: project asset records with R2 keys.
 * Output: CSV manifest stored in R2.
 */
import type { ArtifactGenerator } from '@/artifacts/registry';

export const r2ArchiveManifestGenerator: ArtifactGenerator = {
  id: 'r2-archive-manifest',
  name: 'R2 Archive Manifest',
  output: 'csv',
  async generate(env, args) {
    // TODO(Jules): scan R2 prefix, correlate with D1 metadata, and upload CSV manifest.
    env;
    args;
    throw new Error('r2ArchiveManifestGenerator.generate not implemented');
  },
};
