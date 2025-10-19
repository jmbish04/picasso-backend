import type { Env } from './env';

export interface ImageUploadResult {
  id: string;
  publicUrl: string;
}

export async function uploadDeliveryImage(env: Env, data: Blob | ArrayBuffer | ArrayBufferView | ReadableStream) {
  // TODO(Jules): upload via env.IMAGES binding and return public delivery URL.
  env;
  data;
  throw new Error('uploadDeliveryImage not implemented');
}

export async function deleteDeliveryImage(env: Env, imageId: string) {
  // TODO(Jules): remove delivery variant if rollbacks require purging Cloudflare Images asset.
  env;
  imageId;
  throw new Error('deleteDeliveryImage not implemented');
}

// Checklist: ensure paired R2 originals are preserved even when delivery variants are replaced.
