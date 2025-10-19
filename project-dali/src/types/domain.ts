export interface Project {
  id: string;
  name: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ImageProgression {
  id: string;
  projectId: string;
  parentProgressionId?: string | null;
  prompt: string;
  startImageUrl?: string | null;
  generatedImageUrl: string;
  originalImageR2Key?: string | null;
  aiProvider: 'openai' | 'gemini' | 'workers';
  aiNotes?: string[] | null;
  aiTags?: string[] | null;
  judgment?: 'pass' | 'fail' | null;
  createdAt: string;
}

export interface Artifact {
  id: string;
  projectId: string;
  title: string;
  r2Key: string;
  publicSlug?: string | null;
  createdAt: string;
}

export interface KnowledgeBaseEntry {
  key: string;
  value: string;
}

// TODO(Jules): extend ImageProgression with versioning metadata and phash digest when implemented.
