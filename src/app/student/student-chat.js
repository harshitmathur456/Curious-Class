"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  demoChatMessages,
  suggestedChips,
  topicProgress,
  todaysGoal,
} from "@/data/mockData";
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

const fallbackQuizzes = {
  "salt march": [
    {
      question: "In which year did the Salt March take place?",
      options: ["1920", "1930", "1942", "1947"],
      answerIndex: 1,
      explanation: "The Salt March (also known as the Dandi March) took place from March to April 1930."
    },
    {
      question: "Which Ashram did Gandhi start the Salt March from?",
      options: ["Sabarmati Ashram", "Sevagram Ashram", "Phoenix Settlement", "Tolstoy Farm"],
      answerIndex: 0,
      explanation: "Gandhi started the march from Sabarmati Ashram in Ahmedabad."
    },
    {
      question: "What was the length of the Salt March in miles?",
      options: ["120 miles", "240 miles", "360 miles", "400 miles"],
      answerIndex: 1,
      explanation: "The march spanned 240 miles (approx. 385 km) from Ahmedabad to Dandi."
    },
    {
      question: "Who was the British Viceroy during the Salt March?",
      options: ["Lord Curzon", "Lord Mountbatten", "Lord Irwin", "Lord Chelmsford"],
      answerIndex: 2,
      explanation: "Lord Irwin was the Viceroy of India from 1926 to 1931."
    },
    {
      question: "Which Act gave the British government a monopoly on salt?",
      options: ["The Salt Tax Act", "The Indian Salt Act of 1882", "The Rowlatt Act", "The Dandi Monopoly Act"],
      answerIndex: 1,
      explanation: "The Indian Salt Act of 1882 gave the British government a monopoly on manufacturing and selling salt."
    }
  ],
  "reflection & mirrors": [
    {
      question: "According to the Law of Reflection, the angle of incidence is _______ the angle of reflection.",
      options: ["Greater than", "Less than", "Equal to", "Double of"],
      answerIndex: 2,
      explanation: "The first law of reflection states that the angle of incidence equals the angle of reflection (i = r)."
    },
    {
      question: "Which type of mirror is commonly used as a rear-view mirror in vehicles?",
      options: ["Plane mirror", "Concave mirror", "Convex mirror", "Parabolic mirror"],
      answerIndex: 2,
      explanation: "Convex mirrors diverge light and provide a wider field of view, making them ideal for vehicles."
    },
    {
      question: "The focal length of a plane mirror is:",
      options: ["Zero", "Infinite", "10 cm", "Dependent on distance"],
      answerIndex: 1,
      explanation: "Since a plane mirror has no curvature, its focal point lies at infinity."
    },
    {
      question: "Dentists use which type of mirror to see larger images of teeth?",
      options: ["Plane mirror", "Concave mirror", "Convex mirror", "Double mirror"],
      answerIndex: 1,
      explanation: "Concave mirrors form a magnified, virtual, and erect image when objects are placed close to them."
    },
    {
      question: "What is the speed of light in a vacuum?",
      options: ["3,000 km/s", "300,000 km/s", "30,000 km/s", "3,000,000 km/s"],
      answerIndex: 1,
      explanation: "Light travels at approximately 300,000 km/s (or 3 x 10^8 m/s) in a vacuum."
    }
  ],
  "linear equations": [
    {
      question: "What is the value of x in the equation: 2x + 5 = 15?",
      options: ["x = 5", "x = 10", "x = 15", "x = 20"],
      answerIndex: 0,
      explanation: "Subtract 5 from both sides: 2x = 10. Divide by 2: x = 5."
    },
    {
      question: "If 3x - 7 = x + 9, what is the value of x?",
      options: ["x = 4", "x = 8", "x = 10", "x = 16"],
      answerIndex: 1,
      explanation: "Subtract x from both sides: 2x - 7 = 9. Add 7: 2x = 16. Divide by 2: x = 8."
    },
    {
      question: "The equation y = mx + c represents a:",
      options: ["Quadratic curve", "Straight line", "Circle", "Parabola"],
      answerIndex: 1,
      explanation: "y = mx + c is the slope-intercept form representing a straight line (linear equation)."
    },
    {
      question: "In the expression 4x + 3, what is 'x' called?",
      options: ["Constant", "Coefficient", "Variable", "Exponent"],
      answerIndex: 2,
      explanation: "'x' is a variable because its value can change. '4' is the coefficient, and '3' is the constant."
    },
    {
      question: "If a number is multiplied by 3 and then increased by 7, the result is 22. What is the number?",
      options: ["x = 3", "x = 5", "x = 7", "x = 9"],
      answerIndex: 1,
      explanation: "Let the number be x. 3x + 7 = 22. Subtract 7: 3x = 15. Divide by 3: x = 5."
    }
  ]
};

/* ─── Reasoning depth level from messages ────────────────────── */
function getReasoningLevel(messages) {
  const studentMsgs = messages.filter((m) => m.sender === "student");
  if (studentMsgs.length >= 3) return { level: 3, max: 4, label: "Connecting ideas" };
  if (studentMsgs.length >= 2) return { level: 2, max: 4, label: "Building reasoning" };
  if (studentMsgs.length >= 1) return { level: 1, max: 4, label: "Getting started" };
  return { level: 0, max: 4, label: "Not started" };
}

/* ─── Simulated AI follow-up responses ───────────────────────── */
const aiFollowUps = [
  {
    mode: "follow-up",
    text: "That's a thoughtful response! You're making good connections. Now let me push you a bit further — how does this relate to the broader context of civil disobedience as a strategy? Can you think of another example from history where everyday items became symbols of resistance?",
  },
  {
    mode: "explano",
    text: "Interesting perspective, but here's a counter-argument: some historians argue that the Salt March was actually a **failure** in its immediate goals — the Salt Act wasn't repealed until much later. So was the real power of the march in changing the law, or in changing people's minds? What do you think matters more for a movement?",
  },
  {
    mode: "follow-up",
    text: "Excellent reasoning! You've shown you can think beyond the surface. Let's zoom out: how do the strategies we've discussed — symbolic protest, legal defiance, mass participation — connect to how change happens in your own community today?",
  },
];

const SUBJECT_CONFIGS = {
  history: {
    title: "History",
    goal: {
      topic: "Salt March & Civil Disobedience",
      objective: "Understand why Gandhi chose salt as a symbol and connect historical protest to modern movements."
    },
    progress: [
      { id: 1, label: "Causes of Civil Disobedience", status: "completed" },
      { id: 2, label: "The Salt March", status: "active" },
      { id: 3, label: "Impact & Legacy", status: "upcoming" }
    ],
    chips: [
      "Maybe to show defiance?",
      "Petitions didn't work before...",
      "Taki sab log jud sakein?"
    ],
    taughtTopics: ["Causes of Civil Disobedience", "The Salt March"],
    upcomingClasses: ["Impact & Legacy", "Quit India Movement"],
    initialMessages: demoChatMessages,
    defaultActiveTopic: "Salt March"
  },
  physics: {
    title: "Physics",
    goal: {
      topic: "Reflection & Mirrors",
      objective: "Understand how light behaves when striking different surfaces and connect reflection to everyday mirrors."
    },
    progress: [
      { id: 1, label: "Properties of Light", status: "completed" },
      { id: 2, label: "Reflection & Mirrors", status: "active" },
      { id: 3, label: "Refraction & Lenses", status: "upcoming" }
    ],
    chips: [
      "Because of our eyes?",
      "It's about the mirror's flat surface?",
      "Left-right symmetry?"
    ],
    taughtTopics: ["Properties of Light", "Reflection & Mirrors"],
    upcomingClasses: ["Refraction & Lenses", "Prisms & Rainbows"],
    initialMessages: [
      {
        id: 1,
        sender: "ai",
        mode: "question",
        text: "Welcome! Today we're exploring **Reflection and Mirrors**. Let's start with a puzzle: when you look in a mirror, your left hand looks like your right hand. But why doesn't your head look like your feet? Why does the mirror invert left-to-right but not top-to-bottom?",
        timestamp: "10:02 AM"
      },
      {
        id: 2,
        sender: "student",
        text: "Because mirrors flip things horizontally, not vertically.",
        timestamp: "10:03 AM"
      },
      {
        id: 3,
        sender: "ai",
        mode: "explano",
        text: "That's how we describe it, but *why* does it choose the horizontal axis? A mirror doesn't know what 'horizontal' is. If you turn the mirror 90 degrees, does it start flipping your head and feet? What is the mirror *actually* doing to the light rays?",
        timestamp: "10:04 AM"
      }
    ],
    defaultActiveTopic: "Reflection & Mirrors"
  },
  mathematics: {
    title: "Mathematics",
    goal: {
      topic: "Linear Equations",
      objective: "Learn to model real-world word problems using mathematical equations and solve for the unknown variable."
    },
    progress: [
      { id: 1, label: "Algebraic Expressions", status: "completed" },
      { id: 2, label: "Solving Basic Equations", status: "active" },
      { id: 3, label: "Word Problems & Applications", status: "upcoming" }
    ],
    chips: [
      "x + 5 = 2x - 3?",
      "Is x the number of mangoes?",
      "I need a hint..."
    ],
    taughtTopics: ["Algebraic Expressions", "Solving Basic Equations"],
    upcomingClasses: ["Word Problems & Applications", "Graphing Linear Equations"],
    initialMessages: [
      {
        id: 1,
        sender: "ai",
        mode: "question",
        text: "Welcome! Today we're exploring **Linear Equations**. Imagine you have a mystery box of mangoes. If you add 5 mangoes to it, you get double what you had minus 3 mangoes. How would you write this relationship as a mathematical equation? What does the variable represent?",
        timestamp: "10:02 AM"
      },
      {
        id: 2,
        sender: "student",
        text: "The equation would be x + 5 = 2x - 3. And x is the original number of mangoes.",
        timestamp: "10:03 AM"
      },
      {
        id: 3,
        sender: "ai",
        mode: "explano",
        text: "Spot on with the equation! But let's look closer: you wrote `2x - 3` for 'double what you had minus 3'. Why didn't you write `2(x - 3)`? What's the difference between double of (mangoes minus 3) and (double of mangoes) minus 3? How does grouping change the problem?",
        timestamp: "10:04 AM"
      }
    ],
    defaultActiveTopic: "Linear Equations"
  }
};

/* ─── Main Component ─────────────────────────────────────────── */

export default function StudentChat({ subject = "history" }) {
  const config = SUBJECT_CONFIGS[subject] || SUBJECT_CONFIGS.history;

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
  
  const [activeTopic, setActiveTopic] = useState("");

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

  // Initialize/reset states when subject changes
  useEffect(() => {
    setMessages(config.initialMessages);
    setActiveTopic(config.defaultActiveTopic);
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
  }, [subject]);

  useEffect(() => {
    fetchSharedNotes();
  }, [subject]);

  async function fetchSharedNotes() {
    setLoadingNotes(true);
    try {
      const res = await fetch(`/api/notes?subject=${subject}`);
      if (res.ok) {
        const data = await res.json();
        setSharedNotes(data);
      }
    } catch (e) {
      console.error("Failed to fetch shared notes:", e);
    } finally {
      setLoadingNotes(false);
    }
  }

  async function handleStartQuiz() {
    setLoadingQuiz(true);
    setQuizActive(true);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setAnswerSubmitted(false);
    setSelectedOptionIndex(null);
    setQuizScore(0);

    try {
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

      const data = await res.json();
      if (Array.isArray(data) && data.length === 5) {
        setQuizQuestions(data);
      } else {
        throw new Error("Invalid quiz format received");
      }
    } catch (e) {
      console.error("Failed to generate custom quiz with Gemini, using high-quality local quiz:", e);
      // Fallback to local high-quality quiz matching current active topic
      const topicKey = activeTopic.toLowerCase();
      let questions = fallbackQuizzes[topicKey];
      if (!questions) {
        if (subject === "physics") {
          questions = fallbackQuizzes["reflection & mirrors"];
        } else if (subject === "mathematics") {
          questions = fallbackQuizzes["linear equations"];
        } else {
          questions = fallbackQuizzes["salt march"];
        }
      }
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
    setActiveTopic(topic);
    setMessages([
      {
        id: 1,
        sender: "ai",
        mode: "question",
        text: `Welcome! Today we're exploring **${topic}**. What do you already know about this topic, and what are you most curious to learn?`,
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
      }
    ]);
    setFollowUpIndex(0);
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
      const aiResponse = aiFollowUps[followUpIndex % aiFollowUps.length];
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
              <div className="sc-logo-tagline">Think deeper</div>
            </div>
          </div>

          {/* Subjects Navigation */}
          <div className="sc-subject-nav">
            <div className="sc-subject-nav-label">Subjects</div>
            <div className="sc-subject-nav-links">
              <Link href="/student" className={`sc-subject-link ${subject === "history" ? "sc-subject-link--active" : ""}`}>
                📜 History
              </Link>
              <Link href="/student/physics" className={`sc-subject-link ${subject === "physics" ? "sc-subject-link--active" : ""}`}>
                ⚡ Physics
              </Link>
              <Link href="/student/mathematics" className={`sc-subject-link ${subject === "mathematics" ? "sc-subject-link--active" : ""}`}>
                📐 Mathematics
              </Link>
            </div>
          </div>

          {/* Today's Goal */}
          <div className="sc-goal-card">
            <div className="sc-goal-header">
              <span className="sc-goal-icon"><FlagIcon /></span>
              <span className="sc-goal-label">Today&apos;s goal</span>
            </div>
            <div className="sc-goal-topic">{config.goal.topic}</div>
            <div className="sc-goal-objective">{config.goal.objective}</div>
          </div>

          {/* Topic Progress */}
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
        </div>

        <button
          className="sc-quiz-btn"
          id="start-quiz-btn"
          onClick={handleStartQuiz}
          disabled={loadingQuiz}
        >
          <QuizIcon />
          <span>{loadingQuiz ? "Loading Quiz..." : "Start Topic Quiz"}</span>
        </button>
      </aside>

      <main className="sc-main">
        {quizActive ? (
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
          ) : sharedNotes.length === 0 ? (
            <span style={{ fontSize: "11px", color: "var(--color-text-tertiary)" }}>No shared notes yet.</span>
          ) : (
            <div className="sc-rs-notes-list">
              {sharedNotes.map((note) => (
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
    </div>
  );
}
