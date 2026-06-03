import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";

// GET handler to list notes
export async function GET() {
  try {
    const jsonPath = path.join(process.cwd(), "src", "data", "notes.json");
    const jsonContent = await readFile(jsonPath, "utf8");
    const notes = JSON.parse(jsonContent);
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
    };

    notes.push(newNote);
    await writeFile(jsonPath, JSON.stringify(notes, null, 2), "utf8");

    return Response.json({ success: true, note: newNote });
  } catch (error) {
    console.error("Error uploading note:", error);
    return Response.json({ error: "Failed to upload note" }, { status: 500 });
  }
}
