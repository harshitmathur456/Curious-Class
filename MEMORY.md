# CuriousClass Memory & Architecture Guide

This document records the exact steps to add new classes, subjects, and PDF textbooks to **CuriousClass**, as well as the internal mechanics of how **Explano AI chat** grounds its responses in textbook content.

---

## 1. How to Add a New Class & PDF Textbooks

Follow these 5 steps whenever adding a new Class (e.g., Class 8, Class 9) or new subject textbooks:

### Step 1: Add PDF Files
Copy the PDF textbook files into the `public/notes/` directory.
- **Recommended Filename Convention**: `history_class8_ch1.pdf`, `science_class8_ch1.pdf`, or `History-Class-8.pdf`.

### Step 2: Register in `src/data/notes.json`
Add metadata objects for each PDF file in `src/data/notes.json`:
```json
{
  "id": 801,
  "title": "Resources and Development - Chapter 1 Notes",
  "fileName": "geography_class8_ch1.pdf",
  "fileUrl": "/notes/geography_class8_ch1.pdf",
  "uploadedBy": "Mrs. Sharma",
  "uploadDate": "2026-08-01",
  "fileSize": "3.5 MB",
  "subject": "geography_class8"
}
```
> **Important**: The `subject` field must use compound key formatting: `<subject>_class<number>` (e.g., `history_class8`, `science_class9`).

### Step 3: Define Chapter Data in `src/data/chaptersData.js`
If adding a new subject/class key to student chat navigation, register it in `CHAPTERS_DATA`:
```javascript
export const CHAPTERS_DATA = {
  geography_class8: {
    title: "Class 8 Geography",
    chapters: [
      {
        id: 1,
        name: "Resources",
        objective: "Understand types of natural and human-made resources",
        initialQuestion: "What makes something a resource in human life?",
        chips: ["Natural Resources", "Conservation", "Sustainable Development"]
      }
    ]
  }
};
```

### Step 4: Update Subject Key Mapping in `src/app/student/student-chat.js`
Update `getSubjectKey()` in [student-chat.js](file:///d:/Wadhwani%20ai/curiousclass/src/app/student/student-chat.js) so the student frontend sends the correct compound `subjectKey`:
```javascript
function getSubjectKey(subj, cls) {
  const isC8 = cls && cls.includes("8");
  if (subj === "geography" && isC8) return "geography_class8";
  // ...
}
```

### Step 5: Run the RAG Ingestion Backfill Script
Execute the backfill script to process the new PDFs, extract text, chunk content, generate embeddings, and insert them into Supabase:
```bash
node scripts/backfill-chunks.mjs
```
*Note: Any single PDF uploaded by a teacher via `/api/notes` will be automatically chunked and embedded on upload.*

---

## 2. How Explano Responds to Textbook Content

Explano uses a Retrieval-Augmented Generation (RAG) pipeline to ground its answers in teacher-uploaded textbook PDFs:

```
[Student Message] ──> [/api/explano] ──> [Embed Question (gemini-embedding-001)]
                                                   │
                                                   ▼
                                     [Supabase match_note_chunks RPC]
                                                   │
                            ┌──────────────────────┴──────────────────────┐
                   (Matches Found)                                (No Matches)
                          │                                              │
              [Format Grounding Context]                      [Generic Knowledge Fallback]
                          │                                              │
                          ▼                                              ▼
           [Inject in Gemini Prompt]                       [Standard Socratic Prompt]
                          │                                              │
                          └──────────────────────┬───────────────────────┘
                                                 ▼
                                     [Explano AI Response]
```

### Key RAG Pipeline Rules:

1. **Embedding Model**: Google `gemini-embedding-001` (768 dimensions).
2. **Chunk Configuration**: ~300–500 tokens (~1200–2000 chars) per chunk with ~50-token overlap, preserving paragraph (`\n\n`) and sentence boundaries.
3. **Dual-Stage Search**:
   - First tries vector search with `filter_subject_key = subjectKey`.
   - If 0 matches are found, it automatically executes a **repository-wide fallback search** without subject filtering.
4. **Prompt Context Injection**:
   - Matching textbook excerpts are injected directly into the Gemini `systemInstruction` as `GROUNDING CONTEXT FROM UPLOADED NOTES` BEFORE Socratic teaching rules.
5. **Explano Behavior & Persona**:
   - Explano **MUST** prioritize information from the `GROUNDING CONTEXT`.
   - Explano is instructed **NEVER** to say *"I don't have your textbook"* when grounding context is present.
   - Explano begins with a direct, factually accurate answer based on the textbook excerpt, then seamlessly transitions into Socratic questioning (playing Devil's Advocate / asking follow-ups).
