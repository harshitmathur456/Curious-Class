import { callGeminiWithFallback } from "@/lib/gemini";

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
      console.error("Invalid response format from AI API for quiz:", JSON.stringify(data));
      return Response.json({ error: "Invalid response from AI API" }, { status: 500 });
    }

    let cleanedText = responseText.trim();
    if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/^```(json)?\n?/, "").replace(/\n?```$/, "").trim();
    }

    const parsed = JSON.parse(cleanedText);
    const quizQuestions = Array.isArray(parsed) ? parsed : (parsed.questions || parsed.quiz || Object.values(parsed)[0]);
    return Response.json(quizQuestions);
  } catch (error) {
    console.error("Quiz API route error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
