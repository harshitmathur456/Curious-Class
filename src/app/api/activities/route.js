import { createClient } from '@supabase/supabase-js';

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

// POST: Log student activity (chat or quiz)
export async function POST(request) {
  try {
    const body = await request.json();
    const { student_roll, student_name, class_name, activity_type, topic, details } = body;

    if (!student_roll || !student_name || !class_name || !activity_type || !topic) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('student_activities')
      .insert({
        student_roll,
        student_name,
        class_name,
        activity_type,
        topic,
        details
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true, activity: data });
  } catch (err) {
    console.error('Activity logging error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// GET: Fetch recent activities (optionally filtered by class_name)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const className = searchParams.get('class_name');

    const supabase = getSupabaseClient();
    
    let query = supabase
      .from('student_activities')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (className) {
      query = query.eq('class_name', className);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase fetch error:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ activities: data || [] });
  } catch (err) {
    console.error('Activity fetch error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
