-- ============================================================
-- CuriousClass RAG Pipeline — Supabase pgvector Schema
-- Run this in your Supabase SQL Editor:
--   https://supabase.com/dashboard → SQL Editor
-- ============================================================

-- 1. Enable the pgvector extension (required once per database)
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Create the note_chunks table
--    Stores chunked text from uploaded PDFs with embeddings for semantic search.
--    Embedding dimension: 768 (Google text-embedding-004)
--    Chunk size: ~300-500 tokens with ~50 token overlap
CREATE TABLE IF NOT EXISTS note_chunks (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  note_id     INTEGER NOT NULL,                  -- logical ref to note id in notes.json
  subject_key TEXT NOT NULL,                      -- compound key e.g. "history_class7", "science_class10"
  chapter     TEXT DEFAULT '',                    -- chapter title if available
  file_name   TEXT DEFAULT '',                    -- original PDF filename for traceability
  chunk_index INTEGER NOT NULL DEFAULT 0,         -- ordering within the document
  chunk_text  TEXT NOT NULL,                      -- the actual chunk content (~300-500 tokens)
  embedding   vector(768) NOT NULL,               -- text-embedding-004 outputs 768 dimensions
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create an index for fast cosine similarity search
--    HNSW index is recommended for pgvector (faster queries, slightly slower inserts)
CREATE INDEX IF NOT EXISTS note_chunks_embedding_idx
  ON note_chunks
  USING hnsw (embedding vector_cosine_ops);

-- 4. Create a composite index for filtered queries (subject_key lookups)
CREATE INDEX IF NOT EXISTS note_chunks_subject_key_idx
  ON note_chunks (subject_key);

-- 5. Enable Row Level Security and allow anon access
--    (Required since SUPABASE_SERVICE_ROLE_KEY may not be set)
ALTER TABLE note_chunks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon read note_chunks"
  ON note_chunks FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anon insert note_chunks"
  ON note_chunks FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anon delete note_chunks"
  ON note_chunks FOR DELETE TO anon USING (true);

-- 6. Create the similarity search function
--    Called via supabase.rpc('match_note_chunks', { ... })
CREATE OR REPLACE FUNCTION match_note_chunks(
  query_embedding vector(768),
  match_threshold FLOAT DEFAULT 0.35,
  match_count INT DEFAULT 5,
  filter_subject_key TEXT DEFAULT NULL
)
RETURNS TABLE (
  id          BIGINT,
  note_id     INTEGER,
  subject_key TEXT,
  chapter     TEXT,
  file_name   TEXT,
  chunk_index INTEGER,
  chunk_text  TEXT,
  similarity  FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    nc.id,
    nc.note_id,
    nc.subject_key,
    nc.chapter,
    nc.file_name,
    nc.chunk_index,
    nc.chunk_text,
    1 - (nc.embedding <=> query_embedding) AS similarity
  FROM note_chunks nc
  WHERE
    (filter_subject_key IS NULL OR nc.subject_key = filter_subject_key)
    AND 1 - (nc.embedding <=> query_embedding) > match_threshold
  ORDER BY nc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
