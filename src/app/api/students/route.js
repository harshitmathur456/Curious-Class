import { createClient } from '@supabase/supabase-js';

// Helper to create Supabase client
function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

// POST: Register a new student
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, roll_number, class_name } = body;

    if (!name || !roll_number || !class_name) {
      return Response.json(
        { error: 'Missing required fields: name, roll_number, class_name' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('students')
      .insert({
        name,
        roll_number,
        class_name
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return Response.json(
        { error: error.message, code: error.code },
        { status: 500 }
      );
    }

    return Response.json({ success: true, student: data });
  } catch (err) {
    console.error('Student registration error:', err);
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}

// GET: Fetch all students
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const className = searchParams.get('class_name');

    const supabase = getSupabaseClient();
    
    let query = supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false });

    if (className) {
      query = query.eq('class_name', className);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase fetch error:', error);
      return Response.json(
        { error: error.message, code: error.code },
        { status: 500 }
      );
    }

    return Response.json({ students: data || [] });
  } catch (err) {
    console.error('Student fetch error:', err);
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
