# CuriousClass — Socratic AI Learning & Tutoring Platform

**CuriousClass** is an interactive, premium Socratic learning and tutoring platform designed for school students. It uses generative AI (Google Gemini) to challenge students' critical thinking and logic, combined with a comprehensive Teacher Dashboard to manage class notes and handouts.

---

## 🌟 Key Features

### 1. Interactive AI Chat & Explano Tutor
* **Socratic Guidance**: Explano plays "Devil's Advocate" to challenge student arguments, point out counterarguments, and push students to build their own explanations.
* **Direct Question Answering**: If a student asks a direct question (e.g. *"Who discovered reflection of light?"*), Explano answers the question accurately first, then shifts back to the Socratic/Devil's Advocate tone to continue the learning journey.
* **Optimized Output**: Configured with a `2048` max token limit to handle Gemini 2.5's reasoning thought process without truncating responses.
* **Secure Backend Proxy**: All AI requests are routed through a secure backend proxy to keep API keys private.

### 2. Instant-Load Socratic Quizzes
* **Pre-fetched & Cached Quizzes**: When a student selects a topic, the application pre-fetches the Gemini-generated 5-question MCQ quiz in the background and caches it. Clicking **Start Topic Quiz** starts the quiz instantly.
* **Interactive MCQ Interface**: Offers choice selection, instant correctness highlighting (green for correct, red for incorrect), Socratic explanation cards, and a detailed final scoring sheet.
* **Fallback Quiz Sheets**: If the Gemini API is offline or key quota is exhausted, the client falls back to high-quality curated quiz pools for History, Physics, and Mathematics.

### 3. Knowledge Hub & Tracker
* **Taught Topics & Upcoming Classes**: Lists recent topics to discuss and upcoming classes to help guide the student's study plan.
* **Notes Shared by Teacher**: Lists handouts and PDF notes uploaded by teachers, allowing immediate downloading.
* **Custom Topic News Tracker**: Students can register up to 5 topics of interest to get live news headlines, using a backend wrapper around Google News RSS feeds.

### 4. Teacher Notes Management Dashboard
* **PDF Dropzone**: Drag-and-drop or click to upload PDF files to share.
* **Metadata Persistence**: Notes metadata is tracked persistently in the backend (`notes.json`), and physical files are stored in `/public/notes/`.
* **Download Directory**: Allows teachers to view, download, and track the status of all uploaded files in real-time.

---

## 🛠️ Technology Stack

* **Frontend**: Next.js 16 (App Router, Turbopack), React 19, Vanilla CSS
* **Backend**: Node.js, Next.js Serverless Routes
* **AI Integration**: Google Gemini 2.5 Flash API (`generateContent` on `v1beta`)
* **Utilities**: `rss-parser` (for news updates)

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** v18+ 
* **npm** or **yarn**

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/harshitmathur456/Curious-Class.git
   cd Curious-Class
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Configuration (`.env.local`)
Create a `.env.local` file in the root directory and add your Google Gemini API keys:
```env
# Primary Gemini API Key
GEMINI_API_KEY=your_primary_gemini_api_key_here

# Backup Gemini API Key (called automatically if the primary key runs out of quota/tokens)
GEMINI_API_KEY_BACKUP=your_backup_gemini_api_key_here
```

### Running the Platform
* **Development Mode**:
  ```bash
  npm run dev
  ```
  Open [http://localhost:3000](http://localhost:3000) in your browser.

* **Production Build**:
  ```bash
  npm run build
  npm run start
  ```

---

## 📁 Project Architecture & APIs

* `/student` - Main student workspace (History, Physics, Mathematics subjects).
* `/teacher` - Teacher dashboard for classroom notes management.
* `/api/explano` - Backend endpoint connecting to Explano AI with key cascading fallback.
* `/api/quiz` - Backend endpoint generating 5-question Socratic MCQ quizzes from topic prompts.
* `/api/news` - Backend endpoint parsing Google News RSS headlines.
* `/api/notes` - Backend endpoint listing and handling PDF file uploads.
