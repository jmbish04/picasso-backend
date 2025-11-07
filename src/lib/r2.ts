import type { Env } from './env';

export interface R2PutOptions {
  httpMetadata?: R2HTTPMetadata;
}

export async function putObject(env: Env, key: string, data: ReadableStream | ArrayBuffer | Blob, options: R2PutOptions = {}) {
  // TODO(Jules): upload originals/templates to R2 (BUCKET) and ensure deterministic key naming.
  env;
  key;
  data;
  options;
  throw new Error('putObject not implemented');
}

export async function getObject(env: Env, key: string) {
  // TODO(Jules): retrieve object from R2 with caching headers for public delivery when appropriate.
  env;
  key;
  throw new Error('getObject not implemented');
}

export async function streamObject(env: Env, key: string) {
  // TODO(Jules): stream R2 object to client response to avoid buffering large assets.
  env;
  key;
  throw new Error('streamObject not implemented');
}

// Checklist: whenever manipulating images ensure both original_image_r2_key and generated_image_url are updated.
