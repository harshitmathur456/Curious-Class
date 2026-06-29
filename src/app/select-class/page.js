"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Generate math CAPTCHA
function generateCaptcha() {
  const operators = ["+", "−", "×"];
  const op = operators[Math.floor(Math.random() * operators.length)];
  let a, b, answer;

  switch (op) {
    case "+":
      a = Math.floor(Math.random() * 50) + 1;
      b = Math.floor(Math.random() * 50) + 1;
      answer = a + b;
      break;
    case "−":
      a = Math.floor(Math.random() * 50) + 10;
      b = Math.floor(Math.random() * a);
      answer = a - b;
      break;
    case "×":
      a = Math.floor(Math.random() * 12) + 1;
      b = Math.floor(Math.random() * 12) + 1;
      answer = a * b;
      break;
  }

  return { question: `${a} ${op} ${b} = ?`, answer };
}

// Icons
function ShieldIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"/>
      <polyline points="12 19 5 12 12 5"/>
    </svg>
  );
}

function ClassSelectionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "student"; // Default to student

  const [selectedClass, setSelectedClass] = useState(null);
  const [captcha, setCaptcha] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [status, setStatus] = useState("idle"); // idle | success | error
  const [isVerifying, setIsVerifying] = useState(false);
  const [shake, setShake] = useState(false);
  
  // Student details
  const [studentName, setStudentName] = useState("");
  const [rollNumber, setRollNumber] = useState("");

  // Teacher details
  const [teacherName, setTeacherName] = useState("");
  const [teacherSubject, setTeacherSubject] = useState("mathematics");

  // Initialize CAPTCHA
  useEffect(() => {
    setCaptcha(generateCaptcha());
  }, []);

  const classes = Array.from({ length: 10 }, (_, i) => {
    const num = i + 1;
    if (num === 1) return "Class 1st";
    if (num === 2) return "Class 2nd";
    if (num === 3) return "Class 3rd";
    return `Class ${num}th`;
  });

  function handleClassSelect(cls) {
    setSelectedClass(cls);
    // Focus captcha input after selection if visible
    setTimeout(() => {
      document.getElementById("captcha-input")?.focus();
    }, 100);
  }

  function handleRefresh() {
    setCaptcha(generateCaptcha());
    setUserAnswer("");
    setStatus("idle");
    setShake(false);
  }

  async function handleVerify(e) {
    e.preventDefault();
    if (!selectedClass) return;
    if (!userAnswer.trim() || isVerifying || !captcha) return;

    setIsVerifying(true);
    const isCorrect = parseInt(userAnswer.trim(), 10) === captcha.answer;

    // Log to API
    try {
      await fetch("/api/captcha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: role,
          captcha_answer: userAnswer.trim(),
          is_correct: isCorrect,
        }),
      });

      // If correct and role is student, register student
      if (isCorrect && role === "student") {
        await fetch("/api/students", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: studentName.trim(),
            roll_number: rollNumber.trim(),
            class_name: selectedClass,
          }),
        });
      }
    } catch (err) {
      console.error("Failed to log data:", err);
    }

    if (isCorrect) {
      setStatus("success");
      if (typeof window !== "undefined") {
        localStorage.setItem("selectedClass", selectedClass);
        if (role === "student") {
          localStorage.setItem("studentName", studentName.trim());
          localStorage.setItem("rollNumber", rollNumber.trim());
        } else if (role === "teacher") {
          localStorage.setItem("teacherName", teacherName.trim() || "Teacher");
          localStorage.setItem("teacherSubject", teacherSubject);
        }
      }
      setTimeout(() => {
        const dest = role === "student" ? "/student" : "/teacher";
        router.push(dest);
      }, 1000);
    } else {
      setStatus("error");
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setTimeout(() => {
        setCaptcha(generateCaptcha());
        setUserAnswer("");
        setStatus("idle");
      }, 1500);
    }

    setIsVerifying(false);
  }

  return (
    <div className="selection-page">
      <div className="selection-container">
        {/* Back Link */}
        <button className="back-link" onClick={() => router.push("/")}>
          <ArrowLeftIcon /> Back
        </button>

        <div className="selection-brand">
          <div className="selection-logo">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="40" height="40" rx="12" fill="#2A7A50"/>
              <path d="M12 28V16C12 13.8 13.8 12 16 12H24C26.2 12 28 13.8 28 16V24C28 26.2 26.2 28 24 28H12Z" fill="#EAF3DE"/>
              <circle cx="18" cy="18" r="2" fill="#2A7A50"/>
              <circle cx="24" cy="18" r="2" fill="#2A7A50"/>
              <path d="M16 23C16 23 18 25 21 25C24 25 26 23 26 23" stroke="#2A7A50" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className="selection-title">{role === "student" ? "Enter Details" : "Select Your Class"}</h1>
          <p className="selection-tagline">
            Continuing as <span className="role-badge">{role === "student" ? "Student" : "Teacher"}</span>
          </p>
        </div>

        {/* Student Details Form */}
        {role === "student" && (
          <div className="student-details-form" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <input
              type="text"
              placeholder="Your Name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="captcha-input"
              style={{ flex: '1', minWidth: '200px' }}
            />
            <input
              type="text"
              placeholder="Roll Number"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              className="captcha-input"
              style={{ flex: '1', minWidth: '200px' }}
            />
          </div>
        )}

        {/* Teacher Details Form */}
        {role === "teacher" && (
          <div className="student-details-form" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <input
              type="text"
              placeholder="Your Name (e.g. Mrs. Sharma)"
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              className="captcha-input"
              style={{ flex: '1', minWidth: '200px' }}
            />
            <select
              value={teacherSubject}
              onChange={(e) => setTeacherSubject(e.target.value)}
              className="captcha-input"
              style={{ flex: '1', minWidth: '200px', cursor: 'pointer', padding: '0 1rem' }}
            >
              <option value="history">History</option>
              <option value="science">Science</option>
              <option value="mathematics">Mathematics</option>
              <option value="biology">Biology</option>
              <option value="physics">Physics</option>
              <option value="chemistry">Chemistry</option>
            </select>
          </div>
        )}

        {/* Classes Grid */}
        <div className="classes-grid" style={{ 
          opacity: ((role === "student" && (!studentName.trim() || !rollNumber.trim())) || (role === "teacher" && !teacherName.trim())) ? 0.5 : 1, 
          pointerEvents: ((role === "student" && (!studentName.trim() || !rollNumber.trim())) || (role === "teacher" && !teacherName.trim())) ? 'none' : 'auto' 
        }}>

          {classes.map((cls) => {
            const isSelected = selectedClass === cls;
            return (
              <button
                key={cls}
                type="button"
                className={`class-card ${isSelected ? "class-card--selected" : ""}`}
                onClick={() => handleClassSelect(cls)}
              >
                <div className="class-card-icon">🏫</div>
                <div className="class-card-name">{cls}</div>
              </button>
            );
          })}
        </div>

        {/* CAPTCHA Form Container */}
        {selectedClass && captcha && (
          <div className={`captcha-section-wrapper ${shake ? "captcha-section-wrapper--shake" : ""}`}>
            <div className="captcha-header">
              <div className={`captcha-shield ${status === "success" ? "captcha-shield--success" : ""}`}>
                {status === "success" ? <CheckIcon /> : <ShieldIcon />}
              </div>
              <div className="captcha-header-text">
                <h3>Quick Security Check</h3>
                <p>Solve to enter <strong>{selectedClass}</strong> as a {role}</p>
              </div>
            </div>

            {/* Captcha question */}
            <div className="captcha-question-box">
              <div className="captcha-question-label">What is</div>
              <div className="captcha-question-expr">{captcha.question}</div>
              <button
                className="captcha-refresh"
                onClick={handleRefresh}
                title="New question"
                type="button"
                disabled={status === "success"}
              >
                <RefreshIcon />
              </button>
            </div>

            {/* Input + Submit */}
            <form onSubmit={handleVerify} className="captcha-form">
              <input
                id="captcha-input"
                type="number"
                className={`captcha-input ${status === "error" ? "captcha-input--error" : ""} ${status === "success" ? "captcha-input--success" : ""}`}
                placeholder="Answer"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                autoFocus
                disabled={status === "success" || isVerifying}
              />
              <button
                type="submit"
                className={`captcha-submit ${status === "success" ? "captcha-submit--success" : ""}`}
                disabled={!userAnswer.trim() || isVerifying || status === "success"}
              >
                {status === "success" ? (
                  <>
                    <CheckIcon /> Success
                  </>
                ) : isVerifying ? (
                  "Verifying..."
                ) : (
                  "Verify"
                )}
              </button>
            </form>

            {status === "error" && (
              <div className="captcha-error-msg">Incorrect answer. Please try again!</div>
            )}
          </div>
        )}
      </div>

      <style>{`
        .selection-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-bg-page);
          padding: var(--space-2xl);
        }

        .selection-container {
          max-width: 600px;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: var(--space-xl);
          position: relative;
        }

        .back-link {
          position: absolute;
          top: -40px;
          left: 0;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--color-text-secondary);
          font-size: 13px;
          font-weight: var(--font-weight-medium);
          transition: color 0.2s ease;
          border: none;
          background: none;
          cursor: pointer;
        }

        .back-link:hover {
          color: var(--color-primary);
        }

        .selection-brand {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-xs);
          margin-bottom: var(--space-md);
        }

        .selection-logo {
          margin-bottom: var(--space-xs);
        }

        .selection-title {
          font-size: 26px;
          font-weight: var(--font-weight-medium);
          color: var(--color-text-primary);
          letter-spacing: -0.5px;
        }

        .selection-tagline {
          font-size: 14px;
          color: var(--color-text-secondary);
        }

        .role-badge {
          display: inline-block;
          background: var(--color-bg-mint);
          color: var(--color-primary);
          padding: 2px 10px;
          border-radius: var(--radius-pill);
          font-weight: var(--font-weight-medium);
          font-size: 12px;
          text-transform: capitalize;
        }

        .classes-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--space-md);
          width: 100%;
        }

        @media (max-width: 520px) {
          .classes-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .class-card {
          background: var(--color-bg-white);
          border: 0.5px solid var(--color-border-light);
          border-radius: var(--radius-md);
          padding: var(--space-lg) var(--space-md);
          text-align: center;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-xs);
          cursor: pointer;
        }

        .class-card:hover {
          border-color: var(--color-primary);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(42, 122, 80, 0.05);
        }

        .class-card--selected {
          border-color: var(--color-primary);
          background: var(--color-bg-mint);
          color: var(--color-primary-dark);
          font-weight: var(--font-weight-medium);
          box-shadow: 0 4px 12px rgba(42, 122, 80, 0.08);
          transform: scale(1.03);
        }

        .class-card-icon {
          font-size: 20px;
        }

        .class-card-name {
          font-size: 13px;
        }

        .captcha-section-wrapper {
          margin-top: var(--space-xl);
          background: var(--color-bg-white);
          border: 0.5px solid var(--color-border-light);
          border-radius: var(--radius-lg);
          padding: var(--space-xl);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03), 0 0 0 0.5px var(--color-border-light);
          animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .captcha-section-wrapper--shake {
          animation: captchaShake 0.4s ease;
        }

        @keyframes captchaShake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }

        .captcha-header {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          margin-bottom: var(--space-lg);
        }

        .captcha-shield {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          background: var(--color-bg-mint);
          color: var(--color-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.3s ease;
        }

        .captcha-shield--success {
          background: var(--color-primary);
          color: white;
        }

        .captcha-header-text h3 {
          font-size: 14px;
          font-weight: var(--font-weight-medium);
          color: var(--color-text-primary);
          margin-bottom: 2px;
        }

        .captcha-header-text p {
          font-size: 12px;
          color: var(--color-text-secondary);
        }

        .captcha-question-box {
          background: var(--color-bg-page);
          border: 0.5px solid var(--color-border-light);
          border-radius: var(--radius-md);
          padding: var(--space-md) var(--space-lg);
          margin-bottom: var(--space-md);
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }

        .captcha-question-label {
          font-size: 12px;
          color: var(--color-text-tertiary);
          white-space: nowrap;
        }

        .captcha-question-expr {
          font-size: 20px;
          font-weight: var(--font-weight-medium);
          color: var(--color-text-primary);
          letter-spacing: 1px;
          flex: 1;
        }

        .captcha-refresh {
          width: 28px;
          height: 28px;
          border-radius: var(--radius-round);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text-tertiary);
          transition: all 0.2s ease;
          flex-shrink: 0;
          border: none;
          background: none;
          cursor: pointer;
        }

        .captcha-refresh:hover:not(:disabled) {
          background: var(--color-bg-white);
          color: var(--color-primary);
          transform: rotate(90deg);
        }

        .captcha-form {
          display: flex;
          gap: var(--space-sm);
        }

        .captcha-input {
          flex: 1;
          height: 42px;
          border: 1px solid var(--color-border-light);
          border-radius: var(--radius-sm);
          padding: 0 var(--space-md);
          font-size: 15px;
          color: var(--color-text-primary);
          background: var(--color-bg-white);
          transition: all 0.2s ease;
        }

        .captcha-input:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px rgba(42, 122, 80, 0.08);
        }

        .captcha-input--error {
          border-color: var(--color-red);
          box-shadow: 0 0 0 3px rgba(226, 75, 74, 0.08);
        }

        .captcha-input--success {
          border-color: var(--color-primary);
          background: var(--color-bg-mint);
        }

        .captcha-submit {
          height: 42px;
          padding: 0 var(--space-xl);
          background: var(--color-primary);
          color: white;
          border-radius: var(--radius-sm);
          font-size: 13px;
          font-weight: var(--font-weight-medium);
          display: flex;
          align-items: center;
          gap: var(--space-xs);
          white-space: nowrap;
          transition: all 0.2s ease;
          border: none;
          cursor: pointer;
        }

        .captcha-submit:hover:not(:disabled) {
          background: var(--color-primary-dark);
        }

        .captcha-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .captcha-submit--success {
          background: var(--color-primary) !important;
          opacity: 1 !important;
        }

        .captcha-error-msg {
          font-size: 12px;
          color: var(--color-red);
          text-align: center;
          margin-top: var(--space-sm);
        }
      `}</style>
    </div>
  );
}

export default function SelectClassPage() {
  return (
    <Suspense fallback={
      <div className="selection-page">
        <div style={{ textAlign: "center", color: "var(--color-text-secondary)" }}>
          Loading class selection...
        </div>
      </div>
    }>
      <ClassSelectionForm />
    </Suspense>
  );
}
