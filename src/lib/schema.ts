import { z } from 'zod';

const projectId = z.string().min(1, 'projectId required');
const artifactId = z.string().min(1, 'artifactId required');
const progressionId = z.string().min(1, 'progressionId required');
const lookbookSlug = z.string().min(1, 'slug required');

export const projectSchemas = {
  projectId,
  createBody: z
    .object({
      name: z.string().min(1),
      description: z.string().optional(),
    })
    .strict(),
  updateBody: z
    .object({
      name: z.string().min(1).optional(),
      description: z.string().optional(),
    })
    .strict(),
};

export const jobSchemas = {
  projectId,
  createBody: z
    .object({
      prompt: z.string().min(1),
      sessionId: z.string().min(1),
      startImageUrl: z.string().url().optional(),
      providers: z.array(z.enum(['openai', 'gemini', 'workers'])).min(1),
      variants: z.number().int().positive().max(8).optional(),
    })
    .strict(),
};

export const progressionSchemas = {
  projectId,
  progressionId,
};

export const artifactSchemas = {
  artifactId,
  createBody: z
    .object({
      projectIds: z.array(projectId).min(1),
      generatorId: z.enum([
        'lookbook',
        'storyboard',
        'moodboard',
        'compare-deck',
        'walkthrough-reel',
        'provider-benchmark',
        'judge-report',
        'prompt-lineage-map',
        'prompt-recipe-card',
        'knowledge-pack',
        'seed-replay-script',
        'r2-archive-manifest',
        'review-board',
        'voting-deck',
        'stakeholder-pdf',
        'slideshow',
      ]),
      options: z.record(z.any()).optional(),
    })
    .strict(),
  customizeBody: z
    .object({
      sessionId: z.string().min(1),
      edits: z.record(z.any()),
    })
    .strict(),
  associateBody: z
    .object({
      projectIds: z.array(projectId).min(1),
      progressionIds: z.array(progressionId).optional(),
    })
    .strict(),
};

export const publicSchemas = {
  lookbookSlug,
};

// TODO(Jules): add response schemas for each route to ensure consistent API typing.
// TODO(Jules): expand job schema with idempotency key and variant configuration once finalized.
