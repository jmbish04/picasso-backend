You are Jules, an expert Cloudflare developer. The `picasso-backend` repository skeleton has been created for you. Your task is to implement the complete backend logic. Adhere strictly to the provided `wrangler.toml` and the existing file structure.

**Your Implementation Plan (End-to-End):**

**1. D1 Schema & Seeds**
   - **`migrations/0001_init.sql`**: Implement the full D1 schema as specified. Create all tables (`projects`, `image_progressions`, `artifacts`, `project_artifacts`, `artifact_configurations`, `artifact_views`, `knowledge_base`) and their corresponding indexes. Ensure foreign key constraints are correctly defined.
   - **`seed/knowledge_base.sql`**: Populate this file with 3-5 practical `INSERT` statements for each provider (`openai`, `gemini`, `workers`), providing tips for prompt enhancement.

**2. Security & Core Libraries**
   - **`src/lib/security.ts`**: Complete the `apiKeyAuth()` Hono middleware. It must read a secret from `env` and reject any non-`GET` request to an `/api/*` route that lacks a valid `X-Api-Key` header.
   - **`src/lib/logging.ts`**: Implement the `createLogger` to produce structured JSON logs including `jobId`, `sessionId`, `provider`, and performance timings.

**3. Durable Object Actor (`PicassoDurableObject.ts`)**
   - Implement the WebSocket server logic within the `fetch` handler.
   - On a WebSocket upgrade request, accept the connection and add the client's socket to an in-memory `Set` keyed by the session ID.
   - Implement a `broadcast(message)` method that iterates over the sockets for the current session and sends the message.
   - Add a `/broadcast` internal endpoint (`POST`) that agents can call via `fetch` to send events to this actor, which then get broadcast to all connected clients.
   - Implement connection cleanup logic for `close` or `error` events.

**4. Provider Adapters (`src/adapters/`)**
   - **`openai.adapter.ts`, `gemini.adapter.ts`, `workers.adapter.ts`**: Implement the `run` method for each adapter.
     - Each `run` method should make a functional API call to its respective service using the `AI` binding or `fetch`.
     - After generating an image, upload the result to the `IMAGES` binding to get a delivery URL.
     - Return the `ProviderResult` object containing the `generatedImageUrl` from Cloudflare Images.

**5. Agentic Orchestration (`src/agents/`)**
   - **`orchestrator.agent.ts`**: Implement the `runImageGenerationJob` function. This is the core workflow.
     - Use the `@cloudflare/agents` SDK. For each provider and variant in the job request:
       1.  **Emit Event**: Send a `queued` event to the `PICASSO_DO` actor.
       2.  **Refine Prompt**: In a `step.do`, read tips from the `knowledge_base` table in `DB` and refine the prompt.
       3.  **Execute**: In a `step.do`, call the appropriate provider adapter.
       4.  **Store Original**: In a `step.do`, take the original image (either from `startImageUrl` or the adapter's raw output), and store it in the R2 `BUCKET`.
       5.  **Persist Progression**: In a `step.do`, insert a new row into the `image_progressions` table in `DB`, storing the `original_image_r2_key` and the `generated_image_url` from the `IMAGES` upload.
       6.  **Trigger Judgment**: Call the `runJudgment` agent.
       7.  **Emit Completion**: Send a `complete` or `fail` event to the `PICASSO_DO` actor.
   - **`judge.agent.ts`**: Implement the `runJudgment` function.
     - Use the `AI` binding with the `DEFAULT_MODEL_VISION`.
     - Provide the model with the prompt and the `generatedImageUrl`.
     - Parse the model's response to extract a `judgment` ('pass'|'fail'), `notes`, and `tags`.
     - In a `step.do`, update the corresponding `image_progressions` row in `DB`.
     - Send a `judge` event to the `PICASSO_DO` actor.

**6. Artifact System**
   - **`artifact.agent.ts`**: Implement the `runArtifactCustomization` agent.
     - Use `AGENTIC_MEMORIES` (KV) to store and retrieve conversational history by `sessionId`.
     - Define tools for the agent: `get_projects_for_artifact`, `get_images_for_project`, `save_configuration`, and `render_artifact`. These tools will interact with the `DB` and `BUCKET` bindings.
   - **`artifacts/generators/lookbook.ts`**: Implement the `lookbookGenerator`.
     - It should fetch all `image_progressions` for the given `projectIds`.
     - Fetch the `template.html` from R2.
     - Replace placeholders in the template with the `generated_image_url` values.
     - Write the final HTML file to R2 `BUCKET` and return the `r2Key` and a new `publicSlug`.

**7. Hono Routes (`src/index.ts`)**
   - Implement all specified API routes using Hono. Apply the `apiKeyAuth` middleware to all non-`GET` routes under `/api`.
   - **`POST /api/projects/:id/jobs`**: Use `zod` to validate the body, then trigger the `runImageGenerationJob` orchestrator agent.
   - **`POST /api/artifacts/:id/customize`**: Validate the body and pass the input to the `runArtifactCustomization` agent.
   - **`GET /public/artifact/:slug`**:
     1.  Fetch the artifact's `content_r2_key` from `DB`.
     2.  Retrieve the HTML object from the R2 `BUCKET`.
     3.  Send a message to the `PICASSO_QUEUE` with request metadata for view logging.
     4.  Return the R2 object's body as the response.

**8. Queue Consumer**
   - In `src/index.ts`, implement the `queue()` export handler for the `PICASSO_QUEUE` consumer.
   - On message receipt, parse the view data and insert a new record into the `artifact_views` table in `DB`.

**9. Documentation (`README.md`)**
   - Add a section with `cURL` examples for every API endpoint.
   - Include an example of connecting to the WebSocket stream using a tool like `wscat`.
   - Document the artifact generator "plugin" model.

**Non-Negotiables:**
- Do not modify `wrangler.toml`. Use the bindings exactly as defined in `src/types/env.ts`.
- All public image URLs must come from the `IMAGES` binding. All originals/templates must be stored in the `BUCKET` binding.
- Ensure every step of a long-running job streams its status via the `PICASSO_DO` actor.

Implement the full system now.
