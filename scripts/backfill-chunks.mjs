/**
 * Backfill Script — Generate chunks + embeddings for existing PDFs
 *
 * Usage:
 *   node scripts/backfill-chunks.mjs
 *
 * Configuration:
 *   - Embedding model : text-embedding-004 (768 dimensions)
 *   - Chunk size      : 300-500 tokens (~1200-2000 chars) with 50-token overlap
 *   - Rate limit      : ~200ms between embedding API calls (~5 req/sec)
 *
 * This script reads all PDFs from public/notes/, cross-references with
 * src/data/notes.json for metadata, and ingests chunks + embeddings
 * into the Supabase note_chunks table.
 *
 * Prerequisites:
 *   1. Run supabase_rag_schema.sql in your Supabase SQL Editor first
 *   2. Ensure .env.local has GEMINI_API_KEY and Supabase credentials
 */

import { readFile, readdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

// ─── Resolve project root ───────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "..");

// ─── Load environment variables from .env.local ─────────────────
async function loadEnv() {
  try {
    const envPath = path.join(PROJECT_ROOT, ".env.local");
    const envContent = await readFile(envPath, "utf8");
    for (const line of envContent.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIndex = trimmed.indexOf("=");
      if (eqIndex === -1) continue;
      const key = trimmed.slice(0, eqIndex).trim();
      const value = trimmed.slice(eqIndex + 1).trim();
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
    console.log("✅ Loaded .env.local");
  } catch (e) {
    console.warn("⚠️  Could not load .env.local:", e.message);
  }
}

await loadEnv();

// ─── Constants ──────────────────────────────────────────────────
const EMBEDDING_MODEL = "text-embedding-004";
const EMBEDDING_DIMENSION = 768;
const CHARS_PER_TOKEN = 4;
const CHUNK_MIN_TOKENS = 200;
const CHUNK_MAX_TOKENS = 500;
const CHUNK_OVERLAP_TOKENS = 50;
const EMBEDDING_DELAY_MS = 200; // ~5 requests per second

// ─── Supabase Client ────────────────────────────────────────────
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ─── Gemini Keys ────────────────────────────────────────────────
function getGeminiKeys() {
  const rawKeys = [];
  for (const envKey in process.env) {
    if (envKey.startsWith("GEMINI_API_KEY") || envKey.startsWith("GEMINI_KEY")) {
      if (process.env[envKey]) rawKeys.push(process.env[envKey].trim());
    }
  }
  return [...new Set(rawKeys)].filter(
    (k) => k && k.length > 5 && !k.includes("your_gemini_api_key_here")
  );
}

// ─── PDF Text Extraction ────────────────────────────────────────
async function extractPdfText(buffer) {
  const pdfParse = (await import("pdf-parse/lib/pdf-parse.js")).default;
  try {
    const data = await pdfParse(buffer);
    return data.text || "";
  } catch (err) {
    console.warn(`  ⚠️  pdf-parse warning/error: ${err.message}`);
    return "";
  }
}

// ─── Text Chunking ──────────────────────────────────────────────
function estimateTokens(text) {
  return Math.ceil(text.length / CHARS_PER_TOKEN);
}

function chunkText(text) {
  if (!text || !text.trim()) return [];

  const cleaned = text.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  const paragraphs = cleaned.split(/\n\n+/);
  const chunks = [];
  let currentChunk = "";
  let chunkIndex = 0;

  for (const paragraph of paragraphs) {
    if (estimateTokens(currentChunk + "\n\n" + paragraph) <= CHUNK_MAX_TOKENS) {
      currentChunk = currentChunk ? currentChunk + "\n\n" + paragraph : paragraph;
    } else {
      if (currentChunk && estimateTokens(currentChunk) >= CHUNK_MIN_TOKENS) {
        chunks.push({ chunkText: currentChunk.trim(), chunkIndex: chunkIndex++ });
        const overlapChars = CHUNK_OVERLAP_TOKENS * CHARS_PER_TOKEN;
        const overlap = currentChunk.slice(-overlapChars);
        currentChunk = overlap + "\n\n" + paragraph;
      } else if (currentChunk) {
        currentChunk = currentChunk + "\n\n" + paragraph;
      } else {
        currentChunk = paragraph;
      }

      if (estimateTokens(currentChunk) > CHUNK_MAX_TOKENS) {
        const subChunks = splitLargeBlock(currentChunk);
        for (let i = 0; i < subChunks.length - 1; i++) {
          chunks.push({ chunkText: subChunks[i].trim(), chunkIndex: chunkIndex++ });
        }
        currentChunk = subChunks[subChunks.length - 1];
      }
    }
  }

  if (currentChunk && currentChunk.trim()) {
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

function splitLargeBlock(text) {
  const maxChars = CHUNK_MAX_TOKENS * CHARS_PER_TOKEN;
  const overlapChars = CHUNK_OVERLAP_TOKENS * CHARS_PER_TOKEN;
  const lines = text.split("\n");
  const pieces = [];
  let current = "";

  for (const line of lines) {
    if ((current + "\n" + line).length > maxChars && current.length > 0) {
      pieces.push(current);
      current = current.slice(-overlapChars) + "\n" + line;
    } else {
      current = current ? current + "\n" + line : line;
    }
  }

  if (current) {
    if (current.length > maxChars) {
      const sentences = current.split(/(?<=[.!?])\s+/);
      let sentenceChunk = "";
      for (const sentence of sentences) {
        if ((sentenceChunk + " " + sentence).length > maxChars && sentenceChunk.length > 0) {
          pieces.push(sentenceChunk);
          sentenceChunk = sentenceChunk.slice(-overlapChars) + " " + sentence;
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
async function generateEmbedding(text, keys) {
  const models = ["gemini-embedding-001", "gemini-embedding-2", "text-embedding-004"];

  for (const key of keys) {
    for (const model of models) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:embedContent?key=${key}`;
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: { parts: [{ text: text.slice(0, 8000) }] },
            outputDimensionality: EMBEDDING_DIMENSION,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const values = data.embedding?.values;
          if (values && values.length === EMBEDDING_DIMENSION) return values;
        } else {
          const errText = await response.text().catch(() => "");
          if (response.status === 429) {
            console.warn("  ⏳ Rate limited, waiting 5s...");
            await new Promise((r) => setTimeout(r, 5000));
            continue;
          }
          if (response.status === 401) break;
        }
      } catch (err) {
        console.warn(`  ⚠️  Embed network error on ${model}: ${err.message}`);
      }
    }
  }
  throw new Error("All Gemini keys and embedding models failed");
}

// ─── Main Backfill Logic ────────────────────────────────────────
async function main() {
  console.log("═══════════════════════════════════════════════════════");
  console.log("  CuriousClass RAG Backfill Script");
  console.log("  Embedding: text-embedding-004 (768 dims)");
  console.log("  Chunks: 300-500 tokens, 50 token overlap");
  console.log("═══════════════════════════════════════════════════════\n");

  const keys = getGeminiKeys();
  if (keys.length === 0) {
    console.error("❌ No Gemini API keys found");
    process.exit(1);
  }
  console.log(`🔑 Found ${keys.length} Gemini API key(s)\n`);

  // Load notes metadata
  const notesJsonPath = path.join(PROJECT_ROOT, "src", "data", "notes.json");
  const notesJson = JSON.parse(await readFile(notesJsonPath, "utf8"));
  console.log(`📋 Found ${notesJson.length} notes in notes.json\n`);

  // List PDF files
  const notesDir = path.join(PROJECT_ROOT, "public", "notes");
  const pdfFiles = (await readdir(notesDir)).filter((f) => f.toLowerCase().endsWith(".pdf"));
  console.log(`📁 Found ${pdfFiles.length} PDF files in public/notes/\n`);

  let totalChunks = 0;
  let processedFiles = 0;
  let skippedFiles = 0;
  let errorFiles = 0;

  for (let fi = 0; fi < pdfFiles.length; fi++) {
    const fileName = pdfFiles[fi];
    const filePath = path.join(notesDir, fileName);

    // Find matching note metadata
    const noteMeta = notesJson.find(
      (n) => n.fileName === fileName || (n.fileUrl && n.fileUrl.endsWith(fileName))
    );
    const noteId = noteMeta?.id || fi + 1000;
    let subjectKey = noteMeta?.subject;

    if (!subjectKey || subjectKey === "unknown") {
      const fn = fileName.toLowerCase();
      if (fn.includes("history-class-6") || fn.includes("history_class6")) subjectKey = "history_class6";
      else if (fn.includes("history-class-7") || fn.includes("history_class7")) subjectKey = "history_class7";
      else if (fn.includes("science-class-6") || fn.includes("science_class6")) subjectKey = "science_class6";
      else if (fn.includes("science-class-7") || fn.includes("science_class7")) subjectKey = "science_class7";
      else if (fn.startsWith("history_ch")) subjectKey = "history_class10";
      else if (fn.startsWith("science_ch")) subjectKey = "science_class10";
      else if (fn.startsWith("maths_ch")) subjectKey = "mathematics_class10";
      else subjectKey = "general";
    }

    const chapter = noteMeta?.title || fileName.replace(/\.pdf$/i, "");

    console.log(`\n[${fi + 1}/${pdfFiles.length}] Processing: ${fileName}`);
    console.log(`  Note ID: ${noteId} | Subject: ${subjectKey} | Chapter: ${chapter}`);

    try {
      // Check if chunks already exist
      const { count, error: countErr } = await supabase
        .from("note_chunks")
        .select("id", { count: "exact", head: true })
        .eq("note_id", noteId);

      if (!countErr && count > 0) {
        console.log(`  ⏭️  Already has ${count} chunks — skipping (delete first to re-process)`);
        skippedFiles++;
        continue;
      }

      // Read PDF
      const buffer = await readFile(filePath);
      console.log(`  📄 File size: ${(buffer.length / 1024 / 1024).toFixed(2)} MB`);

      // Extract text
      const text = await extractPdfText(buffer);
      if (!text || text.trim().length < 50) {
        console.log(`  ⚠️  Very little text extracted (${text.length} chars) — skipping`);
        skippedFiles++;
        continue;
      }
      console.log(`  📝 Extracted ${text.length} chars`);

      // Chunk
      const chunks = chunkText(text);
      if (chunks.length === 0) {
        console.log(`  ⚠️  No chunks generated — skipping`);
        skippedFiles++;
        continue;
      }
      console.log(`  🧩 Generated ${chunks.length} chunks`);

      // Generate embeddings and insert (batch of 5)
      const batchSize = 5;
      let insertedCount = 0;

      for (let i = 0; i < chunks.length; i += batchSize) {
        const batch = chunks.slice(i, i + batchSize);
        const embeddings = [];

        for (const chunk of batch) {
          const emb = await generateEmbedding(chunk.chunkText, keys);
          embeddings.push(emb);
          await new Promise((r) => setTimeout(r, EMBEDDING_DELAY_MS));
        }

        const rows = batch.map((chunk, j) => ({
          note_id: noteId,
          subject_key: subjectKey,
          chapter,
          file_name: fileName,
          chunk_index: chunk.chunkIndex,
          chunk_text: chunk.chunkText,
          embedding: JSON.stringify(embeddings[j]),
        }));

        const { error: insertError } = await supabase.from("note_chunks").insert(rows);

        if (insertError) {
          console.error(`  ❌ Insert error: ${insertError.message}`);
        } else {
          insertedCount += rows.length;
        }

        // Progress indicator
        process.stdout.write(`  💾 Inserted ${insertedCount}/${chunks.length} chunks\r`);
      }

      console.log(`  ✅ Done: ${insertedCount} chunks stored`);
      totalChunks += insertedCount;
      processedFiles++;

    } catch (err) {
      console.error(`  ❌ Error processing ${fileName}: ${err.message}`);
      errorFiles++;
    }
  }

  console.log("\n═══════════════════════════════════════════════════════");
  console.log(`  Backfill Complete!`);
  console.log(`  📊 Processed: ${processedFiles} files`);
  console.log(`  ⏭️  Skipped:   ${skippedFiles} files (already done or no text)`);
  console.log(`  ❌ Errors:    ${errorFiles} files`);
  console.log(`  🧩 Total chunks inserted: ${totalChunks}`);
  console.log(`  📐 Embedding: ${EMBEDDING_MODEL} (${EMBEDDING_DIMENSION} dims)`);
  console.log(`  📏 Chunk config: ${CHUNK_MIN_TOKENS}-${CHUNK_MAX_TOKENS} tokens, ${CHUNK_OVERLAP_TOKENS} overlap`);
  console.log("═══════════════════════════════════════════════════════\n");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
