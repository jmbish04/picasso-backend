import { Hono } from 'hono';
import type { Env } from '@/lib/env';
import { progressionSchemas } from '@/lib/schema';

export const createRouter = () => {
  const app = new Hono<{ Bindings: Env }>();

  app.get('/:projectId/progressions', (c) => {
    const { projectId } = c.req.param();
    progressionSchemas.projectId.parse(projectId);
    // TODO(Jules): list image progressions ordered by created_at; join judgments and tags.
    return c.json({ progressions: [] });
  });

  app.post('/:projectId/progressions/:progressionId/rollback', (c) => {
    const { projectId, progressionId } = c.req.param();
    progressionSchemas.projectId.parse(projectId);
    progressionSchemas.progressionId.parse(progressionId);
    // TODO(Jules): roll back to the specified progression, emit WS event, and persist audit trail.
    return c.json({ ok: true });
  });

  return app;
};
