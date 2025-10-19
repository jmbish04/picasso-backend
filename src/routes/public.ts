import { Hono } from 'hono';
import type { Env } from '@/lib/env';
import { publicSchemas } from '@/lib/schema';

export const createRouter = () => {
  const app = new Hono<{ Bindings: Env }>();

  app.get('/lookbook/:slug', (c) => {
    const { slug } = c.req.param();
    publicSchemas.lookbookSlug.parse(slug);
    // TODO(Jules): read rendered HTML from R2 using slug → key mapping and stream response.
    return c.text('Lookbook coming soon.', 202);
  });

  return app;
};
