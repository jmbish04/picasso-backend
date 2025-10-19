import type { Env } from './env';

export interface QueryOptions {
  signal?: AbortSignal;
}

export async function runQuery<T = unknown>(env: Env, sql: string, bindings: unknown[] = [], options: QueryOptions = {}) {
  // TODO(Jules): prepare statement, bind parameters, and handle errors with structured logging.
  env;
  sql;
  bindings;
  options;
  throw new Error('runQuery not implemented');
}

export async function getProjectById(env: Env, projectId: string) {
  // TODO(Jules): fetch single project row and map to domain types defined in src/types/domain.ts.
  env;
  projectId;
  throw new Error('getProjectById not implemented');
}

export async function listKnowledgeBaseTips(env: Env, providerId: string) {
  // TODO(Jules): query knowledge_base for provider-specific tips before adapter invocation.
  env;
  providerId;
  throw new Error('listKnowledgeBaseTips not implemented');
}

// TODO(Jules): add prepared statement cache and transactional helpers for multi-step writes.
