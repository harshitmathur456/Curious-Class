import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return Response.json({ error: 'Missing Supabase credentials' }, { status: 500 });
  }

  const supabase = createClient(url, key);
  const results = {};

  // Test if tables already exist by trying to select from them
  const tables = ['students', 'student_activities', 'pushed_quizzes', 'note_chunks'];
  for (const table of tables) {
    const { error } = await supabase.from(table).select('*').limit(0);
    if (error && error.code === 'PGRST205') {
      results[table] = 'MISSING - needs to be created in Supabase dashboard';
    } else if (error) {
      results[table] = `ERROR: ${error.message}`;
    } else {
      results[table] = 'EXISTS ✓';
    }
  }

  // Also check curriculum table
  const { error: currErr } = await supabase.from('curriculum').select('*').limit(0);
  results['curriculum'] = currErr ? `ERROR: ${currErr.message}` : 'EXISTS ✓';

  const missingTables = Object.entries(results)
    .filter(([_, v]) => v.includes('MISSING'))
    .map(([k]) => k);

  const sql = `
-- Run this SQL in your Supabase SQL Editor (https://supabase.com/dashboard → SQL Editor)

-- 1. Students table
CREATE TABLE IF NOT EXISTS students (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  roll_number TEXT NOT NULL,
  class_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(roll_number, class_name)
);

ALTER TABLE students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for anon" ON students FOR ALL TO anon USING (true) WITH CHECK (true);

-- 2. Student Activities table
CREATE TABLE IF NOT EXISTS student_activities (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  student_roll TEXT NOT NULL,
  student_name TEXT NOT NULL,
  class_name TEXT NOT NULL,
  activity_type TEXT NOT NULL,
  topic TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE student_activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for anon" ON student_activities FOR ALL TO anon USING (true) WITH CHECK (true);

-- 3. Pushed Quizzes table
CREATE TABLE IF NOT EXISTS pushed_quizzes (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  subject TEXT NOT NULL,
  topic TEXT NOT NULL,
  class_name TEXT NOT NULL,
  quiz_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE pushed_quizzes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for anon" ON pushed_quizzes FOR ALL TO anon USING (true) WITH CHECK (true);

-- 4. Note Chunks table (RAG / pgvector)
-- Embedding model: text-embedding-004 (768 dimensions)
-- Chunk size: 300-500 tokens with 50 token overlap
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS note_chunks (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  note_id     INTEGER NOT NULL,
  subject_key TEXT NOT NULL,
  chapter     TEXT DEFAULT '',
  file_name   TEXT DEFAULT '',
  chunk_index INTEGER NOT NULL DEFAULT 0,
  chunk_text  TEXT NOT NULL,
  embedding   vector(768) NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS note_chunks_embedding_idx
  ON note_chunks USING hnsw (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS note_chunks_subject_key_idx
  ON note_chunks (subject_key);

ALTER TABLE note_chunks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anon read note_chunks" ON note_chunks FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon insert note_chunks" ON note_chunks FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon delete note_chunks" ON note_chunks FOR DELETE TO anon USING (true);

-- Similarity search function for RAG retrieval
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
    nc.id, nc.note_id, nc.subject_key, nc.chapter, nc.file_name,
    nc.chunk_index, nc.chunk_text,
    1 - (nc.embedding <=> query_embedding) AS similarity
  FROM note_chunks nc
  WHERE
    (filter_subject_key IS NULL OR nc.subject_key = filter_subject_key)
    AND 1 - (nc.embedding <=> query_embedding) > match_threshold
  ORDER BY nc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
`;

  return Response.json({
    tableStatus: results,
    missingTables,
    message: missingTables.length > 0
      ? `${missingTables.length} table(s) missing. Run the SQL below in your Supabase dashboard SQL editor.`
      : 'All tables exist! No action needed.',
    sql: missingTables.length > 0 ? sql : null,
  });
}
