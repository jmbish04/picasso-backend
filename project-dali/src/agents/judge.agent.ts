import type { Env } from '@/lib/env';
import { dbUpdateJudgment, actorEmit } from './_tools';
import type { WsEnvelope } from '@/lib/ws-events';

export interface JudgeInput {
  progressionId: string;
  projectId: string;
  sessionId: string;
  prompt: string;
  generatedImageUrl: string;
  startImageUrl?: string;
}

export async function runJudge(env: Env, input: JudgeInput) {
  // TODO(Jules): call env.AI.run with vision model to evaluate output and persist results.
  env;
  input;
  dbUpdateJudgment;
  actorEmit;
  type _WsEnvelope = WsEnvelope; // TODO(Jules): emit judge event envelopes when implementation lands.
  throw new Error('runJudge not implemented');
}

// TODO(Jules): include retry logic for judge failures and emit fail events when retries exhausted.
