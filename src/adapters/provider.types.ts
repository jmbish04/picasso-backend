import type { Env } from '@/lib/env';
import type { ImageProgression } from '@/types/domain';

export type ImageOpKind = 'generate' | 'edit' | 'inpaint' | 'outpaint' | 'variation' | 'upscale';

export interface ImageOp {
  kind: ImageOpKind;
  prompt: string;
  startImageUrl?: string;
  sessionId: string;
  projectId: string;
  variantId: string;
}

export interface ProviderResult {
  generatedImageUrl: string;
  originalImageBytes?: ArrayBuffer;
  providerMeta?: Record<string, unknown>;
}

export interface ProviderRunContext {
  env: Env;
  jobId: string;
  projectId: string;
  sessionId: string;
  knowledgeBaseTip?: string;
  onProgress?: (event: Partial<ImageProgression>) => Promise<void> | void;
}

export interface ProviderAdapter {
  id: 'openai' | 'gemini' | 'workers';
  supports: ImageOpKind[];
  run(op: ImageOp, context: ProviderRunContext): Promise<ProviderResult>;
}

export interface ProviderRouterResult extends ProviderResult {
  providerId: ProviderAdapter['id'];
}

export type ProviderRegistry = Record<ProviderAdapter['id'], ProviderAdapter>;

export interface ProviderRouter {
  run(op: ImageOp, context: ProviderRunContext & { providerId: ProviderAdapter['id'] }): Promise<ProviderRouterResult>;
}

// TODO(Jules): extend ProviderRunContext with tracing metadata once observability hooks land.
