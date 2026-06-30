"use client";

import React, { useState, useEffect, useRef } from "react";
import { currentUnit } from "@/data/mockData";
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
  { id: 'quizzes', label: 'Quizzes & Topics', icon: 'cpu', href: '/teacher' },
  { id: 'reports', label: 'Reports', icon: 'bar-chart', href: '/teacher' },
];

/* ─── Main Component ─────────────────────────────────────────── */

export default function TeacherDashboard() {
  const [selectedClass, setSelectedClass] = useState("Class 8-B");
  const [subject, setSubject] = useState("history");
  const [teacherName, setTeacherName] = useState("Teacher");

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expandedAlerts, setExpandedAlerts] = useState({});
  const [selectedTopic, setSelectedTopic] = useState("");
  const [curriculumData, setCurriculumData] = useState({});
  
  // Dynamic student data
  const [studentRoster, setStudentRoster] = useState([]);
  const [heatmapStudents, setHeatmapStudents] = useState([]);
  const [focusAlerts, setFocusAlerts] = useState([]);
  const [studentActivities, setStudentActivities] = useState([]);
  const [currentHeatmapSubtopics, setCurrentHeatmapSubtopics] = useState([]);
  
  // Analytics states
  const [selectedStudentForReport, setSelectedStudentForReport] = useState(null);
  const [classAnalytics, setClassAnalytics] = useState({ classAverage: 0, topicsNeedingReview: [], strongTopics: [] });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const cls = localStorage.getItem("selectedClass");
      const tName = localStorage.getItem("teacherName");
      const tSub = localStorage.getItem("teacherSubject");

      if (tName) setTeacherName(tName);

      if (cls) {
        setSelectedClass(cls);
        let sub = tSub || "history";
        if (!tSub && cls.includes("10")) {
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
    if (selectedClass) {
      fetchStudents();
    }
  }, [selectedClass, subjectKey, curriculumData]);

  async function fetchStudents() {
    try {
      // 1. Fetch Students for selected class
      const res = await fetch(`/api/students?class_name=${encodeURIComponent(selectedClass)}`);
      let students = [];
      if (res.ok) {
        const data = await res.json();
        students = data.students || [];
      }

      // 2. Fetch Activities for selected class
      let activities = [];
      const actRes = await fetch(`/api/activities?class_name=${encodeURIComponent(selectedClass)}`);
      if (actRes.ok) {
        const actData = await actRes.json();
        const allActs = actData.activities || [];
        
        const allowedTopics = (CHAPTERS_DATA[subjectKey]?.chapters || []).map(ch => ch.name);
        Object.values(curriculumData).forEach(chap => {
          if (chap && chap.topics) {
            chap.topics.forEach(t => allowedTopics.push(t.name));
          }
        });
        
        activities = allActs.filter(a => {
          if (a.details && a.details.subject_key) {
            return a.details.subject_key === subjectKey;
          }
          return allowedTopics.includes(a.topic);
        });

        setStudentActivities(activities);
      }

      // Populate Roster
      const roster = students.map(s => {
        const studentActs = activities.filter(a => a.student_roll === s.roll_number);
        const lastAct = studentActs.length > 0 ? new Date(studentActs[0].created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Never';
        return {
          id: s.id,
          name: s.name,
          rollNo: s.roll_number,
          lastActive: lastAct,
          activities: studentActs
        };
      });
      setStudentRoster(roster);

      // Populate Heatmap with real scores
      // Find up to 4 unique topics that have quizzes
      const quizTopics = Array.from(new Set(activities.filter(a => a.activity_type === 'quiz').map(a => a.topic)));
      const heatmapTopics = quizTopics.length > 0 ? quizTopics.slice(0, 4) : (CHAPTERS_DATA[subjectKey]?.chapters || []).slice(0, 4).map(ch => ch.name);
      setCurrentHeatmapSubtopics(heatmapTopics);
      
      const heatmap = students.map(s => {
        const studentQuizzes = activities.filter(a => a.student_roll === s.roll_number && a.activity_type === 'quiz');
        
        const scores = heatmapTopics.map(topic => {
          const quizzes = studentQuizzes.filter(q => q.topic === topic);
          if (quizzes.length === 0) return null; // Not taken
          const totalScore = quizzes.reduce((acc, curr) => acc + (curr.details.score / curr.details.total), 0);
          return Math.round((totalScore / quizzes.length) * 100);
        });

        return {
          name: s.name,
          scores: scores
        };
      });
      setHeatmapStudents(heatmap);

      // Populate Focus Alerts
      // Generate alerts if a student scored less than 60% on any quiz, or hasn't taken a quiz yet
      let alerts = [];
      roster.forEach(student => {
        const studentQuizzes = student.activities.filter(a => a.activity_type === 'quiz');
        if (studentQuizzes.length === 0) {
          // Maybe an alert that they haven't started? Let's skip for now.
        } else {
          studentQuizzes.forEach(q => {
            const pct = (q.details.score / q.details.total) * 100;
            if (pct < 60) {
              alerts.push({
                id: `${student.rollNo}-${q.id}`,
                student: student.name,
                timeAgo: new Date(q.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                description: `Scored ${q.details.score}/${q.details.total} on ${q.topic}.`,
                priority: pct < 40 ? 'urgent' : 'low',
                aiInsight: `Needs review on ${q.topic}. Explano identified gaps in their knowledge.`,
              });
            }
          });
        }
      });
      
      // Sort alerts by urgency and time
      alerts.sort((a, b) => a.priority === 'urgent' ? -1 : 1);
      setFocusAlerts(alerts.slice(0, 5)); // Keep top 5 alerts

      
      // Calculate Class Analytics
      const quizActivities = activities.filter(a => a.activity_type === 'quiz');
      if (quizActivities.length > 0) {
        let totalScore = 0;
        let totalMax = 0;
        const topicStats = {};
        
        quizActivities.forEach(q => {
          totalScore += q.details.score;
          totalMax += q.details.total;
          if (!topicStats[q.topic]) topicStats[q.topic] = { score: 0, max: 0, count: 0 };
          topicStats[q.topic].score += q.details.score;
          topicStats[q.topic].max += q.details.total;
          topicStats[q.topic].count += 1;
        });
        
        const classAvg = Math.round((totalScore / totalMax) * 100);
        const review = [];
        const strong = [];
        
        Object.keys(topicStats).forEach(topic => {
          const stats = topicStats[topic];
          const pct = (stats.score / stats.max) * 100;
          if (pct <= 65) review.push({ topic, avg: Math.round(pct) }); // Changed to <= 65% to easily flag topics
          if (pct >= 75) strong.push({ topic, avg: Math.round(pct) }); // Changed to >= 75% to easily flag strong topics
        });
        
        setClassAnalytics({ classAverage: classAvg, topicsNeedingReview: review, strongTopics: strong });
      } else {
        setClassAnalytics({ classAverage: 0, topicsNeedingReview: [], strongTopics: [] });
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

  async function fetchCurriculum() {
    try {
      const res = await fetch(`/api/curriculum?subject=${subjectKey}`);
      if (res.ok) {
        const data = await res.json();
        setCurriculumData(data);
      }
    } catch (e) {
      console.error("Failed to fetch curriculum:", e);
    }
  }

  async function updateChapterStatus(chapterId, status) {
    // Optimistic update
    setCurriculumData(prev => {
      const updated = { ...prev };
      if (!updated[chapterId]) {
        updated[chapterId] = { status: 'pending', coveredDate: null, topics: [] };
      }
      updated[chapterId] = { ...updated[chapterId], status, coveredDate: status === 'covered' ? new Date().toISOString().split('T')[0] : null };
      return updated;
    });
    try {
      await fetch('/api/curriculum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: subjectKey, chapterId, action: 'UPDATE_CHAPTER_STATUS', payload: { status } })
      });
    } catch (e) { console.error('updateChapterStatus error:', e); }
  }

  async function addTopic(chapterId, name) {
    if (!name.trim()) return;
    const tempId = Date.now().toString();
    // Optimistic update
    setCurriculumData(prev => {
      const updated = { ...prev };
      if (!updated[chapterId]) {
        updated[chapterId] = { status: 'pending', coveredDate: null, topics: [] };
      }
      updated[chapterId] = {
        ...updated[chapterId],
        topics: [...(updated[chapterId].topics || []), { id: tempId, name, status: 'pending' }]
      };
      return updated;
    });
    try {
      await fetch('/api/curriculum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: subjectKey, chapterId, action: 'ADD_TOPIC', payload: { name } })
      });
      // Refresh to get the real ID from server
      fetchCurriculum();
    } catch (e) { console.error('addTopic error:', e); }
  }

  async function updateTopicStatus(chapterId, topicId, status) {
    // Optimistic update
    setCurriculumData(prev => {
      const updated = { ...prev };
      if (updated[chapterId]) {
        updated[chapterId] = {
          ...updated[chapterId],
          topics: (updated[chapterId].topics || []).map(t =>
            t.id === topicId ? { ...t, status } : t
          )
        };
      }
      return updated;
    });
    try {
      await fetch('/api/curriculum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: subjectKey, chapterId, action: 'UPDATE_TOPIC_STATUS', payload: { topicId, status } })
      });
    } catch (e) { console.error('updateTopicStatus error:', e); }
  }

  async function removeTopic(chapterId, topicId) {
    // Optimistic update
    setCurriculumData(prev => {
      const updated = { ...prev };
      if (updated[chapterId]) {
        updated[chapterId] = {
          ...updated[chapterId],
          topics: (updated[chapterId].topics || []).filter(t => t.id !== topicId)
        };
      }
      return updated;
    });
    try {
      await fetch('/api/curriculum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: subjectKey, chapterId, action: 'REMOVE_TOPIC', payload: { topicId } })
      });
    } catch (e) { console.error('removeTopic error:', e); }
  }

  useEffect(() => {
    fetchNotes();
    fetchCurriculum();
    const chapters = CHAPTERS_DATA[subjectKey]?.chapters || [];
    if (chapters.length > 0) {
      setSelectedTopic(chapters[0].name);
    } else {
      setSelectedTopic("");
    }
  }, [subjectKey]);

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
          subject: CHAPTERS_DATA[subjectKey]?.title || subject,
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
      <nav className={`td-nav ${isSidebarOpen ? 'mobile-open' : ''}`}>
        <button className="td-mobile-toggle" onClick={() => setIsSidebarOpen(false)} style={{ position: 'absolute', right: '10px', top: '10px' }}>✕</button>
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
          <button className="td-new-topic-btn" id="new-topic-btn" onClick={() => setActiveNav('quizzes')}>
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
            <button className="td-mobile-toggle" onClick={() => setIsSidebarOpen(true)}>☰</button>
            <div>
              <select
                value={selectedClass}
                onChange={(e) => {
                  const newClass = e.target.value;
                  setSelectedClass(newClass);
                  if (typeof window !== "undefined") {
                    localStorage.setItem("selectedClass", newClass);
                  }
                  // Reset selectedTopic when changing class
                  const isC10 = newClass.includes("10");
                  const isC6 = newClass.includes("6");
                  const subKey = (subject === "mathematics" && isC10) ? "mathematics_class10" :
                                 (subject === "science" && isC10) ? "science_class10" :
                                 (subject === "history" && isC10) ? "history_class10" :
                                 (subject === "science" && isC6) ? "science_class6" :
                                 (subject === "history" && isC6) ? "history_class6" : subject;
                  const chapters = CHAPTERS_DATA[subKey]?.chapters || [];
                  if (chapters.length > 0) {
                    setSelectedTopic(chapters[0].name);
                  } else {
                    setSelectedTopic("");
                  }
                }}
                style={{
                  padding: "6px 12px",
                  borderRadius: "8px",
                  border: "1px solid var(--color-border-light)",
                  background: "var(--color-bg-mint)",
                  color: "var(--color-primary)",
                  fontWeight: "700",
                  fontSize: "18px",
                  outline: "none",
                  cursor: "pointer"
                }}
              >
                {Array.from({ length: 10 }, (_, i) => {
                  const num = i + 1;
                  const name = num === 1 ? "Class 1st" : num === 2 ? "Class 2nd" : num === 3 ? "Class 3rd" : `Class ${num}th`;
                  return <option key={name} value={name}>{name}</option>;
                })}
              </select>
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
                  } else {
                    setSelectedTopic("");
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
              <div className="td-teacher-name">{teacherName}</div>
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

          {/* Stat Cards - Real-time from DB */}
          <div className="td-stats-row">
            {/* Active Participants */}
            <div className="td-stat-card td-stat-card--green" id="stat-participants">
              <div className="td-stat-label">Active participants</div>
              <div className="td-stat-value">
                {studentRoster.filter(s => s.activities.length > 0).length}
                <span className="td-stat-total">/{studentRoster.length} enrolled</span>
              </div>
            </div>

            {/* Avg Comprehension */}
            <div className="td-stat-card td-stat-card--green" id="stat-comprehension">
              <div className="td-stat-label">Avg comprehension</div>
              <div className="td-stat-value">
                {classAnalytics.classAverage > 0 ? `${classAnalytics.classAverage}%` : '—'}
                {classAnalytics.classAverage > 0 && (
                  <span className="td-stat-trend" style={{ fontSize: '12px', marginLeft: '6px', color: classAnalytics.classAverage >= 70 ? 'var(--color-primary)' : '#E24B4A' }}>
                    {classAnalytics.classAverage >= 70 ? '✓ Good' : '⚠ Needs Attention'}
                  </span>
                )}
              </div>
            </div>

            {/* Critical Focus Alerts */}
            <div className="td-stat-card td-stat-card--red" id="stat-alerts">
              <div className="td-stat-label">Critical focus alerts</div>
              <div className="td-stat-value">
                {focusAlerts.length}
                <span className="td-stat-total"> {focusAlerts.length === 1 ? 'student' : 'students'}</span>
              </div>
            </div>
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
                <div className="td-heatmap-grid" style={{ gridTemplateColumns: `100px repeat(${currentHeatmapSubtopics.length || 4}, 1fr)` }}>
                  <div className="td-hm-corner" />
                  {currentHeatmapSubtopics.map((sub) => (
                    <div key={sub} className="td-hm-header">{sub.substring(0, 15)}{sub.length > 15 ? '...' : ''}</div>
                  ))}

                  {/* Data rows */}
                  {heatmapStudents.map((student) => (
                    <React.Fragment key={student.name}>
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
                    </React.Fragment>
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
        
        {/* Quizzes & Topics View */}
        {activeNav === "quizzes" && (
          <div className="td-dashboard">
            {/* Topic Management */}
            <div className="td-card">
              <div className="td-card-header">
                <div className="td-card-title">Manage Topics</div>
                <div className="td-card-subtitle">Define topics under each chapter for {subject}. These topics are used for quiz generation.</div>
              </div>
              <div style={{ padding: "var(--space-xl)", display: "flex", flexDirection: "column", gap: "20px" }}>
                {(CHAPTERS_DATA[subjectKey]?.chapters || []).map(ch => {
                  const chData = curriculumData[ch.id] || { status: 'pending', topics: [] };
                  return (
                    <div key={ch.id} style={{ border: '1px solid var(--color-border-light)', borderRadius: '8px', padding: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ margin: 0, color: 'var(--color-primary)' }}>{ch.name}</h3>
                        <div>
                          <select 
                            value={chData.status} 
                            onChange={(e) => updateChapterStatus(ch.id, e.target.value)}
                            style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
                          >
                            <option value="pending">Pending</option>
                            <option value="ongoing">Ongoing</option>
                            <option value="covered">Covered</option>
                          </select>
                          {chData.coveredDate && <span style={{ marginLeft: '10px', fontSize: '12px', color: '#666' }}>Covered on {chData.coveredDate}</span>}
                        </div>
                      </div>
                      
                      <div style={{ marginBottom: '16px' }}>
                        <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#555' }}>Topics</h4>
                        {chData.topics?.length === 0 ? (
                          <p style={{ fontSize: '13px', color: '#888' }}>No topics defined yet. Add topics below to enable quiz generation for this chapter.</p>
                        ) : (
                          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {chData.topics?.map(topic => (
                              <li key={topic.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px', background: '#f9f9f9', marginBottom: '4px', borderRadius: '4px' }}>
                                <span>{topic.name}</span>
                                <div>
                                  <select 
                                    value={topic.status} 
                                    onChange={(e) => updateTopicStatus(ch.id, topic.id, e.target.value)}
                                    style={{ padding: '4px', borderRadius: '4px', border: '1px solid #ddd', marginRight: '8px' }}
                                  >
                                    <option value="pending">Pending</option>
                                    <option value="ongoing">Ongoing</option>
                                    <option value="covered">Covered</option>
                                  </select>
                                  <button onClick={() => removeTopic(ch.id, topic.id)} style={{ color: 'red', border: 'none', background: 'transparent', cursor: 'pointer' }}>✖</button>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input 
                          type="text" 
                          placeholder="New topic name..." 
                          id={`new-topic-${ch.id}`}
                          style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                          onKeyDown={(e) => {
                            if(e.key === 'Enter') {
                              addTopic(ch.id, e.target.value);
                              e.target.value = '';
                            }
                          }}
                        />
                        <button 
                          onClick={(e) => {
                            const input = document.getElementById(`new-topic-${ch.id}`);
                            addTopic(ch.id, input.value);
                            input.value = '';
                          }}
                          style={{ padding: '8px 16px', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          Add Topic
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quiz Generation */}
            <div className="td-card" style={{ marginTop: '20px' }}>
              <div className="td-card-header">
                <div className="td-card-title">Generate & Push Quiz</div>
                <div className="td-card-subtitle">Select a topic and push a Gemini-generated quiz to all students.</div>
              </div>
              <div style={{ padding: "var(--space-xl)" }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <select
                    value={quizTopic}
                    onChange={(e) => setQuizTopic(e.target.value)}
                    style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ccc', minWidth: '200px' }}
                  >
                    <option value="">Select a topic...</option>
                    {(CHAPTERS_DATA[subjectKey]?.chapters || []).map(ch => {
                      const chData = curriculumData[ch.id] || { topics: [] };
                      return (chData.topics || []).map(t => (
                        <option key={t.id} value={t.name}>{ch.name} → {t.name}</option>
                      ));
                    })}
                  </select>
                  <button
                    onClick={handleGenerateAndPushQuiz}
                    disabled={generatingQuiz || !quizTopic}
                    style={{ padding: '8px 20px', background: generatingQuiz ? '#ccc' : 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: generatingQuiz ? 'not-allowed' : 'pointer', fontWeight: '600' }}
                  >
                    {generatingQuiz ? 'Generating...' : 'Generate & Push Quiz'}
                  </button>
                </div>
                {quizStatus && <p style={{ marginTop: '12px', fontSize: '13px', color: quizStatus.includes('success') ? 'green' : '#666' }}>{quizStatus}</p>}
                {pushedQuiz && (
                  <div style={{ marginTop: '16px', padding: '12px', background: '#f0f9f0', borderRadius: '8px', border: '1px solid var(--color-border-light)' }}>
                    <h4 style={{ margin: '0 0 8px 0', color: 'var(--color-primary)' }}>Pushed Quiz Preview</h4>
                    {(pushedQuiz.quiz_data || pushedQuiz.questions || []).map((q, i) => (
                      <div key={i} style={{ marginBottom: '8px' }}>
                        <p style={{ margin: '0 0 4px 0', fontWeight: '500', fontSize: '13px' }}>{i+1}. {q.question}</p>
                        <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>Answer: {q.options?.[q.answerIndex]}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Students View */}
        {activeNav === "students" && (
          <div className="td-dashboard">
            {/* Class Analysis Overview */}
            <div className="td-card" style={{ marginBottom: "var(--space-xl)" }}>
              <div className="td-card-header">
                <div className="td-card-title">Class Analytics Overview</div>
                <div className="td-card-subtitle">Combined performance data for {selectedClass}</div>
              </div>
              <div style={{ padding: "var(--space-lg)", display: "flex", gap: "var(--space-xl)", flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: "200px", padding: "var(--space-md)", background: "var(--color-bg-subtle)", borderRadius: "8px", textAlign: "center" }}>
                  <h4 style={{ margin: "0 0 8px 0", color: "var(--color-text-secondary)", fontSize: "13px", textTransform: "uppercase" }}>Overall Average</h4>
                  <div style={{ fontSize: "32px", fontWeight: "700", color: classAnalytics.classAverage >= 60 ? "var(--heatmap-100)" : "var(--heatmap-0)" }}>
                    {classAnalytics.classAverage}%
                  </div>
                  <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "var(--color-text-tertiary)" }}>Based on all quizzes taken</p>
                </div>
                
                <div style={{ flex: 1, minWidth: "200px", padding: "var(--space-md)", background: "var(--color-bg-subtle)", borderRadius: "8px" }}>
                  <h4 style={{ margin: "0 0 12px 0", color: "var(--color-text-secondary)", fontSize: "13px", textTransform: "uppercase" }}>Needs Review</h4>
                  {classAnalytics.topicsNeedingReview.length > 0 ? (
                    <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "13px", color: "var(--color-text-primary)" }}>
                      {classAnalytics.topicsNeedingReview.map(t => (
                        <li key={t.topic} style={{ marginBottom: "4px" }}>
                          <strong>{t.topic}</strong> (Avg: {t.avg}%)
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ margin: 0, fontSize: "13px", color: "var(--color-text-tertiary)" }}>No topics currently need review.</p>
                  )}
                </div>
                
                <div style={{ flex: 1, minWidth: "200px", padding: "var(--space-md)", background: "var(--color-bg-subtle)", borderRadius: "8px" }}>
                  <h4 style={{ margin: "0 0 12px 0", color: "var(--color-text-secondary)", fontSize: "13px", textTransform: "uppercase" }}>Strong Topics</h4>
                  {classAnalytics.strongTopics.length > 0 ? (
                    <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "13px", color: "var(--color-text-primary)" }}>
                      {classAnalytics.strongTopics.map(t => (
                        <li key={t.topic} style={{ marginBottom: "4px" }}>
                          <strong>{t.topic}</strong> (Avg: {t.avg}%)
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ margin: 0, fontSize: "13px", color: "var(--color-text-tertiary)" }}>No strong topics identified yet.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="td-two-col">
              {/* Roster */}
              <div className="td-card">
                <div className="td-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="td-card-title">Student Roster</div>
                  <button onClick={fetchStudents} style={{ padding: "4px 8px", fontSize: "12px", borderRadius: "4px", border: "1px solid var(--color-border-light)", background: "white", cursor: "pointer" }}>Refresh Data</button>
                </div>
                <div className="td-alerts-list">
                  {studentRoster.map((student) => (
                    <div 
                      key={student.id} 
                      className={`td-alert-item td-alert-item--low ${selectedStudentForReport?.id === student.id ? 'active' : ''}`}
                      style={{ cursor: "pointer", background: selectedStudentForReport?.id === student.id ? "var(--color-bg-mint)" : "white" }}
                      onClick={() => setSelectedStudentForReport(student)}
                    >
                      <div className="td-alert-top">
                        <span className="td-alert-student">{student.name}</span>
                        <span className="td-alert-time">Roll No: {student.rollNo}</span>
                      </div>
                      <div className="td-alert-desc">Last active: {student.lastActive}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Report Card or All Activities */}
              {selectedStudentForReport ? (
                <div className="td-card">
                  <div className="td-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div className="td-card-title">{selectedStudentForReport.name}'s Report Card</div>
                      <div className="td-card-subtitle">Roll No: {selectedStudentForReport.rollNo}</div>
                    </div>
                    <button onClick={() => setSelectedStudentForReport(null)} style={{ padding: "4px 8px", fontSize: "12px", borderRadius: "4px", border: "none", background: "var(--color-bg-subtle)", cursor: "pointer" }}>Close</button>
                  </div>
                  <div style={{ padding: "var(--space-lg)" }}>
                    <h4 style={{ margin: "0 0 12px 0", fontSize: "14px" }}>Quiz Scores</h4>
                    {selectedStudentForReport.activities.filter(a => a.activity_type === 'quiz').length > 0 ? (
                      <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px 0" }}>
                        {selectedStudentForReport.activities.filter(a => a.activity_type === 'quiz').map(q => {
                          const pct = (q.details.score / q.details.total) * 100;
                          return (
                            <li key={q.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--color-border-light)" }}>
                              <span style={{ fontSize: "13px", fontWeight: "500" }}>{q.topic}</span>
                              <span style={{ fontSize: "13px", color: pct < 60 ? "red" : "green", fontWeight: "600" }}>{q.details.score}/{q.details.total} ({Math.round(pct)}%)</span>
                            </li>
                          )
                        })}
                      </ul>
                    ) : (
                      <p style={{ fontSize: "13px", color: "var(--color-text-tertiary)", marginBottom: "24px" }}>No quizzes taken yet.</p>
                    )}

                    <h4 style={{ margin: "0 0 12px 0", fontSize: "14px" }}>Recent Chats</h4>
                    {selectedStudentForReport.activities.filter(a => a.activity_type === 'chat').length > 0 ? (
                      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        {selectedStudentForReport.activities.filter(a => a.activity_type === 'chat').slice(0, 5).map(c => (
                          <li key={c.id} style={{ fontSize: "13px", padding: "6px 0", color: "var(--color-text-secondary)" }}>
                            • Chatted about <strong>{c.topic}</strong> on {new Date(c.created_at).toLocaleDateString()}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p style={{ fontSize: "13px", color: "var(--color-text-tertiary)" }}>No chat activity yet.</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="td-card">
                  <div className="td-card-header">
                    <div className="td-card-title">Recent Activity (All Students)</div>
                    <div className="td-card-subtitle">Click a student on the left for detailed analysis</div>
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
              )}
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
