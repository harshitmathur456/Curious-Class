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
  const tables = ['students', 'student_activities', 'pushed_quizzes'];
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
