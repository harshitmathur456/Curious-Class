/**
 * Resilient Multi-Provider AI Client.
 * 1. Tries Gemini API keys FIRST across all models and backup keys.
 * 2. ONLY if all Gemini attempts fail, cascades to Groq API (llama-3.3-70b-versatile) as the LAST fallback.
 */

export async function callGeminiWithFallback(body) {
  // STEP 1: Gemini API Primary Execution (Highest Priority)
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
    process.env.GEMINI_API_KEY_FRESH,
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
    const models = ["gemini-flash-latest", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-2.5-flash"];

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      for (const model of models) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout to give Gemini full chance to respond

        try {
          console.log(`[AI Client] Priority 1: Attempting Gemini model "${model}" with key index ${i}...`);
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
              console.log(`[AI Client] Successfully generated response via Gemini (${model}, key index ${i})`);
              return data;
            }
          }

          const errorText = await response.text().catch(() => "");
          console.warn(`[Gemini API] Key index ${i} with model "${model}" failed (Status ${response.status}): ${errorText.slice(0, 150)}`);

          if (response.status === 401) {
            break; // Stop trying invalid key and move to next key immediately
          }
        } catch (err) {
          clearTimeout(timeoutId);
          console.warn(`[Gemini API] Error/Timeout on key index ${i}, model "${model}":`, err.name === 'AbortError' ? 'Timeout (5s)' : err.message);
        }
      }
    }
  }

  // STEP 2: Groq API Fallback (LAST Priority - Only used if ALL Gemini attempts fail)
  console.log("[AI Client] All Gemini API attempts failed. Cascading to Groq API as LAST priority fallback...");
  const groqApiKey = (process.env.GROQ_API_KEY || "").trim();
  
  if (groqApiKey) {
    // Priority order for Groq: llama-3.3-70b-versatile is top-tier (70B parameters) matching Gemini/GPT-4 quality
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
        console.log(`[AI Client] LAST Priority: Attempting Groq fallback model "${groqModel}"...`);
        const groqPayload = {
          model: groqModel,
          messages: messages,
          temperature: body.generationConfig?.temperature ?? 0.7,
          max_tokens: 2048,
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



