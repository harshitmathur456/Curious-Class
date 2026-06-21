import { createClient } from '@supabase/supabase-js';

// POST: Log a captcha verification entry
export async function POST(request) {
  try {
    const body = await request.json();
    const { role, captcha_answer, is_correct } = body;

    if (!role || !captcha_answer) {
      return Response.json(
        { error: 'Missing required fields: role, captcha_answer' },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const { data, error } = await supabase
      .from('captcha_entries')
      .insert({
        role,
        captcha_answer: String(captcha_answer),
        is_correct: !!is_correct,
        ip_address: request.headers.get('x-forwarded-for') || 'unknown',
        user_agent: request.headers.get('user-agent') || 'unknown',
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

    return Response.json({ success: true, entry: data });
  } catch (err) {
    console.error('Captcha log error:', err);
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}

// GET: Retrieve captcha entries (for teacher dashboard / admin)
export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const { data, error } = await supabase
      .from('captcha_entries')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(data);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
