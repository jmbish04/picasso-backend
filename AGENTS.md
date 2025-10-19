AGENTS.md — Project `picasso-backend`

A Cloudflare-native, agent-orchestrated platform for AI image generation, inline edits, quality control, and shareable artifacts.
	•	Runtime: Cloudflare Workers
	•	Realtime: Durable Object actor (PICASSO_DO) for WebSocket fan-out
	•	Data: D1 (DB)
	•	Originals & HTML: R2 (BUCKET)
	•	Delivery images: Cloudflare Images (IMAGES)
	•	LLM/vision + agents: AI (@cloudflare/agents)
	•	Queues: PICASSO_QUEUE
	•	Memory: AGENTIC_MEMORIES (KV)
	•	Frontend: Separate Worker app; connects to this API

Immutable contract: Do not change binding names/IDs defined in wrangler.toml. Code must use the exact bindings listed above via Env.

⸻

1) High-level architecture

Client (React)  ──(HTTP/WS)──>  API Worker (Hono)
                                  │
                                  ├─ Durable Object Actor (PICASSO_DO) ⇄ WebSocket clients
                                  │
                                  ├─ Orchestrator Agent (AI)
                                  │     ├─ Tools: D1, R2, Images, DO Fanout, Queue
                                  │     └─ Provider Router → {OpenAI, Gemini, Workers}
                                  │
                                  ├─ Judge Agent (AI vision)
                                  │     └─ writes judgment/notes/tags to D1
                                  │
                                  └─ Artifact Agent (AI)
                                        ├─ reads/writes config to D1 + KV
                                        └─ renders HTML to R2 → public GET


⸻

2) Event lifecycle (jobs)

POST /api/projects/:id/jobs
  → Orchestrator Agent:
      1) validate payload, generate jobId, read knowledge_base tips
      2) for each provider × variant:
           emit → DO: queued
           run adapter (prompt refined)
           persist: R2 original (if any), Cloudflare Images delivery
           write image_progressions row
           call Judge Agent → update judgment/notes/tags
           emit → DO: running/progress/judge
      3) when all variants done → DO: complete

WebSocket envelope (lib/ws-events.ts):

type WsType = 'queued' | 'running' | 'progress' | 'judge' | 'fail' | 'complete';
interface WsEnvelope<T=any> { sessionId: string; type: WsType; ts: number; data: T; }


⸻

3) Agents

3.1 Orchestrator Agent
	•	Goal: Coordinate multi-provider, multi-variant image ops with live progress.
	•	Inputs: { projectId, sessionId, prompt, startImageUrl?, providers[], variants? }
	•	Tools it uses (via step.do):
	•	db.getTips(provider), db.insertProgression(row), db.updateJudgment(...)
	•	r2.putOriginal(bytes, key), images.uploadDelivery(urlOrBytes)
	•	router.run(provider, ImageOp)
	•	actor.emit(sessionId, WsEnvelope)
	•	queue.send('artifact-view' | 'log', payload)
	•	Behaviors:
	•	Apply provider-specific tips from knowledge_base.
	•	Emit granular WS events.
	•	Store originals to R2; store deliveries via Images URL.
	•	De-duplicate near-identical variants (tiny-thumbnail or pHash).
	•	On error, emit fail and continue other variants where possible.

3.2 Judge Agent
	•	Goal: Validate adherence to prompt; tag outputs for search; guard hallucination drift.
	•	Inputs: { startImageUrl?, prompt, generatedImageUrl }
	•	Outputs: { judgment: 'pass'|'fail', notes: string[], tags: string[] }
	•	Side effects: updates D1 row; emits judge event (with optional retrySuggestion).
	•	Model: vision-capable (via env.AI.run).

3.3 Artifact Agent
	•	Goal: Conversational assembly of shareable artifacts from project images.
	•	State: stored in AGENTIC_MEMORIES (KV) keyed by sessionId.
	•	Tasks:
	•	Guide user to select images, titles, themes.
	•	Save config to artifact_configurations.
	•	Render template HTML to R2, return public_slug.
	•	Tools: db.getProjectsForArtifact, db.getImagesForProject, r2.getTemplate/putHtml, db.saveConfig, actor.emit.

⸻

4) Tools (Agent I/O primitives)

All external effects are wrapped as tools (pure functions) called via step.do(name, fn):

// agents/_tools.ts (examples)
export async function dbInsertProgression(env: Env, row: Partial<ImageProgression>) { /* ... */ }
export async function r2PutOriginal(env: Env, key: string, bytes: ArrayBuffer) { /* ... */ }
export async function imagesUploadDelivery(env: Env, input: Blob | URL): Promise<string> { /* return public URL */ }
export async function actorEmit(env: Env, sessionId: string, envelope: WsEnvelope) { /* POST to DO */ }
export async function queueLog(env: Env, payload: any) { /* send to PICASSO_QUEUE */ }

Why tools? They centralize retries, logging, and type guarantees. Agents remain business-logic only.

⸻

5) Provider adapters & routing

Types (adapters/provider.types.ts):

export type ImageOpKind = 'generate'|'edit'|'inpaint'|'outpaint'|'variation'|'upscale';
export interface ImageOp { kind: ImageOpKind; prompt: string; startImageUrl?: string }
export interface ProviderResult { generatedImageUrl: string; providerMeta?: Record<string, any> }
export interface ProviderAdapter {
  id: 'openai'|'gemini'|'workers';
  supports: ImageOpKind[];
  run(op: ImageOp, env: Env): Promise<ProviderResult>;
}

Router (adapters/router.ts) responsibilities:
	•	Read knowledge_base and refine prompt per provider.
	•	Fan-out by variants.
	•	De-dup via pHash (or fast thumbnail hash) to avoid duplicate inserts.
	•	Emit progress ticks back to Orchestrator via callback.

Adapters: openai.adapter.ts, gemini.adapter.ts, workers.adapter.ts
	•	Minimal working run() using the provider’s API/model present in env.AI or HTTP.
	•	Return delivery URL (after Images upload). Originals go to R2 first when applicable.

⸻

6) Durable Object as an Actor (PICASSO_DO)
	•	Holds Map<string, Set<WebSocket>> of clients per sessionId.
	•	WS route: GET /api/stream/:sessionId → accept, heartbeat, cleanup.
	•	Actor inbox: POST /_actor/:sessionId → broadcast a WsEnvelope to all session clients.
	•	No external component mutates the WS sets directly; all fan-out via this DO endpoint.

⸻

7) Artifacts: registry & generators

Treat artifacts as plug-ins:

export type ArtifactOutput = 'html'|'pdf'|'json'|'video'|'3d'|'csv';
export interface ArtifactGenerator {
  id: string; name: string; output: ArtifactOutput;
  generate: (env: Env, args: { projectIds: string[], options?: Record<string, any> })
    => Promise<{ r2Key: string, publicSlug?: string }>;
}

Baseline implemented: lookbook (HTML injected with Cloudflare Images URLs).
Planned stubs included:
	•	storyboard, moodboard, compare-deck, walkthrough-reel, provider-benchmark, judge-report,
prompt-lineage-map, prompt-recipe-card, knowledge-pack, seed-replay-script,
r2-archive-manifest, review-board, voting-deck, stakeholder-pdf, slideshow.

Public delivery: GET /public/lookbook/:slug streams HTML from R2 with cache headers and enqueues a view log to PICASSO_QUEUE → consumer writes artifact_views.

⸻

8) Storage rules (non-negotiable)
	•	Originals (user uploads, provider raw outputs): store bytes in R2 (BUCKET) with deterministic keys:
project/{projectId}/jobs/{jobId}/orig/{variantIdx} → persist original_image_r2_key.
	•	Delivery images: upload to Cloudflare Images (IMAGES); persist returned public URL in generated_image_url.
	•	Never serve originals directly to the public UI.

⸻

9) Security & limits
	•	Require X-Api-Key header on all non-GET routes (enforce via Hono middleware).
	•	Request size guard (reject oversized bodies).
	•	Validate image MIME types.
	•	Optional per-IP rate limit on /jobs (token bucket in DO).

⸻

10) Observability & idempotency
	•	Structured logs for each step: { jobId, sessionId, provider, step, ms }.
	•	Accept Idempotency-Key on /jobs; if (projectId, key) already processed, return prior result.
	•	Include trace/span labels for each step.do(...) if available.

⸻

11) Data model (D1)

Core tables (required):
	•	projects(id, name, description, created_at, updated_at)
	•	image_progressions(id, project_id, parent_progression_id?, start_image_url?, prompt, generated_image_url, original_image_r2_key, ai_provider, ai_notes, ai_tags, judgment, created_at)
	•	artifacts(id, project_id, title, r2_key, public_slug, created_at)
	•	knowledge_base(key, value)

Extended artifacts (recommended):
	•	project_artifacts(project_id, artifact_id, PRIMARY KEY(project_id, artifact_id))
	•	artifact_configurations(artifact_id, config_key, config_value, PRIMARY KEY(artifact_id, config_key))
	•	artifact_views(id, artifact_id, timestamp, ip_address, country, city, user_agent)
	•	Indexes: projects(updated_at), image_progressions(project_id, created_at), artifacts(public_slug), artifact_views(artifact_id, timestamp)

⸻

12) Request/response validation (zod)
	•	Add shared schemas in lib/schema.ts.
	•	Validate every route body and query; fail fast with clear messages.
	•	Normalize/escape strings before D1 inserts.

⸻

13) Error handling policy
	•	Agent/tool failures: emit fail WS event with error summary and correlation id; continue other variants.
	•	Judge failure: mark progression fail; include retrySuggestion in WS judge event; expose “guided retry” path.
	•	Adapters: catch provider errors; include provider code and HTTP status in logs.

⸻

14) Testing checklist
	•	Unit: router prompt-refinement; pHash de-dupe; D1 queries; R2/Images helpers.
	•	Integration: /jobs fan-out + WS stream; judgment writeback; artifact rendering to R2.
	•	E2E (Playwright or lightweight client test): run mocked adapters → see queued → running → judge → complete.

⸻

15) Sample agent prompts (internal)

Orchestrator system prompt (sketch):

You coordinate multi-provider image operations on Cloudflare. Use tools instead of direct I/O. For each provider×variant: emit progress, store originals to R2, store delivery via Images, write D1, then run Judge. Avoid duplicates via quick pHash. Always respect provider tips from knowledge_base.

Judge system prompt (sketch):

You are a vision evaluator. Compare the prompt and (optional) start image against the generated image. Output: judgment, notes[] (concise, actionable), tags[] (nouns/adjectives/colors/materials). Penalize hallucinations and missing elements.

Artifact system prompt (sketch):

You assemble artifacts from project images. Ask minimal questions, propose defaults, and fill placeholders in the selected template. Persist choices; when complete, render HTML to R2 and return a public_slug.

⸻

16) Coding standards
	•	Public functions/classes must have AI-oriented docstrings describing inputs, outputs, side effects, and failure modes.
	•	Keep agents pure from I/O—use tools exclusively.
	•	Never block long operations without emitting WS progress via the actor.

⸻

Done criteria for a job
	•	Progress events observed in WS.
	•	R2 original key & Images delivery URL persisted.
	•	D1 progression row with ai_provider and created_at.
	•	Judge notes & tags written; judgment pass/fail set.

Done criteria for an artifact
	•	Renders to R2 under a stable key.
	•	public_slug resolves via public GET and logs a view through the queue consumer.

⸻

Owner: Backend platform (Jules)
Contributors: Adapters (provider specialists), Artifact authors, Frontend team
