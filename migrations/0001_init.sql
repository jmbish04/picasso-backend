-- Core tables
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS image_progressions (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  parent_progression_id TEXT REFERENCES image_progressions(id),
  start_image_url TEXT,
  prompt TEXT NOT NULL,
  generated_image_url TEXT NOT NULL,
  original_image_r2_key TEXT,
  ai_provider TEXT NOT NULL,
  ai_notes TEXT,
  ai_tags TEXT,
  judgment TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS artifacts (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  title TEXT NOT NULL,
  r2_key TEXT NOT NULL,
  public_slug TEXT UNIQUE,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS knowledge_base (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Recommended extended tables (enable when implementing associations)
-- CREATE TABLE IF NOT EXISTS project_artifacts (
--   project_id TEXT NOT NULL REFERENCES projects(id),
--   artifact_id TEXT NOT NULL REFERENCES artifacts(id),
--   PRIMARY KEY (project_id, artifact_id)
-- );
--
-- CREATE TABLE IF NOT EXISTS artifact_configurations (
--   artifact_id TEXT NOT NULL REFERENCES artifacts(id),
--   config_key TEXT NOT NULL,
--   config_value TEXT,
--   PRIMARY KEY (artifact_id, config_key)
-- );
--
-- CREATE TABLE IF NOT EXISTS artifact_views (
--   id TEXT PRIMARY KEY,
--   artifact_id TEXT NOT NULL REFERENCES artifacts(id),
--   timestamp TEXT NOT NULL,
--   ip_address TEXT,
--   country TEXT,
--   city TEXT,
--   user_agent TEXT
-- );

CREATE INDEX IF NOT EXISTS idx_projects_updated_at ON projects(updated_at);
CREATE INDEX IF NOT EXISTS idx_image_progressions_project ON image_progressions(project_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_artifacts_public_slug ON artifacts(public_slug);

-- TODO(Jules): add triggers for updated_at refresh and JSON columns for notes/tags once D1 supports.
