Of course, Justin. Here is a meta-prompt you can provide to GPT to refine its prompt-drafting process for Jules. This prompt instructs it on how to correctly and idiomatically incorporate the specific Cloudflare technologies you're using.

***

### **Prompt for GPT: "Cloudflare-Native Prompt Refinement"**

You are a senior prompt engineer specializing in Cloudflare's serverless developer platform. Your task is to refine and enhance prompts for an expert AI developer named "Jules." These prompts must guide Jules to build a backend API (`picasso-backend`) using specific, idiomatic Cloudflare technologies.

Your primary goal is to translate abstract requirements into concrete architectural patterns that leverage the full power of the Cloudflare ecosystem. Do not just list services; explain *how* they interact through bindings and specific SDKs.

Before you refine any prompt, internalize these **Core Cloudflare Architectural Principles**:

---

#### **1. Orchestration vs. Execution: `@cloudflare/agents` as the Conductor**

* **Mentality**: The `@cloudflare/agents` SDK is not just for calling an AI model; it's the central nervous system for orchestrating complex workflows. An "Agent" is the conductor, and the various bindings (D1, R2, Queues, DOs, Containers) are the instruments in the orchestra.
* **Implementation**: When drafting prompts, frame tasks as a sequence of steps orchestrated by an agent. The agent should `step.do()` actions that call tools, where each tool is a function that interacts with a binding (e.g., `await env.DB.prepare(...)` or `await env.BUCKET.put(...)`). Avoid generic instructions like "use D1"; instead, say "the agent should use its D1 tool to query the `projects` table."

---

#### **2. Stateful Actors, Not Just Storage: Durable Objects as `cloudflare/actors`**

* **Mentality**: A Durable Object (like `PicassoDurableObject`) is a stateful actor. It's not just a key-value store; it's a single-threaded, instantiated class that manages its own state and logic. It's perfect for managing real-time connections, coordinating state for a specific entity (like a `sessionId`), and ensuring transactional consistency for a single logical unit.
* **Implementation**: In your prompts for Jules, refer to Durable Objects as "actors." When describing the WebSocket streaming functionality, instruct Jules to "implement the `PicassoDurableObject` as a stateful actor responsible for managing WebSocket connections for a given session." Agents should *send messages* to this actor (via its `fetch` handler) rather than directly manipulating its state.

---

#### **3. Isolated Microservices: Cloudflare Containers for Heavy Lifting**

* **Mentality**: Not all logic belongs in a Worker. Heavy, complex, or non-JavaScript dependencies (like specialized Python libraries for image analysis or specific AI models) should be isolated in their own environment. This is the role of Cloudflare Containers.
* **Implementation**: When a task is too complex for a standard Worker (e.g., running a specific version of a Python library), instruct Jules to "deploy this functionality as a separate microservice using a Cloudflare Container." Crucially, specify that the main Worker and its agents will invoke this service via a **service binding** defined in `wrangler.toml`. This treats the container as a distinct, internal API.

---

#### **4. The Storage Dichotomy: R2 for Originals, Images for Delivery**

* **Mentality**: R2 and Cloudflare Images have distinct, complementary roles. **R2 (`BUCKET`)** is the source of truth for original, immutable artifacts (e.g., the raw output from an AI model, HTML templates). **Cloudflare Images (`IMAGES`)** is a delivery and transformation service. You never store originals in the Images service directly; you upload them, and it gives you an optimized, deliverable URL.
* **Implementation**: Be precise. Instruct Jules to "upload the original, high-fidelity image artifact to the R2 `BUCKET`" and then "upload that same image to the `IMAGES` binding to get a shareable, optimized delivery URL." The D1 `image_progressions` table must store both the `original_image_r2_key` and the `generated_image_url` (from Cloudflare Images).

---

#### **5. Ground Truth: `wrangler.toml` and `env.ts` are Law**

* **Mentality**: The provided `wrangler.toml` and the derived `src/types/env.ts` are not suggestions; they are the definitive contract for the runtime environment. All bindings (`DB`, `AI`, `BUCKET`, `PICASSO_DO`, etc.) are available on the `env` object.
* **Implementation**: Explicitly forbid the use of placeholder binding names. All instructions to Jules must reference the exact binding names as specified in the provided context. For example, always say "write to the `DB` binding" or "send a message to the `PICASSO_QUEUE` binding."

---

### **Your Task**

Now, review the following prompt draft I've created for Jules. Rewrite and enhance it to rigorously apply all five of the Core Cloudflare Architectural Principles detailed above. Ensure the final prompt is clear, technically precise, and guides Jules to build an application that is idiomatically Cloudflare-native.

**[-- PASTE YOUR ORIGINAL PROMPT DRAFT FOR JULES HERE --]**

```markdown
Here you go—two paste-ready prompts. First one tells Codex to scaffold the repo (with comments that guide Jules). Second one tells Jules to fully implement the backend, including the expanded artifact system. I’ve kept your real bindings intact and explicitly told both agents not to change them.

⸻

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

⸻

Prompt 2 — Jules (Fill in the Skeleton)

You are Jules. The repo skeleton already exists. Implement the backend Cloudflare Worker API for Project Dali in that repo. Do not change any Cloudflare bindings or IDs in wrangler.toml.

Implement the following (end-to-end)

1) Security & App bootstrap
    •   Enforce X-Api-Key on all non-GET API routes. Put the guard in a Hono middleware (lib/security.ts).
    •   Structured logger (lib/logging.ts) with jobId/provider/timings.

2) D1 schema & seeds
    •   Complete migrations/0001_init.sql per spec:
    •   Tables: projects, image_progressions, artifacts, knowledge_base.
    •   Indexes: projects(updated_at), image_progressions(project_id, created_at), artifacts(public_slug).
    •   Enable (uncomment/finish) advanced artifact tables and indexes:
    •   project_artifacts(project_id, artifact_id, PRIMARY KEY(project_id, artifact_id))
    •   artifact_configurations(artifact_id, config_key, config_value, PRIMARY KEY(artifact_id, config_key))
    •   artifact_views(id, artifact_id, timestamp, ip_address, country, city, user_agent)
    •   Indexes on artifact_views(artifact_id, timestamp)
    •   Fill seed/knowledge_base.sql with 3–5 tips per provider (OpenAI/Gemini/Workers).

3) Durable Object: session.do.ts
    •   Implement a broadcast hub keyed by sessionId.
    •   Support WS route GET /api/stream/:sessionId from src/index.ts:
    •   Accept connections, keep list of sockets per session, broadcast typed events:
    •   queued|running|progress|judge|fail|complete
    •   Heartbeats & cleanup on close.

4) Provider routing
    •   Complete adapters/provider.types.ts:

export type ImageOpKind = 'generate'|'edit'|'inpaint'|'outpaint'|'variation'|'upscale';
export interface ImageOp { kind: ImageOpKind; prompt: string; startImageUrl?: string }
export interface ProviderResult { generatedImageUrl: string; providerMeta?: Record<string, any> }
export interface ProviderAdapter { id:'openai'|'gemini'|'workers'; supports: ImageOpKind[]; run(op: ImageOp, env: Env): Promise<ProviderResult> }


    •   Implement:
    •   openai.adapter.ts (use IMAGES for delivery upload after generation).
    •   gemini.adapter.ts
    •   workers.adapter.ts
    •   In router.ts:
    •   Read knowledge_base → refine prompt by provider.
    •   Fan-out variants per provider.
    •   Add minimal pHash or perceptual thumbnail hash to skip near-duplicates.
    •   Emit granular WS events (queued, then running per provider/variant, progress, etc).

5) Storage rules
    •   If startImageUrl exists, ingest it and store the original bytes to R2 (BUCKET) → persist the R2 key in original_image_r2_key.
    •   After each provider returns, upload the delivery image to Cloudflare Images (IMAGES), persist generated_image_url.
    •   Insert row into image_progressions with ai_provider, timestamps, and initial empty judgment/ai_notes/ai_tags.

6) Judge agent
    •   Implement agents/judge.agent.ts:
    •   Input: { startImageUrl?, prompt, generatedImageUrl }
    •   Output: { judgment: 'pass'|'fail', notes: string[], tags: string[] }
    •   Use env.AI.run with a vision-capable model to score alignment.
    •   Update row with judgment, ai_notes, ai_tags.
    •   Emit WS judge event; if fail, include retrySuggestion (a short tip string).

7) Orchestrator agent
    •   Implement agents/orchestrator.agent.ts:
    •   Validate job payload; generate a jobId.
    •   For each provider × variant:
    •   Emit queued → running.
    •   Route to proper adapter (prompt refined via knowledge_base).
    •   On success, persist progression row, then call Judge.
    •   Emit progress and final complete when all variants done.
    •   On error, emit fail with error string.

8) Artifact system (plugin-like)
    •   artifacts/registry.ts:

export type ArtifactOutput = 'html'|'pdf'|'json'|'video'|'3d'|'csv';
export interface ArtifactGenerator {
  id: string;
  name: string;
  output: ArtifactOutput;
  generate: (env: Env, args: { projectIds: string[], options?: Record<string, any> }) => Promise<{ r2Key: string, publicSlug?: string }>;
}
export const registry: Record<string, ArtifactGenerator> = {
  lookbook: lookbookGenerator,
  storyboard: storyboardGenerator,
  moodboard: moodboardGenerator,
  compareDeck: compareDeckGenerator,
  walkthroughReel: walkthroughReelGenerator,
  providerBenchmark: providerBenchmarkGenerator,
  judgeReport: judgeReportGenerator,
  promptLineageMap: promptLineageMapGenerator,
  promptRecipeCard: promptRecipeCardGenerator,
  knowledgePack: knowledgePackGenerator,
  seedReplayScript: seedReplayScriptGenerator,
  r2ArchiveManifest: r2ArchiveManifestGenerator,
  reviewBoard: reviewBoardGenerator,
  votingDeck: votingDeckGenerator,
  stakeholderPdf: stakeholderPdfGenerator,
  slideshow: slideshowGenerator,
};


    •   Implement Lookbook fully (read CF Images URLs for selected project(s), inject into template.html, write final HTML to R2, return public_slug).
    •   Stub other generators with meaningful TODOs and return shaped placeholders (e.g., JSON or HTML with “coming soon”).

9) Routes (Hono + zod)
    •   GET /api/projects — list
    •   POST /api/projects — create
    •   GET /api/projects/:id — fetch
    •   PATCH /api/projects/:id — update
    •   GET /api/projects/:id/progressions?query=&tags=[] — filter by text/tags (simple LIKE/json_each)
    •   POST /api/projects/:id/jobs — body:
{ startImageUrl?: string, prompt: string, providers: ('openai'|'gemini'|'workers')[], variants?: number, sessionId: string }
→ call Orchestrator, stream via DO
    •   POST /api/progressions/:id/rollback — create new progression based on that step’s original/start image
    •   POST /api/projects/:id/artifacts/lookbook — generate HTML in R2; return { public_slug }
    •   POST /api/artifacts — generic artifact creation by registry id; associate with projects
    •   POST /api/artifacts/:id/associate — link to more projects
    •   POST /api/artifacts/:id/customize — chat-like step storage in AGENTIC_MEMORIES, commit to artifact_configurations
    •   GET /public/lookbook/:slug — stream from R2 (cache headers, async log view via PICASSO_QUEUE)

10) Queue consumer (view logging)
    •   Consume PICASSO_QUEUE messages; write artifact_views with ip, country, city, ua, timestamp.

11) README
    •   Add env var table, wrangler dev instructions, cURL examples for all routes, and WS example (wscat) for /api/stream/:sessionId.
    •   Document artifact plug-in model and how to add a new generator.

⸻

Guardrails & Non-negotiables
    •   Do not change binding names/IDs in wrangler.toml. Use them as typed in lib/env.ts.
    •   All public delivery images must come from Cloudflare Images.
    •   Originals/templates go to R2.
    •   Non-GET routes require X-Api-Key.
    •   Emit WS events at each stage; never block on long tasks without streaming progress.

Definition of Done
    •   All routes compile and run under wrangler dev.
    •   d1:migrate succeeds; seeds load.
    •   Submitting a /api/projects/:id/jobs with mock provider returns progress events and writes a progression with judge output.
    •   /api/projects/:id/artifacts/lookbook returns a working public_slug that serves HTML from R2.
    •   Queue consumer records artifact_views for public GETs.



Implement now.
```
PROMPT 2 - JULES 

You are Jules. Build the backend Worker API for Project Dali. It orchestrates multi-provider image generation/edits, versioning, judge checks, and artifact (lookbook) publishing. Frontend is already defined—implement the contract below.

Cloudflare Stack
    •   Hono for HTTP routes + zod validation.
    •   Durable Object SessionDO for real-time job streaming via WebSocket (/api/stream/:sessionId).
    •   D1 for data (schema below).
    •   R2 for originals & static lookbooks; Cloudflare Images for delivery versions.
    •   @cloudflare/agents (or your abstraction) to run provider adapters & judge agent.

D1 Schema (migrations)
    •   projects(id TEXT PRIMARY KEY, name TEXT, description TEXT, created_at INTEGER, updated_at INTEGER)
    •   image_progressions(id TEXT PRIMARY KEY, project_id TEXT, parent_progression_id TEXT NULL, start_image_url TEXT NULL, prompt TEXT, generated_image_url TEXT, original_image_r2_key TEXT, ai_provider TEXT, ai_notes TEXT, ai_tags TEXT, judgment TEXT NULL, created_at INTEGER, FOREIGN KEY(project_id) REFERENCES projects(id))
    •   artifacts(id TEXT PRIMARY KEY, project_id TEXT, title TEXT, r2_key TEXT, public_slug TEXT UNIQUE, created_at INTEGER, FOREIGN KEY(project_id) REFERENCES projects(id))
    •   knowledge_base(key TEXT PRIMARY KEY, value TEXT)  // JSON strings with provider tips
    •   Indexes: projects(updated_at), image_progressions(project_id, created_at), artifacts(public_slug)

REST API (aligns with frontend)
    •   GET /api/projects
    •   POST /api/projects  // {name, description?}
    •   GET /api/projects/:id
    •   PATCH /api/projects/:id
    •   GET /api/projects/:id/progressions?query=&tags=[]
    •   POST /api/projects/:id/jobs
Body: { startImageUrl?: string, prompt: string, providers: ('openai'|'gemini'|'workers')[], variants?: number, sessionId: string }
Behavior:
    1.  Refine prompt per provider using knowledge_base.
    2.  Fan-out N variants per provider.
    3.  For each job: fetch/ingest startImageUrl (if present) → store original to R2 → run provider adapter → upload delivery to Cloudflare Images.
    4.  Create image_progressions row with metadata.
    5.  Call Judge → update judgment, ai_notes, ai_tags.
    6.  Stream granular events to SessionDO for sessionId.
    •   POST /api/progressions/:id/rollback
Creates a new progression using that step’s original/start image as the new base; returns new progression id.
    •   POST /api/projects/:id/artifacts/lookbook
Generates static HTML (from template) including project images (CF Images URLs), writes to R2, returns { public_slug }.
    •   GET /public/lookbook/:slug
Streams HTML from R2 (cacheable).

WebSocket Streaming (Durable Object: SessionDO)
    •   Endpoint: WS /api/stream/:sessionId
    •   Event types: queued | running | progress | judge | fail | complete
    •   Payload includes: jobId, provider, variantIndex, generatedImageUrl?, notes?, tags?, error?

Provider Routing

Define:

type ImageOpKind = 'generate'|'edit'|'inpaint'|'outpaint'|'variation'|'upscale';

interface ImageOp { kind: ImageOpKind; prompt: string; startImageUrl?: string; }

interface ProviderAdapter {
  id: 'openai'|'gemini'|'workers';
  supports: ImageOpKind[];
  run(op: ImageOp, env: Env): Promise<{ generatedImageUrl: string; providerMeta?: any }>;
}

    •   Implement adapters for OpenAI, Gemini, Workers AI with simple, working calls (env keys).
    •   Add a minimal perceptual hash (pHash) step to avoid saving near-duplicates (okay to stub a fast hash first).

Judge Agent
    •   Input: { startImageUrl?, prompt, generatedImageUrl }
    •   Output → store in image_progressions:
    •   judgment: 'pass'|'fail'
    •   ai_notes: short bullet list
    •   ai_tags: JSON array
    •   If fail, emit a judge event with notes and a retrySuggestion string.

Storage Rules
    •   Originals (uploaded or fetched) → R2.
    •   Delivery images (what the UI shows/compares) → Cloudflare Images.
    •   Persist both locations on each progression row.

Security & Ops
    •   Basic auth token for write routes (header X-Api-Key).
    •   Request body size guard; file type checks on image ingest.
    •   Verbose structured logs per job (jobId, provider, timings).
    •   wrangler.toml bindings:
    •   D1, R2_ASSETS, IMAGES, AI, DO_SESSIONS
    •   Seed knowledge_base with 3–5 provider tips each.

Cloudflare-Native Implementation Rules (must follow)
    1.  Agents orchestrate; tools execute. Implement Orchestrator/Judge/Artifact with @cloudflare/agents. Each external effect (DB/R2/Images/DO/Queues) is a tool invoked via step.do('tool-name', fn). Keep business logic inside agents, and IO inside tools. This guarantees traceability and retries.  ￼
    2.  Treat the DO as an Actor.
    •   Add POST /_actor/:sessionId endpoint on the DO for agents to send events; DO fans out to connected WS clients.
    •   Keep an in-memory Map<sessionId, Set<WebSocket>> and prune on close/heartbeat timeout. No direct mutation of WS sets from the Worker—always message the DO.  ￼
    3.  Images pipeline is two-phase.
    •   Phase A (R2 Originals): when receiving startImageUrl or a provider result, fetch bytes and BUCKET.put() with a deterministic key (project/{id}/jobs/{jobId}/orig/{n}); store key in D1.
    •   Phase B (Delivery URL): upload the display asset to IMAGES, persist its public URL in generated_image_url. Never serve originals directly.  ￼
    4.  Provider routing & prompt refinement. Before each provider call, read knowledge_base tips and rewrite prompts accordingly; log the applied tip set in job metadata. Implement a minimal pHash (or tiny-thumbnail hash) to skip near-duplicates before insert.  ￼
    5.  Artifacts are plugins. Implement Lookbook fully; others can return structured placeholders but must write manifests to R2 and rows to D1. For public views, stream from R2 and asynchronously enqueue a view log to PICASSO_QUEUE → consumer inserts into artifact_views.
    6.  Security and limits. Enforce X-Api-Key on non-GET, cap body size, validate image MIME, and apply per-IP rate-limits on /jobs (simple DO-scoped token bucket is fine).
    7.  Observability. Emit structured logs { jobId, sessionId, provider, step, ms }. If the Agents SDK exposes traces, annotate each step.do with a span label.
    8.  Idempotency. Accept optional Idempotency-Key on /jobs; skip duplicate processing if a D1 row exists for the same projectId + key.
    9.  Backpressure & progress. For each variant: queued → running(provider,variant) → progress(0..1) → judge(result) → complete. Flush WS messages via the DO; never hold a long-running request without emitting events.
    10. Wrangler contract is immutable. Use only the bindings and names defined in wrangler.toml/env.ts. Do not add placeholder bindings; if you need a container service, call it out as a new service binding to be added later (commented TODO).  ￼

Concrete “Done” checks (expand your Definition of Done)
    •   POST /api/projects/:id/jobs runs multi-provider with prompt tips applied, writes R2 original + Images delivery, inserts D1 row, and streams WS via the DO actor.
    •   POST /api/projects/:id/artifacts/lookbook writes HTML to R2 and returns a working public_slug; GET /public/lookbook/:slug streams it and logs a view via queue consumer.
    •   Judge emits pass/fail + tags; on fail, /jobs stream includes a retrySuggestion.
    •   Queue consumer writes artifact_views consistently under load (batch ack).    

What to output now
    1.  worker.ts with Hono routes and zod validators.
    2.  durable-objects/session.ts implementing the WebSocket fanout.
    3.  adapters/{openai,gemini,workers}.ts (minimal working run() calls).
    4.  migrations/0001_init.sql + seed/knowledge_base.sql.
    5.  lookbook/template.html + generator code.
    6.  README.md with env vars, wrangler dev, and cURL examples for every route.

Keep code modular and document every exported function with a docstring optimized for AI code review.



````markdown
# ✅ Complete Cloudflare Configuration and Scaffold for `picasso-backend`

Below is the **final version** of the complete setup with your correct D1 database ID  
(`2c5e386d-cc7f-41f1-9964-3a650cc884fe`) filled in.

---

## `wrangler.toml`

```toml
name = "picasso-backend"
main = "src/index.ts"
compatibility_date = "2024-10-01"
compatibility_flags = ["nodejs_compat"]

# Observability
observability = { enabled = true }

# Environment Variables
[vars]
DEFAULT_MODEL_REASONING = "@cf/meta/llama-3.3-70b-instruct-fp8-fast"
DEFAULT_MODEL_VISION = "@cf/meta/llama-3.2-11b-vision-instruct"

# Workers AI Binding
[ai]
binding = "AI"

# Cloudflare Images Binding
[images]
binding = "IMAGES"

# Assets binding
[assets]
binding = "ASSETS"
directory = "./public"

# D1 Databases
[[d1_databases]]
binding = "DB"
database_name = "picasso-backend"
database_id = "2c5e386d-cc7f-41f1-9964-3a650cc884fe"
migrations_dir = "migrations"

# KV Namespaces
[[kv_namespaces]]
binding = "USER_PREFERENCES"
id = "e4b02f072368413293bf0a082b4fc487"

[[kv_namespaces]]
binding = "AGENTIC_MEMORIES"
id = "034f334883bf407f9d0637ec94291f25"

# R2 Buckets
[[r2_buckets]]
binding = "BUCKET"
bucket_name = "picasso-backend"

# Durable Objects
[[durable_objects.bindings]]
name = "PICASSO_DO"
class_name = "PicassoDurableObject"
script_name = "picasso-backend"

[[migrations]]
tag = "v1"
new_sqlite_classes = ["PicassoDurableObject"]

# Workflows
[[workflows]]
binding = "PICASSO_WORKFLOW"
name = "picasso-workflow"
class_name = "PicassoWorkflow"

# Queues
[[queues.producers]]
binding = "PICASSO_QUEUE"
queue = "picasso-backend-queue"

[[queues.consumers]]
queue = "picasso-backend-queue"
max_batch_size = 10
max_batch_timeout = 30

# Preview Environment
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
````

---

## 🧩 Durable Object

`src/durable-objects/PicassoDurableObject.ts`

```typescript
import { DurableObject } from 'cloudflare:workers';
import { Env } from '../types/env';

export class PicassoDurableObject extends DurableObject<Env> {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    
    switch (url.pathname) {
      case '/counter':
        return this.handleCounter();
      case '/state':
        return this.handleState();
      default:
        return new Response('Durable Object Ready', { status: 200 });
    }
  }

  private async handleCounter(): Promise<Response> {
    let count = (await this.ctx.storage.get<number>('counter')) || 0;
    count++;
    await this.ctx.storage.put('counter', count);
    return Response.json({ count });
  }

  private async handleState(): Promise<Response> {
    const allData = await this.ctx.storage.list();
    const state = Object.fromEntries(allData);
    return Response.json({ state });
  }
}
```

---

## ⚙️ Workflow Entrypoint

`src/workflows/PicassoWorkflow.ts`

```typescript
import { WorkflowEntrypoint, WorkflowStep, WorkflowEvent } from 'cloudflare:workers';
import { Env } from '../types/env';

type WorkflowParams = {
  userId: string;
  task: string;
  timestamp: string;
};

export class PicassoWorkflow extends WorkflowEntrypoint<Env, WorkflowParams> {
  async run(event: WorkflowEvent<WorkflowParams>, step: WorkflowStep) {
    const { userId, task } = event.params;

    // Step 1: Validate input
    await step.do('validate', async () => {
      console.log(`Validating task ${task} for user ${userId}`);
      return { valid: true };
    });

    // Step 2: Process with AI
    const aiResult = await step.do('process-ai', async () => {
      const response = await this.env.AI.run(this.env.DEFAULT_MODEL_REASONING, {
        messages: [{ role: 'user', content: `Process task: ${task}` }]
      });
      return response;
    });

    // Step 3: Store result in D1
    await step.do('store-result', async () => {
      await this.env.DB.prepare(
        'INSERT INTO workflow_results (user_id, task, result, created_at) VALUES (?, ?, ?, ?)'
      ).bind(
        userId,
        task,
        JSON.stringify(aiResult),
        new Date().toISOString()
      ).run();
    });

    // Step 4: Notify Queue
    await step.do('notify', async () => {
      await this.env.PICASSO_QUEUE.send({
        type: 'workflow-complete',
        userId,
        task,
        result: aiResult
      });
    });

    return { success: true, userId, task, result: aiResult };
  }
}
```

---

## 🧠 Env Types

`src/types/env.ts`

```typescript
export interface Env {
  DEFAULT_MODEL_REASONING: string;
  DEFAULT_MODEL_VISION: string;

  AI: Ai;
  IMAGES: any;
  ASSETS: Fetcher;
  DB: D1Database;

  USER_PREFERENCES: KVNamespace;
  AGENTIC_MEMORIES: KVNamespace;

  BUCKET: R2Bucket;
  PICASSO_DO: DurableObjectNamespace;
  PICASSO_WORKFLOW: Workflow;
  PICASSO_QUEUE: Queue;
}
```

---

## 📦 Package Configuration

`package.json`

```json
{
  "name": "picasso-backend",
  "version": "1.0.0",
  "scripts": {
    "dev": "wrangler dev",
    "deploy": "wrangler deploy",
    "deploy:preview": "wrangler deploy --env preview",
    "types": "wrangler types",
    "d1:create-migration": "wrangler d1 migrations create DB",
    "d1:migrate": "wrangler d1 migrations apply DB",
    "d1:migrate:preview": "wrangler d1 migrations apply DB --env preview"
  },
  "devDependencies": {
    "@cloudflare/workers-types": "^4.20241127.0",
    "typescript": "^5.7.3",
    "wrangler": "^3.100.0"
  }
}
```

---

## 🧱 TypeScript Config

`tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "lib": ["ES2022"],
    "types": ["@cloudflare/workers-types"],
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowJs": true,
    "checkJs": false,
    "jsx": "react",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

---

## 🚀 Next Steps

```bash
# 1️⃣ Verify databases
npx wrangler d1 list

# 2️⃣ Create migration folder
mkdir migrations

# 3️⃣ Install deps
npm install

# 4️⃣ Generate worker types
npx wrangler types

# 5️⃣ Start dev mode
npm run dev
```

**[-- PASTE YOUR PRIOR JULES PREP MATERIALS BELOW THAT SHOULD  BE INCORPORATED AS CONTEXT --]**

Of course, Justin. I've enhanced the prompt for Jules to incorporate the more sophisticated, multi-project, and agent-driven artifact system you've described.

This revised prompt builds on the solid foundation of the previous version, adding a layer of dynamic content generation and user interaction that aligns perfectly with your work in orchestrating complex, multi-agent AI workflows. The `wrangler.toml` configuration you provided is assumed to be in place, and the instructions for Jules are written to leverage those exact bindings.

Here is the enhanced prompt:

***

You are Jules. Build the backend Worker API for Project Dali, a highly interactive and scalable system for AI image creation and publishing. Your primary role is to orchestrate a distributed network of agents, actors, and services to handle multi-provider image generation, versioning, quality control, and the dynamic creation of shareable artifacts.

### **Cloudflare Stack & Architecture**

You will build this system exclusively on the Cloudflare Developer Platform. The `wrangler.toml` file is already configured with all necessary bindings. Your code must use these exact bindings as they appear in the `Env` type.

* **Hono**: Serves as the main router in `src/index.ts` for all HTTP requests, using Zod for strict validation.
* **Durable Object (`PicassoDurableObject`)**: Acts as a stateful actor for real-time job streaming. It manages WebSocket connections for `sessionId`s to broadcast the status of ongoing image generation jobs.
* **D1 (`DB`)**: The single source of truth for all relational data, including projects, image progressions, artifacts, and analytics.
* **R2 (`BUCKET`) & Cloudflare Images (`IMAGES`)**: **R2** is used for storing originals: high-fidelity generated images and artifact templates (HTML with placeholders). **Cloudflare Images** is the exclusive CDN for all public-facing, transformed, and delivery-optimized images.
* **@cloudflare/agents (`AI`)**: This is the core of your orchestration logic. You will define a primary **Orchestrator Agent** to manage the image generation pipeline and a specialized **Artifact Agent** for user-driven artifact customization.
* **KV (`AGENTIC_MEMORIES`)**: Use this binding to persist conversational state for the Artifact Agent, allowing users to pause and resume customization sessions.
* **Queues (`PICASSO_QUEUE`)**: Offload non-critical tasks like logging artifact views to avoid blocking user-facing requests.

### **D1 Schema (migrations)**

Your first task is to define the database migrations.

* `projects(id TEXT PRIMARY KEY, name TEXT, description TEXT, created_at INTEGER, updated_at INTEGER)`
* `image_progressions(id TEXT PRIMARY KEY, project_id TEXT, parent_progression_id TEXT NULL, start_image_url TEXT NULL, prompt TEXT, generated_image_url TEXT, original_image_r2_key TEXT, ai_provider TEXT, ai_notes TEXT, ai_tags TEXT, judgment TEXT NULL, created_at INTEGER, FOREIGN KEY(project_id) REFERENCES projects(id))`
* `artifacts(id TEXT PRIMARY KEY, owner_id TEXT, title TEXT, template_r2_key TEXT, content_r2_key TEXT, public_slug TEXT UNIQUE, created_at INTEGER)`
* **`project_artifacts` (Join Table)**: `(project_id TEXT, artifact_id TEXT, PRIMARY KEY (project_id, artifact_id), FOREIGN KEY(project_id) REFERENCES projects(id), FOREIGN KEY(artifact_id) REFERENCES artifacts(id))`
* **`artifact_configurations`**: `(artifact_id TEXT, config_key TEXT, config_value TEXT, PRIMARY KEY (artifact_id, config_key), FOREIGN KEY(artifact_id) REFERENCES artifacts(id))`
* **`artifact_views`**: `(id TEXT PRIMARY KEY, artifact_id TEXT, timestamp INTEGER, ip_address TEXT, country TEXT, city TEXT, user_agent TEXT, FOREIGN KEY(artifact_id) REFERENCES artifacts(id))`
* `knowledge_base(key TEXT PRIMARY KEY, value TEXT)`
* **Indexes**: `projects(updated_at)`, `image_progressions(project_id, created_at)`, `artifacts(public_slug)`, `artifact_views(artifact_id, timestamp)`

### **REST API & Agentic Workflows**

* `GET /api/projects`
* `POST /api/projects` // `{ name, description? }`
* `GET /api/projects/:id`
* `PATCH /api/projects/:id`
* `GET /api/projects/:id/progressions?query=&tags=[]`
* **`POST /api/projects/:id/jobs`**
    * **Body**: `{ startImageUrl?: string, prompt: string, providers: ('openai'|'gemini'|'workers')[], variants?: number, sessionId: string }`
    * **Behavior**: This endpoint triggers the **Orchestrator Agent** to manage a multi-step image generation workflow, pushing real-time updates to the `PicassoDurableObject` actor for the given `sessionId`.
* **`POST /api/artifacts`** // `{ templateR2Key: string, title: string, projectIds: string[] }`
    * Creates a new artifact record, associates it with one or more projects via the `project_artifacts` table, and returns the `artifact_id` and `public_slug`.
* **`POST /api/artifacts/:id/associate`** // `{ projectId: string }`
    * Links an existing artifact to an additional project.
* **`POST /api/artifacts/:id/customize`** // `{ sessionId: string, input: string }`
    * **Behavior**: This is the entrypoint for the **Artifact Agent**. The user interacts with this endpoint via a chat interface.
        1.  The agent loads its conversational state from `AGENTIC_MEMORIES` using the `sessionId`.
        2.  It retrieves the artifact's template from R2 (`template_r2_key`) and identifies placeholders (e.g., `{{TITLE}}`, `{{IMAGE_PLACEHOLDER_1}}`).
        3.  It guides the user through filling the placeholders, allowing them to select images from any associated projects.
        4.  As the user makes choices, the agent saves them to the `artifact_configurations` table in D1.
        5.  Once all placeholders are filled, the agent triggers a final rendering process that generates the complete HTML, stores it in R2 (`content_r2_key`), and notifies the user.
* **`GET /public/artifact/:slug`**
    * **Behavior**:
        1.  Fetches the artifact record from D1 using the `public_slug`.
        2.  Retrieves the rendered HTML from R2 via its `content_r2_key`.
        3.  **Asynchronously**, sends a message to `PICASSO_QUEUE` with request details (IP, CF-Connecting-IP, CF-IPCountry, User-Agent) for logging. The queue consumer will process this and insert a record into the `artifact_views` table.
        4.  Streams the HTML from R2 to the client with appropriate caching headers.

### **Artifact Customization Agent**

This is a specialized agent built with `@cloudflare/agents` responsible for interactive artifact configuration.

* **State Management**: Uses `AGENTIC_MEMORIES` (KV) to persist the conversation state, keyed by `sessionId`.
* **Knowledge**: It reads the artifact's HTML template from R2 to identify required placeholders (e.g., `{{TITLE}}`, `{{SUBTITLE}}`, `{{IMAGE_1}}`, `{{IMAGE_2}}`).
* **Tools**:
    * `get_projects_for_artifact(artifactId)`: Queries the D1 `project_artifacts` table.
    * `get_images_for_project(projectId)`: Queries the D1 `image_progressions` table.
    * `save_configuration(artifactId, key, value)`: Writes a key-value pair to the D1 `artifact_configurations` table.
    * `render_artifact(artifactId)`: A final step that reads all configurations from D1, injects them into the R2 template, and saves the final HTML back to R2 under the `content_r2_key`.

### **Storage & Security**

* **Originals & Templates**: All high-fidelity AI-generated images and HTML artifact templates are stored in the **R2** `BUCKET`.
* **Delivery Images**: All images displayed in the UI or in public artifacts must be served via **Cloudflare Images** for optimization and transformation.
* **Security**: All non-public API routes must be protected by a secret token passed in the `X-Api-Key` header.

### **What to Output Now**

1.  **`worker.ts`**: The main Hono router with all API endpoints and Zod validators.
2.  **`durable-objects/PicassoDurableObject.ts`**: Implementation for the real-time job streaming WebSocket actor.
3.  **`agents/`**: Directory containing the logic for the **Orchestrator Agent** and the **Artifact Agent**.
4.  **`migrations/0001_init.sql`**: The complete SQL schema including all tables and indexes.
5.  **`seed/knowledge_base.sql`**: Seed data for provider tips.
6.  An example **`lookbook/template.html`** with placeholders.
7.  A comprehensive **`README.md`** with `cURL` examples for every API endpoint.
