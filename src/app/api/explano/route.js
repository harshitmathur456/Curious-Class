import { callGeminiWithFallback } from "@/lib/gemini";
import { searchRelevantChunks, formatGroundingContext } from "@/lib/rag";

export async function POST(request) {
  try {
    const { messages, activeTopic, subject, className } = await request.json();

    if (!messages || !activeTopic) {
      return Response.json({ error: "Missing messages or activeTopic" }, { status: 400 });
    }

    // ── RAG Retrieval: search uploaded notes for relevant context ──
    let groundingContext = "";
    let ragUsed = false;

    try {
      // Extract the student's latest question
      const studentMessages = messages.filter((m) => m.sender === "student");
      const latestQuestion = studentMessages.length > 0
        ? studentMessages[studentMessages.length - 1].text
        : activeTopic;

      // Build the search query: combine topic + student question for better retrieval
      const searchQuery = `${activeTopic}: ${latestQuestion}`;

      // Determine subject key for filtering (e.g., "history_class7")
      const subjectKey = subject || null;

      const { chunks, hasResults } = await searchRelevantChunks({
        query: searchQuery,
        subjectKey,
        topK: 5,
        threshold: 0.35,
      });

      if (hasResults) {
        groundingContext = formatGroundingContext(chunks);
        ragUsed = true;
        console.log(`[Explano] RAG grounding active: ${chunks.length} chunks retrieved for "${latestQuestion.slice(0, 60)}..."`);
      } else {
        console.log(`[Explano] No RAG chunks found, falling back to generic knowledge`);
      }
    } catch (ragError) {
      // RAG failure is non-fatal: fall back to generic Gemini knowledge
      console.warn("[Explano] RAG search failed (non-blocking):", ragError.message);
    }

    // Structure the prompt with conversation history
    let conversationHistory = "";
    messages.forEach((msg) => {
      const speaker = msg.sender === "student" ? "Student" : "Explano";
      conversationHistory += `${speaker}: ${msg.text}\n\n`;
    });

    const prompt = `Here is the current conversation history:\n\n${conversationHistory}Respond as Explano. Remember to challenge the student's last response (play Devil's Advocate) and ask a follow-up question. Keep it concise (2-4 sentences).`;

    // Build system instruction with optional grounding context injected BEFORE the teaching rules
    const systemInstruction = `You are Explano, an empathetic, highly intelligent AI teaching assistant for school students.
Your primary goal is to guide students to think deeper on the topic: "${activeTopic}".
${groundingContext ? `\n${groundingContext}\n` : ""}
Rules:
1. INTENT & TYPO DECODING: School students frequently write with typos, misspelled words, phonetic spellings, grammatical mistakes, or cut-off words (e.g. "did napolean din in the battle of loo" -> "Did Napoleon die in the Battle of Waterloo?", "who discover algeba" -> "Who discovered algebra?", "what is photosynthes" -> "What is photosynthesis?"). You MUST decode their intent, correct typos mentally, recognize historical/scientific terms even if misspelled or cut off, and answer their REAL intended question accurately.
2. FACTUAL ACCURACY FIRST: Always start your response with a clear, direct, and factually accurate answer to what the student actually meant.${ragUsed ? " You DO HAVE access to the student's textbook/notes provided in the GROUNDING CONTEXT above. NEVER say 'I don't have your textbook in front of me' or 'I don't have your book'. Use the grounded content directly to answer." : ""} (E.g., if they ask "did napolean din in the battle of loo", clarify that Napoleon lost the Battle of Waterloo in 1815, but died in 1821 in exile on St. Helena).
3. SOCRATIC & ENGAGING: After providing the accurate answer, seamlessly challenge their thinking, play "Devil's Advocate", or ask a thought-provoking follow-up question related to "${activeTopic}".
4. TONE & FORMATTING: Keep your response warm, friendly, encouraging, and age-appropriate for an 8th-grade student (around 2-4 sentences total). Use **bold** for key terms.
5. TOPIC GUIDANCE: If the student asks an off-topic question, answer briefly and gently connect it back to "${activeTopic}".`;

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

    return Response.json({
      text: responseText.trim(),
      ragUsed,
    });
  } catch (error) {
    console.error("Explano API route error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
