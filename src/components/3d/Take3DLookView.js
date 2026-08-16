"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ThreeDGraphViewer from "./ThreeDGraphViewer";
import GraphViewer2D from "./GraphViewer2D";
import MathText from "../MathText";
import "./take-3d-look.css";

const sampleEquations = [
  { label: "Linear: 2x + 3", eq: "2x + 3", desc: "Degree 1 straight line polynomial" },
  { label: "Quadratic: x² + 3x + 2", eq: "x^2 + 3x + 2", desc: "Degree 2 parabola curve" },
  { label: "Difference of Squares: x² - 4", eq: "x^2 - 4", desc: "Factorable polynomial (x-2)(x+2)" },
  { label: "Linear: 2x + 5", eq: "2x + 5", desc: "Slope m=2, intercept c=5" },
  { label: "Wave Surface: sin(x) * cos(y)", eq: "sin(x) * cos(y)", desc: "Trigonometric 3D wave surface" },
  { label: "Paraboloid: x² + y²", eq: "x^2 + y^2", desc: "3D circular paraboloid bowl" },
  { label: "Saddle: x³ - 3xy²", eq: "x^3 - 3*x*y^2", desc: "Monkey saddle surface" },
];

const themeOptions = [
  { id: "curious", label: "Curious Forest", icon: "🌲" },
  { id: "neon", label: "Neon Cyber", icon: "⚡" },
  { id: "rainbow", label: "Rainbow", icon: "🌈" },
  { id: "volcano", label: "Volcano Heat", icon: "🌋" },
  { id: "ocean", label: "Deep Ocean", icon: "🌊" },
];

export default function Take3DLookView({ initialEquation = "2x + 3" }) {
  const router = useRouter();
  const [equation, setEquation] = useState(initialEquation || "2x + 3");
  const [viewMode, setViewMode] = useState("BOTH"); // BOTH, 3D, 2D
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);
  const [ampScale, setAmpScale] = useState(1.0);
  const [colorPalette, setColorPalette] = useState("curious");
  const [cameraPreset, setCameraPreset] = useState("iso");

  // Dropdown open state
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const themeRef = useRef(null);

  // Coordinate inspector inputs
  const [inputX, setInputX] = useState(2);
  const [inputY, setInputY] = useState(2);

  // Fullscreen state for 3D Interactive Surface Model
  const [is3DFullscreen, setIs3DFullscreen] = useState(false);

  // Handle Esc key to exit 3D fullscreen
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape" && is3DFullscreen) {
        setIs3DFullscreen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [is3DFullscreen]);

  // Sync equation when navigated from a different chat message
  useEffect(() => {
    if (initialEquation && initialEquation !== "2x + 3") {
      setEquation(initialEquation);
    }
  }, [initialEquation]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (themeRef.current && !themeRef.current.contains(event.target)) {
        setIsThemeOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectSample = (sampleEq) => {
    setEquation(sampleEq);
  };

  const handleGoBack = () => {
    if (typeof window !== "undefined") {
      const fromChat = sessionStorage.getItem("curiousclass_from_chat");
      const returnSubject = sessionStorage.getItem("curiousclass_return_subject");
      const returnTopic = sessionStorage.getItem("curiousclass_return_topic");

      sessionStorage.removeItem("curiousclass_from_chat");

      if (fromChat === "true" && window.history.length > 1) {
        router.back();
        return;
      }

      if (returnSubject) {
        let path = returnSubject === "history" ? "/student" : `/student/${returnSubject}`;
        if (returnTopic) {
          path += `?topic=${encodeURIComponent(returnTopic)}`;
        }
        router.push(path);
        return;
      }

      if (window.history.length > 1 && document.referrer && document.referrer.includes(window.location.host)) {
        router.back();
        return;
      }
    }

    router.push("/student");
  };

  const currentTheme = themeOptions.find((t) => t.id === colorPalette) || themeOptions[0];

  return (
    <div className="look3d-page">
      {/* CuriousClass Top Navigation Bar */}
      <header className="look3d-header">
        <div className="look3d-header-inner">
          <div className="look3d-header-brand">
            <button onClick={handleGoBack} className="look3d-back-btn" title="Back to Chat">
              ←
            </button>
            <div className="look3d-title-group">
              <span className="look3d-app-name">CuriousClass</span>
              <span className="look3d-app-sub">AI-Powered Critical Thinking</span>
            </div>
          </div>

          <div className="look3d-header-actions">
            <span className="look3d-badge">
              🌐 3D & 2D Visualizer
            </span>
            <button onClick={handleGoBack} className="look3d-return-btn">
              ← Return to Explano Chat
            </button>
          </div>
        </div>
      </header>

      {/* Main Page Container */}
      <main className="look3d-main">
        {/* Page Title & Equation Card */}
        <div className="look3d-card">
          <div className="look3d-banner-top">
            <div className="look3d-heading-group">
              <div className="look3d-tag">
                🌐 Interactive 3D Explorer • CuriousClass Special Feature
              </div>
              <h1 className="look3d-h1">
                Take a 3D Look: <span className="look3d-equation-pill"><MathText text={`$${equation}$`} /></span>
              </h1>
              <p className="look3d-subtext">
                Visualize mathematical functions, polynomials, and equations in real-time 3D surface space and 2D line plots. Interact with coordinates, wave animations, and height maps.
              </p>
            </div>

            {/* Custom Equation Input Box */}
            <div className="look3d-input-group">
              <label className="look3d-input-label">Custom Equation Input:</label>
              <div className="look3d-input-box">
                <span className="look3d-input-prefix">f(x,y) =</span>
                <input
                  type="text"
                  value={equation}
                  onChange={(e) => setEquation(e.target.value)}
                  placeholder="e.g. 2x + 3, x^2 - 4"
                  className="look3d-input"
                />
              </div>
            </div>
          </div>

          {/* Quick Example Equation Pills */}
          <div className="look3d-samples-bar">
            <span className="look3d-samples-label">Quick Examples:</span>
            {sampleEquations.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectSample(item.eq)}
                className={`look3d-chip ${equation.trim() === item.eq ? "look3d-chip--active" : ""}`}
                title={item.desc}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Controls Panel Card */}
        <div className="look3d-controls-card">
          {/* Row 1: Mode Switcher & Feature Toggles */}
          <div className="look3d-controls-row">
            {/* View Mode Buttons (Default state with neither selected shows both) */}
            <div className="look3d-button-group">
              <button
                onClick={() => setViewMode((prev) => (prev === "3D" ? "BOTH" : "3D"))}
                className={`look3d-toggle-btn ${viewMode === "3D" ? "look3d-toggle-btn--active" : ""}`}
              >
                🧊 3D Graph Only
              </button>
              <button
                onClick={() => setViewMode((prev) => (prev === "2D" ? "BOTH" : "2D"))}
                className={`look3d-toggle-btn ${viewMode === "2D" ? "look3d-toggle-btn--active" : ""}`}
              >
                📈 2D Line Plot Only
              </button>
            </div>

            {/* 3D Feature Toggles */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <button
                onClick={() => setIsAnimated((prev) => !prev)}
                className={`look3d-action-btn ${isAnimated ? "look3d-action-btn--active" : ""}`}
              >
                🌊 Animated Waves: {isAnimated ? "ON" : "OFF"}
              </button>

              <button
                onClick={() => setWireframe((prev) => !prev)}
                className={`look3d-action-btn ${wireframe ? "look3d-action-btn--active" : ""}`}
              >
                🕸️ Wireframe: {wireframe ? "ON" : "OFF"}
              </button>

              <button
                onClick={() => setAutoRotate((prev) => !prev)}
                className={`look3d-action-btn ${autoRotate ? "look3d-action-btn--active" : ""}`}
              >
                🔄 Auto-Spin: {autoRotate ? "ON" : "OFF"}
              </button>
            </div>
          </div>

          {/* Row 2: Coordinate Input, Height Scale, Restyled Theme Selector, Camera Presets */}
          <div className="look3d-controls-row" style={{ paddingTop: "8px", borderTop: "0.5px solid var(--color-border-light, #E5E5E5)" }}>
            {/* Coordinate Input Box */}
            <div className="look3d-control-box">
              <span>🎯 Coordinate Input:</span>
              <span style={{ color: "#d97706" }}>X:</span>
              <input
                type="number"
                step="0.5"
                value={inputX}
                onChange={(e) => setInputX(e.target.value)}
                className="look3d-num-input"
              />
              <span style={{ color: "#2563eb", marginLeft: "4px" }}>Y:</span>
              <input
                type="number"
                step="0.5"
                value={inputY}
                onChange={(e) => setInputY(e.target.value)}
                className="look3d-num-input"
              />
            </div>

            {/* Height Scale Slider */}
            <div className="look3d-control-box">
              <span>Height Scale:</span>
              <input
                type="range"
                min="0.2"
                max="3.0"
                step="0.1"
                value={ampScale}
                onChange={(e) => setAmpScale(Number(e.target.value))}
                className="look3d-range-input"
              />
              <span style={{ color: "var(--color-primary, #2A7A50)", fontFamily: "monospace" }}>{ampScale.toFixed(1)}x</span>
            </div>

            {/* Custom Restyled Theme Selector Dropdown */}
            <div className="look3d-control-box" style={{ padding: "4px 8px" }}>
              <span style={{ color: "var(--color-text-secondary, #666)" }}>Theme:</span>
              <div className="look3d-select-wrapper" ref={themeRef}>
                <button
                  type="button"
                  onClick={() => setIsThemeOpen((prev) => !prev)}
                  className="look3d-select-trigger"
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span>{currentTheme.icon}</span>
                    <span>{currentTheme.label}</span>
                  </span>
                  <svg
                    className={`look3d-select-chevron ${isThemeOpen ? "look3d-select-chevron--open" : ""}`}
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {isThemeOpen && (
                  <div className="look3d-select-menu">
                    {themeOptions.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setColorPalette(opt.id);
                          setIsThemeOpen(false);
                        }}
                        className={`look3d-select-option ${colorPalette === opt.id ? "look3d-select-option--active" : ""}`}
                      >
                        <span>{opt.icon}</span>
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Camera Presets */}
            <div className="look3d-button-group">
              <span style={{ fontSize: "11px", padding: "0 4px", color: "var(--color-text-secondary, #666)" }}>Camera:</span>
              <button
                onClick={() => setCameraPreset("iso")}
                className={`look3d-toggle-btn ${cameraPreset === "iso" ? "look3d-toggle-btn--active" : ""}`}
              >
                Isometric
              </button>
              <button
                onClick={() => setCameraPreset("top")}
                className={`look3d-toggle-btn ${cameraPreset === "top" ? "look3d-toggle-btn--active" : ""}`}
              >
                Top (XY)
              </button>
              <button
                onClick={() => setCameraPreset("front")}
                className={`look3d-toggle-btn ${cameraPreset === "front" ? "look3d-toggle-btn--active" : ""}`}
              >
                Front (XZ)
              </button>
            </div>
          </div>
        </div>

        {/* Viewport Render Area */}
        {viewMode === "BOTH" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div className={`look3d-viewport-card ${is3DFullscreen ? "look3d-viewport-card--fullscreen" : ""}`}>
              <div className="look3d-viewport-header">
                <h3 className="look3d-viewport-title">
                  <span>🧊 3D Interactive Surface Model</span>
                  <span className="look3d-badge">z = {equation}</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIs3DFullscreen((prev) => !prev)}
                  className="look3d-fullscreen-btn"
                  title={is3DFullscreen ? "Exit Fullscreen (Esc)" : "Expand 3D Model to Fullscreen"}
                >
                  <span>{is3DFullscreen ? "🗗" : "⛶"}</span>
                  <span>{is3DFullscreen ? "Exit Fullscreen" : "Fullscreen"}</span>
                </button>
              </div>
              <ThreeDGraphViewer
                equation={equation}
                wireframe={wireframe}
                autoRotate={autoRotate}
                isAnimated={isAnimated}
                ampScale={ampScale}
                colorPalette={colorPalette}
                cameraPreset={cameraPreset}
                inputX={inputX}
                inputY={inputY}
                is3DFullscreen={is3DFullscreen}
              />
            </div>

            <div className="look3d-viewport-card">
              <div className="look3d-viewport-header">
                <h3 className="look3d-viewport-title">
                  <span>📈 2D Scatter Line Plot</span>
                  <span className="look3d-badge">y = {equation}</span>
                </h3>
              </div>
              <GraphViewer2D equation={equation} />
            </div>
          </div>
        ) : viewMode === "3D" ? (
          <div className={`look3d-viewport-card ${is3DFullscreen ? "look3d-viewport-card--fullscreen" : ""}`}>
            <div className="look3d-viewport-header">
              <h3 className="look3d-viewport-title">
                <span>🧊 3D Interactive Surface Model</span>
                <span className="look3d-badge">z = {equation}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIs3DFullscreen((prev) => !prev)}
                className="look3d-fullscreen-btn"
                title={is3DFullscreen ? "Exit Fullscreen (Esc)" : "Expand 3D Model to Fullscreen"}
              >
                <span>{is3DFullscreen ? "🗗" : "⛶"}</span>
                <span>{is3DFullscreen ? "Exit Fullscreen" : "Fullscreen"}</span>
              </button>
            </div>
            <ThreeDGraphViewer
              equation={equation}
              wireframe={wireframe}
              autoRotate={autoRotate}
              isAnimated={isAnimated}
              ampScale={ampScale}
              colorPalette={colorPalette}
              cameraPreset={cameraPreset}
              inputX={inputX}
              inputY={inputY}
              is3DFullscreen={is3DFullscreen}
            />
          </div>
        ) : (
          <div className="look3d-viewport-card">
            <div className="look3d-viewport-header">
              <h3 className="look3d-viewport-title">
                <span>📈 2D Scatter Line Plot</span>
                <span className="look3d-badge">y = {equation}</span>
              </h3>
            </div>
            <GraphViewer2D equation={equation} />
          </div>
        )}
      </main>
    </div>
  );
}
