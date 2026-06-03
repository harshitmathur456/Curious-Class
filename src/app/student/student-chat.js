"use client";

import { useState, useRef, useEffect } from "react";
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

/* ─── Main Component ─────────────────────────────────────────── */

export default function StudentChat() {
  const [messages, setMessages] = useState(demoChatMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const [followUpIndex, setFollowUpIndex] = useState(0);

  const [trackedTopics, setTrackedTopics] = useState([]);
  const [topicInput, setTopicInput] = useState("");
  const [news, setNews] = useState({});
  const [loadingNews, setLoadingNews] = useState(false);
  
  const [activeTopic, setActiveTopic] = useState("Salt March");

  const [sharedNotes, setSharedNotes] = useState([]);
  const [loadingNotes, setLoadingNotes] = useState(true);

  useEffect(() => {
    fetchSharedNotes();
  }, []);

  async function fetchSharedNotes() {
    try {
      const res = await fetch("/api/notes");
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

          {/* Today's Goal */}
          <div className="sc-goal-card">
            <div className="sc-goal-header">
              <span className="sc-goal-icon"><FlagIcon /></span>
              <span className="sc-goal-label">Today&apos;s goal</span>
            </div>
            <div className="sc-goal-topic">{todaysGoal.topic}</div>
            <div className="sc-goal-objective">{todaysGoal.objective}</div>
          </div>

          {/* Topic Progress */}
          <div className="sc-progress">
            <div className="sc-progress-label">Topic progress</div>
            <div className="sc-progress-steps">
              {topicProgress.map((step, i) => (
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
                  {i < topicProgress.length - 1 && <div className="sc-step-line" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        <button className="sc-past-chats-btn" id="view-past-chats">
          <HistoryIcon />
          <span>View past chats</span>
        </button>
      </aside>

      {/* ── Main Chat Area ── */}
      <main className="sc-main">
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
            {suggestedChips.map((chip) => (
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
      </main>

      {/* ── Right Sidebar (Knowledge Hub) ── */}
      <aside className="sc-right-sidebar">
        <h2 className="sc-rs-title">Knowledge Hub</h2>
        
        <div className="sc-rs-section">
          <h3 className="sc-rs-subtitle">Taught by Teacher</h3>
          <ul className="sc-rs-list">
            <li onClick={() => handleTopicSelect("Causes of Civil Disobedience")} style={{cursor: "pointer"}}>Causes of Civil Disobedience</li>
            <li onClick={() => handleTopicSelect("The Salt March")} style={{cursor: "pointer"}}>The Salt March</li>
          </ul>
        </div>

        <div className="sc-rs-section">
          <h3 className="sc-rs-subtitle">Upcoming Classes</h3>
          <ul className="sc-rs-list">
            <li onClick={() => handleTopicSelect("Impact & Legacy")} style={{cursor: "pointer"}}>Impact & Legacy</li>
            <li onClick={() => handleTopicSelect("Quit India Movement")} style={{cursor: "pointer"}}>Quit India Movement</li>
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
