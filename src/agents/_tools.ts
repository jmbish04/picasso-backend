import type { Env } from '@/lib/env';
import type { WsEnvelope } from '@/lib/ws-events';
import type { Artifact } from '@/types/domain';

// Tool: insert progression row into D1.
export async function dbInsertProgression(env: Env, payload: unknown) {
  // TODO(Jules): wrap env.DB.prepare(...) calls and ensure structured logging.
  env;
  payload;
  throw new Error('dbInsertProgression not implemented');
}

// Tool: update judgment metadata for a progression.
export async function dbUpdateJudgment(env: Env, progressionId: string, data: unknown) {
  // TODO(Jules): persist judgment, notes, and tags, then emit WS judge event.
  env;
  progressionId;
  data;
  throw new Error('dbUpdateJudgment not implemented');
}

// Tool: store raw bytes to R2.
export async function r2PutOriginal(env: Env, key: string, bytes: ArrayBuffer) {
  // TODO(Jules): upload to BUCKET with appropriate metadata and retry on transient errors.
  env;
  key;
  bytes;
  throw new Error('r2PutOriginal not implemented');
}

// Tool: upload delivery image via Cloudflare Images.
export async function imagesUploadDelivery(env: Env, input: Blob | ArrayBuffer | URL): Promise<string> {
  // TODO(Jules): use IMAGES binding to create a public variant; return the delivery URL.
  env;
  input;
  throw new Error('imagesUploadDelivery not implemented');
}

// Tool: emit events to the Durable Object actor.
export async function actorEmit(env: Env, sessionId: string, envelope: WsEnvelope) {
  // Example: await actorEmit(env, sessionId, { type: 'queued', sessionId, ts: Date.now(), data: {...} });
  // TODO(Jules): POST to /_actor/:sessionId endpoint with envelope payload.
  env;
  sessionId;
  envelope;
  throw new Error('actorEmit not implemented');
}

// Tool: queue background processing/logging.
export async function queueLog(env: Env, payload: unknown) {
  // TODO(Jules): send message to PICASSO_QUEUE for analytics or artifact view logging.
  env;
  payload;
  throw new Error('queueLog not implemented');
}

// Tool: fetch artifact configuration.
export async function dbGetArtifact(env: Env, artifactId: string): Promise<Artifact | null> {
  // TODO(Jules): perform SELECT from D1 and map to domain type defined in src/types/domain.ts.
  env;
  artifactId;
  throw new Error('dbGetArtifact not implemented');
}

// TODO(Jules): add additional tools for KV reads/writes (AGENTIC_MEMORIES) as flows evolve.
