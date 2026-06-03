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
    const isBackup = i > 0;
    try {
      console.log(`[Quiz API] Calling Gemini (Key index: ${i}, Backup: ${isBackup})`);
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`;
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
        console.error(`[Quiz API] Gemini error status (Key index: ${i}):`, response.status, errorText);
        lastError = new Error(`Gemini API error: ${response.status} - ${errorText}`);
      }
    } catch (err) {
      console.error(`[Quiz API] Gemini network/fetch error (Key index: ${i}):`, err);
      lastError = err;
    }
  }

  throw lastError || new Error("Unknown error calling Gemini API");
}

export async function POST(request) {
  try {
    const { subject, topic } = await request.json();

    if (!subject || !topic) {
      return Response.json({ error: "Missing subject or topic" }, { status: 400 });
    }

    const prompt = `Generate a 5-question MCQ quiz on the subject "${subject}" and topic "${topic}".`;

    const systemInstruction = `You are a school teacher creating a 5-question MCQ quiz for 8th-grade students on the subject "${subject}" and topic "${topic}".
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

    let data;
    try {
      data = await callGeminiWithFallback(body);
    } catch (apiError) {
      console.error("All Gemini API attempts failed for Quiz API:", apiError);
      return Response.json({ error: "Gemini API error: " + apiError.message }, { status: 502 });
    }

    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      console.error("Invalid response format from Gemini for quiz:", JSON.stringify(data));
      return Response.json({ error: "Invalid response from Gemini" }, { status: 500 });
    }

    const quizQuestions = JSON.parse(responseText);
    return Response.json(quizQuestions);
  } catch (error) {
    console.error("Quiz API route error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
