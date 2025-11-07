import type { MiddlewareHandler } from 'hono';

export function logging(): MiddlewareHandler {
  return async (c, next) => {
    const start = Date.now();
    await next();
    const duration = Date.now() - start;
    // TODO(Jules): integrate with Cloudflare trace headers and forward logs to analytics pipeline.
    console.log('request', {
      method: c.req.method,
      path: c.req.path,
      status: c.res.status,
      duration,
    });
  };
}

// TODO(Jules): add helper for agent step logging with jobId/sessionId context.
