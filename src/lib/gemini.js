/**
 * Resilient Multi-Provider AI Client.
 * 1. Tries Gemini API keys first (with fast timeout for zero-lag performance).
 * 2. If Gemini fails, immediately falls back to ultra-fast Groq API.
 */

export async function callGeminiWithFallback(body) {
  // 1. Try Gemini API keys first
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
    const models = ["gemini-2.5-flash", "gemini-flash-latest", "gemini-2.0-flash"];

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      for (const model of models) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500); // 3.5s fast timeout to prevent lag

        try {
          console.log(`[AI Client] Attempting Gemini model "${model}" with key index ${i}...`);
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
          
          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (response.ok) {
            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text && text.trim()) {
              console.log(`[AI Client] Successfully generated response via Gemini (${model}, key ${i})`);
              return data;
            }
          }

          const errorText = await response.text().catch(() => "");
          console.warn(`[Gemini API] Key index ${i} with model "${model}" failed (Status ${response.status}): ${errorText.slice(0, 150)}`);

          if (response.status === 401) {
            break; // Move to next key immediately if unauthorized
          }
        } catch (err) {
          clearTimeout(timeoutId);
          console.warn(`[Gemini API] Error/Timeout on key index ${i}, model "${model}":`, err.name === 'AbortError' ? 'Timeout (3.5s)' : err.message);
        }
      }
    }
  }

  // 2. Zero-lag Fallback to Groq API if Gemini keys fail or are invalid
  console.log("[AI Client] Gemini attempt failed or offline. Cascading to Groq API fallback instantly...");
  const groqApiKey = (process.env.GROQ_API_KEY || "").trim();
  
  if (groqApiKey) {
    const groqModels = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "mixtral-8x7b-32768"];
    
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
        console.log(`[AI Client] Attempting Groq fallback model "${groqModel}"...`);
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
            console.log(`[AI Client] Successfully generated fallback response via Groq (${groqModel})`);
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
          const errorText = await response.text().catch(() => "");
          console.warn(`[Groq API] Model "${groqModel}" failed (Status ${response.status}): ${errorText.slice(0, 150)}`);
        }
      } catch (err) {
        console.error(`[Groq API] Network error on model "${groqModel}":`, err.message);
      }
    }
  }

  throw new Error("All AI API options (Gemini & Groq fallback) failed to generate content.");
}


