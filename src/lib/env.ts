import type { PicassoDurableObject } from '@/durable-objects/session.do';

export interface Env {
  AI: Ai;
  IMAGES: ImagesService;
  ASSETS: Fetcher;
  DB: D1Database;
  USER_PREFERENCES: KVNamespace;
  AGENTIC_MEMORIES: KVNamespace;
  BUCKET: R2Bucket;
  PICASSO_DO: DurableObjectNamespace<PicassoDurableObject>;
  PICASSO_WORKFLOW: WorkflowNamespace;
  PICASSO_QUEUE: Queue;
  DEFAULT_MODEL_REASONING: string;
  DEFAULT_MODEL_VISION: string;
}

export interface Ai {
  run: (model: string, input: Record<string, unknown>) => Promise<unknown>;
}

export interface ImagesService {
  upload: (data: Blob | ArrayBuffer | ArrayBufferView | ReadableStream, options?: Record<string, unknown>) => Promise<{ id: string; variants: string[] }>;
}

export interface WorkflowNamespace {
  create: (name: string, options?: Record<string, unknown>) => Promise<unknown>;
}

export interface Queue {
  send: (messages: MessageBatch) => Promise<void>;
}

export interface MessageBatch extends Iterable<QueueMessage> {}

export interface QueueMessage {
  body: unknown;
}

// These global declarations ensure TypeScript knows about the Durable Object class binding.
declare global {
  // eslint-disable-next-line no-var
  var PicassoDurableObject: typeof PicassoDurableObject;
}
