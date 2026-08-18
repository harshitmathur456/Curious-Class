"use client";

import React from "react";
import Link from "next/link";

export default class GraphErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error?.message || "Unknown error" };
  }

  componentDidCatch(error, errorInfo) {
    console.error("[GraphErrorBoundary] Caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
          fontFamily: "'Inter', 'Segoe UI', sans-serif",
          padding: "32px",
        }}>
          <div style={{
            maxWidth: "520px",
            width: "100%",
            background: "rgba(30, 41, 59, 0.9)",
            borderRadius: "20px",
            border: "1px solid rgba(148, 163, 184, 0.15)",
            padding: "48px 36px",
            textAlign: "center",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          }}>
            <div style={{ fontSize: "3.5rem", marginBottom: "16px" }}>⚠️</div>
            <h2 style={{
              fontSize: "22px",
              fontWeight: "800",
              color: "#F8FAFC",
              margin: "0 0 12px 0",
              letterSpacing: "-0.02em",
            }}>
              Couldn't Parse This Equation
            </h2>
            <p style={{
              fontSize: "14px",
              color: "#94A3B8",
              lineHeight: "1.7",
              margin: "0 0 8px 0",
            }}>
              The graph engine encountered an issue while trying to visualize this equation. This may happen with very complex or unusual formatting.
            </p>
            {this.state.errorMessage && (
              <p style={{
                fontSize: "12px",
                color: "#EF4444",
                fontFamily: "monospace",
                background: "rgba(239, 68, 68, 0.1)",
                borderRadius: "8px",
                padding: "10px 14px",
                margin: "16px 0",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                wordBreak: "break-all",
              }}>
                {this.state.errorMessage}
              </p>
            )}
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "24px" }}>
              <button
                onClick={() => this.setState({ hasError: false, errorMessage: "" })}
                style={{
                  padding: "10px 24px",
                  borderRadius: "10px",
                  border: "1px solid rgba(56, 189, 248, 0.3)",
                  background: "rgba(56, 189, 248, 0.1)",
                  color: "#38BDF8",
                  fontWeight: "700",
                  fontSize: "13px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                🔄 Try Again
              </button>
              <Link
                href="/student"
                style={{
                  padding: "10px 24px",
                  borderRadius: "10px",
                  border: "1px solid rgba(148, 163, 184, 0.2)",
                  background: "rgba(148, 163, 184, 0.08)",
                  color: "#CBD5E1",
                  fontWeight: "700",
                  fontSize: "13px",
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
              >
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
