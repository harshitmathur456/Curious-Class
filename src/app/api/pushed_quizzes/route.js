import { createClient } from '@supabase/supabase-js';

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

async function callGeminiWithFallback(body) {
  const primaryKey = process.env.GEMINI_API_KEY;
  const backupKey = process.env.GEMINI_API_KEY_BACKUP;
  const keys = [primaryKey, backupKey].filter(Boolean);

  if (keys.length === 0) {
    throw new Error("No Gemini API keys configured");
  }

  let lastError = null;
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        return await response.json();
      } else {
        const errorText = await response.text();
        lastError = new Error(`Gemini API error: ${response.status} - ${errorText}`);
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error("Unknown error calling Gemini API");
}

// POST: Generate quiz with Gemini and save to Supabase
export async function POST(request) {
  try {
    const { subject, topic, class_name } = await request.json();

    if (!subject || !topic || !class_name) {
      return Response.json({ error: "Missing subject, topic, or class_name" }, { status: 400 });
    }

    const prompt = `Generate a 5-question MCQ quiz on the subject "${subject}" and topic "${topic}".`;

    const systemInstruction = `You are a school teacher creating a 5-question MCQ quiz for ${class_name} students on the subject "${subject}" and topic "${topic}".
Return ONLY a valid JSON array of 5 questions.
Each question object in the array must follow this exact structure:
{
  "question": "The text of the question?",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "answerIndex": 0, // 0-3 indicating the index of the correct option
  "explanation": "Brief explanation of the correct answer."
}`;

    const body = {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ],
      systemInstruction: {
        parts: [{ text: systemInstruction }]
      },
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.5,
      }
    };

    let quizQuestions;
    try {
      const data = await callGeminiWithFallback(body);
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!responseText) {
        throw new Error("Invalid response structure from Gemini");
      }
      quizQuestions = JSON.parse(responseText);
    } catch (apiError) {
      console.warn("Gemini API failed, using fallback quiz generation:", apiError.message);
      // Fallback quiz generation
      quizQuestions = [
        {
          question: `What is the primary definition or concept behind "${topic}" in ${subject}?`,
          options: [
            `It represents the fundamental rule governing ${topic}`,
            `It is a method to calculate values related to ${topic}`,
            `It is a key historical context of ${topic}`,
            `All of the above`
          ],
          answerIndex: 3,
          explanation: `All options correctly describe different aspects of ${topic} in the context of ${subject}.`
        },
        {
          question: `Which of the following is a key application of "${topic}"?`,
          options: [
            `Solving practical problems in standard exercises`,
            `Analyzing advanced theories and concepts`,
            `Evaluating real-world scenarios in ${subject}`,
            `All of the above`
          ],
          answerIndex: 3,
          explanation: `"${topic}" has multiple applications ranging from standard exercises to real-world scenarios.`
        },
        {
          question: `Which of the following is true regarding "${topic}"?`,
          options: [
            `It is only applicable to basic scenarios`,
            `It forms a core part of the CBSE ${class_name} curriculum`,
            `It has no relation to other topics in ${subject}`,
            `It was developed in the 21st century`
          ],
          answerIndex: 1,
          explanation: `"${topic}" is an essential chapter/topic in the CBSE ${class_name} syllabus.`
        },
        {
          question: `What is a common misconception about "${topic}"?`,
          options: [
            `That it is extremely simple and requires no practice`,
            `That it is only useful for examinations`,
            `That it cannot be visualized or modeled`,
            `All of the above`
          ],
          answerIndex: 3,
          explanation: `Practice, visualization, and practical application are all critical to mastering "${topic}".`
        },
        {
          question: `Which of the following best summarizes the main goal of studying "${topic}"?`,
          options: [
            `To build critical thinking and problem-solving skills in ${subject}`,
            `To memorize definitions and dates`,
            `To perform repetitive calculations`,
            `To avoid learning other subjects`
          ],
          answerIndex: 0,
          explanation: `The study of "${topic}" aims to enhance critical thinking and analytic capabilities.`
        }
      ];
    }

    // Save to Supabase
    const supabase = getSupabaseClient();
    const { data: insertedQuiz, error } = await supabase
      .from('pushed_quizzes')
      .insert({
        subject,
        topic,
        class_name,
        quiz_data: quizQuestions
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return Response.json({ error: "Failed to save quiz to DB: " + error.message }, { status: 500 });
    }

    return Response.json({ success: true, quiz: insertedQuiz });
  } catch (error) {
    console.error("Pushed Quiz API route error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject');
    const topic = searchParams.get('topic');
    const className = searchParams.get('class_name');

    if (!subject || !className) {
      return Response.json({ error: 'Missing required query parameters' }, { status: 400 });
    }

    const supabase = getSupabaseClient();
    
    if (topic) {
      // Fetch latest pushed quiz for this topic
      const { data, error } = await supabase
        .from('pushed_quizzes')
        .select('*')
        .eq('subject', subject)
        .eq('topic', topic)
        .eq('class_name', className)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Supabase fetch error:', error);
        return Response.json({ error: error.message }, { status: 500 });
      }

      return Response.json({ quiz: data.length > 0 ? data[0] : null });
    } else {
      // Fetch all pushed quizzes for this subject and class
      const { data, error } = await supabase
        .from('pushed_quizzes')
        .select('topic, created_at')
        .eq('subject', subject)
        .eq('class_name', className)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase fetch error:', error);
        return Response.json({ error: error.message }, { status: 500 });
      }

      return Response.json({ quizzes: data });
    }
  } catch (err) {
    console.error('Quiz fetch error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
