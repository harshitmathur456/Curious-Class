/**
 * RAG (Retrieval-Augmented Generation) utilities for CuriousClass.
 *
 * Configuration:
 *   - Embedding model : Google text-embedding-004  (768 dimensions)
 *   - Chunk size      : 300-500 tokens (~1200-2000 chars) with 50-token overlap
 *   - Similarity      : Cosine via pgvector <=> operator
 *   - Threshold       : 0.35 minimum similarity for retrieval
 */

import { supabaseAdmin } from "@/lib/supabase-server";

// ─── Constants ──────────────────────────────────────────────────
const EMBEDDING_MODEL = "text-embedding-004";
const EMBEDDING_DIMENSION = 768;
const CHUNK_TARGET_TOKENS = 400;   // target chunk size in tokens
const CHUNK_MIN_TOKENS = 200;      // minimum chunk size (don't create tiny trailing chunks)
const CHUNK_MAX_TOKENS = 500;      // hard max before forcing a split
const CHUNK_OVERLAP_TOKENS = 50;   // overlap between consecutive chunks
const CHARS_PER_TOKEN = 4;         // rough estimate: 1 token ≈ 4 characters

// ─── PDF Text Extraction ────────────────────────────────────────

/**
 * Extract plain text from a PDF buffer.
 * @param {Buffer} buffer - PDF file contents
 * @returns {Promise<string>} Extracted text
 */
export async function extractPdfText(buffer) {
  // Dynamic import of pdf-parse 1.1.1 core parser
  const pdfParse = (await import("pdf-parse/lib/pdf-parse.js")).default;
  const data = await pdfParse(buffer);
  return data.text || "";
}

// ─── Text Chunking ──────────────────────────────────────────────

/**
 * Estimate token count from character length.
 * text-embedding-004 uses a similar tokenizer to Gemini (~4 chars/token).
 */
function estimateTokens(text) {
  return Math.ceil(text.length / CHARS_PER_TOKEN);
}

/**
 * Split text into overlapping chunks respecting paragraph/sentence boundaries.
 *
 * Strategy:
 *   1. Split by double newline (paragraphs) first.
 *   2. If a paragraph exceeds CHUNK_MAX_TOKENS, split by single newline (lines).
 *   3. If a line still exceeds, split by sentence boundaries (". ").
 *   4. Hard-split as last resort.
 *
 * @param {string} text - Full document text
 * @returns {{ chunkText: string, chunkIndex: number }[]}
 */
export function chunkText(text) {
  if (!text || !text.trim()) return [];

  // Normalize whitespace
  const cleaned = text.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();

  // Split into paragraphs
  const paragraphs = cleaned.split(/\n\n+/);

  const chunks = [];
  let currentChunk = "";
  let chunkIndex = 0;

  for (const paragraph of paragraphs) {
    const paraTokens = estimateTokens(paragraph);

    // If adding this paragraph stays under target, accumulate
    if (estimateTokens(currentChunk + "\n\n" + paragraph) <= CHUNK_MAX_TOKENS) {
      currentChunk = currentChunk ? currentChunk + "\n\n" + paragraph : paragraph;
    } else {
      // Flush current chunk if it has content
      if (currentChunk && estimateTokens(currentChunk) >= CHUNK_MIN_TOKENS) {
        chunks.push({ chunkText: currentChunk.trim(), chunkIndex: chunkIndex++ });

        // Create overlap: take the last ~CHUNK_OVERLAP_TOKENS worth of text
        const overlapChars = CHUNK_OVERLAP_TOKENS * CHARS_PER_TOKEN;
        const overlap = currentChunk.slice(-overlapChars);
        currentChunk = overlap + "\n\n" + paragraph;
      } else if (currentChunk) {
        // Current chunk too small to flush alone, merge with paragraph
        currentChunk = currentChunk + "\n\n" + paragraph;
      } else {
        currentChunk = paragraph;
      }

      // If the single paragraph is huge, split it further
      if (estimateTokens(currentChunk) > CHUNK_MAX_TOKENS) {
        const subChunks = splitLargeBlock(currentChunk);
        for (let i = 0; i < subChunks.length - 1; i++) {
          chunks.push({ chunkText: subChunks[i].trim(), chunkIndex: chunkIndex++ });
        }
        // Keep the last sub-chunk as ongoing accumulator (with overlap)
        currentChunk = subChunks[subChunks.length - 1];
      }
    }
  }

  // Flush remaining text
  if (currentChunk && currentChunk.trim()) {
    // If too small, merge with last chunk
    if (estimateTokens(currentChunk) < CHUNK_MIN_TOKENS && chunks.length > 0) {
      const lastChunk = chunks[chunks.length - 1];
      chunks[chunks.length - 1] = {
        chunkText: lastChunk.chunkText + "\n\n" + currentChunk.trim(),
        chunkIndex: lastChunk.chunkIndex,
      };
    } else {
      chunks.push({ chunkText: currentChunk.trim(), chunkIndex: chunkIndex++ });
    }
  }

  return chunks;
}

/**
 * Split a large block of text into pieces ≤ CHUNK_MAX_TOKENS.
 * Tries sentence boundaries first, then hard-splits.
 */
function splitLargeBlock(text) {
  const maxChars = CHUNK_MAX_TOKENS * CHARS_PER_TOKEN;
  const overlapChars = CHUNK_OVERLAP_TOKENS * CHARS_PER_TOKEN;

  // Try splitting by lines first
  const lines = text.split("\n");
  const pieces = [];
  let current = "";

  for (const line of lines) {
    if ((current + "\n" + line).length > maxChars && current.length > 0) {
      pieces.push(current);
      const overlap = current.slice(-overlapChars);
      current = overlap + "\n" + line;
    } else {
      current = current ? current + "\n" + line : line;
    }
  }

  if (current) {
    // If this single piece is still too large, hard-split by sentences
    if (current.length > maxChars) {
      const sentences = current.split(/(?<=[.!?])\s+/);
      let sentenceChunk = "";
      for (const sentence of sentences) {
        if ((sentenceChunk + " " + sentence).length > maxChars && sentenceChunk.length > 0) {
          pieces.push(sentenceChunk);
          const overlap = sentenceChunk.slice(-overlapChars);
          sentenceChunk = overlap + " " + sentence;
        } else {
          sentenceChunk = sentenceChunk ? sentenceChunk + " " + sentence : sentence;
        }
      }
      if (sentenceChunk) pieces.push(sentenceChunk);
    } else {
      pieces.push(current);
    }
  }

  return pieces;
}

// ─── Embedding Generation ───────────────────────────────────────

/**
 * Get all available Gemini API keys (reuses the same multi-key pattern as gemini.js).
 */
function getGeminiKeys() {
  const rawKeys = [];

  for (const envKey in process.env) {
    if (envKey.startsWith("GEMINI_API_KEY") || envKey.startsWith("GEMINI_KEY")) {
      if (process.env[envKey]) {
        rawKeys.push(process.env[envKey].trim());
      }
    }
  }

  return [...new Set(rawKeys)].filter(
    (key) => key && key.length > 5 && !key.includes("your_gemini_api_key_here")
  );
}

/**
 * Generate a 768-dimensional embedding for a text string using text-embedding-004.
 *
 * @param {string} text - Text to embed
 * @returns {Promise<number[]>} 768-dimension float array
 * @throws {Error} If all API keys fail
 */
export async function generateEmbedding(text) {
  const keys = getGeminiKeys();
  if (keys.length === 0) {
    throw new Error("No Gemini API keys found in environment variables");
  }

  const models = ["gemini-embedding-001", "gemini-embedding-2", "text-embedding-004"];

  for (const key of keys) {
    for (const model of models) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:embedContent?key=${key}`;

        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: {
              parts: [{ text: text.slice(0, 8000) }],
            },
            outputDimensionality: EMBEDDING_DIMENSION,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const values = data.embedding?.values;
          if (values && values.length === EMBEDDING_DIMENSION) {
            return values;
          }
          console.warn(`[RAG Embed] Unexpected embedding dimension: ${values?.length}`);
        } else {
          const errorText = await response.text().catch(() => "");
          if (response.status === 401) break; // try next key
        }
      } catch (err) {
        console.warn(`[RAG Embed] Network error on model ${model}:`, err.message);
      }
    }
  }

  throw new Error("All Gemini API keys and embedding models failed");
}

/**
 * Generate embeddings for multiple texts with rate limiting.
 *
 * @param {string[]} texts - Array of texts to embed
 * @param {number} delayMs - Delay between API calls (default 200ms for ~5 req/sec)
 * @returns {Promise<number[][]>} Array of 768-dim embeddings
 */
export async function generateEmbeddings(texts, delayMs = 200) {
  const embeddings = [];
  for (let i = 0; i < texts.length; i++) {
    const embedding = await generateEmbedding(texts[i]);
    embeddings.push(embedding);

    // Rate limiting: wait between calls (skip for last item)
    if (i < texts.length - 1 && delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  return embeddings;
}

// ─── Chunk Ingestion Pipeline ───────────────────────────────────

/**
 * Full pipeline: extract PDF text → chunk → embed → store in Supabase.
 *
 * @param {Buffer} pdfBuffer - PDF file contents
 * @param {{ noteId: number, subjectKey: string, chapter: string, fileName: string }} metadata
 * @returns {Promise<{ chunkCount: number, status: string }>}
 */
export async function ingestPdfChunks(pdfBuffer, metadata) {
  const { noteId, subjectKey, chapter = "", fileName = "" } = metadata;

  // 1. Extract text
  const fullText = await extractPdfText(pdfBuffer);
  if (!fullText || fullText.trim().length < 50) {
    console.warn(`[RAG Ingest] PDF "${fileName}" has very little text (${fullText.length} chars), skipping.`);
    return { chunkCount: 0, status: "skipped_no_text" };
  }

  console.log(`[RAG Ingest] Extracted ${fullText.length} chars from "${fileName}"`);

  // 2. Chunk text
  const chunks = chunkText(fullText);
  if (chunks.length === 0) {
    return { chunkCount: 0, status: "skipped_no_chunks" };
  }

  console.log(`[RAG Ingest] Split into ${chunks.length} chunks (target: ${CHUNK_TARGET_TOKENS} tokens, max: ${CHUNK_MAX_TOKENS} tokens, overlap: ${CHUNK_OVERLAP_TOKENS} tokens)`);

  // 3. Delete existing chunks for this note (idempotent re-ingestion)
  const { error: deleteError } = await supabaseAdmin
    .from("note_chunks")
    .delete()
    .eq("note_id", noteId);

  if (deleteError) {
    console.warn(`[RAG Ingest] Could not delete old chunks for note ${noteId}:`, deleteError.message);
  }

  // 4. Generate embeddings with rate limiting and insert in batches
  const batchSize = 10;
  let insertedCount = 0;

  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize);
    const batchTexts = batch.map((c) => c.chunkText);

    // Generate embeddings for this batch (rate-limited internally)
    const embeddings = await generateEmbeddings(batchTexts, 150);

    // Prepare rows
    const rows = batch.map((chunk, j) => ({
      note_id: noteId,
      subject_key: subjectKey,
      chapter,
      file_name: fileName,
      chunk_index: chunk.chunkIndex,
      chunk_text: chunk.chunkText,
      embedding: JSON.stringify(embeddings[j]),
    }));

    // Insert batch into Supabase
    const { error: insertError } = await supabaseAdmin
      .from("note_chunks")
      .insert(rows);

    if (insertError) {
      console.error(`[RAG Ingest] Insert error at batch ${Math.floor(i / batchSize)}:`, insertError.message);
    } else {
      insertedCount += rows.length;
    }
  }

  console.log(`[RAG Ingest] Stored ${insertedCount}/${chunks.length} chunks for "${fileName}"`);
  return { chunkCount: insertedCount, status: "success" };
}

// ─── Semantic Search ────────────────────────────────────────────

/**
 * Search for relevant note chunks matching a student's question.
 *
 * @param {{ query: string, subjectKey?: string, topK?: number, threshold?: number }} params
 * @returns {Promise<{ chunks: Array, hasResults: boolean }>}
 */
export async function searchRelevantChunks({
  query,
  subjectKey = null,
  topK = 5,
  threshold = 0.35,
}) {
  try {
    // 1. Embed the student's question
    const queryEmbedding = await generateEmbedding(query);

    // 2. Call the match_note_chunks Postgres function via RPC with subject filter
    let { data, error } = await supabaseAdmin.rpc("match_note_chunks", {
      query_embedding: JSON.stringify(queryEmbedding),
      match_threshold: threshold,
      match_count: topK,
      filter_subject_key: subjectKey || null,
    });

    if (error) {
      console.error("[RAG Search] RPC error:", error.message);
    }

    // 3. Fallback: if subject filter produced no results, try WITHOUT subject filter
    if ((!data || data.length === 0) && subjectKey) {
      console.log(`[RAG Search] No matches with subject_key="${subjectKey}". Retrying vector search without subject filter...`);
      const fallbackResult = await supabaseAdmin.rpc("match_note_chunks", {
        query_embedding: JSON.stringify(queryEmbedding),
        match_threshold: Math.max(0.25, threshold - 0.05), // slightly lower threshold for fallback
        match_count: topK,
        filter_subject_key: null,
      });

      if (!fallbackResult.error && fallbackResult.data && fallbackResult.data.length > 0) {
        data = fallbackResult.data;
        console.log(`[RAG Search Fallback] Found ${data.length} chunks across textbook repository`);
      }
    }

    if (!data || data.length === 0) {
      console.log(`[RAG Search] No chunks found above threshold for: "${query.slice(0, 80)}..."`);
      return { chunks: [], hasResults: false };
    }

    console.log(`[RAG Search] Found ${data.length} relevant chunks (top similarity: ${data[0].similarity?.toFixed(3)})`);
    return { chunks: data, hasResults: true };
  } catch (err) {
    console.error("[RAG Search] Error:", err.message);
    // Graceful fallback: don't break the chat if search fails
    return { chunks: [], hasResults: false };
  }
}

/**
 * Format retrieved chunks into a grounding context block for the AI prompt.
 *
 * @param {Array} chunks - Retrieved chunks from searchRelevantChunks
 * @returns {string} Formatted context block
 */
export function formatGroundingContext(chunks) {
  if (!chunks || chunks.length === 0) return "";

  const contextParts = chunks.map((chunk, i) => {
    const source = [chunk.file_name, chunk.chapter].filter(Boolean).join(" — ");
    return `[Source ${i + 1}: ${source}]\n${chunk.chunk_text}`;
  });

  return `
--- GROUNDING CONTEXT FROM UPLOADED NOTES ---
The following excerpts are from the teacher's uploaded study material. Use these as your PRIMARY source of information when answering. Cite or reference this material where relevant.

${contextParts.join("\n\n")}

--- END OF GROUNDING CONTEXT ---
`.trim();
}
