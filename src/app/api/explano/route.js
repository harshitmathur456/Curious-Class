export async function POST(request) {
  try {
    const { messages, activeTopic } = await request.json();

    if (!messages || !activeTopic) {
      return Response.json({ error: "Missing messages or activeTopic" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json({ error: "Gemini API key is not configured" }, { status: 500 });
    }

    // Structure the prompt with conversation history
    let conversationHistory = "";
    messages.forEach((msg) => {
      const speaker = msg.sender === "student" ? "Student" : "Explano";
      conversationHistory += `${speaker}: ${msg.text}\n\n`;
    });

    const prompt = `Here is the current conversation history:\n\n${conversationHistory}Respond as Explano. Remember to challenge the student's last response (play Devil's Advocate) and ask a follow-up question. Keep it concise (2-4 sentences).`;

    const systemInstruction = `You are Explano, an interactive AI teaching assistant for school students.
Your goal is to help students think deeper about the topic: "${activeTopic}".
Rules:
1. Don't just give answers. Challenge the student's reasoning, point out counterarguments, or ask thought-provoking questions.
2. Be encouraging but play "Devil's Advocate" to push them to build their explanation.
3. Keep your response brief, friendly, and appropriate for an 8th-grade student (around 2-4 sentences).
4. Use formatting like **bold** for key concepts.
5. If the student asks about a different topic, guide them back to "${activeTopic}" or challenge them on it.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

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
          temperature: 0.7,
          maxOutputTokens: 300,
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error status:", response.status, errorText);
      return Response.json({ error: "Gemini API error" }, { status: response.status });
    }

    const data = await response.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      console.error("Invalid Gemini response format:", JSON.stringify(data));
      return Response.json({ error: "Invalid response from Gemini" }, { status: 500 });
    }

    return Response.json({ text: responseText.trim() });
  } catch (error) {
    console.error("Explano API route error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
