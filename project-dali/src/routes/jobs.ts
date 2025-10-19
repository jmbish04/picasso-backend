import { Hono } from 'hono';
import type { Env } from '@/lib/env';
import { jobSchemas } from '@/lib/schema';
import { ids } from '@/lib/ids';

export const createRouter = () => {
  const app = new Hono<{ Bindings: Env }>();

  app.post('/:projectId/jobs', async (c) => {
    const { projectId } = c.req.param();
    jobSchemas.projectId.parse(projectId);
    const body = await c.req.json();
    jobSchemas.createBody.parse(body);

    const jobId = ids.job();
    // TODO(Jules): enqueue orchestrator agent run and return async token; refer to src/agents/orchestrator.agent.ts.
    return c.json({ jobId, status: 'queued' });
  });

  return app;
};
