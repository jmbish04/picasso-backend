# Project Dali — Agent Collaboration Charter

This document describes how the Orchestrator, Judge, and Artifact agents collaborate inside the Project Dali backend. Follow this guide when building new behaviors or debugging flows.

## Roles
- **Orchestrator Agent** — Coordinates provider routing, tracks job lifecycle, persists outputs, and streams state changes via the Durable Object actor.
- **Judge Agent** — Evaluates generated assets against the prompt, tags results, and writes structured feedback back to D1.
- **Artifact Agent** — Conversationally assembles shareable artifacts using stored project assets, templated HTML, and Cloudflare storage.

## Event Flow
```
POST /api/projects/:id/jobs
          │
          ▼
   Hono Route Layer
          │
          ▼
   Orchestrator Agent
          │ step.do('actor.emit', queued)
          ▼
PicassoDurableObject (session.do.ts)
          │ broadcasts WsEnvelope
          ▼
 Provider Router (adapters/router.ts)
          │
          ├─▶ OpenAI Adapter
          ├─▶ Gemini Adapter
          └─▶ Workers Adapter
          │
          ▼
   Judge Agent (verdict + tags)
          │
          ▼
        D1 Writes
          │
          ▼
   WebSocket Stream → Clients
```

## Provider Adapter Contract
Adapters live in `src/adapters`. Each adapter must implement the `ProviderAdapter` interface exported from `provider.types.ts`. Expectations:
- `run(op, context)` returns a `ProviderResult` with `generatedImageUrl` (delivery URL) and optional metadata.
- **Retries:** Use exponential backoff (base 2, max 3 attempts) for transient errors. Respect provider-specific rate limits.
- **Knowledge Base:** Router will supply provider tips. Apply them to prompts before sending requests.
- **Original Storage:** Adapters return handles to raw bytes when available so the Orchestrator can persist originals to R2.

## Artifact Plug-in Contract
Artifact generators live in `src/artifacts/*/generator.ts` and must conform to the `ArtifactGenerator` type exported from `src/artifacts/registry.ts`.
- `generate(env, args)` returns `{ r2Key, publicSlug? }` and uploads final output to R2 (or delegates to Cloudflare Images for derived assets).
- Supported output types: `html | pdf | json | video | 3d | csv`.
- Generators may persist configuration in D1 or KV via agent tools.
- Include checklist comments for image handling (original vs delivery) as required.

## What Jules Implements Next
- [ ] Flesh out provider adapters and routing logic with real API calls and retries.
- [ ] Complete Durable Object message handling and WebSocket broadcast wiring.
- [ ] Implement zod schemas and request validation across all routes.
- [ ] Finish artifact generator templates and rendering pipelines.
- [ ] Enable X-Api-Key enforcement middleware for protected routes.
- [ ] Populate migrations beyond skeletons and wire to application logic.
- [ ] Expand knowledge base seed data with real provider guidance.
