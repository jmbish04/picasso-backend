import type { Env } from '@/lib/env';
import { artifactRegistry } from '@/artifacts/registry';
import { actorEmit, dbGetArtifact, queueLog } from './_tools';

export interface ArtifactAgentInput {
  artifactId?: string;
  projectIds: string[];
  generatorId: keyof typeof artifactRegistry;
  options?: Record<string, unknown>;
  sessionId: string;
}

export async function runArtifactAgent(env: Env, input: ArtifactAgentInput) {
  // TODO(Jules): orchestrate conversation, load templates, and render artifact output to R2.
  env;
  input;
  artifactRegistry;
  dbGetArtifact;
  queueLog;
  actorEmit;
  throw new Error('runArtifactAgent not implemented');
}

// TODO(Jules): persist artifact configuration to D1 + KV and emit completion events.
