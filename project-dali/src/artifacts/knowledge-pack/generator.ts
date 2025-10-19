/**
 * Knowledge Pack Generator
 * Inputs: knowledge_base entries, provider best practices.
 * Output: JSON bundle + optional HTML index stored in R2.
 */
import type { ArtifactGenerator } from '@/artifacts/registry';

export const knowledgePackGenerator: ArtifactGenerator = {
  id: 'knowledge-pack',
  name: 'Knowledge Pack',
  output: 'json',
  async generate(env, args) {
    // TODO(Jules): query knowledge_base table, format sections, and upload JSON (plus optional HTML index).
    env;
    args;
    throw new Error('knowledgePackGenerator.generate not implemented');
  },
};
