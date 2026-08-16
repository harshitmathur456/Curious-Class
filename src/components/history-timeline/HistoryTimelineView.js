"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MathText from "../MathText";
import { getTimelineForTopic } from "@/data/historyTimelines";
import "./history-timeline.css";

export default function HistoryTimelineView({ topic = "salt-march" }) {
  const router = useRouter();
  const timelineData = getTimelineForTopic(topic);
  const events = timelineData?.events || [];

  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Sync active item when topic changes
  useEffect(() => {
    setActiveIndex(0);
    setHoveredIndex(null);
  }, [topic]);

  const currentIdx = hoveredIndex !== null ? hoveredIndex : activeIndex;
  const activeItem = events[currentIdx] || events[0] || {};

  const handleGoBack = () => {
    if (typeof window !== "undefined") {
      const returnSubject = sessionStorage.getItem("curiousclass_return_subject") || "history";
      const returnTopic = sessionStorage.getItem("curiousclass_return_topic");

      let path = returnSubject === "history" ? "/student" : `/student/${returnSubject}`;
      if (returnTopic) {
        path += `?topic=${encodeURIComponent(returnTopic)}`;
      }
      router.push(path);
      return;
    }
    router.push("/student");
  };

  return (
    <div className="ht-page">
      {/* CuriousClass Top Navigation Bar */}
      <header className="ht-header">
        <div className="ht-header-inner">
          <div className="ht-header-brand">
            <button onClick={handleGoBack} className="ht-back-btn" title="Back to Chat">
              ←
            </button>
            <div className="ht-title-group">
              <span className="ht-app-name">CuriousClass</span>
              <span className="ht-app-sub">AI-Powered Critical Thinking</span>
            </div>
          </div>

          <div className="ht-header-actions">
            <span className="ht-badge">
              📜 History Timeline Explorer
            </span>
            <button onClick={handleGoBack} className="ht-return-btn">
              ← Return to Explano Chat
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="ht-main">
        {/* Title & Topic Header Card */}
        <div className="ht-card">
          <div className="ht-heading-group">
            <div className="ht-tag">
              📜 Interactive History Timeline • CuriousClass Special Feature
            </div>
            <h1 className="ht-h1">
              {timelineData.title}
            </h1>
            <p className="ht-subtext">
              {timelineData.subtitle || "Explore key historical turning points, strategic developments, and major events in chronological order."}
            </p>
          </div>

          {/* Year Quick Navigation Bar */}
          <div className="ht-year-bar">
            <span style={{ fontSize: "12px", fontWeight: 500, color: "var(--color-text-secondary, #666)" }}>
              Timeline Navigation:
            </span>
            {events.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`ht-year-chip ${idx === currentIdx ? "ht-year-chip--active" : ""}`}
              >
                <span>📅 {item.year}</span>
                <span style={{ opacity: 0.75 }}>| {item.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Split Layout: Left Chain vs Right Detail Drawer */}
        <div className="ht-split-grid">
          {/* Left Column: Interactive Timeline Chain */}
          <div className="ht-chain-container">
            {events.map((item, index) => {
              const isActive = index === currentIdx;
              const isLast = index === events.length - 1;

              return (
                <div
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="ht-chain-item"
                >
                  {/* Node Circle & Connector Line */}
                  <div className="ht-node-column">
                    <div className={`ht-node-circle ${isActive ? "ht-node-circle--active" : ""}`}>
                      {index + 1}
                    </div>
                    {!isLast && <div className="ht-node-line" />}
                  </div>

                  {/* Event Card */}
                  <div className={`ht-event-card ${isActive ? "ht-event-card--active" : ""}`}>
                    <div className="ht-event-card-header">
                      <span className="ht-date-pill">
                        📅 {item.year}
                      </span>
                      <span className="ht-event-seq">
                        Event {index + 1} of {events.length}
                      </span>
                    </div>

                    <h3 className="ht-event-title">
                      <MathText text={item.title} />
                    </h3>

                    <p className="ht-event-desc">
                      <MathText text={item.description} />
                    </p>

                    <div style={{ fontSize: "11px", fontWeight: 500, color: "var(--color-primary, #2A7A50)", display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}>
                      <span>Hover or click to inspect deep dive details</span>
                      <span>→</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Event Deep Dive Drawer */}
          <div className="ht-detail-card">
            <div className="ht-detail-header">
              <span className="ht-detail-tag">
                🔍 Event Deep Dive
              </span>
              <span className="ht-badge">
                📅 {activeItem.year}
              </span>
            </div>

            <div>
              <h2 className="ht-detail-title">
                <MathText text={activeItem.title || "Historical Event"} />
              </h2>
              <p className="ht-subtext" style={{ marginTop: "8px" }}>
                <MathText text={activeItem.description} />
              </p>
            </div>

            {/* Historical Significance & Impact */}
            <div className="ht-detail-box">
              <span className="ht-detail-box-label">
                ⚡ Historical Significance & Impact
              </span>
              <div className="ht-detail-box-body">
                <MathText text={activeItem.impact || "Key turning point that shaped democratic, social, and political developments."} />
              </div>
            </div>

            {/* Key Figures & Actors */}
            {activeItem.keyFigures && (
              <div className="ht-detail-box">
                <span className="ht-detail-box-label">
                  👥 Key Figures & Actors
                </span>
                <div className="ht-detail-box-body">
                  <MathText text={activeItem.keyFigures} />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="ht-nav-row">
              <button
                disabled={activeIndex === 0}
                onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
                className="ht-nav-btn"
              >
                ← Prev Event
              </button>
              <span style={{ color: "var(--color-text-tertiary, #999)" }}>
                {activeIndex + 1} of {events.length}
              </span>
              <button
                disabled={activeIndex === events.length - 1}
                onClick={() => setActiveIndex(Math.min(events.length - 1, activeIndex + 1))}
                className="ht-nav-btn"
              >
                Next Event →
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
