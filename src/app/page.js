"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/* ─── Generate a simple math CAPTCHA ─────────────────────────── */
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

/* ─── Icons ──────────────────────────────────────────────────── */

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

function XIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
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

/* ─── Main Component ─────────────────────────────────────────── */

export default function Home() {
  const router = useRouter();
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [captcha, setCaptcha] = useState(generateCaptcha);
  const [userAnswer, setUserAnswer] = useState("");
  const [status, setStatus] = useState("idle"); // idle | success | error
  const [isVerifying, setIsVerifying] = useState(false);
  const [shake, setShake] = useState(false);

  function handleCardClick(role) {
    setSelectedRole(role);
    setCaptcha(generateCaptcha());
    setUserAnswer("");
    setStatus("idle");
    setShake(false);
    setShowCaptcha(true);
  }

  function handleRefresh() {
    setCaptcha(generateCaptcha());
    setUserAnswer("");
    setStatus("idle");
    setShake(false);
  }

  function handleClose() {
    setShowCaptcha(false);
    setStatus("idle");
    setUserAnswer("");
  }

  async function handleVerify(e) {
    e.preventDefault();
    if (!userAnswer.trim() || isVerifying) return;

    setIsVerifying(true);
    const isCorrect = parseInt(userAnswer.trim(), 10) === captcha.answer;

    // Log to Supabase
    try {
      await fetch("/api/captcha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: selectedRole,
          captcha_answer: userAnswer.trim(),
          is_correct: isCorrect,
        }),
      });
    } catch (err) {
      console.error("Failed to log captcha:", err);
    }

    if (isCorrect) {
      setStatus("success");
      setTimeout(() => {
        const dest = selectedRole === "student" ? "/student" : "/teacher";
        router.push(dest);
      }, 800);
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
    <div className="landing-page">
      <div className="landing-container">
        <div className="landing-brand">
          <div className="landing-logo">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="40" height="40" rx="12" fill="#2A7A50"/>
              <path d="M12 28V16C12 13.8 13.8 12 16 12H24C26.2 12 28 13.8 28 16V24C28 26.2 26.2 28 24 28H12Z" fill="#EAF3DE"/>
              <circle cx="18" cy="18" r="2" fill="#2A7A50"/>
              <circle cx="24" cy="18" r="2" fill="#2A7A50"/>
              <path d="M16 23C16 23 18 25 21 25C24 25 26 23 26 23" stroke="#2A7A50" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className="landing-title">CuriousClass</h1>
          <p className="landing-tagline">AI-powered critical thinking for every classroom</p>
        </div>

        <div className="landing-cards">
          <button
            type="button"
            className="landing-card"
            id="student-entry"
            onClick={() => handleCardClick("student")}
          >
            <div className="landing-card-icon landing-card-icon--student">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <div className="landing-card-content">
              <h2>Student Chat</h2>
              <p>Start a conversation with the AI tutor. Explore topics through Socratic dialogue and critical thinking challenges.</p>
            </div>
            <div className="landing-card-arrow">→</div>
          </button>

          <button
            type="button"
            className="landing-card"
            id="teacher-entry"
            onClick={() => handleCardClick("teacher")}
          >
            <div className="landing-card-icon landing-card-icon--teacher">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1"/>
                <rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/>
                <rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
            </div>
            <div className="landing-card-content">
              <h2>Teacher Dashboard</h2>
              <p>Monitor student comprehension in real-time. View heatmaps, focus alerts, and AI-generated insights.</p>
            </div>
            <div className="landing-card-arrow">→</div>
          </button>
        </div>

        <p className="landing-footer">Built for Indian government schools · Class 6–10 · Works on 2G</p>
      </div>

      {/* ── CAPTCHA Modal Overlay ── */}
      {showCaptcha && (
        <div className="captcha-overlay" onClick={handleClose}>
          <div
            className={`captcha-modal ${shake ? "captcha-modal--shake" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button className="captcha-close" onClick={handleClose} aria-label="Close">
              <XIcon />
            </button>

            {/* Header */}
            <div className="captcha-header">
              <div className={`captcha-shield ${status === "success" ? "captcha-shield--success" : ""}`}>
                {status === "success" ? <CheckIcon /> : <ShieldIcon />}
              </div>
              <div className="captcha-header-text">
                <h3>Quick Verification</h3>
                <p>Solve this to continue as <span className="captcha-role-tag">{selectedRole}</span></p>
              </div>
            </div>

            {/* Question */}
            <div className="captcha-question-box">
              <div className="captcha-question-label">What is</div>
              <div className="captcha-question-expr">{captcha.question}</div>
              <button
                className="captcha-refresh"
                onClick={handleRefresh}
                title="New question"
                type="button"
              >
                <RefreshIcon />
              </button>
            </div>

            {/* Input + Submit */}
            <form onSubmit={handleVerify} className="captcha-form">
              <div className="captcha-input-wrap">
                <input
                  type="number"
                  className={`captcha-input ${status === "error" ? "captcha-input--error" : ""} ${status === "success" ? "captcha-input--success" : ""}`}
                  placeholder="Your answer"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  autoFocus
                  disabled={status === "success"}
                />
              </div>
              <button
                type="submit"
                className={`captcha-submit ${status === "success" ? "captcha-submit--success" : ""}`}
                disabled={!userAnswer.trim() || isVerifying || status === "success"}
              >
                {status === "success" ? (
                  <>
                    <CheckIcon /> Verified!
                  </>
                ) : (
                  "Verify"
                )}
              </button>
            </form>

            {/* Error message */}
            {status === "error" && (
              <div className="captcha-error-msg">Incorrect answer. Trying a new one...</div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .landing-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-bg-page);
          padding: var(--space-2xl);
        }

        .landing-container {
          max-width: 520px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-3xl);
        }

        .landing-brand {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-sm);
        }

        .landing-logo {
          margin-bottom: var(--space-sm);
        }

        .landing-title {
          font-size: 28px;
          font-weight: var(--font-weight-medium);
          color: var(--color-text-primary);
          letter-spacing: -0.5px;
        }

        .landing-tagline {
          font-size: 14px;
          color: var(--color-text-secondary);
        }

        .landing-cards {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .landing-card {
          display: flex;
          align-items: center;
          gap: var(--space-lg);
          background: var(--color-bg-white);
          border: 0.5px solid var(--color-border-light);
          border-radius: var(--radius-lg);
          padding: var(--space-xl) var(--space-2xl);
          transition: border-color 0.2s ease;
          text-align: left;
          width: 100%;
        }

        .landing-card:hover {
          border-color: var(--color-primary);
        }

        .landing-card-icon {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .landing-card-icon--student {
          background: var(--color-bg-mint);
          color: var(--color-primary);
        }

        .landing-card-icon--teacher {
          background: var(--color-purple-bg);
          color: var(--color-purple);
        }

        .landing-card-content {
          flex: 1;
          min-width: 0;
        }

        .landing-card-content h2 {
          font-size: 15px;
          font-weight: var(--font-weight-medium);
          color: var(--color-text-primary);
          margin-bottom: 4px;
        }

        .landing-card-content p {
          font-size: 12px;
          color: var(--color-text-secondary);
          line-height: 1.5;
        }

        .landing-card-arrow {
          font-size: 18px;
          color: var(--color-text-tertiary);
          flex-shrink: 0;
          transition: transform 0.2s ease;
        }

        .landing-card:hover .landing-card-arrow {
          transform: translateX(4px);
          color: var(--color-primary);
        }

        .landing-footer {
          font-size: 11px;
          color: var(--color-text-tertiary);
          text-align: center;
        }

        /* ── Captcha Modal ── */

        .captcha-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.35);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: captchaFadeIn 0.2s ease;
        }

        @keyframes captchaFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .captcha-modal {
          background: var(--color-bg-white);
          border-radius: var(--radius-lg);
          padding: var(--space-2xl) var(--space-2xl) var(--space-xl);
          width: 360px;
          max-width: 90vw;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 0.5px var(--color-border-light);
          position: relative;
          animation: captchaSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes captchaSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .captcha-modal--shake {
          animation: captchaShake 0.4s ease;
        }

        @keyframes captchaShake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }

        .captcha-close {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 28px;
          height: 28px;
          border-radius: var(--radius-round);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text-tertiary);
          transition: all 0.15s ease;
        }

        .captcha-close:hover {
          background: var(--color-bg-page);
          color: var(--color-text-primary);
        }

        .captcha-header {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          margin-bottom: var(--space-xl);
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
          font-size: 15px;
          font-weight: var(--font-weight-medium);
          color: var(--color-text-primary);
          margin-bottom: 2px;
        }

        .captcha-header-text p {
          font-size: 12px;
          color: var(--color-text-secondary);
        }

        .captcha-role-tag {
          display: inline-block;
          background: var(--color-bg-mint);
          color: var(--color-primary);
          padding: 1px 8px;
          border-radius: var(--radius-pill);
          font-weight: var(--font-weight-medium);
          font-size: 11px;
          text-transform: capitalize;
        }

        .captcha-question-box {
          background: var(--color-bg-page);
          border: 0.5px solid var(--color-border-light);
          border-radius: var(--radius-md);
          padding: var(--space-lg) var(--space-xl);
          margin-bottom: var(--space-lg);
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          position: relative;
        }

        .captcha-question-label {
          font-size: 12px;
          color: var(--color-text-tertiary);
          white-space: nowrap;
        }

        .captcha-question-expr {
          font-size: 22px;
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
        }

        .captcha-refresh:hover {
          background: var(--color-bg-white);
          color: var(--color-primary);
          transform: rotate(90deg);
        }

        .captcha-form {
          display: flex;
          gap: var(--space-sm);
          margin-bottom: var(--space-sm);
        }

        .captcha-input-wrap {
          flex: 1;
        }

        .captcha-input {
          width: 100%;
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

        .captcha-input::-webkit-inner-spin-button,
        .captcha-input::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .captcha-input[type="number"] {
          -moz-appearance: textfield;
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
          margin-top: var(--space-xs);
          animation: captchaFadeIn 0.2s ease;
        }
      `}</style>
    </div>
  );
}
