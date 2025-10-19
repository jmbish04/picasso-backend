import type { Env } from '@/lib/env';
import type { ImageOp } from '@/adapters/provider.types';
import { providerRouter } from '@/adapters/router';
import { actorEmit, dbInsertProgression, imagesUploadDelivery, r2PutOriginal } from './_tools';
import type { WsEnvelope } from '@/lib/ws-events';

export interface OrchestratorInput {
  projectId: string;
  sessionId: string;
  jobId: string;
  variantId: string;
  op: ImageOp;
  knowledgeBaseTip?: string;
}

export async function runOrchestrator(env: Env, input: OrchestratorInput) {
  // TODO(Jules): orchestrate multi-provider flow, persist to D1, and emit WS events for each lifecycle stage.
  env;
  input;
  providerRouter;
  actorEmit;
  dbInsertProgression;
  imagesUploadDelivery;
  r2PutOriginal;
  type _WsEnvelope = WsEnvelope; // TODO(Jules): remove once broadcasting implemented.
  throw new Error('runOrchestrator not implemented');
}

// TODO(Jules): integrate with AI.run when agent runtime is ready.
