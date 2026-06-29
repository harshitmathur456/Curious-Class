import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const subject = searchParams.get('subject');

  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('curriculum')
      .select('subject_key, data');

    if (error) {
      console.error('Supabase fetch error:', error);
      return NextResponse.json({}, { status: 500 });
    }

    const curriculumData = {};
    if (data) {
      data.forEach(row => {
        curriculumData[row.subject_key] = row.data;
      });
    }

    if (subject) {
      return NextResponse.json(curriculumData[subject] || {});
    }

    return NextResponse.json(curriculumData);
  } catch (err) {
    console.error('API GET error:', err);
    return NextResponse.json({});
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { subject, chapterId, action, payload } = body;

    if (!subject || !chapterId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Fetch current subject data
    const supabase = getSupabaseClient();
    let currentData = {};
    const { data: fetchRes, error: fetchErr } = await supabase
      .from('curriculum')
      .select('data')
      .eq('subject_key', subject)
      .single();

    if (fetchRes && fetchRes.data) {
      currentData = fetchRes.data;
    } else if (fetchErr && fetchErr.code !== 'PGRST116') {
      // PGRST116 means no rows found, which is fine for new subjects
      console.error('Error fetching subject data:', fetchErr);
    }

    // 2. Initialize chapter if it doesn't exist
    if (!currentData[chapterId]) {
      currentData[chapterId] = {
        status: 'pending',
        coveredDate: null,
        topics: []
      };
    }

    const chapter = currentData[chapterId];

    // 3. Process action
    switch (action) {
      case 'UPDATE_CHAPTER_STATUS':
        chapter.status = payload.status;
        if (payload.status === 'covered') {
          chapter.coveredDate = payload.date || new Date().toISOString().split('T')[0];
        } else {
          chapter.coveredDate = null;
        }
        break;
      case 'ADD_TOPIC':
        chapter.topics.push({
          id: Date.now().toString(),
          name: payload.name,
          status: 'pending'
        });
        break;
      case 'REMOVE_TOPIC':
        chapter.topics = chapter.topics.filter(t => t.id !== payload.topicId);
        break;
      case 'UPDATE_TOPIC_STATUS':
        const topic = chapter.topics.find(t => t.id === payload.topicId);
        if (topic) {
          topic.status = payload.status;
        }
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // 4. Save back to Supabase (Upsert)
    const { error: upsertErr } = await supabase
      .from('curriculum')
      .upsert({ 
        subject_key: subject, 
        data: currentData 
      });

    if (upsertErr) {
      console.error('Error updating curriculum:', upsertErr);
      return NextResponse.json({ error: 'Failed to write data to database' }, { status: 500 });
    }

    return NextResponse.json({ success: true, chapter });
  } catch (error) {
    console.error('POST /api/curriculum error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
