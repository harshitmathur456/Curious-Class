import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import { ingestPdfChunks } from "@/lib/rag";

// GET handler to list notes (with optional subject filter)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get("subject");

    const jsonPath = path.join(process.cwd(), "src", "data", "notes.json");
    const jsonContent = await readFile(jsonPath, "utf8");
    let notes = JSON.parse(jsonContent);

    if (subject) {
      notes = notes.filter((n) => n.subject === subject.toLowerCase());
    }

    return Response.json(notes);
  } catch (error) {
    console.error("Error reading notes:", error);
    return Response.json({ error: "Failed to read notes" }, { status: 500 });
  }
}

// POST handler to upload a new PDF note
export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const title = formData.get("title") || "";
    const subject = formData.get("subject") || "history";
    const chapter = formData.get("chapter") || "";

    if (!file) {
      return Response.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Ensure it is a PDF file
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      return Response.json({ error: "Only PDF files are allowed" }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure the public/notes directory exists
    const uploadDir = path.join(process.cwd(), "public", "notes");
    await mkdir(uploadDir, { recursive: true });

    // Write file to the public/notes directory
    const filePath = path.join(uploadDir, file.name);
    await writeFile(filePath, buffer);

    // Update notes.json metadata
    const jsonPath = path.join(process.cwd(), "src", "data", "notes.json");
    let notes = [];
    try {
      const jsonContent = await readFile(jsonPath, "utf8");
      notes = JSON.parse(jsonContent);
    } catch (e) {
      console.warn("notes.json didn't exist or was invalid, initializing empty array");
    }

    const newNote = {
      id: notes.length > 0 ? Math.max(...notes.map((n) => n.id)) + 1 : 1,
      title: title.trim() || file.name.replace(/\.[^/.]+$/, ""),
      fileName: file.name,
      fileUrl: `/notes/${encodeURIComponent(file.name)}`,
      uploadedBy: "Mrs. Sharma",
      uploadDate: new Date().toISOString().split("T")[0],
      fileSize: `${(file.size / 1024).toFixed(1)} KB`,
      subject: subject.toLowerCase(),
    };

    notes.push(newNote);
    await writeFile(jsonPath, JSON.stringify(notes, null, 2), "utf8");

    // ── RAG Pipeline: Extract text, chunk, embed, and store ──────
    // Fire-and-forget: don't block the upload response for large PDFs
    const ragPromise = ingestPdfChunks(buffer, {
      noteId: newNote.id,
      subjectKey: subject.toLowerCase(),
      chapter: chapter || newNote.title,
      fileName: file.name,
    }).catch((ragErr) => {
      console.error("[Notes Upload] RAG ingestion failed (non-blocking):", ragErr.message);
      return { chunkCount: 0, status: "error" };
    });

    // For small PDFs (< 2MB), wait for RAG to complete so we can return chunk count.
    // For large PDFs, return immediately and let RAG run in the background.
    let ragResult = { chunkCount: 0, status: "processing" };
    if (file.size < 2 * 1024 * 1024) {
      ragResult = await ragPromise;
    } else {
      // Don't await — let it run in the background
      console.log(`[Notes Upload] Large PDF (${(file.size / 1024 / 1024).toFixed(1)}MB) — RAG processing in background`);
    }

    return Response.json({
      success: true,
      note: newNote,
      rag: {
        chunkCount: ragResult.chunkCount,
        status: ragResult.status,
        embeddingModel: "text-embedding-004",
        embeddingDimension: 768,
        chunkConfig: "300-500 tokens, 50 token overlap",
      },
    });
  } catch (error) {
    console.error("Error uploading note:", error);
    return Response.json({ error: "Failed to upload note" }, { status: 500 });
  }
}
