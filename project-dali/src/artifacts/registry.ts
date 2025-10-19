import type { Env } from '@/lib/env';

export type ArtifactOutput = 'html' | 'pdf' | 'json' | 'video' | '3d' | 'csv';

export interface ArtifactGeneratorArgs {
  projectIds: string[];
  options?: Record<string, unknown>;
  sessionId: string;
}

export interface ArtifactGenerateResult {
  r2Key: string;
  publicSlug?: string;
  meta?: Record<string, unknown>;
}

export interface ArtifactGenerator {
  id: ArtifactId;
  name: string;
  output: ArtifactOutput;
  generate: (env: Env, args: ArtifactGeneratorArgs) => Promise<ArtifactGenerateResult>;
}

export type ArtifactId =
  | 'lookbook'
  | 'storyboard'
  | 'moodboard'
  | 'compare-deck'
  | 'walkthrough-reel'
  | 'provider-benchmark'
  | 'judge-report'
  | 'prompt-lineage-map'
  | 'prompt-recipe-card'
  | 'knowledge-pack'
  | 'seed-replay-script'
  | 'r2-archive-manifest'
  | 'review-board'
  | 'voting-deck'
  | 'stakeholder-pdf'
  | 'slideshow';

export const artifactRegistry: Record<ArtifactId, ArtifactGenerator> = {
  'lookbook': {
    id: 'lookbook',
    name: 'Lookbook',
    output: 'html',
    async generate(env, args) {
      // TODO(Jules): render lookbook template with selected images and upload HTML to R2.
      env;
      args;
      throw new Error('lookbook generator not implemented');
    },
  },
  'storyboard': {
    id: 'storyboard',
    name: 'Storyboard',
    output: 'html',
    async generate(env, args) {
      // TODO(Jules): assemble storyboard frames with captions and persist HTML to R2.
      env;
      args;
      throw new Error('storyboard generator not implemented');
    },
  },
  'moodboard': {
    id: 'moodboard',
    name: 'Moodboard',
    output: 'html',
    async generate(env, args) {
      // TODO(Jules): layout moodboard collage and ensure delivery images via Cloudflare Images.
      env;
      args;
      throw new Error('moodboard generator not implemented');
    },
  },
  'compare-deck': {
    id: 'compare-deck',
    name: 'Compare Deck',
    output: 'html',
    async generate(env, args) {
      // TODO(Jules): create comparison deck with provider metadata overlays and upload to R2.
      env;
      args;
      throw new Error('compare-deck generator not implemented');
    },
  },
  'walkthrough-reel': {
    id: 'walkthrough-reel',
    name: 'Walkthrough Reel',
    output: 'video',
    async generate(env, args) {
      // TODO(Jules): orchestrate video assembly via external service and store manifest in R2.
      env;
      args;
      throw new Error('walkthrough-reel generator not implemented');
    },
  },
  'provider-benchmark': {
    id: 'provider-benchmark',
    name: 'Provider Benchmark',
    output: 'json',
    async generate(env, args) {
      // TODO(Jules): aggregate provider stats and render JSON + optional HTML summary to R2.
      env;
      args;
      throw new Error('provider-benchmark generator not implemented');
    },
  },
  'judge-report': {
    id: 'judge-report',
    name: 'Judge Report',
    output: 'html',
    async generate(env, args) {
      // TODO(Jules): compile judge feedback into structured HTML and persist to R2.
      env;
      args;
      throw new Error('judge-report generator not implemented');
    },
  },
  'prompt-lineage-map': {
    id: 'prompt-lineage-map',
    name: 'Prompt Lineage Map',
    output: '3d',
    async generate(env, args) {
      // TODO(Jules): produce graph JSON + HTML viewer for prompt evolution and store to R2.
      env;
      args;
      throw new Error('prompt-lineage-map generator not implemented');
    },
  },
  'prompt-recipe-card': {
    id: 'prompt-recipe-card',
    name: 'Prompt Recipe Card',
    output: 'pdf',
    async generate(env, args) {
      // TODO(Jules): generate printable recipe card (HTML → PDF) and upload to R2.
      env;
      args;
      throw new Error('prompt-recipe-card generator not implemented');
    },
  },
  'knowledge-pack': {
    id: 'knowledge-pack',
    name: 'Knowledge Pack',
    output: 'json',
    async generate(env, args) {
      // TODO(Jules): export curated knowledge base subset and host via R2 JSON.
      env;
      args;
      throw new Error('knowledge-pack generator not implemented');
    },
  },
  'seed-replay-script': {
    id: 'seed-replay-script',
    name: 'Seed Replay Script',
    output: 'json',
    async generate(env, args) {
      // TODO(Jules): craft replay script for regenerating assets and store as JSON in R2.
      env;
      args;
      throw new Error('seed-replay-script generator not implemented');
    },
  },
  'r2-archive-manifest': {
    id: 'r2-archive-manifest',
    name: 'R2 Archive Manifest',
    output: 'csv',
    async generate(env, args) {
      // TODO(Jules): list project originals stored in R2 and write manifest CSV.
      env;
      args;
      throw new Error('r2-archive-manifest generator not implemented');
    },
  },
  'review-board': {
    id: 'review-board',
    name: 'Review Board',
    output: 'html',
    async generate(env, args) {
      // TODO(Jules): render review board with pinned comments and push HTML to R2.
      env;
      args;
      throw new Error('review-board generator not implemented');
    },
  },
  'voting-deck': {
    id: 'voting-deck',
    name: 'Voting Deck',
    output: 'html',
    async generate(env, args) {
      // TODO(Jules): create polling UI template and ensure event hooks for WS updates.
      env;
      args;
      throw new Error('voting-deck generator not implemented');
    },
  },
  'stakeholder-pdf': {
    id: 'stakeholder-pdf',
    name: 'Stakeholder PDF',
    output: 'pdf',
    async generate(env, args) {
      // TODO(Jules): convert HTML template into PDF via external service and store R2 key.
      env;
      args;
      throw new Error('stakeholder-pdf generator not implemented');
    },
  },
  'slideshow': {
    id: 'slideshow',
    name: 'Slideshow',
    output: 'html',
    async generate(env, args) {
      // TODO(Jules): build slideshow HTML with autoplay options and upload to R2.
      env;
      args;
      throw new Error('slideshow generator not implemented');
    },
  },
};

// TODO(Jules): consider loading generator implementations dynamically when they grow large.
