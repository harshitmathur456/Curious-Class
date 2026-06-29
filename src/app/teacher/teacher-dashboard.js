"use client";

import { useState, useEffect, useRef } from "react";
import {
  dashboardStats,
  currentUnit,
  heatmapSubtopics,
} from "@/data/mockData";
import { CHAPTERS_DATA } from "@/data/chaptersData";
import "./teacher-dashboard.css";

/* ─── Icons ──────────────────────────────────────────────────── */

function GridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}

function BookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  );
}

function CpuIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/>
      <line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/>
      <line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/>
      <line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/>
      <line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/>
    </svg>
  );
}

function BarChartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>
    </svg>
  );
}

function HelpIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  );
}

function LogOutIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  );
}

const iconMap = {
  grid: GridIcon,
  users: UsersIcon,
  book: BookIcon,
  cpu: CpuIcon,
  "bar-chart": BarChartIcon,
};

/* ─── Heatmap color helper ───────────────────────────────────── */
function getHeatmapColor(score) {
  if (score >= 80) return "var(--heatmap-100)";
  if (score >= 40) return "var(--heatmap-50)";
  return "var(--heatmap-0)";
}

function getHeatmapBorder(score) {
  if (score < 40) return "0.5px solid var(--color-bg-mint-border)";
  return "none";
}

/* ─── Notes Icons ────────────────────────────────────────────── */

function PdfIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  );
}

function CloudUploadIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.2 15c.1-.4.1-.9.1-1.3C21.3 9.9 18 6.6 14 6.6c-1.3 0-2.5.4-3.6 1-1.1-2.3-3.4-4-6.2-4C1.9 3.6.1 5.4.1 7.7c0 .5.1.9.2 1.3C.1 9.4 0 9.8 0 10.3c0 3.7 3 6.7 6.7 6.7h13.4c2.8 0 5-2.2 5-5 0-.8-.2-1.5-.7-2"/>
      <polyline points="16 11 12 7 8 11"/>
      <line x1="12" y1="7" x2="12" y2="17"/>
    </svg>
  );
}

/* ─── Teacher Nav Items ──────────────────────────────────────────── */
const teacherNavItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'grid', href: '/teacher' },
  { id: 'students', label: 'Students', icon: 'users', href: '/teacher' },
  { id: 'notes', label: 'Notes', icon: 'book', href: '/teacher' },
  { id: 'quizzes', label: 'Quizzes', icon: 'cpu', href: '/teacher' },
  { id: 'reports', label: 'Reports', icon: 'bar-chart', href: '/teacher' },
];

/* ─── Main Component ─────────────────────────────────────────── */

export default function TeacherDashboard() {
  const [selectedClass, setSelectedClass] = useState("Class 8-B");
  const [subject, setSubject] = useState("history");

  const isClass10 = selectedClass && selectedClass.includes("10");
  const isClass6 = selectedClass && selectedClass.includes("6");
  let subjectKey = subject;
  if (isClass10) {
    if (subject === "mathematics") {
      subjectKey = "mathematics_class10";
    } else if (subject === "science") {
      subjectKey = "science_class10";
    } else if (subject === "history") {
      subjectKey = "history_class10";
    }
  } else if (isClass6) {
    if (subject === "science") {
      subjectKey = "science_class6";
    } else if (subject === "history") {
      subjectKey = "history_class6";
    }
  }

  const [activeNav, setActiveNav] = useState("dashboard");
  const [expandedAlerts, setExpandedAlerts] = useState({});
  const [selectedTopic, setSelectedTopic] = useState("");
  
  // Dynamic student data
  const [studentRoster, setStudentRoster] = useState([]);
  const [heatmapStudents, setHeatmapStudents] = useState([]);
  const [focusAlerts, setFocusAlerts] = useState([]);
  const [studentActivities, setStudentActivities] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const cls = localStorage.getItem("selectedClass");
      if (cls) {
        setSelectedClass(cls);
        let sub = "history";
        if (cls.includes("10")) {
          sub = "mathematics";
        }
        setSubject(sub);
        const isC10 = cls.includes("10");
        const isC6 = cls.includes("6");
        const subKey = (sub === "mathematics" && isC10) ? "mathematics_class10" :
                       (sub === "science" && isC10) ? "science_class10" :
                       (sub === "history" && isC10) ? "history_class10" :
                       (sub === "science" && isC6) ? "science_class6" :
                       (sub === "history" && isC6) ? "history_class6" : sub;
        const chapters = CHAPTERS_DATA[subKey]?.chapters || [];
        if (chapters.length > 0) {
          setSelectedTopic(chapters[0].name);
        }
      } else {
        const chapters = CHAPTERS_DATA["history"]?.chapters || [];
        if (chapters.length > 0) {
          setSelectedTopic(chapters[0].name);
        }
      }
    }
  }, []);

  const [notes, setNotes] = useState([]);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [uploadTitle, setUploadTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ text: "", type: "" });

  const [quizTopic, setQuizTopic] = useState("");
  const [generatingQuiz, setGeneratingQuiz] = useState(false);
  const [pushedQuiz, setPushedQuiz] = useState(null);
  const [quizStatus, setQuizStatus] = useState("");

  const subjectKeyRef = useRef(subjectKey);
  useEffect(() => {
    subjectKeyRef.current = subjectKey;
  }, [subjectKey]);

  useEffect(() => {
    fetchNotes();
  }, [subjectKey]);

  useEffect(() => {
    fetchStudents();
  }, []);

  async function fetchStudents() {
    try {
      // 1. Fetch Students
      const res = await fetch('/api/students');
      if (res.ok) {
        const data = await res.json();
        const students = data.students || [];
        
        // Populate Roster
        const roster = students.map(s => ({
          id: s.id,
          name: s.name,
          rollNo: s.roll_number,
          lastActive: 'Just now'
        }));
        setStudentRoster(roster);

        // Populate Heatmap with fake scores for now
        const heatmap = students.map(s => ({
          name: s.name,
          scores: [
            Math.floor(Math.random() * 60) + 40,
            Math.floor(Math.random() * 60) + 40,
            Math.floor(Math.random() * 60) + 40,
            Math.floor(Math.random() * 60) + 40
          ]
        }));
        setHeatmapStudents(heatmap);

        // Populate Focus Alerts
        const alerts = students.slice(0, 3).map((s, idx) => ({
          id: s.id,
          student: s.name,
          timeAgo: `${(idx + 1) * 5}m ago`,
          description: idx === 0 ? 'Struggling with cause-effect logic.' : 'Missed sequence in recent exercise.',
          priority: idx === 0 ? 'urgent' : 'low',
          aiInsight: 'Needs a quick check-in to confirm understanding of recent material.',
        }));
        setFocusAlerts(alerts);
      }

      // 2. Fetch Activities
      if (selectedClass) {
        const actRes = await fetch(`/api/activities?class_name=${encodeURIComponent(selectedClass)}`);
        if (actRes.ok) {
          const actData = await actRes.json();
          setStudentActivities(actData.activities || []);
        }
      }
    } catch (e) {
      console.error("Failed to fetch students/activities:", e);
    }
  }

  async function fetchNotes() {
    const activeSubjectKey = subjectKey;
    setLoadingNotes(true);
    try {
      const res = await fetch(`/api/notes?subject=${activeSubjectKey}`);
      if (res.ok) {
        const data = await res.json();
        if (activeSubjectKey === subjectKeyRef.current) {
          setNotes(data);
        }
      }
    } catch (e) {
      console.error("Failed to fetch notes:", e);
    } finally {
      if (activeSubjectKey === subjectKeyRef.current) {
        setLoadingNotes(false);
      }
    }
  }

  async function handleUpload(e) {
    e.preventDefault();
    if (!selectedFile) {
      setStatusMsg({ text: "Please select a PDF file first.", type: "error" });
      return;
    }

    setUploading(true);
    setStatusMsg({ text: "", type: "" });

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("title", uploadTitle);
    formData.append("subject", subjectKey);

    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMsg({ text: "Note uploaded and shared successfully!", type: "success" });
        setUploadTitle("");
        setSelectedFile(null);
        fetchNotes();
      } else {
        setStatusMsg({ text: data.error || "Failed to upload note.", type: "error" });
      }
    } catch (error) {
      console.error(error);
      setStatusMsg({ text: "Network error. Failed to upload note.", type: "error" });
    } finally {
      setUploading(false);
    }
  }

  function toggleAlert(id) {
    setExpandedAlerts((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  async function handleGenerateAndPushQuiz() {
    if (!quizTopic) {
      setQuizStatus("Please select a topic first.");
      return;
    }
    setGeneratingQuiz(true);
    setQuizStatus("Generating & Pushing quiz using Gemini...");
    setPushedQuiz(null);
    try {
      const res = await fetch("/api/pushed_quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: subject,
          topic: quizTopic,
          class_name: selectedClass
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPushedQuiz(data.quiz);
        setQuizStatus("Quiz pushed successfully to all students!");
      } else {
        setQuizStatus("Failed to push quiz: " + (data.error || "Unknown error"));
      }
    } catch (e) {
      setQuizStatus("Error pushing quiz");
      console.error(e);
    } finally {
      setGeneratingQuiz(false);
    }
  }

  return (
    <div className="td-layout">
      {/* ── Left Navigation ── */}
      <nav className="td-nav">
        <div className="td-nav-top">
          {/* Logo */}
          <div className="td-nav-logo">
            <div className="td-nav-logo-icon">
              <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="12" fill="#2A7A50"/>
                <path d="M12 28V16C12 13.8 13.8 12 16 12H24C26.2 12 28 13.8 28 16V24C28 26.2 26.2 28 24 28H12Z" fill="#EAF3DE"/>
                <circle cx="18" cy="18" r="2" fill="#2A7A50"/>
                <circle cx="24" cy="18" r="2" fill="#2A7A50"/>
                <path d="M16 23C16 23 18 25 21 25C24 25 26 23 26 23" stroke="#2A7A50" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <div className="td-nav-school">CuriousClass</div>
            </div>
          </div>

          {/* New Topic Button */}
          <button className="td-new-topic-btn" id="new-topic-btn">
            <PlusIcon />
            <span>New Topic</span>
          </button>

          {/* Nav Links */}
          <div className="td-nav-links">
            {teacherNavItems.map((item) => {
              const Icon = iconMap[item.icon];
              return (
                <button
                  key={item.id}
                  className={`td-nav-link ${activeNav === item.id ? "td-nav-link--active" : ""}`}
                  id={`nav-${item.id}`}
                  onClick={() => setActiveNav(item.id)}
                >
                  {Icon && <Icon />}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="td-nav-bottom">
          <button className="td-nav-link" id="nav-help">
            <HelpIcon />
            <span>Help</span>
          </button>
          <button className="td-nav-link" id="nav-logout">
            <LogOutIcon />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      {/* ── Main Content ── */}
      <div className="td-content">
        {/* Top Bar */}
        <header className="td-header">
          <div className="td-header-left" style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
            <div>
              <h1 className="td-page-title" style={{ margin: 0 }}>{selectedClass}</h1>
            </div>
            <div style={{ marginLeft: "var(--space-md)" }}>
              <select
                value={subject}
                onChange={(e) => {
                  const newSub = e.target.value;
                  setSubject(newSub);
                  const isC10 = selectedClass && selectedClass.includes("10");
                  const isC6 = selectedClass && selectedClass.includes("6");
                  const subKey = (newSub === "mathematics" && isC10) ? "mathematics_class10" :
                                 (newSub === "science" && isC10) ? "science_class10" :
                                 (newSub === "history" && isC10) ? "history_class10" :
                                 (newSub === "science" && isC6) ? "science_class6" :
                                 (newSub === "history" && isC6) ? "history_class6" : newSub;
                  const chapters = CHAPTERS_DATA[subKey]?.chapters || [];
                  if (chapters.length > 0) {
                    setSelectedTopic(chapters[0].name);
                  }
                }}
                style={{
                  padding: "6px 12px",
                  borderRadius: "8px",
                  border: "1px solid var(--color-border-light)",
                  background: "var(--color-bg-mint)",
                  color: "var(--color-primary)",
                  fontWeight: "500",
                  outline: "none",
                  cursor: "pointer"
                }}
              >
                <option value="history">History</option>
                <option value="science">Science</option>
                <option value="mathematics">Mathematics</option>
              </select>
            </div>
          </div>
          <div className="td-header-right">
            <div className="td-teacher-info">
              <div className="td-teacher-name">Mrs. Sharma</div>
              <div className="td-teacher-dept">
                {subject === "mathematics" ? "Mathematics" :
                 subject === "physics" ? "Physics" :
                 subject === "chemistry" ? "Chemistry" :
                 subject === "biology" ? "Biology" :
                 subject === "science" ? "Science" : "Social Science"}
              </div>
            </div>
            <div className="td-teacher-avatar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        {activeNav === "dashboard" && (
          <div className="td-dashboard">
            {/* Current Unit Card */}
          <div className="td-unit-card" id="current-unit-card">
            <div className="td-unit-info">
              <div className="td-unit-eyebrow">Current unit</div>
              <div className="td-unit-name">
                {subject === "mathematics" ? (isClass10 ? "Class 10 Mathematics" : "Mathematics Curriculum") :
                 subject === "physics" ? "Class 11/12 Physics" :
                 subject === "chemistry" ? "Class 11/12 Chemistry" :
                 subject === "biology" ? "Class 11/12 Biology" :
                 subject === "science" ? (isClass10 ? "Class 10 Science" : isClass6 ? "Class 6 Science" : "Science Curriculum") :
                 subject === "history" ? (isClass10 ? "Class 10 History" : isClass6 ? "Class 6 History" : "History Curriculum") : currentUnit.name}
              </div>
              <div className="td-unit-desc">
                {subject === "mathematics" ? (isClass10 ? "CBSE Class 10 Curriculum" : "General Mathematics") :
                 subject === "physics" ? "Higher Secondary Physics" :
                 subject === "chemistry" ? "Higher Secondary Chemistry" :
                 subject === "biology" ? "Higher Secondary Biology" :
                 subject === "science" ? (isClass10 ? "CBSE Class 10 Science Curriculum" : isClass6 ? "CBSE Class 6 Science Curriculum" : "General Science Concepts") :
                 subject === "history" ? (isClass10 ? "CBSE Class 10 History Curriculum" : isClass6 ? "CBSE Class 6 History Curriculum" : "General History Concepts") : currentUnit.description}
              </div>
            </div>
            <div className="td-unit-actions">
              <select
                className="td-topic-select"
                id="topic-selector"
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
              >
                {(CHAPTERS_DATA[subjectKey]?.chapters || []).map((ch) => (
                  <option key={ch.id} value={ch.name}>{ch.name}</option>
                ))}
              </select>
              <button className="td-set-btn" id="set-topic-btn">Set</button>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="td-stats-row">
            {dashboardStats.map((stat) => (
              <div
                key={stat.id}
                className={`td-stat-card td-stat-card--${stat.variant}`}
                id={`stat-${stat.id}`}
              >
                <div className="td-stat-label">{stat.label}</div>
                <div className="td-stat-value">
                  {stat.value}
                  {stat.total && <span className="td-stat-total">{stat.total}</span>}
                  {stat.trend && <span className="td-stat-trend">{stat.trend}</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Two Column: Heatmap + Focus Alerts */}
          <div className="td-two-col">
            {/* Comprehension Heatmap */}
            <div className="td-card" id="comprehension-heatmap">
              <div className="td-card-header">
                <div>
                  <div className="td-card-title">Comprehension heatmap</div>
                  <div className="td-card-subtitle">Real-time AI assessment</div>
                </div>
              </div>
              <div className="td-heatmap">
                {/* Header row */}
                <div className="td-heatmap-grid" style={{ gridTemplateColumns: `100px repeat(${heatmapSubtopics.length}, 1fr)` }}>
                  <div className="td-hm-corner" />
                  {heatmapSubtopics.map((sub) => (
                    <div key={sub} className="td-hm-header">{sub}</div>
                  ))}

                  {/* Data rows */}
                  {heatmapStudents.map((student) => (
                    <>
                      <div key={`name-${student.name}`} className="td-hm-label">{student.name}</div>
                      {student.scores.map((score, i) => (
                        <div
                          key={`${student.name}-${i}`}
                          className="td-hm-cell"
                          style={{
                            background: getHeatmapColor(score),
                            border: getHeatmapBorder(score),
                          }}
                        />
                      ))}
                    </>
                  ))}
                </div>

                {/* Legend */}
                <div className="td-hm-legend">
                  <span className="td-hm-legend-item">
                    <span className="td-hm-legend-dot" style={{ background: "var(--heatmap-0)", border: "0.5px solid var(--color-bg-mint-border)" }} />
                    0%
                  </span>
                  <span className="td-hm-legend-item">
                    <span className="td-hm-legend-dot" style={{ background: "var(--heatmap-50)" }} />
                    50%
                  </span>
                  <span className="td-hm-legend-item">
                    <span className="td-hm-legend-dot" style={{ background: "var(--heatmap-100)" }} />
                    100%
                  </span>
                </div>
              </div>
            </div>

            {/* Focus Alerts */}
            <div className="td-card td-card--alerts" id="focus-alerts-panel">
              <div className="td-card-header td-alerts-header">
                <span className="td-card-title">Focus alerts</span>
                <span className="td-alerts-badge">
                  {focusAlerts.length} Alerts
                </span>
              </div>
              <div className="td-alerts-list">
                {focusAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`td-alert-item ${alert.priority === "urgent" ? "td-alert-item--urgent" : "td-alert-item--low"}`}
                    id={`alert-${alert.id}`}
                  >
                    <div className="td-alert-top">
                      <span className="td-alert-student">{alert.student}</span>
                      <span className="td-alert-time">{alert.timeAgo}</span>
                    </div>
                    <div className="td-alert-desc">{alert.description}</div>
                    <button
                      className="td-alert-insight-btn"
                      onClick={() => toggleAlert(alert.id)}
                    >
                      <ChevronIcon />
                      <span>AI Insight</span>
                    </button>
                    {expandedAlerts[alert.id] && (
                      <div className="td-alert-insight">
                        {alert.aiInsight}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        )}
        {/* Students View */}
        {activeNav === "students" && (
          <div className="td-dashboard">
            <div className="td-two-col">
              {/* Roster */}
              <div className="td-card">
                <div className="td-card-header">
                  <div className="td-card-title">Student Roster</div>
                </div>
                <div className="td-alerts-list">
                  {studentRoster.map((student) => (
                    <div key={student.id} className="td-alert-item td-alert-item--low">
                      <div className="td-alert-top">
                        <span className="td-alert-student">{student.name}</span>
                        <span className="td-alert-time">Roll No: {student.rollNo}</span>
                      </div>
                      <div className="td-alert-desc">Last active: {student.lastActive}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* All Student Activities */}
              <div className="td-card">
                <div className="td-card-header">
                  <div className="td-card-title">Recent Activity</div>
                </div>
                <div className="td-alerts-list">
                  {studentActivities.length === 0 ? (
                    <div style={{ padding: "var(--space-md)", color: "var(--color-text-tertiary)" }}>No recent activity.</div>
                  ) : (
                    studentActivities.map((act) => (
                      <div key={act.id} className="td-alert-item td-alert-item--low">
                        <div className="td-alert-top">
                          <span className="td-alert-student">{act.student_name}</span>
                          <span className="td-alert-time">
                            {new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="td-alert-desc">
                          {act.activity_type === 'chat' && <span>Chatted with Explano about <strong>{act.topic}</strong>.</span>}
                          {act.activity_type === 'quiz' && <span>Completed quiz on <strong>{act.topic}</strong> (Score: {act.details.score}/{act.details.total}).</span>}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notes View */}
        {activeNav === "notes" && (
          <div className="td-dashboard">
            <div className="td-notes-container">
              {/* Left Column: Shared Notes List */}
              <div className="td-card">
                <div className="td-card-header">
                  <div className="td-card-title">Shared Notes & Handouts</div>
                  <div className="td-card-subtitle">Materials shared with all students in Class 8-B</div>
                </div>
                <div style={{ padding: "var(--space-lg)" }}>
                  {loadingNotes ? (
                    <div style={{ textAlign: "center", padding: "var(--space-xl)", color: "var(--color-text-tertiary)" }}>
                      Loading notes...
                    </div>
                  ) : notes.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "var(--space-xl)", color: "var(--color-text-tertiary)" }}>
                      No notes uploaded yet. Use the panel on the right to upload your first note.
                    </div>
                  ) : (
                    <div className="td-notes-list">
                      {notes.map((note) => (
                        <div key={note.id} className="td-note-row">
                          <div className="td-note-left">
                            <div className="td-note-icon-box">
                              <PdfIcon />
                            </div>
                            <div className="td-note-details">
                              <div className="td-note-name">{note.title}</div>
                              <div className="td-note-meta-row">
                                <span>{note.fileName}</span>
                                <span>•</span>
                                <span>{note.fileSize}</span>
                                <span>•</span>
                                <span>{note.uploadDate}</span>
                              </div>
                            </div>
                          </div>
                          <div className="td-note-actions">
                            <a
                              href={note.fileUrl}
                              download
                              className="td-note-download-btn"
                            >
                              Download
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Upload Panel */}
              <div className="td-card">
                <div className="td-card-header">
                  <div className="td-card-title">Upload & Share Notes</div>
                  <div className="td-card-subtitle">Students will instantly see uploaded files in their Knowledge Hub</div>
                </div>
                <div style={{ padding: "var(--space-lg)" }}>
                  <form onSubmit={handleUpload} className="td-upload-form">
                    <div className="td-form-group">
                      <label className="td-form-label">Notes Title</label>
                      <input
                        type="text"
                        className="td-text-input"
                        placeholder="E.g., Causes of Civil Disobedience"
                        value={uploadTitle}
                        onChange={(e) => setUploadTitle(e.target.value)}
                        required
                      />
                    </div>

                    <div className="td-form-group">
                      <label className="td-form-label">PDF File</label>
                      <label className="td-file-dropzone">
                        <input
                          type="file"
                          accept=".pdf"
                          style={{ display: "none" }}
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              setSelectedFile(e.target.files[0]);
                              if (!uploadTitle) {
                                const nameWithoutExt = e.target.files[0].name.replace(/\.[^/.]+$/, "");
                                setUploadTitle(nameWithoutExt.replace(/[_-]/g, " "));
                              }
                            }
                          }}
                        />
                        <div className="td-dropzone-icon">
                          <CloudUploadIcon />
                        </div>
                        {selectedFile ? (
                          <div className="td-selected-file-badge">
                            <PdfIcon />
                            <span>{selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                          </div>
                        ) : (
                          <>
                            <div className="td-dropzone-text">Click to choose a file</div>
                            <div className="td-dropzone-sub">Only PDF files are supported</div>
                          </>
                        )}
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="td-upload-submit-btn"
                      disabled={uploading || !selectedFile}
                    >
                      {uploading ? "Sharing..." : "Upload & Share"}
                    </button>

                    {statusMsg.text && (
                      <div className={`td-status-msg td-status-msg--${statusMsg.type}`}>
                        {statusMsg.text}
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reports View */}
        {activeNav === "reports" && (
          <div className="td-dashboard">
            <div className="td-card">
              <div className="td-card-header">
                <div className="td-card-title">Student Reports</div>
              </div>
              <div style={{ padding: "var(--space-xl)" }}>
                <p>Reports view placeholder. Content goes here.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
