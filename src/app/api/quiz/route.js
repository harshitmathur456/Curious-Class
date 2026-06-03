export async function POST(request) {
  try {
    const { subject, topic } = await request.json();

    if (!subject || !topic) {
      return Response.json({ error: "Missing subject or topic" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json({ error: "Gemini API key is not configured" }, { status: 500 });
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

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
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
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini Quiz API error:", response.status, errorText);
      return Response.json({ error: "Gemini API error" }, { status: response.status });
    }

    const data = await response.json();
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
