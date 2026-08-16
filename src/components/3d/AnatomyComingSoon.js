"use client";

import React from "react";

/**
 * A styled "Coming Soon" placeholder card for anatomy keywords
 * that don't yet have a .glb model file.
 * 
 * Matches CuriousClass design system — white card, green accents, mint background.
 */
export default function AnatomyComingSoon({ label = "3D Model", icon = "🧬" }) {
  return (
    <div
      style={{
        marginTop: "12px",
        borderRadius: "var(--radius-md, 12px)",
        border: "1px dashed var(--color-bg-mint-border, #C0DD97)",
        background: "var(--color-bg-mint, #EAF3DE)",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        minHeight: "180px",
      }}
    >
      {/* Pulsing Icon */}
      <div
        style={{
          fontSize: "48px",
          lineHeight: 1,
          animation: "pulse 2s ease-in-out infinite",
          opacity: 0.7,
        }}
      >
        {icon}
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: "15px",
          fontWeight: 600,
          color: "var(--color-primary-dark, #27500A)",
          textAlign: "center",
        }}
      >
        {label}
      </div>

      {/* Coming Soon Badge */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          background: "var(--color-bg-white, #FFFFFF)",
          border: "1px solid var(--color-bg-mint-border, #C0DD97)",
          borderRadius: "var(--radius-pill, 20px)",
          padding: "6px 16px",
          fontSize: "12px",
          fontWeight: 600,
          color: "var(--color-primary, #2A7A50)",
        }}
      >
        <span>🔬</span>
        3D Interactive Model — Coming Soon
      </div>

      {/* Subtext */}
      <p
        style={{
          fontSize: "12px",
          color: "var(--color-text-tertiary, #999)",
          textAlign: "center",
          maxWidth: "320px",
          lineHeight: 1.5,
          margin: 0,
        }}
      >
        We&apos;re building an interactive 3D model for this organ.
        Check back soon for a fully rotatable, zoomable experience!
      </p>

      {/* Inline pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.08); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
