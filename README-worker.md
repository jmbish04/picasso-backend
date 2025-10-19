# Project Dali Backend Skeleton

This repository contains the Cloudflare Worker backend scaffold for Project Dali. The goal is to provide Jules with a well-documented, strongly typed foundation to implement multi-provider AI image generation, judging, and artifact publishing workflows.

## Stack Overview
- **Runtime**: Cloudflare Workers (Hono framework)
- **Realtime**: Durable Object (`PicassoDurableObject`) for WebSocket fan-out
- **Data**: D1 + KV (`AGENTIC_MEMORIES`)
- **Storage**: R2 (`BUCKET`) for originals/templates, Cloudflare Images (`IMAGES`) for delivery
- **AI**: `AI` binding for orchestrator, judge, and artifact agents
- **Queues**: `PICASSO_QUEUE` for downstream consumers

> ⚠️ All bindings are defined in `wrangler.toml` and must not be modified.

## Getting Started
1. Install dependencies: `npm install`
2. Start local dev server: `npm run dev`
3. Run type checking: `npm run types`
4. Apply migrations to local D1: `npm run d1:migrate`

Additional documentation lives in:
- [`AGENTS.md`](./AGENTS.md) — collaboration guide and flow diagrams
- [`services/README.md`](./services/README.md) — guidelines for moving heavy work to Cloudflare Services

Implementation TODOs for Jules are marked throughout the codebase as `// TODO(Jules): ...`.
