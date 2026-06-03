import Link from "next/link";

export default function Home() {
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
          <Link href="/student" className="landing-card" id="student-entry">
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
          </Link>

          <Link href="/teacher" className="landing-card" id="teacher-entry">
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
          </Link>
        </div>

        <p className="landing-footer">Built for Indian government schools · Class 6–10 · Works on 2G</p>
      </div>

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
      `}</style>
    </div>
  );
}
