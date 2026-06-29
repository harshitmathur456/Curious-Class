# CuriousClass — Socratic AI Learning & Tutoring Platform

**CuriousClass** is an interactive, premium Socratic learning and tutoring platform designed for school students. It uses generative AI (Google Gemini 3.5 Flash) to challenge students' critical thinking and logic, combined with a comprehensive Teacher Dashboard to manage class notes, handouts, quizzes, and class analytics.

---

## 🌟 Key Features

### 1. Interactive AI Chat & Explano Tutor
* **Socratic Guidance**: Explano plays "Devil's Advocate" to challenge student arguments, point out counterarguments, and push students to build their own explanations.
* **Direct Question Answering**: Answers direct questions first, then shifts back to the Socratic/Devil's Advocate tone to continue the learning journey.
* **Voice Input**: Students can use the microphone to talk in Hindi, English, or Hinglish, and the AI will transcribe and understand it.
* **Secure Backend Proxy**: All AI requests are routed through a secure backend proxy to keep API keys private.

### 2. Instant-Load Socratic Quizzes
* **Pre-fetched & Cached Quizzes**: When a student selects a topic, the application pre-fetches the Gemini-generated 5-question MCQ quiz in the background.
* **Interactive MCQ Interface**: Offers choice selection, instant correctness highlighting, Socratic explanation cards, and a detailed final scoring sheet.
* **Teacher-Pushed Quizzes**: Teachers can use the dashboard to push custom-generated quizzes to students instantly.

### 3. Knowledge Hub & Tracker
* **Taught Topics & Upcoming Classes**: Lists recent topics to discuss and upcoming classes to help guide the student's study plan.
* **Notes Shared by Teacher**: Lists handouts and PDF notes uploaded by teachers, allowing immediate downloading.

### 4. Teacher Dashboard & Analytics
* **Class Analytics**: Tracks student activity (scores, last active, heatmap of quiz topics).
* **Curriculum Tracker**: Teachers can mark topics as "pending", "ongoing", or "covered".
* **Notes Management**: Upload and manage PDFs/handouts via a Supabase storage integration.

---

## 🛠️ Technology Stack

* **Frontend**: Next.js (App Router, Turbopack), React, Vanilla CSS
* **Backend**: Node.js, Next.js Serverless Routes
* **Database & Storage**: Supabase (PostgreSQL for activities, Storage for notes)
* **AI Integration**: Google Gemini 3.5 Flash API

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
Create a `.env.local` file in the root directory and add your Google Gemini and Supabase keys:
```env
# Gemini API Key (Using multiple fallbacks for rate limits)
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_API_KEY_BACKUP=your_backup_gemini_api_key_here

# Supabase Keys (For Database & Notes Storage)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Running the Platform
* **Development Mode**:
  ```bash
  npm run dev
  ```
  Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Architecture & APIs

### Frontend Routes
* `/student` - Main student workspace (choose between Science/Math).
* `/teacher` - Teacher dashboard for classroom notes management and analytics.

### API Routes
* `/api/explano` - Connects to Explano AI with key cascading fallback.
* `/api/quiz` - Generates 5-question Socratic MCQ quizzes from topic prompts.
* `/api/activities` - Supabase endpoints for tracking student interactions.
* `/api/curriculum` - Supabase endpoints for fetching/updating teacher curriculum tracker.
* `/api/notes` - Uploading and listing PDF notes from Supabase Storage.
* `/api/pushed_quizzes` - Syncs teacher-generated quizzes to students.
