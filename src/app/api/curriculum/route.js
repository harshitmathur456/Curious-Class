import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'curriculum.json');

function readCurriculum() {
  try {
    if (!fs.existsSync(dataFilePath)) {
      return {};
    }
    const fileContents = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error reading curriculum.json:', error);
    return {};
  }
}

function writeCurriculum(data) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing curriculum.json:', error);
    return false;
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const subject = searchParams.get('subject');

  const data = readCurriculum();

  if (subject) {
    return NextResponse.json(data[subject] || {});
  }

  return NextResponse.json(data);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { subject, chapterId, action, payload } = body;

    if (!subject || !chapterId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const data = readCurriculum();
    if (!data[subject]) {
      data[subject] = {};
    }
    if (!data[subject][chapterId]) {
      data[subject][chapterId] = {
        status: 'pending',
        coveredDate: null,
        topics: []
      };
    }

    const chapter = data[subject][chapterId];

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
          topic.status = payload.status; // 'covered' or 'pending'
        }
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    if (writeCurriculum(data)) {
      return NextResponse.json({ success: true, chapter });
    } else {
      return NextResponse.json({ error: 'Failed to write data' }, { status: 500 });
    }
  } catch (error) {
    console.error('POST /api/curriculum error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
