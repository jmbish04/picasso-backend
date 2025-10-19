import type { MiddlewareHandler } from 'hono';

interface SecurityOptions {
  enabled: boolean;
}

export function security(options: SecurityOptions): MiddlewareHandler {
  return async (c, next) => {
    if (!options.enabled || c.req.method === 'GET' || c.req.method === 'OPTIONS') {
      return next();
    }

    // TODO(Jules): enforce X-Api-Key header validation against KV or environment secrets.
    // Placeholder: allow all requests until keys are provisioned.
    return next();
  };
}

// TODO(Jules): add nonce/csrf protections if POST endpoints are exposed to browsers.
