import { Hono } from 'hono';
import type { Env } from '@/lib/env';
import { artifactSchemas } from '@/lib/schema';
import { artifactRegistry } from '@/artifacts/registry';

export const createRouter = () => {
  const app = new Hono<{ Bindings: Env }>();

  app.get('/', (c) => {
    // TODO(Jules): list artifacts filtered by query params (projectId, type, visibility).
    return c.json({ artifacts: [] });
  });

  app.post('/', async (c) => {
    const body = await c.req.json();
    artifactSchemas.createBody.parse(body);
    // TODO(Jules): invoke Artifact Agent to gather config and render artifact via registry.
    return c.json({ artifact: body }, 202);
  });

  app.post('/:artifactId/customize', async (c) => {
    const { artifactId } = c.req.param();
    artifactSchemas.artifactId.parse(artifactId);
    const body = await c.req.json();
    artifactSchemas.customizeBody.parse(body);
    // TODO(Jules): hand off customization request to Artifact Agent and return tracking info.
    return c.json({ artifactId, status: 'pending' });
  });

  app.post('/:artifactId/associate', async (c) => {
    const { artifactId } = c.req.param();
    artifactSchemas.artifactId.parse(artifactId);
    const body = await c.req.json();
    artifactSchemas.associateBody.parse(body);
    // TODO(Jules): link artifact to projects/images and persist relation tables.
    return c.json({ ok: true });
  });

  app.get('/registry', (c) => {
    // TODO(Jules): consider restricting to internal clients when security middleware is enabled.
    return c.json({ registry: Object.keys(artifactRegistry) });
  });

  return app;
};
