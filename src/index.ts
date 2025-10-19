import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { Env } from '@/lib/env';
import { createRouter as createProjectsRouter } from '@/routes/projects';
import { createRouter as createJobsRouter } from '@/routes/jobs';
import { createRouter as createProgressionsRouter } from '@/routes/progressions';
import { createRouter as createArtifactsRouter } from '@/routes/artifacts';
import { createRouter as createPublicRouter } from '@/routes/public';
import { logging } from '@/lib/logging';
import { security } from '@/lib/security';

const app = new Hono<{ Bindings: Env }>();

app.use('*', cors());
app.use('*', logging());
// TODO(Jules): enable API key enforcement for non-GET routes once keys are issued.
app.use('*', security({ enabled: false }));

app.route('/api/projects', createProjectsRouter());
app.route('/api/projects', createJobsRouter());
app.route('/api/projects', createProgressionsRouter());
app.route('/api/artifacts', createArtifactsRouter());
app.route('/public', createPublicRouter());

app.get('/healthz', (c) => c.json({ ok: true }));

// TODO(Jules): implement Durable Object alarm handler, queue consumers, and workflows when needed.
export default app;
