"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { compile } from "mathjs";
import ThreeDGraphViewer from "./ThreeDGraphViewer";
import GraphViewer2D, { analyzeEquation, sanitizeEquationString, cleanSingleExpression } from "./GraphViewer2D";
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
  { id: "curious", label: "Curious Emerald", icon: "🟢" },
  { id: "emerald", label: "Emerald Mint", icon: "🌱" },
  { id: "rainbow", label: "Rainbow Spectrum", icon: "🌈" },
  { id: "neon", label: "Neon Cyber", icon: "⚡" },
  { id: "volcano", label: "Volcano Heat", icon: "🌋" },
  { id: "ocean", label: "Deep Ocean", icon: "🌊" },
];

export default function Take3DLookView({ initialEquation = "2x + 3" }) {
  const router = useRouter();
  const cleanInitial = useMemo(() => sanitizeEquationString(initialEquation), [initialEquation]);
  const [equation, setEquation] = useState(cleanInitial || "2x + 3");
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

  // Fullscreen state for 3D Interactive Surface Model
  const [is3DFullscreen, setIs3DFullscreen] = useState(false);

  const eqAnalysis = useMemo(() => {
    try {
      return analyzeEquation(equation);
    } catch (e) {
      console.error("[Take3DLookView] analyzeEquation error:", e);
      return { raw: equation, clean: equation, variables: ["x"], varCount: 1, hasEquals: false, sides: [equation], cleanSides: [equation], isSingleVariableEquation: false };
    }
  }, [equation]);
  const is1Var = eqAnalysis.varCount < 2;
  const effectiveViewMode = viewMode;

  // Dynamic Variable Input state (e.g. { n: 50 } or { x: 2, y: 2 })
  const [varValues, setVarValues] = useState({});

  // Derived helper for legacy inputX / inputY props on GraphViewers
  const inputX = varValues.x !== undefined ? varValues.x : (varValues.n !== undefined ? varValues.n : 2);
  const inputY = varValues.y !== undefined ? varValues.y : 2;

  const indepVarLabel = useMemo(() => {
    if (!eqAnalysis || !eqAnalysis.variables || eqAnalysis.variables.length === 0) return "x";
    return eqAnalysis.variables[0];
  }, [eqAnalysis]);

  const depVarLabel = useMemo(() => {
    if (!eqAnalysis) return "y";
    if (eqAnalysis.explicitTarget) {
      return eqAnalysis.explicitTarget.toLowerCase() === "a_n" ? "aₙ" : eqAnalysis.explicitTarget;
    }
    const mainVar = eqAnalysis.variables ? eqAnalysis.variables[0] : "x";
    return mainVar === "n" ? "aₙ" : "y";
  }, [eqAnalysis]);

  // Sync default variable values whenever equation analysis updates
  useEffect(() => {
    if (eqAnalysis && eqAnalysis.variables) {
      const initial = {};
      eqAnalysis.variables.forEach((v) => {
        if (v === "n") initial[v] = 50;
        else if (v === "x") initial[v] = 2;
        else if (v === "y") initial[v] = 2;
        else initial[v] = 5;
      });
      setVarValues(initial);
    }
  }, [eqAnalysis]);

  // Compute live output for readout card
  const liveOutput = useMemo(() => {
    if (!eqAnalysis || !eqAnalysis.variables) return null;
    const { explicitTarget, cleanSides, variables, hasEquals } = eqAnalysis;

    const numericVars = {};
    for (const v of variables) {
      const rawVal = varValues[v];
      if (rawVal === undefined || rawVal === "" || isNaN(Number(rawVal))) {
        return null;
      }
      numericVars[v] = Number(rawVal);
    }

    try {
      if (explicitTarget) {
        const cleanRHS = cleanSingleExpression(cleanSides[0]);
        const compiled = compile(cleanRHS);
        const val = compiled.evaluate(numericVars);
        const rounded = typeof val === "number" ? Math.round(val * 1000) / 1000 : val;
        const displaySymbol = explicitTarget.toLowerCase() === "a_n" ? "aₙ" : explicitTarget;
        return { label: displaySymbol, formatted: `${displaySymbol} = ${rounded}` };
      } else if (hasEquals && cleanSides.length >= 2) {
        const cleanLHS = cleanSingleExpression(cleanSides[0]);
        const cleanRHS = cleanSingleExpression(cleanSides[1]);
        const lhsVal = compile(cleanLHS).evaluate(numericVars);
        const rhsVal = compile(cleanRHS).evaluate(numericVars);
        const rLHS = typeof lhsVal === "number" ? Math.round(lhsVal * 1000) / 1000 : lhsVal;
        const rRHS = typeof rhsVal === "number" ? Math.round(rhsVal * 1000) / 1000 : rhsVal;
        return { label: "LHS / RHS", formatted: `LHS = ${rLHS} | RHS = ${rRHS}` };
      } else if (cleanSides[0]) {
        const cleanExpr = cleanSingleExpression(cleanSides[0]);
        const compiled = compile(cleanExpr);
        const val = compiled.evaluate(numericVars);
        const rounded = typeof val === "number" ? Math.round(val * 1000) / 1000 : val;
        const mainVar = variables[0] || "x";
        const targetSymbol = mainVar === "n" ? "aₙ" : "y";
        return { label: targetSymbol, formatted: `${targetSymbol} = ${rounded}` };
      }
    } catch (err) {
      return null;
    }
    return null;
  }, [eqAnalysis, varValues]);

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
    if (initialEquation) {
      setEquation(sanitizeEquationString(initialEquation));
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
                🌐 Interactive Visualizer • CuriousClass Special Feature
              </div>
              <h1 className="look3d-h1">
                Visualizing Equation: <span className="look3d-equation-pill"><MathText text={`$${equation}$`} /></span>
              </h1>
              <p className="look3d-subtext">
                {is1Var
                  ? `Single-variable equation in ${indepVarLabel} detected (computing ${depVarLabel}). Rendered as 2D planar lines inside the 3D WebGL canvas (${indepVarLabel.toUpperCase()} & ${depVarLabel} axes) with solution root calculation.`
                  : "Visualize mathematical functions and equations in real-time 3D surface space and 2D line plots."}
              </p>
            </div>

            {/* Custom Equation Input Box */}
            <div className="look3d-input-group">
              <label className="look3d-input-label">Custom Equation Input:</label>
              <div className="look3d-input-box">
                <span className="look3d-input-prefix">
                  {equation.includes("=") ? "Equation:" : is1Var ? "y =" : "z ="}
                </span>
                <input
                  type="text"
                  value={equation}
                  onChange={(e) => setEquation(e.target.value)}
                  placeholder="e.g. x + 5 = 2x - 3, 2x + 3, x^2 + y^2"
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
            {/* View Mode Buttons */}
            <div className="look3d-button-group">
              <button
                onClick={() => setViewMode("BOTH")}
                className={`look3d-toggle-btn ${effectiveViewMode === "BOTH" ? "look3d-toggle-btn--active" : ""}`}
              >
                📊 View Both (3D + 2D)
              </button>
              <button
                onClick={() => setViewMode("3D")}
                className={`look3d-toggle-btn ${effectiveViewMode === "3D" ? "look3d-toggle-btn--active" : ""}`}
              >
                🧊 3D Canvas Only
              </button>
              <button
                onClick={() => setViewMode("2D")}
                className={`look3d-toggle-btn ${effectiveViewMode === "2D" ? "look3d-toggle-btn--active" : ""}`}
              >
                📈 2D Plot Only
              </button>
            </div>

            {/* Feature Toggles */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              {!is1Var && (
                <>
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
                </>
              )}

              <button
                onClick={() => setAutoRotate((prev) => !prev)}
                className={`look3d-action-btn ${autoRotate ? "look3d-action-btn--active" : ""}`}
              >
                🔄 Auto-Spin: {autoRotate ? "ON" : "OFF"}
              </button>
            </div>
          </div>

          {/* Row 2: Controls (Camera presets for all, Surface controls for 2+ vars) */}
          <div className="look3d-controls-row" style={{ paddingTop: "8px", borderTop: "0.5px solid var(--color-border-light, #E5E5E5)" }}>
            {/* Dynamic Variable Input & Live Computed Output Box (Available for ALL equations) */}
            <div className="look3d-control-box" style={{
              backgroundColor: "var(--color-bg-white, #FFFFFF)",
              border: "0.5px solid var(--color-border-secondary, #CBD5E1)",
              borderRadius: "8px",
              padding: "6px 12px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              boxShadow: "none"
            }}>
              <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--color-text-secondary, #64748B)" }}>
                🎯 Variable Input:
              </span>

              {/* Input box for each variable present in the equation */}
              {eqAnalysis && eqAnalysis.variables && eqAnalysis.variables.map((vName) => (
                <div key={vName} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--color-primary-dark, #27500A)", fontFamily: "monospace" }}>
                    {vName}:
                  </span>
                  <input
                    type="number"
                    step="1"
                    value={varValues[vName] !== undefined ? varValues[vName] : ""}
                    onChange={(e) => {
                      const val = e.target.value === "" ? "" : Number(e.target.value);
                      setVarValues((prev) => ({ ...prev, [vName]: val }));
                    }}
                    style={{
                      width: "56px",
                      backgroundColor: "#FFFFFF",
                      border: "0.5px solid var(--color-border-secondary, #CBD5E1)",
                      borderRadius: "8px",
                      padding: "4px 8px",
                      fontSize: "12px",
                      fontWeight: "600",
                      fontFamily: "Inter, Poppins, sans-serif",
                      color: "var(--color-text-primary, #1A1A1A)",
                      textAlign: "center",
                      outline: "none",
                      boxShadow: "none"
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Live Computed Output Stat Card */}
            {liveOutput && (
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "var(--color-bg-mint, #EAF3DE)",
                border: "1px solid var(--color-primary, #2A7A50)",
                borderRadius: "10px",
                padding: "6px 14px"
              }}>
                <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--color-primary-dark, #27500A)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Computed Output:
                </span>
                <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--color-primary-dark, #27500A)", fontFamily: "monospace" }}>
                  {liveOutput.formatted}
                </span>
              </div>
            )}

            {!is1Var && (
              /* Height Scale Slider */
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
            )}

            {/* Custom Restyled Theme Selector Dropdown (Available for both 1-var and 2-var) */}
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

            {/* Camera Presets (available in all modes) */}
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
        {effectiveViewMode === "BOTH" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div className={`look3d-viewport-card ${is3DFullscreen ? "look3d-viewport-card--fullscreen" : ""}`}>
              <div className="look3d-viewport-header">
                <h3 className="look3d-viewport-title">
                  <span>🧊 3D WebGL Canvas {is1Var ? "(Planar Line Mode)" : "(Surface Model)"}</span>
                  <span className="look3d-badge">{equation}</span>
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
                  <span className="look3d-badge">{equation.includes("=") || is1Var ? equation : `y = ${equation}`}</span>
                </h3>
              </div>
              <GraphViewer2D equation={equation} />
            </div>
          </div>
        ) : effectiveViewMode === "3D" ? (
          <div className={`look3d-viewport-card ${is3DFullscreen ? "look3d-viewport-card--fullscreen" : ""}`}>
            <div className="look3d-viewport-header">
              <h3 className="look3d-viewport-title">
                <span>🧊 3D WebGL Canvas {is1Var ? "(Planar Line Mode)" : "(Surface Model)"}</span>
                <span className="look3d-badge">{equation}</span>
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
                <span className="look3d-badge">{equation.includes("=") || is1Var ? equation : `y = ${equation}`}</span>
              </h3>
            </div>
            <GraphViewer2D equation={equation} />
          </div>
        )}
      </main>
    </div>
  );
}
