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

function MicIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
      <line x1="12" y1="19" x2="12" y2="23"/>
      <line x1="8" y1="23" x2="16" y2="23"/>
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

export default function StudentChat({ subject = null, isCuriousCorner = false }) {
  const [currentSubject, setCurrentSubject] = useState(subject);
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
    const isC7 = cls && cls.includes("7");
    if (subj === "mathematics" && isC10) return "mathematics_class10";
    if (subj === "science" && isC10) return "science_class10";
    if (subj === "history" && isC10) return "history_class10";
    if (subj === "science" && isC6) return "science_class6";
    if (subj === "history" && isC6) return "history_class6";
    if (subj === "history" && isC7) return "history_class7";
    if (subj === "science" && isC7) return "science_class7";
    return subj;
  }



  const isClass10 = selectedClass && selectedClass.includes("10");
  const isClass6 = selectedClass && selectedClass.includes("6");
  const isClass7 = selectedClass && selectedClass.includes("7");
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
  } else if (isClass7) {
    if (currentSubject === "history") {
      subjectKey = "history_class7";
    } else if (currentSubject === "science") {
      subjectKey = "science_class7";
    }
  }

  const allChapters = CHAPTERS_DATA[subjectKey]?.chapters || [];
  const activeChapter = allChapters.find((c) => c.name === activeTopic);
  const activeIndex = activeTopic ? allChapters.findIndex((c) => c.name === activeTopic) : -1;
  const taughtTopics = activeIndex >= 0 ? allChapters.slice(0, activeIndex).map((c) => c.name) : [];
  const upcomingClasses = activeIndex >= 0 ? allChapters.slice(activeIndex + 1).map((c) => c.name) : allChapters.map((c) => c.name);

  const activeChapterId = activeChapter?.id;

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
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
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

  // Curriculum and Pushed Quizzes States
  const [curriculumData, setCurriculumData] = useState({});
  const [pushedQuizzes, setPushedQuizzes] = useState([]);
  const [activeQuizTopic, setActiveQuizTopic] = useState("");

  // Load tracked topics from localStorage or initialize with defaults on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("trackedTopics");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setTrackedTopics(parsed);
            // Fetch news for each topic
            parsed.forEach((topic) => {
              fetchNewsForTopic(topic);
            });
            return;
          }
        } catch (e) {
          console.error("Failed to parse trackedTopics", e);
        }
      }
      
      // Default fallback topics
      const defaultTopics = ["Space", "Artificial Intelligence", "Climate Change"];
      setTrackedTopics(defaultTopics);
      localStorage.setItem("trackedTopics", JSON.stringify(defaultTopics));
      defaultTopics.forEach((topic) => {
        fetchNewsForTopic(topic);
      });
    }
  }, []);

  // Initialize/reset states when subject changes
  useEffect(() => {
    setActiveTopic("");
    setMessages([]);
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
    setCurriculumData({});
    setPushedQuizzes([]);
    setActiveQuizTopic("");
  }, [currentSubject]);

  // Derived computations - MUST be after state declarations
  const chapterCurriculum = curriculumData[activeChapterId] || { status: 'pending', topics: [] };
  const chapterTopics = chapterCurriculum.topics || [];
  const topicsWithQuizzes = chapterTopics.map(topic => {
    const hasQuiz = pushedQuizzes.some(q => q.topic === topic.name);
    return { ...topic, hasQuiz };
  });

  const filteredNotes = activeTopic
    ? (sharedNotes.some(note => note.fileName && note.fileName.toLowerCase().endsWith(`_ch${activeIndex + 1}.pdf`))
        ? sharedNotes.filter(note => note.fileName && note.fileName.toLowerCase().endsWith(`_ch${activeIndex + 1}.pdf`))
        : sharedNotes)
    : sharedNotes;

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

  // Fetch curriculum and pushed quizzes for student
  useEffect(() => {
    let active = true;

    async function fetchCurriculumAndQuizzes() {
      if (!selectedClass) return;
      try {
        // Fetch curriculum
        const currRes = await fetch(`/api/curriculum?subject=${subjectKey}`);
        if (currRes.ok && active) {
          const currData = await currRes.json();
          setCurriculumData(currData);
        }

        // Fetch pushed quizzes
        const subjectTitle = CHAPTERS_DATA[subjectKey]?.title || currentSubject;
        const quizRes = await fetch(`/api/pushed_quizzes?subject=${encodeURIComponent(subjectTitle)}&class_name=${encodeURIComponent(selectedClass)}`);
        if (quizRes.ok && active) {
          const quizData = await quizRes.json();
          setPushedQuizzes(quizData.quizzes || []);
        }
      } catch (e) {
        console.error("Failed to fetch curriculum or quizzes:", e);
      }
    }

    fetchCurriculumAndQuizzes();

    return () => {
      active = false;
    };
  }, [subjectKey, selectedClass]);

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

  async function handleStartQuiz(topicName) {
    const quizTopicToFetch = topicName || activeTopic;
    setActiveQuizTopic(quizTopicToFetch);
    setQuizActive(true);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setAnswerSubmitted(false);
    setSelectedOptionIndex(null);
    setQuizScore(0);

    const cached = cachedQuizzes[quizTopicToFetch];
    if (cached) {
      console.log(`[Quiz] Loading quiz for "${quizTopicToFetch}" instantly from cache.`);
      setQuizQuestions(cached);
      setLoadingQuiz(false);
      return;
    }

    setLoadingQuiz(true);
    console.log(`[Quiz] Cache miss. Loading pushed quiz for "${quizTopicToFetch}"...`);

    try {
      const subjectTitle = CHAPTERS_DATA[subjectKey]?.title || currentSubject;
      const res = await fetch(`/api/pushed_quizzes?subject=${encodeURIComponent(subjectTitle)}&topic=${encodeURIComponent(quizTopicToFetch)}&class_name=${encodeURIComponent(selectedClass)}`);

      if (!res.ok) {
        throw new Error("Failed to fetch pushed quiz");
      }

      const resData = await res.json();
      const data = resData.quiz ? resData.quiz.quiz_data : null;

      if (Array.isArray(data) && data.length === 5) {
        setQuizQuestions(data);
        setCachedQuizzes((prev) => ({ ...prev, [quizTopicToFetch]: data }));
      } else {
        alert("The teacher has not pushed a quiz for this topic yet.");
        setQuizActive(false);
      }
    } catch (e) {
      console.error("Failed to load pushed quiz:", e);
      alert("The teacher has not pushed a quiz for this topic yet.");
      setQuizActive(false);
    } finally {
      setLoadingQuiz(false);
    }
  }

  function handleSelectOption(index) {
    if (answerSubmitted) return;
    setSelectedOptionIndex(index);
  }

  async function logActivity(activityType, details, customTopic) {
    if (typeof window === "undefined") return;
    const sName = localStorage.getItem("studentName") || "Unknown Student";
    const sRoll = localStorage.getItem("rollNumber") || "Unknown Roll";
    try {
      await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_roll: sRoll,
          student_name: sName,
          class_name: selectedClass,
          activity_type: activityType,
          topic: customTopic || activeTopic,
          details: {
            ...details,
            subject_key: subjectKey
          }        })
      });
    } catch (e) {
      console.error("Failed to log activity", e);
    }
  }

  function handleSubmitAnswer() {
    if (selectedOptionIndex === null || answerSubmitted) return;
    
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const isCorrect = selectedOptionIndex === currentQuestion.answerIndex;
    
    let newScore = quizScore;
    if (isCorrect) {
      newScore = quizScore + 1;
      setQuizScore(newScore);
    }
    
    setUserAnswers((prev) => [...prev, selectedOptionIndex]);
    setAnswerSubmitted(true);

    if (currentQuestionIndex === quizQuestions.length - 1) {
      logActivity('quiz', { score: newScore, total: quizQuestions.length }, activeQuizTopic);
    }
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

    logActivity('chapter_start', { chapter: topic });
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
      const newTopics = [...trackedTopics, t];
      setTrackedTopics(newTopics);
      if (typeof window !== "undefined") {
        localStorage.setItem("trackedTopics", JSON.stringify(newTopics));
      }
      setTopicInput("");
      fetchNewsForTopic(t);
    }
  }

  function handleRemoveTopic(t) {
    const newTopics = trackedTopics.filter((x) => x !== t);
    setTrackedTopics(newTopics);
    if (typeof window !== "undefined") {
      localStorage.setItem("trackedTopics", JSON.stringify(newTopics));
    }
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        // Using en-IN which handles Hinglish (English + Hindi mix) well
        recognitionRef.current.lang = 'en-IN';
        
        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInputValue((prev) => prev ? `${prev} ${transcript}` : transcript);
          setIsListening(false);
        };
        
        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
        };
        
        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
        } catch (e) {
          console.error("Failed to start speech recognition:", e);
        }
      } else {
        alert("Your browser does not support speech recognition. Please try Chrome or Edge.");
      }
    }
  };
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

    logActivity('chat', { message: text });

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
    !currentSubject && !isCuriousCorner ? (
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
      <aside className={`sc-sidebar ${isLeftSidebarOpen ? 'mobile-open' : ''}`}>
        <button className="sc-mobile-toggle" onClick={() => setIsLeftSidebarOpen(false)} style={{ position: 'absolute', right: '10px', top: '10px' }}>✕</button>
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

          {/* Explore Navigation */}
          <div className="sc-subject-nav" style={{ marginTop: "var(--space-lg)" }}>
            <div className="sc-subject-nav-label">Explore</div>
            <div className="sc-subject-nav-links">
              <Link href="/student/curious-corner" className={`sc-subject-link ${isCuriousCorner ? "sc-subject-link--active" : ""}`}>
                📰 Curious Corner
              </Link>
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
        </div>


        {activeTopic && (
          <div className="sc-active-chapter-box">
            <div className="sc-ac-label">Active Chapter</div>
            <div className="sc-ac-name">{activeTopic}</div>
            <button className="sc-change-chapter-btn" onClick={() => setActiveTopic("")}>
              ← Change Chapter
            </button>
          </div>
        )}
      </aside>

      <main className="sc-main" style={(!activeTopic || isCuriousCorner) ? { padding: "var(--space-2xl)", overflowY: "auto" } : {}}>
        <div className="sc-mobile-toggle" style={{ display: 'none', justifyContent: 'space-between', padding: '10px 20px', borderBottom: '1px solid #eee', background: 'white' }}>
          <button onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)} style={{ background: 'none', border: 'none', fontSize: '20px' }}>☰ Menu</button>
          {activeTopic && !isCuriousCorner && <button onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)} style={{ background: 'none', border: 'none', fontSize: '20px' }}>📘 Hub</button>}
        </div>
        {isCuriousCorner ? (
          <div className="sc-curious-corner-view" style={{ maxWidth: "800px", margin: "0 auto", width: "100%" }}>
            <div className="sc-cc-header" style={{ marginBottom: "var(--space-2xl)", borderBottom: "1px solid var(--color-border-light)", paddingBottom: "var(--space-lg)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "var(--space-xs)" }}>
                <span style={{ fontSize: "2rem" }}>🧠</span>
                <h1 style={{ fontSize: "28px", fontWeight: "700", color: "var(--color-primary-dark)", margin: 0 }}>Curious Corner</h1>
              </div>
              <p style={{ fontSize: "14px", color: "var(--color-text-secondary)" }}>
                Explore live news and fuel your curiosity. Track up to 5 topics to get real-time articles.
              </p>
            </div>

            {/* Input Section */}
            <div style={{ 
              background: "white", 
              border: "1px solid var(--color-border-light)", 
              borderRadius: "12px", 
              padding: "var(--space-lg)", 
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
              marginBottom: "var(--space-2xl)"
            }}>
              <h3 style={{ fontSize: "14px", fontWeight: "600", color: "var(--color-text-primary)", marginBottom: "var(--space-sm)" }}>
                Add Topic to Track
              </h3>
              <div style={{ display: "flex", gap: "10px" }}>
                <input 
                  type="text" 
                  placeholder="E.g., Chandrayaan, Renewable Energy, Robotics..." 
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddTopic();
                  }}
                  disabled={trackedTopics.length >= 5}
                  style={{ 
                    flex: 1, 
                    padding: "10px 16px", 
                    border: "1px solid var(--color-border-medium)", 
                    borderRadius: "8px", 
                    fontSize: "14px",
                    background: trackedTopics.length >= 5 ? "#f5f5f5" : "white"
                  }}
                />
                <button 
                  onClick={handleAddTopic} 
                  disabled={!topicInput.trim() || trackedTopics.length >= 5}
                  style={{ 
                    padding: "0 24px", 
                    background: "var(--color-primary)", 
                    color: "white", 
                    border: "none", 
                    borderRadius: "8px", 
                    cursor: "pointer", 
                    fontWeight: "600",
                    transition: "all 0.2s",
                    opacity: (!topicInput.trim() || trackedTopics.length >= 5) ? 0.6 : 1
                  }}
                >
                  Add Topic
                </button>
              </div>
              <p style={{ fontSize: "12px", color: "var(--color-text-tertiary)", marginTop: "8px" }}>
                {trackedTopics.length}/5 topics tracked. {trackedTopics.length >= 5 && "Remove a topic to add a new one."}
              </p>
            </div>

            {/* Topics Grid */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {trackedTopics.map(topic => (
                <div key={topic} style={{ 
                  background: "white", 
                  border: "1px solid var(--color-border-light)", 
                  borderRadius: "12px", 
                  padding: "var(--space-lg)", 
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid #f5f5f5", paddingBottom: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "1.2rem" }}>🔍</span>
                      <h2 style={{ margin: 0, fontSize: "18px", color: "var(--color-primary-dark)", fontWeight: "600" }}>{topic}</h2>
                    </div>
                    <button 
                      onClick={() => handleRemoveTopic(topic)} 
                      style={{ 
                        background: "var(--color-red-bg)", 
                        color: "var(--color-red-text)", 
                        border: "none", 
                        padding: "6px 12px",
                        borderRadius: "6px",
                        cursor: "pointer", 
                        fontSize: "12px",
                        fontWeight: "500"
                      }}
                    >
                      Remove
                    </button>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {news[topic] ? (
                      news[topic].length > 0 ? (
                        news[topic].map((article, i) => (
                          <a 
                            key={i} 
                            href={article.link} 
                            target="_blank" 
                            rel="noreferrer" 
                            style={{ 
                              display: "block",
                              padding: "12px",
                              borderRadius: "8px",
                              background: "#fafafa",
                              border: "1px solid #f0f0f0",
                              transition: "all 0.2s",
                              textDecoration: "none"
                            }}
                            className="cc-news-card"
                          >
                            <div style={{ fontWeight: "600", fontSize: "14px", color: "var(--color-text-primary)", marginBottom: "4px" }}>
                              {article.title}
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", color: "var(--color-text-tertiary)" }}>
                              <span>Source: {article.source}</span>
                              <span>{article.pubDate ? new Date(article.pubDate).toLocaleDateString() : ""}</span>
                            </div>
                          </a>
                        ))
                      ) : (
                        <div style={{ textAlign: "center", padding: "20px", color: "var(--color-text-tertiary)", fontStyle: "italic" }}>
                          No recent news found for this topic. Try another search.
                        </div>
                      )
                    ) : loadingNews ? (
                      <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
                        <div className="sc-typing-dots">
                          <span /><span /><span />
                        </div>
                      </div>
                    ) : (
                      <div style={{ textAlign: "center", padding: "20px", color: "var(--color-text-tertiary)", fontStyle: "italic" }}>
                        Waiting to load...
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {trackedTopics.length === 0 && (
                <div style={{ textAlign: "center", padding: "40px", background: "white", border: "1px dashed var(--color-border-medium)", borderRadius: "12px" }}>
                  <span style={{ fontSize: "3rem" }}>📰</span>
                  <h3 style={{ fontSize: "16px", color: "var(--color-text-primary)", marginTop: "12px", marginBottom: "8px" }}>No topics added yet</h3>
                  <p style={{ fontSize: "14px", color: "var(--color-text-secondary)", maxWidth: "400px", margin: "0 auto" }}>
                    Add your favorite topics above to start tracking latest news articles!
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : !activeTopic ? (
          <div className="sc-topic-select-view">
            <div className="sc-tsv-header">
              <h1>Select a Chapter</h1>
              <p>Choose a chapter to begin your Socratic discussion with Explano.</p>
            </div>
            
            <div className="sc-tsv-grid">
              {allChapters.map((chapter) => (
                  <button
                    key={chapter.id}
                    className="sc-tsv-card"
                    onClick={() => handleTopicSelect(chapter.name)}
                  >
                    <div className="sc-tsv-card-icon">📚</div>
                    <div className="sc-tsv-card-info">
                      <h3>{chapter.name}</h3>
                      <p>{chapter.objective}</p>
                    </div>
                    <div className="sc-tsv-card-arrow">→</div>
                  </button>
              ))}
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
                  onClick={toggleListening}
                  title="Voice Input (Hindi/English)"
                  style={{
                    background: isListening ? '#f44336' : 'var(--color-primary-light)',
                    color: isListening ? 'white' : 'var(--color-primary)',
                    marginRight: '8px',
                    transition: 'all 0.3s ease'
                  }}
                  aria-label="Toggle voice input"
                >
                  <MicIcon />
                </button>
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
      {activeTopic && !isCuriousCorner && (
        <aside className={`sc-right-sidebar ${isRightSidebarOpen ? 'mobile-open' : ''}`}>
          <button className="sc-mobile-toggle" onClick={() => setIsRightSidebarOpen(false)} style={{ position: 'absolute', right: '10px', top: '10px' }}>✕</button>
          <h2 className="sc-rs-title">Knowledge Hub</h2>

          {/* Quizzes Section */}
          <div className="sc-rs-section" style={{ background: '#f5fcf8', border: '1px solid #d4ebd9', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
            <h3 className="sc-rs-subtitle" style={{ color: 'var(--color-primary-dark)', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px' }}>📋 Quizzes Pushed by Teacher</h3>
            {topicsWithQuizzes.length === 0 ? (
              <p style={{ fontSize: '12px', color: '#666', margin: 0, fontStyle: 'italic' }}>No topics defined by teacher yet.</p>
            ) : (
              <ul className="sc-rs-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: 0, listStyle: 'none' }}>
                {topicsWithQuizzes.map((t) => (
                  <li 
                    key={t.id} 
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      padding: '8px 12px', 
                      background: 'white', 
                      border: '1px solid var(--color-border-light)', 
                      borderRadius: '8px',
                      fontSize: '13px'
                    }}
                  >
                    <span style={{ fontWeight: '500', color: '#333' }}>{t.name}</span>
                    {t.hasQuiz ? (
                      <button 
                        onClick={() => handleStartQuiz(t.name)}
                        style={{ 
                          padding: '4px 10px', 
                          background: 'var(--color-primary)', 
                          color: 'white', 
                          border: 'none', 
                          borderRadius: '6px', 
                          cursor: 'pointer', 
                          fontSize: '11px',
                          fontWeight: '600'
                        }}
                      >
                        Start Quiz
                      </button>
                    ) : (
                      <span style={{ fontSize: '11px', color: '#999', fontStyle: 'italic' }}>Quiz Pending</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
          
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


        </aside>
      )}
    </div>
  );
}
