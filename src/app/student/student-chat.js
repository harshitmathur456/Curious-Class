"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CHAPTERS_DATA } from "@/data/chaptersData";
import "./student-chat.css";

/* ─── Icons (inline SVGs to avoid dependencies) ──────────────── */

function RobotIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="10" rx="2"/>
      <circle cx="12" cy="5" r="2"/>
      <path d="M12 7v4"/>
      <line x1="8" y1="16" x2="8" y2="16"/>
      <line x1="16" y1="16" x2="16" y2="16"/>
    </svg>
  );
}

function BrainIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a5 5 0 0 1 5 5c0 1.5-.5 2.5-1.5 3.5L12 14l-3.5-3.5C7.5 9.5 7 8.5 7 7a5 5 0 0 1 5-5z"/>
      <path d="M12 14v8"/>
      <path d="M8 18h8"/>
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/>
      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  );
}

function FlagIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
      <line x1="4" y1="22" x2="4" y2="15"/>
    </svg>
  );
}

function HistoryIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}

function PdfIconMini() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
    </svg>
  );
}

function QuizIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="9" y1="15" x2="15" y2="15"/>
      <line x1="9" y1="11" x2="15" y2="11"/>
      <circle cx="7" cy="11" r="0.5" fill="currentColor"/>
      <circle cx="7" cy="15" r="0.5" fill="currentColor"/>
    </svg>
  );
}

const fallbackFollowUps = [
  {
    mode: "follow-up",
    text: "That's a very interesting thought! Can you explain the reasoning behind it? How would you prove this to someone who doesn't agree?",
  },
  {
    mode: "explano",
    text: "Interesting perspective! But consider this alternative angle: does this rule always apply, or are there exceptions? What happens under extreme conditions?",
  },
  {
    mode: "follow-up",
    text: "Spot on! You are making great connections. Let's push this further: how does this concept connect to other chapters or real-world applications?",
  }
];

/* ─── Reasoning depth level from messages ────────────────────── */
function getReasoningLevel(messages) {
  const studentMsgs = messages.filter((m) => m.sender === "student");
  if (studentMsgs.length >= 3) return { level: 3, max: 4, label: "Connecting ideas" };
  if (studentMsgs.length >= 2) return { level: 2, max: 4, label: "Building reasoning" };
  if (studentMsgs.length >= 1) return { level: 1, max: 4, label: "Getting started" };
  return { level: 0, max: 4, label: "Not started" };
}

/* ─── Main Component ─────────────────────────────────────────── */

export default function StudentChat({ subject = null }) {
  const [currentSubject, setCurrentSubject] = useState(subject);
  const [curriculumData, setCurriculumData] = useState({});
  const [activeChapterId, setActiveChapterId] = useState(null);
  const router = useRouter();
  const [selectedClass, setSelectedClass] = useState("");
  const [activeTopic, setActiveTopic] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const cls = localStorage.getItem("selectedClass") || "";
      setSelectedClass(cls);

    }
  }, []);

  function getSubjectKey(subj, cls) {
    const isC10 = cls && cls.includes("10");
    const isC6 = cls && cls.includes("6");
    if (subj === "mathematics" && isC10) return "mathematics_class10";
    if (subj === "science" && isC10) return "science_class10";
    if (subj === "history" && isC10) return "history_class10";
    if (subj === "science" && isC6) return "science_class6";
    if (subj === "history" && isC6) return "history_class6";
    return subj;
  }

  useEffect(() => {
    if (currentSubject) {
      const subKey = getSubjectKey(currentSubject, selectedClass);
      fetch(`/api/curriculum?subject=${subKey}`)
        .then(r => r.json())
        .then(data => setCurriculumData(data))
        .catch(e => console.error(e));
    }
  }, [currentSubject, selectedClass]);

  const isClass10 = selectedClass && selectedClass.includes("10");
  const isClass6 = selectedClass && selectedClass.includes("6");
  let subjectKey = currentSubject;
  if (isClass10) {
    if (currentSubject === "mathematics") {
      subjectKey = "mathematics_class10";
    } else if (currentSubject === "science") {
      subjectKey = "science_class10";
    } else if (currentSubject === "history") {
      subjectKey = "history_class10";
    }
  } else if (isClass6) {
    if (subject === "science") {
      subjectKey = "science_class6";
    } else if (currentSubject === "history") {
      subjectKey = "history_class6";
    }
  }

  const allChapters = CHAPTERS_DATA[subjectKey]?.chapters || [];
  const activeChapter = allChapters.find((c) => c.id === activeChapterId);
  const activeIndex = activeChapterId ? allChapters.findIndex((c) => c.id === activeChapterId) : -1;
  const taughtTopics = activeIndex >= 0 ? allChapters.slice(0, activeIndex).map((c) => c.name) : [];
  const upcomingClasses = activeIndex >= 0 ? allChapters.slice(activeIndex + 1).map((c) => c.name) : allChapters.map((c) => c.name);

  const config = {
    title: CHAPTERS_DATA[subjectKey]?.title || subject,
    goal: {
      topic: activeTopic || "",
      objective: activeChapter?.objective || "",
    },
    progress: activeChapter?.progress || [],
    chips: activeChapter?.chips || [],
    taughtTopics,
    upcomingClasses,
    initialMessages: activeChapter
      ? [
          {
            id: 1,
            sender: "ai",
            mode: "question",
            text: activeChapter.initialQuestion,
            timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
          },
        ]
      : [],
  };

  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const [followUpIndex, setFollowUpIndex] = useState(0);

  const [trackedTopics, setTrackedTopics] = useState([]);
  const [topicInput, setTopicInput] = useState("");
  const [news, setNews] = useState({});
  const [loadingNews, setLoadingNews] = useState(false);

  const [sharedNotes, setSharedNotes] = useState([]);
  const [loadingNotes, setLoadingNotes] = useState(true);

  // Quiz States
  const [quizActive, setQuizActive] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [quizScore, setQuizScore] = useState(0);

  // Pre-fetching and Caching States
  const [cachedQuizzes, setCachedQuizzes] = useState({});
  const prefetchPromisesRef = useRef({});

  const filteredNotes = activeTopic
    ? (sharedNotes.some(note => note.fileName && note.fileName.toLowerCase().endsWith(`_ch${activeIndex + 1}.pdf`))
        ? sharedNotes.filter(note => note.fileName && note.fileName.toLowerCase().endsWith(`_ch${activeIndex + 1}.pdf`))
        : sharedNotes)
    : sharedNotes;

  // Initialize/reset states when subject changes
  useEffect(() => {
    setActiveChapterId(null);
    setActiveTopic("");
    setMessages([]);
    setTrackedTopics([]);
    setNews({});
    setInputValue("");
    setFollowUpIndex(0);
    setTopicInput("");
    setQuizActive(false);
    setQuizQuestions([]);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setAnswerSubmitted(false);
    setSelectedOptionIndex(null);
    setQuizScore(0);
    setCachedQuizzes({});
    prefetchPromisesRef.current = {};
  }, [currentSubject]);

  useEffect(() => {
    let active = true;

    async function fetchSharedNotes() {
      setLoadingNotes(true);
      try {
        const res = await fetch(`/api/notes?subject=${subjectKey}`);
        if (res.ok && active) {
          const data = await res.json();
          setSharedNotes(data);
        }
      } catch (e) {
        console.error("Failed to fetch shared notes:", e);
      } finally {
        if (active) setLoadingNotes(false);
      }
    }

    fetchSharedNotes();

    return () => {
      active = false;
    };
  }, [subjectKey]);

  // Background pre-fetch quiz when activeTopic changes
  useEffect(() => {
    if (!activeTopic) return;
    
    // If already in cache, do nothing
    if (cachedQuizzes[activeTopic]) return;
    
    // If already prefetching, do nothing
    if (prefetchPromisesRef.current[activeTopic]) return;

    console.log(`[Prefetch] Starting prefetch for subject: "${config.title}", topic: "${activeTopic}"`);

    const promise = fetch("/api/quiz", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subject: config.title,
        topic: activeTopic,
      }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Prefetch response was not ok");
        const data = await res.json();
        if (Array.isArray(data) && data.length === 5) {
          console.log(`[Prefetch] Successfully prefetched and cached quiz for topic: "${activeTopic}"`);
          setCachedQuizzes((prev) => ({ ...prev, [activeTopic]: data }));
          return data;
        }
        throw new Error("Prefetch returned invalid format");
      })
      .catch((err) => {
        console.warn(`[Prefetch] Failed to prefetch quiz for "${activeTopic}":`, err);
        // Clear the promise from ref so we can retry on demand/click
        delete prefetchPromisesRef.current[activeTopic];
        throw err;
      });

    prefetchPromisesRef.current[activeTopic] = promise;
  }, [subject, activeTopic, config.title]);

  async function handleStartQuiz() {
    setQuizActive(true);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setAnswerSubmitted(false);
    setSelectedOptionIndex(null);
    setQuizScore(0);

    const cached = cachedQuizzes[activeTopic];
    if (cached) {
      console.log(`[Quiz] Loading quiz for "${activeTopic}" instantly from cache.`);
      setQuizQuestions(cached);
      setLoadingQuiz(false);
      return;
    }

    setLoadingQuiz(true);
    console.log(`[Quiz] Cache miss or pending prefetch for "${activeTopic}". Loading...`);

    try {
      let data;
      // If there is an active prefetch promise, await it
      if (prefetchPromisesRef.current[activeTopic]) {
        console.log(`[Quiz] Awaiting active prefetch promise for "${activeTopic}"`);
        data = await prefetchPromisesRef.current[activeTopic];
      } else {
        // Otherwise, fetch normally
        console.log(`[Quiz] Fetching quiz on demand for "${activeTopic}"`);
        const res = await fetch("/api/quiz", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subject: config.title,
            topic: activeTopic,
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to fetch quiz");
        }

        data = await res.json();
      }

      if (Array.isArray(data) && data.length === 5) {
        setQuizQuestions(data);
        // Also cache it
        setCachedQuizzes((prev) => ({ ...prev, [activeTopic]: data }));
      } else {
        throw new Error("Invalid quiz format received");
      }
    } catch (e) {
      console.error("Failed to generate custom quiz with Gemini, using high-quality local quiz:", e);
      // Fallback to local high-quality quiz matching current active topic
      const questions = activeChapter?.quizzes || [];
      setQuizQuestions(questions);
    } finally {
      setLoadingQuiz(false);
    }
  }

  function handleSelectOption(index) {
    if (answerSubmitted) return;
    setSelectedOptionIndex(index);
  }

  function handleSubmitAnswer() {
    if (selectedOptionIndex === null || answerSubmitted) return;
    
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const isCorrect = selectedOptionIndex === currentQuestion.answerIndex;
    
    if (isCorrect) {
      setQuizScore((prev) => prev + 1);
    }
    
    setUserAnswers((prev) => [...prev, selectedOptionIndex]);
    setAnswerSubmitted(true);
  }

  function handleNextQuestion() {
    setAnswerSubmitted(false);
    setSelectedOptionIndex(null);
    setCurrentQuestionIndex((prev) => prev + 1);
  }

  const reasoning = getReasoningLevel(messages);

  function handleTopicSelect(topic) {
    const chapter = allChapters.find((c) => c.name === topic);
    if (!chapter) return;

    setActiveTopic(topic);
    setMessages([
      {
        id: 1,
        sender: "ai",
        mode: "question",
        text: chapter.initialQuestion,
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
      }
    ]);
    setInputValue("");
    setFollowUpIndex(0);
    setQuizActive(false);
    setQuizQuestions([]);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setAnswerSubmitted(false);
    setSelectedOptionIndex(null);
    setQuizScore(0);
  }

  async function fetchNewsForTopic(topic) {
    setLoadingNews(true);
    try {
      const res = await fetch(`/api/news?q=${encodeURIComponent(topic)}`);
      const data = await res.json();
      if (data.articles) {
        setNews((prev) => ({ ...prev, [topic]: data.articles }));
      }
    } catch (e) {
      console.error(e);
    }
    setLoadingNews(false);
  }

  function handleAddTopic() {
    const t = topicInput.trim();
    if (t && trackedTopics.length < 5 && !trackedTopics.includes(t)) {
      setTrackedTopics([...trackedTopics, t]);
      setTopicInput("");
      fetchNewsForTopic(t);
    }
  }

  function handleRemoveTopic(t) {
    setTrackedTopics(trackedTopics.filter((x) => x !== t));
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  async function handleSend() {
    const text = inputValue.trim();
    if (!text) return;

    const studentMsg = {
      id: messages.length + 1,
      sender: "student",
      text,
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    };

    const newMessages = [...messages, studentMsg];
    setMessages(newMessages);
    setInputValue("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/explano", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: newMessages,
          activeTopic,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch AI response");
      }

      const data = await res.json();
      const aiMsg = {
        id: newMessages.length + 1,
        sender: "ai",
        mode: "explano",
        text: data.text,
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error("Error fetching Gemini response:", err);
      // Fallback response
      const aiResponse = fallbackFollowUps[followUpIndex % fallbackFollowUps.length];
      const aiMsg = {
        id: newMessages.length + 1,
        sender: "ai",
        mode: aiResponse.mode,
        text: `${aiResponse.text} *(Note: Gemini API key offline or request failed, using simulation)*`,
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setFollowUpIndex((prev) => prev + 1);
    } finally {
      setIsTyping(false);
    }
  }

  function handleChipClick(chip) {
    setInputValue(chip);
    inputRef.current?.focus();
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    !currentSubject ? (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--color-bg)' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>Welcome to CuriousClass</h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '2.5rem', color: 'var(--color-text-secondary)' }}>What would you like to study today?</p>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {selectedClass && (selectedClass.includes("11") || selectedClass.includes("12")) ? (
            <>
              <button onClick={() => { setCurrentSubject('physics'); router.push('/student/physics'); }} style={{ padding: '20px', fontSize: '1.2rem', borderRadius: '12px', border: '1px solid var(--color-border-light)', background: 'white', cursor: 'pointer' }}>⚡ Physics</button>
              <button onClick={() => { setCurrentSubject('chemistry'); router.push('/student/chemistry'); }} style={{ padding: '20px', fontSize: '1.2rem', borderRadius: '12px', border: '1px solid var(--color-border-light)', background: 'white', cursor: 'pointer' }}>🧪 Chemistry</button>
              <button onClick={() => { setCurrentSubject('biology'); router.push('/student/biology'); }} style={{ padding: '20px', fontSize: '1.2rem', borderRadius: '12px', border: '1px solid var(--color-border-light)', background: 'white', cursor: 'pointer' }}>🧬 Biology</button>
              <button onClick={() => { setCurrentSubject('mathematics'); router.push('/student/mathematics'); }} style={{ padding: '20px', fontSize: '1.2rem', borderRadius: '12px', border: '1px solid var(--color-border-light)', background: 'white', cursor: 'pointer' }}>📐 Mathematics</button>
            </>
          ) : (
            <>
              <button onClick={() => { setCurrentSubject('history'); router.push('/student'); }} style={{ padding: '20px', fontSize: '1.2rem', borderRadius: '12px', border: '1px solid var(--color-border-light)', background: 'white', cursor: 'pointer' }}>📜 History</button>
              <button onClick={() => { setCurrentSubject('science'); router.push('/student/science'); }} style={{ padding: '20px', fontSize: '1.2rem', borderRadius: '12px', border: '1px solid var(--color-border-light)', background: 'white', cursor: 'pointer' }}>🔬 Science</button>
              <button onClick={() => { setCurrentSubject('mathematics'); router.push('/student/mathematics'); }} style={{ padding: '20px', fontSize: '1.2rem', borderRadius: '12px', border: '1px solid var(--color-border-light)', background: 'white', cursor: 'pointer' }}>📐 Mathematics</button>
            </>
          )}
        </div>
      </div>
    ) :
    <div className="sc-layout">
      {/* ── Left Sidebar ── */}
      <aside className="sc-sidebar">
        <div className="sc-sidebar-top">
          {/* Logo */}
          <div className="sc-logo">
            <div className="sc-logo-icon">
              <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="12" fill="#2A7A50"/>
                <path d="M12 28V16C12 13.8 13.8 12 16 12H24C26.2 12 28 13.8 28 16V24C28 26.2 26.2 28 24 28H12Z" fill="#EAF3DE"/>
                <circle cx="18" cy="18" r="2" fill="#2A7A50"/>
                <circle cx="24" cy="18" r="2" fill="#2A7A50"/>
                <path d="M16 23C16 23 18 25 21 25C24 25 26 23 26 23" stroke="#2A7A50" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <div className="sc-logo-name">CuriousClass</div>
              <div className="sc-logo-tagline">{selectedClass ? `${selectedClass} • Think deeper` : "Think deeper"}</div>
            </div>
          </div>

          {/* Subjects Navigation */}
          <div className="sc-subject-nav">
            <div className="sc-subject-nav-label">Subjects</div>
            <div className="sc-subject-nav-links">
              {selectedClass && (selectedClass.includes("11") || selectedClass.includes("12")) ? (
                <>
                  <Link href="/student/physics" className={`sc-subject-link ${currentSubject === "physics" ? "sc-subject-link--active" : ""}`}>
                    ⚡ Physics
                  </Link>
                  <Link href="/student/chemistry" className={`sc-subject-link ${currentSubject === "chemistry" ? "sc-subject-link--active" : ""}`}>
                    🧪 Chemistry
                  </Link>
                  <Link href="/student/biology" className={`sc-subject-link ${currentSubject === "biology" ? "sc-subject-link--active" : ""}`}>
                    🧬 Biology
                  </Link>
                  <Link href="/student/mathematics" className={`sc-subject-link ${currentSubject === "mathematics" ? "sc-subject-link--active" : ""}`}>
                    📐 Mathematics
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/student" className={`sc-subject-link ${currentSubject === "history" ? "sc-subject-link--active" : ""}`}>
                    📜 History
                  </Link>
                  <Link href="/student/science" className={`sc-subject-link ${currentSubject === "science" ? "sc-subject-link--active" : ""}`}>
                    🔬 Science
                  </Link>
                  <Link href="/student/mathematics" className={`sc-subject-link ${currentSubject === "mathematics" ? "sc-subject-link--active" : ""}`}>
                    📐 Mathematics
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Today's Goal */}
          {activeTopic && (
            <div className="sc-goal-card">
              <div className="sc-goal-header">
                <span className="sc-goal-icon"><FlagIcon /></span>
                <span className="sc-goal-label">Today&apos;s goal</span>
              </div>
              <div className="sc-goal-topic">{config.goal.topic}</div>
              <div className="sc-goal-objective">{config.goal.objective}</div>
            </div>
          )}

          {/* Topic Progress */}
          {activeTopic && config.progress.length > 0 && (
            <div className="sc-progress">
              <div className="sc-progress-label">Topic progress</div>
              <div className="sc-progress-steps">
                {config.progress.map((step, i) => (
                  <div
                    key={step.id}
                    className={`sc-step ${step.status === "completed" ? "sc-step--done" : ""} ${step.status === "active" ? "sc-step--active" : ""} ${step.status === "upcoming" ? "sc-step--upcoming" : ""}`}
                  >
                    <div className="sc-step-indicator">
                      {step.status === "completed" && (
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                          <path d="M3 8L6.5 11.5L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                      {step.status === "active" && <div className="sc-step-dot sc-step-dot--active" />}
                      {step.status === "upcoming" && <div className="sc-step-dot sc-step-dot--upcoming" />}
                    </div>
                    <span className="sc-step-text">{step.label}</span>
                    {i < config.progress.length - 1 && <div className="sc-step-line" />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {activeTopic && (
          <button
            className="sc-quiz-btn"
            id="start-quiz-btn"
            onClick={handleStartQuiz}
            disabled={loadingQuiz}
          >
            <QuizIcon />
            <span>{loadingQuiz ? "Loading Quiz..." : "Start Topic Quiz"}</span>
          </button>
        )}

        {activeChapterId && (
          <div className="sc-active-chapter-box">
            <div className="sc-ac-label">Active Chapter</div>
            <div className="sc-ac-name">{activeChapter?.name}</div>
            <button className="sc-change-chapter-btn" onClick={() => { setActiveChapterId(null); setActiveTopic(""); }}>
              ← Change Chapter
            </button>
          </div>
        )}
      </aside>

      <main className="sc-main" style={!activeTopic ? { padding: "var(--space-2xl)", overflowY: "auto" } : {}}>
        {!activeChapterId ? (
          <div className="sc-topic-select-view">
            <div className="sc-tsv-header">
              <h1>Select a Chapter</h1>
              <p>Choose a chapter to see topics covered by your teacher.</p>
            </div>
            
            <div className="sc-tsv-grid">
              {allChapters.map((chapter) => {
                const chData = curriculumData[chapter.id] || {};
                return (
                  <button
                    key={chapter.id}
                    className="sc-tsv-card"
                    onClick={() => setActiveChapterId(chapter.id)}
                  >
                    <div className="sc-tsv-card-icon">📚</div>
                    <div className="sc-tsv-card-info">
                      <h3>{chapter.name}</h3>
                      <p>{chapter.objective}</p>
                      {chData.status === 'covered' && <span style={{fontSize: '12px', color: 'green', fontWeight: 'bold', display: 'block', marginTop: '4px'}}>Covered on {chData.coveredDate}</span>}
                      {chData.status === 'ongoing' && <span style={{fontSize: '12px', color: 'orange', fontWeight: 'bold', display: 'block', marginTop: '4px'}}>Ongoing</span>}
                    </div>
                    <div className="sc-tsv-card-arrow">→</div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : !activeTopic ? (
          <div className="sc-topic-select-view">
            <div className="sc-tsv-header">
              <h1>{activeChapter?.name} - Topics</h1>
              <p>Select a topic to begin Socratic discussion.</p>
              <button onClick={() => setActiveChapterId(null)} style={{background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', textDecoration: 'underline'}}>← Back to Chapters</button>
            </div>
            
            <div className="sc-tsv-grid">
              {(() => {
                const chData = curriculumData[activeChapterId] || { topics: [] };
                if (chData.topics?.length === 0 || !chData.topics) {
                  return <p style={{color: 'var(--color-text-secondary)'}}>No topics defined by the teacher yet.</p>
                }
                return chData.topics.map(topic => (
                  <button
                    key={topic.id}
                    className="sc-tsv-card"
                    onClick={() => handleTopicSelect(topic.name)}
                    style={{ borderLeft: topic.status === 'covered' ? '4px solid green' : '4px solid #ccc' }}
                  >
                    <div className="sc-tsv-card-icon">📝</div>
                    <div className="sc-tsv-card-info">
                      <h3>{topic.name}</h3>
                      <p style={{color: topic.status === 'covered' ? 'green' : 'var(--color-text-tertiary)'}}>{topic.status === 'covered' ? 'Covered' : 'Yet to be covered'}</p>
                    </div>
                    <div className="sc-tsv-card-arrow">→</div>
                  </button>
                ));
              })()}
            </div>
          </div>
        ) : quizActive ? (
          <div className="sc-quiz-view">
            <div className="sc-quiz-header">
              <h2 className="sc-quiz-title">{config.title} Quiz: {activeTopic}</h2>
              <span className="sc-quiz-badge">Interactive MCQ</span>
            </div>

            {loadingQuiz ? (
              <div className="sc-quiz-content" style={{ justifyContent: "center", alignItems: "center" }}>
                <div className="sc-typing-dots" style={{ margin: "var(--space-md) 0" }}>
                  <span /><span /><span />
                </div>
                <p style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>Generating custom quiz with Gemini AI...</p>
              </div>
            ) : quizQuestions.length > 0 && currentQuestionIndex < 5 ? (
              // Quiz Question View
              <div className="sc-quiz-content">
                <div className="sc-quiz-progress-bar">
                  <div 
                    className="sc-quiz-progress-fill" 
                    style={{ width: `${((currentQuestionIndex + (answerSubmitted ? 1 : 0)) / 5) * 100}%` }}
                  />
                </div>
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="sc-quiz-question-num">Question {currentQuestionIndex + 1} of 5</span>
                  <span style={{ fontSize: "12px", color: "var(--color-text-secondary)" }}>Score: {quizScore}/{currentQuestionIndex}</span>
                </div>

                <h3 className="sc-quiz-question-text">{quizQuestions[currentQuestionIndex].question}</h3>

                <div className="sc-quiz-options">
                  {quizQuestions[currentQuestionIndex].options.map((option, i) => {
                    const isSelected = selectedOptionIndex === i;
                    const isCorrectAnswer = quizQuestions[currentQuestionIndex].answerIndex === i;
                    
                    let btnClass = "sc-quiz-option-btn";
                    if (isSelected) btnClass += " sc-quiz-option-btn--selected";
                    
                    if (answerSubmitted) {
                      if (isCorrectAnswer) {
                        btnClass += " sc-quiz-option-btn--correct";
                      } else if (isSelected) {
                        btnClass += " sc-quiz-option-btn--incorrect";
                      }
                    }

                    return (
                      <button
                        key={i}
                        className={btnClass}
                        onClick={() => handleSelectOption(i)}
                        disabled={answerSubmitted}
                      >
                        <div className="sc-quiz-option-indicator">
                          {String.fromCharCode(65 + i)}
                        </div>
                        <span>{option}</span>
                      </button>
                    );
                  })}
                </div>

                {answerSubmitted && (
                  <div className="sc-quiz-explanation">
                    <strong>Explanation:</strong> {quizQuestions[currentQuestionIndex].explanation}
                  </div>
                )}

                <div className="sc-quiz-action-row">
                  {!answerSubmitted ? (
                    <button
                      className="sc-quiz-submit-btn"
                      onClick={handleSubmitAnswer}
                      disabled={selectedOptionIndex === null}
                    >
                      Submit Answer
                    </button>
                  ) : (
                    <button
                      className="sc-quiz-submit-btn"
                      onClick={handleNextQuestion}
                    >
                      {currentQuestionIndex < 4 ? "Next Question" : "View Results"}
                    </button>
                  )}
                  <button 
                    onClick={() => setQuizActive(false)} 
                    style={{ background: "transparent", color: "var(--color-text-secondary)", fontSize: "13px", padding: "10px 20px", border: "none", cursor: "pointer" }}
                  >
                    Exit Quiz
                  </button>
                </div>
              </div>
            ) : quizQuestions.length > 0 ? (
              // Quiz Results View
              <div className="sc-quiz-content" style={{ overflowY: "auto" }}>
                <div className="sc-quiz-summary">
                  <div className="sc-quiz-score-circle">
                    <span className="sc-quiz-score-val">{quizScore}/5</span>
                    <span className="sc-quiz-score-lbl">Score</span>
                  </div>
                  
                  <h3 className="sc-quiz-summary-title">
                    {quizScore === 5 ? "Perfect Score!" : quizScore >= 3 ? "Well Done!" : "Keep Learning!"}
                  </h3>
                  
                  <p className="sc-quiz-summary-desc">
                    {quizScore === 5 
                      ? "Outstanding! You got a perfect 100% on this topic! You've mastered these concepts."
                      : quizScore >= 3 
                      ? "Great job! You have a solid understanding of the concepts. Review the incorrect answers below to improve."
                      : "Good effort! Try reading the shared notes or discussing more with Explano to strengthen your grasp of the topic."
                    }
                  </p>

                  <div className="sc-quiz-review-section">
                    <h4 className="sc-quiz-review-title">Review Questions</h4>
                    <div className="sc-quiz-review-list">
                      {quizQuestions.map((q, idx) => {
                        const userAnswer = userAnswers[idx];
                        const isCorrect = userAnswer === q.answerIndex;
                        return (
                          <div key={idx} className="sc-quiz-review-item">
                            <p className="sc-quiz-review-q">{idx + 1}. {q.question}</p>
                            <p className={`sc-quiz-review-ans ${isCorrect ? "sc-quiz-review-ans--correct" : "sc-quiz-review-ans--incorrect"}`}>
                              {isCorrect ? "✓ Correct: " : "✗ Your Answer: "} 
                              {q.options[userAnswer]} 
                              {!isCorrect && ` (Correct: ${q.options[q.answerIndex]})`}
                            </p>
                            <p style={{ fontSize: "11px", color: "var(--color-text-tertiary)", marginTop: "4px", fontStyle: "italic" }}>
                              {q.explanation}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    className="sc-quiz-submit-btn"
                    onClick={() => setQuizActive(false)}
                    style={{ marginTop: "var(--space-md)" }}
                  >
                    Back to Chat
                  </button>
                </div>
              </div>
            ) : (
              <div className="sc-quiz-content" style={{ justifyContent: "center", alignItems: "center" }}>
                <p style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>Failed to load quiz. Please try again.</p>
                <button className="sc-quiz-submit-btn" onClick={() => setQuizActive(false)}>Back to Chat</button>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Reasoning Depth Bar */}
            <div className="sc-depth-bar">
              <div className="sc-depth-label">
                <span>Reasoning depth</span>
                <span className="sc-depth-level">Level {reasoning.level}/{reasoning.max}</span>
              </div>
              <div className="sc-depth-track">
                <div
                  className="sc-depth-fill"
                  style={{ width: `${(reasoning.level / reasoning.max) * 100}%` }}
                />
              </div>
              <div className="sc-depth-sublabel">{reasoning.label}</div>
            </div>

            {/* Topic Pill */}
            <div className="sc-topic-pill-wrap">
              <div className="sc-topic-pill">Topic: {activeTopic}</div>
            </div>

            {/* Chat Messages */}
            <div className="sc-chat-messages">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`sc-msg ${msg.sender === "ai" ? "sc-msg--ai" : "sc-msg--student"} ${msg.mode === "explano" ? "sc-msg--devils" : ""}`}
                >
                  {msg.sender === "ai" && (
                    <div className="sc-msg-avatar">
                      {msg.mode === "explano" ? (
                        <div className="sc-avatar sc-avatar--devils"><BrainIcon /></div>
                      ) : (
                        <div className="sc-avatar sc-avatar--ai"><RobotIcon /></div>
                      )}
                    </div>
                  )}
                  <div className="sc-msg-content">
                    {msg.mode === "explano" && (
                      <div className="sc-devils-label">Explano</div>
                    )}
                    <div className="sc-msg-bubble">
                      <p dangerouslySetInnerHTML={{
                        __html: msg.text
                          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                          .replace(/\*(.*?)\*/g, "<em>$1</em>"),
                      }} />
                    </div>
                    <div className="sc-msg-time">{msg.timestamp}</div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="sc-msg sc-msg--ai">
                  <div className="sc-msg-avatar">
                    <div className="sc-avatar sc-avatar--ai"><RobotIcon /></div>
                  </div>
                  <div className="sc-msg-content">
                    <div className="sc-msg-bubble sc-typing">
                      <div className="sc-typing-dots">
                        <span /><span /><span />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Bottom Input Area */}
            <div className="sc-input-area">
              {/* Suggested Chips */}
              <div className="sc-chips">
                {config.chips.map((chip) => (
                  <button
                    key={chip}
                    className="sc-chip"
                    onClick={() => handleChipClick(chip)}
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Input Row */}
              <div className="sc-input-row">
                <input
                  ref={inputRef}
                  type="text"
                  className="sc-input"
                  id="student-chat-input"
                  placeholder="Type your answer here..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  className="sc-send-btn"
                  id="send-message-btn"
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                  aria-label="Send message"
                >
                  <SendIcon />
                </button>
              </div>

              <p className="sc-disclaimer">AI can make mistakes. Focus on the concepts.</p>
            </div>
          </>
        )}
      </main>

      {/* ── Right Sidebar (Knowledge Hub) ── */}
      {activeTopic && (
        <aside className="sc-right-sidebar">
          <h2 className="sc-rs-title">Knowledge Hub</h2>
          
          <div className="sc-rs-section">
            <h3 className="sc-rs-subtitle">Taught by Teacher</h3>
            <ul className="sc-rs-list">
              {config.taughtTopics.map((topic) => (
                <li key={topic} onClick={() => handleTopicSelect(topic)} style={{cursor: "pointer"}}>{topic}</li>
              ))}
            </ul>
          </div>

          <div className="sc-rs-section">
            <h3 className="sc-rs-subtitle">Upcoming Classes</h3>
            <ul className="sc-rs-list">
              {config.upcomingClasses.map((topic) => (
                <li key={topic} onClick={() => handleTopicSelect(topic)} style={{cursor: "pointer"}}>{topic}</li>
              ))}
            </ul>
          </div>

          <div className="sc-rs-section">
            <h3 className="sc-rs-subtitle">Notes Shared by Teacher</h3>
            {loadingNotes ? (
              <span style={{ fontSize: "11px", color: "var(--color-text-tertiary)" }}>Loading shared notes...</span>
            ) : filteredNotes.length === 0 ? (
              <span style={{ fontSize: "11px", color: "var(--color-text-tertiary)" }}>No shared notes yet.</span>
            ) : (
              <div className="sc-rs-notes-list">
                {filteredNotes.map((note) => (
                  <a
                    key={note.id}
                    href={note.fileUrl}
                    download
                    className="sc-rs-note-item"
                    title={`Download ${note.title}`}
                  >
                    <span className="sc-rs-note-icon">
                      <PdfIconMini />
                    </span>
                    <div className="sc-rs-note-info">
                      <div className="sc-rs-note-title">{note.title}</div>
                      <div className="sc-rs-note-meta">{note.fileSize} • {note.uploadDate}</div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="sc-rs-section">
            <h3 className="sc-rs-subtitle">Track Topics (News)</h3>
            <p className="sc-rs-desc">Add up to 5 topics to get live news</p>
            <div className="sc-rs-input-group">
              <input 
                type="text" 
                placeholder="E.g., Space, AI..." 
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddTopic();
                }}
                disabled={trackedTopics.length >= 5}
                className="sc-rs-input"
              />
              <button onClick={handleAddTopic} disabled={!topicInput.trim() || trackedTopics.length >= 5} className="sc-rs-add-btn">+</button>
            </div>
            
            <div className="sc-rs-tracked">
              {trackedTopics.map(topic => (
                <div key={topic} className="sc-rs-topic-card">
                  <div className="sc-rs-topic-header">
                    <h4>{topic}</h4>
                    <button onClick={() => handleRemoveTopic(topic)}>×</button>
                  </div>
                  <div className="sc-rs-news-list">
                    {news[topic] ? (
                      news[topic].length > 0 ? (
                        news[topic].map((article, i) => (
                          <a key={i} href={article.link} target="_blank" rel="noreferrer" className="sc-rs-news-item">
                            • {article.title}
                          </a>
                        ))
                      ) : (
                        <span className="sc-rs-no-news">No recent news found.</span>
                      )
                    ) : loadingNews ? (
                      <span className="sc-rs-no-news">Loading...</span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
