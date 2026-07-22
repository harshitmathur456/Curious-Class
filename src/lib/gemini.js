/**
 * Resilient Multi-Provider AI Client (Groq + Gemini multi-key dynamic fallback).
 * Guarantees zero downtime by prioritizing ultra-fast Groq API and cascading to Gemini keys.
 */

export async function callGeminiWithFallback(body) {
  // 1. Try Groq API first
  const groqApiKey = (process.env.GROQ_API_KEY || "").trim();
  
  if (groqApiKey) {
    const groqModels = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "mixtral-8x7b-32768"];
    
    // Extract system prompt and contents to format OpenAI-style messages
    const systemText = body.systemInstruction?.parts?.map((p) => p.text).join('\n') || '';
    const messages = [];

    if (systemText) {
      messages.push({ role: "system", content: systemText });
    }

    if (body.contents && Array.isArray(body.contents)) {
      for (const item of body.contents) {
        const role = item.role === "model" ? "assistant" : (item.role || "user");
        const text = item.parts?.map((p) => p.text).join('\n') || '';
        messages.push({ role, content: text });
      }
    }

    const isJsonMode = body.generationConfig?.responseMimeType === "application/json";

    for (const groqModel of groqModels) {
      try {
        console.log(`[AI Client] Attempting Groq model "${groqModel}"...`);
        const groqPayload = {
          model: groqModel,
          messages: messages,
          temperature: body.generationConfig?.temperature ?? 0.7,
        };

        if (isJsonMode) {
          groqPayload.response_format = { type: "json_object" };
        }

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${groqApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(groqPayload),
        });

        if (response.ok) {
          const data = await response.json();
          const responseText = data.choices?.[0]?.message?.content;
          
          if (responseText && responseText.trim()) {
            console.log(`[AI Client] Successfully generated response via Groq (${groqModel})`);
            return {
              candidates: [
                {
                  content: {
                    parts: [{ text: responseText.trim() }]
                  }
                }
              ]
            };
          }
        } else {
          const errorText = await response.text();
          console.warn(`[Groq API] Model "${groqModel}" failed (Status ${response.status}): ${errorText.slice(0, 150)}`);
        }
      } catch (err) {
        console.error(`[Groq API] Network error on model "${groqModel}":`, err.message);
      }
    }
  }

  // 2. Fallback to Gemini API keys if Groq fails or is unavailable
  console.log("[AI Client] Cascading to Gemini API fallback...");
  const rawKeys = [];
  
  for (const envKey in process.env) {
    if (envKey.startsWith('GEMINI_API_KEY') || envKey.startsWith('GEMINI_KEY')) {
      if (process.env[envKey]) {
        rawKeys.push(process.env[envKey].trim());
      }
    }
  }

  rawKeys.push(
    process.env.GEMINI_API_KEY,
    process.env.GEMINI_API_KEY_1,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
    process.env.GEMINI_API_KEY_4,
    process.env.GEMINI_API_KEY_5,
    process.env.GEMINI_API_KEY_BACKUP
  );

  const keys = [...new Set(rawKeys)].filter(
    (key) => key && key.length > 5 && !key.includes('your_gemini_api_key_here')
  );

  if (keys.length > 0) {
    const models = ["gemini-2.5-flash", "gemini-flash-latest", "gemini-3.6-flash", "gemini-2.0-flash"];
    let lastError = null;

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      for (const model of models) {
        try {
          console.log(`[Gemini API] Attempting model "${model}" with key index ${i}...`);
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
          
          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          });

          if (response.ok) {
            const data = await response.json();
            return data;
          }

          const errorText = await response.text();
          console.warn(`[Gemini API] Key index ${i} with model "${model}" failed (Status ${response.status}): ${errorText.slice(0, 150)}`);
          lastError = new Error(`Gemini API Error (Key ${i}, Model ${model}, Status ${response.status}): ${errorText.slice(0, 150)}`);

          if (response.status === 401) {
            break;
          }
        } catch (err) {
          console.error(`[Gemini API] Network error (Key index ${i}, Model "${model}"):`, err);
          lastError = err;
        }
      }
    }
  }

  throw new Error("All AI API options (Groq & Gemini) failed to generate content.");
}

