import { Hono } from 'hono';
import type { Env } from '@/lib/env';
import { projectSchemas } from '@/lib/schema';

export const createRouter = () => {
  const app = new Hono<{ Bindings: Env }>();

  app.get('/', (c) => {
    // TODO(Jules): list projects from D1 using pagination; see types in src/types/domain.ts.
    return c.json({ projects: [], cursor: null });
  });

  app.post('/', async (c) => {
    const body = await c.req.json();
    projectSchemas.createBody.parse(body);
    // TODO(Jules): insert project row into D1 and return created entity.
    return c.json({ project: body }, 201);
  });

  app.get('/:projectId', (c) => {
    const { projectId } = c.req.param();
    projectSchemas.projectId.parse(projectId);
    // TODO(Jules): fetch project by id from D1; handle 404.
    return c.json({ project: null });
  });

  app.patch('/:projectId', async (c) => {
    const { projectId } = c.req.param();
    projectSchemas.projectId.parse(projectId);
    const body = await c.req.json();
    projectSchemas.updateBody.parse(body);
    // TODO(Jules): update project metadata and return latest record.
    return c.json({ project: body });
  });

  app.delete('/:projectId', (c) => {
    const { projectId } = c.req.param();
    projectSchemas.projectId.parse(projectId);
    // TODO(Jules): soft-delete project and cascade artifact visibility updates.
    return c.json({ ok: true });
  });

  return app;
};
