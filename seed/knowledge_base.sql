INSERT INTO knowledge_base (key, value) VALUES
  ('provider:openai:prompting', 'TODO(Jules): Add OpenAI style guidelines, aspect ratio hints, and safety filters.'),
  ('provider:gemini:prompting', 'TODO(Jules): Add Gemini-specific multimodal tips and fallback behaviors.'),
  ('provider:workers:prompting', 'TODO(Jules): Document Cloudflare Workers AI parameters, image sizes, and retry strategies.');

-- Agents must read provider tips before routing requests (see AGENTS.md).
