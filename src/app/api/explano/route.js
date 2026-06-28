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
      console.log(`[Explano API] Calling Gemini (Key index: ${i}, Backup: ${isBackup})`);
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;
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
        console.error(`[Explano API] Gemini error status (Key index: ${i}):`, response.status, errorText);
        lastError = new Error(`Gemini API error: ${response.status} - ${errorText}`);
      }
    } catch (err) {
      console.error(`[Explano API] Gemini network/fetch error (Key index: ${i}):`, err);
      lastError = err;
    }
  }

  throw lastError || new Error("Unknown error calling Gemini API");
}

export async function POST(request) {
  try {
    const { messages, activeTopic } = await request.json();

    if (!messages || !activeTopic) {
      return Response.json({ error: "Missing messages or activeTopic" }, { status: 400 });
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
1. If the student asks a direct question (e.g. "who discover algebra firsrt" or "what is reflection"), you MUST answer their question clearly and accurately first. Do NOT ignore or deflect their questions.
2. After answering the question, do not stop there—still challenge their thinking, play "Devil's Advocate", or ask a thought-provoking follow-up question related to the topic to push them to build their own explanation.
3. Keep your response brief, friendly, and appropriate for an 8th-grade student (around 2-4 sentences total).
4. Use formatting like **bold** for key concepts.
5. If the student asks about or goes to a completely unrelated topic, guide them back to "${activeTopic}".`;

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
        temperature: 0.7,
        maxOutputTokens: 2048,
      }
    };

    let data;
    try {
      data = await callGeminiWithFallback(body);
    } catch (apiError) {
      console.error("All Gemini API attempts failed for Explano API:", apiError);
      return Response.json({ error: "Gemini API error: " + apiError.message }, { status: 502 });
    }

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
