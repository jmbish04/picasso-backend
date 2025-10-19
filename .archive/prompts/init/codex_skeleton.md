Prompt 1 — Codex (Skeleton)

You are Codex. Create a GitHub repo skeleton for Project Dali (backend-first) that Jules will later fill in. Priorities: clean structure, strong DX, typed boundaries, and inline code comments that act as TODOs/instructions for Jules. Do not alter the provided Cloudflare bindings or IDs.

Repo goals
    •   Cloudflare Worker backend (Hono + zod) with real-time WS via Durable Object.
    •   D1 migrations seeded and organized.
    •   Adapters folder for multi-provider routing.
    •   Agents folder (Orchestrator, Judge, Artifact) with typed interfaces and TODOs.
    •   Pluggable Artifact Registry with stubs for several artifact types beyond Lookbook.
    •   Dev scripts, CI-friendly layout, AGENTS.md for how agents collaborate.
    •   Keep bindings exactly as provided. Do not replace real IDs/names.

Create this structure

project-dali/
  .editorconfig
  .gitignore
  README.md
  AGENTS.md
  package.json
  tsconfig.json
  wrangler.toml                # Use EXACT bindings below
  src/
    index.ts                   # Hono app (route map only, TODO stubs)
    routes/
      projects.ts              # CRUD route stubs
      jobs.ts                  # image-job orchestration endpoint stub
      progressions.ts          # list/rollback stubs
      artifacts.ts             # create/customize/associate/list public serve stub
      public.ts                # GET /public/lookbook/:slug (stub)
    adapters/
      provider.types.ts        # Interfaces + enums (filled)
      openai.adapter.ts        # TODO: Jules implement
      gemini.adapter.ts        # TODO: Jules implement
      workers.adapter.ts       # TODO: Jules implement
      router.ts                # TODO: Jules implement routing & de-dupe
    agents/
      orchestrator.agent.ts    # TODO: pipeline glue; emits DO events
      judge.agent.ts           # TODO: pass/fail + notes/tags
      artifact.agent.ts        # TODO: placeholder-driven HTML fill
    artifacts/
      registry.ts              # Export map of artifact generators (stubs)
      lookbook/
        template.html          # Minimal HTML + placeholders
        generator.ts           # TODO: Jules implement
      storyboard/
        template.html          # TODO template
        generator.ts           # TODO
      moodboard/
        template.html          # TODO template
        generator.ts           # TODO
      compare-deck/
        template.html          # TODO template
        generator.ts           # TODO
      walkthrough-reel/
        generator.ts           # TODO (GIF/MP4 via external step or placeholder)
      provider-benchmark/
        generator.ts           # TODO (JSON + HTML summary)
      judge-report/
        generator.ts           # TODO
      prompt-lineage-map/
        generator.ts           # TODO (graph JSON + HTML)
      prompt-recipe-card/
        generator.ts           # TODO (JSON + preview HTML)
      knowledge-pack/
        generator.ts           # TODO
      seed-replay-script/
        generator.ts           # TODO
      r2-archive-manifest/
        generator.ts           # TODO
      review-board/
        template.html          # TODO with pinned comments placeholder
        generator.ts           # TODO
      voting-deck/
        template.html          # TODO (poll UI)
        generator.ts           # TODO
      stakeholder-pdf/
        template.html          # TODO (server-side HTML→PDF later)
        generator.ts           # TODO
      slideshow/
        template.html          # TODO
        generator.ts           # TODO
    durable-objects/
      session.do.ts            # WS fanout skeleton
    lib/
      env.ts                   # Env types matching wrangler.toml (filled)
      db.ts                    # D1 helpers (prepared statements, k/v helpers)
      r2.ts                    # R2 helpers (put/get/stream) stubs
      images.ts                # Cloudflare Images helpers stubs
      schema.ts                # zod schemas shared by routes (partial)
      ids.ts                   # id/slug helpers (nanoid)
      logging.ts               # structured logger
      security.ts              # X-Api-Key guard middleware
      ws-events.ts             # typed event payloads
    types/
      domain.ts                # Project, ImageProgression, Artifact types
  migrations/
    0001_init.sql              # tables + indexes (skeleton)
  seed/
    knowledge_base.sql         # seed provider tips (placeholder rows)

Use this wrangler.toml verbatim (don’t modify IDs/names)

name = "picasso-backend"
main = "src/index.ts"
compatibility_date = "2024-10-01"
compatibility_flags = ["nodejs_compat"]
observability = { enabled = true }

[vars]
DEFAULT_MODEL_REASONING = "@cf/meta/llama-3.3-70b-instruct-fp8-fast"
DEFAULT_MODEL_VISION = "@cf/meta/llama-3.2-11b-vision-instruct"

[ai]
binding = "AI"

[images]
binding = "IMAGES"

[assets]
binding = "ASSETS"
directory = "./public"

[[d1_databases]]
binding = "DB"
database_name = "picasso-backend"
database_id = "2c5e386d-cc7f-41f1-9964-3a650cc884fe"
migrations_dir = "migrations"

[[kv_namespaces]]
binding = "USER_PREFERENCES"
id = "e4b02f072368413293bf0a082b4fc487"

[[kv_namespaces]]
binding = "AGENTIC_MEMORIES"
id = "034f334883bf407f9d0637ec94291f25"

[[r2_buckets]]
binding = "BUCKET"
bucket_name = "picasso-backend"

[[durable_objects.bindings]]
name = "PICASSO_DO"
class_name = "PicassoDurableObject"
script_name = "picasso-backend"

[[migrations]]
tag = "v1"
new_sqlite_classes = ["PicassoDurableObject"]

[[workflows]]
binding = "PICASSO_WORKFLOW"
name = "picasso-workflow"
class_name = "PicassoWorkflow"

[[queues.producers]]
binding = "PICASSO_QUEUE"
queue = "picasso-backend-queue"

[[queues.consumers]]
queue = "picasso-backend-queue"
max_batch_size = 10
max_batch_timeout = 30

[env.preview]
[env.preview.vars]
DEFAULT_MODEL_REASONING = "@cf/meta/llama-3.1-8b-instruct"
DEFAULT_MODEL_VISION = "@cf/meta/llama-3.2-11b-vision-instruct"

[[env.preview.d1_databases]]
binding = "DB"
database_name = "picasso-backend-preview"
database_id = "YOUR_PREVIEW_DB_ID"
migrations_dir = "migrations"

[[env.preview.r2_buckets]]
binding = "BUCKET"
bucket_name = "picasso-backend-preview"

Fill these files with scaffold code + comments for Jules
    •   src/index.ts: Hono app with route registration only; add // TODO(Jules): comments where implementation is required. Include X-Api-Key middleware hook, not enforced yet.
    •   durable-objects/session.do.ts: Minimal WS accept/broadcast skeleton; comments for event types queued|running|progress|judge|fail|complete.
    •   lib/env.ts: exact Env interface for the above bindings (complete).
    •   lib/schema.ts: zod stubs for request/response of each route; mark TODOs.
    •   migrations/0001_init.sql: create projects, image_progressions, artifacts, knowledge_base, indexes given; include commented tables for artifact join/config/view that Jules may enable.
    •   seed/knowledge_base.sql: INSERT placeholders for provider tips (OpenAI/Gemini/Workers).

Add AGENTS.md (must include)
    •   Roles: Orchestrator, Judge, Artifact.
    •   Event flow diagram (ASCII) from /api/projects/:id/jobs → DO → adapters → judge → D1 → stream.
    •   Provider adapter contract + recommended retry/backoff.
    •   Artifact plug-in contract (generator signature, output types: html|pdf|json|video|3d|csv).
    •   “What Jules implements next” checklist.

Package + scripts
    •   package.json scripts:
    •   dev, deploy, deploy:preview
    •   types, d1:migrate, d1:migrate:preview
    •   tsconfig.json targeting ES2022 + workers types.

Important: Include succinct // TODO(Jules): comments in every file that requires implementation, with one-liners describing the expected behavior and cross-links to types.



Cloudflare-Native Scaffold Requirements (do not alter binding names)
    •   Agents as the conductor. Create agents/_tools.ts with typed tools that the Orchestrator/Judge/Artifact agents will call (D1 read/write, R2 put/get, Images upload, DO postMessage/fetch). Stub each tool with // TODO(Jules) and an example step.do('tool-name', ...) usage in comments.  ￼
    •   Durable Object as an Actor. In durable-objects/session.do.ts, document that this DO is a stateful actor managing WS clients for a sessionId. Add a POST /_actor/:sessionId handler stub for agents to send fan-out messages (JSON event payload). No direct state mutation from outside; only via that endpoint.  ￼
    •   Images vs R2. Add lib/images.ts and lib/r2.ts with comments that originals go to R2 and delivery images go through the IMAGES binding; D1 records must store both original_image_r2_key and generated_image_url. Put a checklist comment on every code path that touches images.  ￼
    •   Service boundaries for heavy work. Create services/ with a README.md explaining when to move work into a Cloudflare Container behind a service binding (e.g., advanced pHash or video assembly) and how the Worker calls it. Include a // TODO(Jules): add service binding in wrangler.toml when first container is introduced.  ￼
    •   Prompt-refinement store. In seed/knowledge_base.sql, add provider-tip rows and document in AGENTS.md that agents must read from knowledge_base before routing.  ￼
    •   Security hooks. Add lib/security.ts middleware stub enforcing X-Api-Key on non-GET; wire the hook but leave disabled with a // TODO(Jules): enable in prod.
    •   Event typings. In lib/ws-events.ts, define queued|running|progress|judge|fail|complete payloads and a WsEnvelope { sessionId, type, ts, data } so Codex-scaffolded UI clients can rely on types. (WS is delivered by the DO actor.)
    •   Artifact plugin registry. In artifacts/registry.ts, export a typed registry with the list you’re shipping (lookbook, storyboard, moodboard, compare-deck, walkthrough-reel, provider-benchmark, judge-report, prompt-lineage-map, prompt-recipe-card, knowledge-pack, seed-replay-script, r2-archive-manifest, review-board, voting-deck, stakeholder-pdf, slideshow). Each generator file gets a header block with required inputs/outputs and // TODO(Jules) notes for data flow.
    •   Never change bindings. wrangler.toml and lib/env.ts are the law; do not introduce placeholder IDs; code must import the exact bindings (DB, AI, BUCKET, IMAGES, PICASSO_DO, PICASSO_QUEUE, etc.).  ￼


Do all the above now.
