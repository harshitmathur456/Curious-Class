"use client";

import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import { parse } from "mathjs";

const Plot = dynamic(() => import("react-plotly.js"), {
  ssr: false,
  loading: () => (
    <div className="rounded-xl bg-emerald-50 p-8 text-center text-emerald-800 border border-emerald-200 font-mono">
      📈 Loading 2D Line Graph Engine...
    </div>
  ),
});

/**
 * Clean a single expression side (convert LaTeX, Greek, powers, implicit multiplication)
 */
export function cleanSingleExpression(exprStr) {
  if (!exprStr) return "0";
  let s = String(exprStr).trim();

  // Strip LaTeX delimiters
  s = s.replace(/[\$\`]/g, "").trim();

  // Convert LaTeX Greek letters & symbols
  s = s
    .replace(/\\pi/g, "pi")
    .replace(/\\theta/g, "theta")
    .replace(/\\alpha/g, "alpha")
    .replace(/\\beta/g, "beta")
    .replace(/\\Delta/g, "Delta")
    .replace(/\\cdot/g, "*")
    .replace(/\\times/g, "*")
    .replace(/\\degree/g, "")
    .replace(/\\text\{[^{}]*\}/g, "");

  s = s.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, "(($1)/($2))");
  s = s.replace(/\\sqrt\{([^{}]+)\}/g, "sqrt($1)");
  s = s.replace(/\\/g, "");

  s = s
    .replace(/²/g, "^2")
    .replace(/³/g, "^3")
    .replace(/⁴/g, "^4");

  // Insert explicit multiplication (e.g. 2x -> 2*x, 3.5x -> 3.5*x, (a)(b) -> (a)*(b))
  s = s.replace(/(\d)\s*([a-zA-Z\(])/g, "$1*$2");
  s = s.replace(/(\))\s*([\(a-zA-Z0-9])/g, "$1*$2");

  return s;
}

/**
 * Sanitize an extracted or raw equation string to be 100% clean math:
 * - Trims leading/trailing sentence punctuation (parens, brackets, dashes, arrows, etc.)
 * - Stops at equation chaining symbols (like ⇒, =>, ->) to take only the first equation
 * - Fixes unmatched leading/trailing parens (e.g. "(x + 5 = 2x - 3" -> "x + 5 = 2x - 3")
 * - Cleans LaTeX delimiters ($...$, \(...\))
 */
export function sanitizeEquationString(raw) {
  if (!raw || typeof raw !== "string") return "2x + 3";

  let str = raw.trim();

  // 1. Strip LaTeX wrapper delimiters ($...$, \(...\), \[...\])
  str = str.replace(/^\$+|\$+$|^\\\(|\\\)$|^\\\[|\\\]$/g, "").trim();

  // 2. Stop at arrow delimiters (Unicode, ASCII, LaTeX commands, HTML entities, and literal word variants):
  // e.g. ⇒, =>, ->, -->, \Rightarrow, \Longrightarrow, \implies, \to, \longrightarrow, \iff,
  // ;Rightarrow;, &Rightarrow;, Rightarrow, rArr, rarr, etc.
  const arrowRegex = /⇒|=>|->|-->|\\Rightarrow|\\Longrightarrow|\\implies|\\to|\\longrightarrow|\\iff|&Rightarrow;?|&rArr;?|&rarr;?|;?\s*Rightarrow\s*;?|;?\s*Longrightarrow\s*;?|;?\s*implies\s*;?/i;
  
  if (arrowRegex.test(str)) {
    str = str.split(arrowRegex)[0].trim();
  }

  // 3. Strip any remaining LaTeX commands (anything starting with \ like \text{...}, \quad, \left, \right, etc.)
  str = str.replace(/\\(text|quad|qquad|left|right|displaystyle|begin|end|frac|sqrt|cdot|times|degree|bold|mathrm)\b/gi, "");
  str = str.replace(/\\([a-zA-Z]+)/g, ""); // strip any remaining backslash LaTeX command words

  // 4. Strip stray HTML entities or stray semicolon words (like &nbsp;, ;Rightarrow;, ;etc)
  str = str.replace(/&[a-zA-Z0-9#]+;/g, "");
  str = str.replace(/;[a-zA-Z0-9_]+;?/g, "");

  // 5. Strip trailing prose clauses e.g. ", where x represents...", " where x is...", " in step 1", etc.
  str = str.replace(/,?\s+\b(where|in|step|and|so|which|for|when|with|as|given|assuming|let)\b.*$/i, "").trim();

  // 6. Strip trailing punctuation like '.', ',', ';', ':', '!', '?', '—', '--', '-', etc.
  str = str.replace(/[\.,;:!\?—–\-]+\s*$/g, "").trim();

  // 7. Strip leading sentence prose words (e.g. "...we get x+5=2x-3" -> "x+5=2x-3")
  const mathFunctions = new Set(["sin", "cos", "tan", "asin", "acos", "atan", "sinh", "cosh", "tanh", "log", "ln", "log10", "exp", "sqrt", "cbrt", "abs", "floor", "ceil", "round", "min", "max", "pi", "f", "g", "h"]);
  
  // Loop to strip any leading words that are not math functions or single variables
  while (/^[a-zA-Z]{2,}\s+/.test(str)) {
    const firstWord = str.match(/^[a-zA-Z]{2,}/)[0];
    if (mathFunctions.has(firstWord.toLowerCase())) break;
    str = str.replace(/^[a-zA-Z]{2,}\s+/, "").trim();
  }

  // Also clean if str starts with non-alphanumeric punctuation except '(' or '-'
  str = str.replace(/^[^\w\(\+\-]+/g, "").trim();

  // 8. Handle unmatched outer parens/brackets
  while (str.startsWith("(") || str.startsWith("[") || str.startsWith("{")) {
    const openChar = str[0];
    const closeChar = openChar === "(" ? ")" : openChar === "[" ? "]" : "}";
    
    let depth = 0;
    let hasMatchingEnd = false;
    for (let i = 0; i < str.length; i++) {
      if (str[i] === openChar) depth++;
      else if (str[i] === closeChar) {
        depth--;
        if (depth === 0 && i === str.length - 1) {
          hasMatchingEnd = true;
        }
      }
    }

    const openCount = (str.match(new RegExp("\\" + openChar, "g")) || []).length;
    const closeCount = (str.match(new RegExp("\\" + closeChar, "g")) || []).length;

    if (openCount > closeCount) {
      str = str.slice(1).trim();
    } else if (hasMatchingEnd) {
      str = str.slice(1, -1).trim();
    } else {
      break;
    }
  }

  // Check trailing unclosed parens/brackets
  while (str.endsWith(")") || str.endsWith("]") || str.endsWith("}")) {
    const closeChar = str[str.length - 1];
    const openChar = closeChar === ")" ? "(" : closeChar === "]" ? "[" : "{";
    const openCount = (str.match(new RegExp("\\" + openChar, "g")) || []).length;
    const closeCount = (str.match(new RegExp("\\" + closeChar, "g")) || []).length;
    if (closeCount > openCount) {
      str = str.slice(0, -1).trim();
    } else {
      break;
    }
  }

  // Strip trailing punctuation again e.g. after paren removal
  str = str.replace(/[\.,;:!\?—–\-]+\s*$/g, "").trim();

  // Strip leading words again in case parens removal exposed a word e.g. "(Solving x+5..."
  while (/^[a-zA-Z]{2,}\s+/.test(str)) {
    const firstWord = str.match(/^[a-zA-Z]{2,}/)[0];
    if (mathFunctions.has(firstWord.toLowerCase())) break;
    str = str.replace(/^[a-zA-Z]{2,}\s+/, "").trim();
  }

  // 9. Clean stray leading/trailing operators, semicolons, or dashes
  str = str.replace(/^[\s\+=\*\/—–;\-]+|[\s\+=\*\/—–;\-]+$/g, "").trim();

  return str || "2x + 3";
}

/**
 * Analyze an equation string to detect variables, sides, and equation type
 */
export function analyzeEquation(rawEq) {
  const sanitizedRaw = sanitizeEquationString(rawEq);
  if (!sanitizedRaw) {
    return {
      raw: "2x + 3",
      clean: "2*x + 3",
      variables: ["x"],
      varCount: 1,
      hasEquals: false,
      sides: ["2x + 3"],
      cleanSides: ["2*x + 3"],
      isSingleVariableEquation: false,
    };
  }

  let str = String(sanitizedRaw).trim().replace(/[\$\`]/g, "");

  // Detect '='
  const hasEquals = str.includes("=") && !str.includes("==");
  let rawSides = hasEquals ? str.split("=").map((s) => s.trim()) : [str];

  // If explicit function prefix like "y = 2x + 3" or "z = x^2 + y^2"
  if (hasEquals && rawSides.length === 2) {
    const leftLower = rawSides[0].toLowerCase();
    if (["y", "z", "f(x)", "f(x,y)", "z(x,y)", "g(x)"].includes(leftLower)) {
      const innerAnalysis = analyzeEquation(rawSides[1]);
      return {
        ...innerAnalysis,
        raw: rawEq,
        explicitTarget: leftLower,
      };
    }
  }

  const cleanSides = rawSides.map(cleanSingleExpression);

  // Extract symbol variables using mathjs parse
  const variablesSet = new Set();
  const knownKeywords = new Set([
    "sin", "cos", "tan", "asin", "acos", "atan", "sinh", "cosh", "tanh",
    "log", "ln", "log10", "exp", "sqrt", "cbrt", "abs", "floor", "ceil",
    "round", "min", "max", "pi", "e", "i", "tau", "degree", "Delta", "alpha",
    "beta", "theta", "gamma"
  ]);

  cleanSides.forEach((sideClean) => {
    try {
      const node = parse(sideClean);
      node.filter((n) => n.isSymbolNode).forEach((n) => {
        if (!knownKeywords.has(n.name) && isNaN(Number(n.name))) {
          variablesSet.add(n.name);
        }
      });
    } catch (e) {
      const matches = sideClean.match(/\b[a-zA-Z]\b/g);
      if (matches) {
        matches.forEach((m) => {
          if (!knownKeywords.has(m)) variablesSet.add(m);
        });
      }
    }
  });

  const variables = Array.from(variablesSet);
  const varCount = variables.length || 1;
  const isSingleVariableEquation = hasEquals && rawSides.length >= 2 && varCount === 1;

  return {
    raw: rawEq,
    clean: cleanSides.join(" - "),
    variables,
    varCount,
    hasEquals,
    sides: rawSides,
    cleanSides,
    isSingleVariableEquation,
  };
}

export function cleanExpression(eq) {
  const analysis = analyzeEquation(eq);
  if (analysis.isSingleVariableEquation) {
    return `(${analysis.cleanSides[0]}) - (${analysis.cleanSides[1]})`;
  }
  return analysis.cleanSides[0] || "2*x + 3";
}

export default function GraphViewer2D({ equation = "2x + 3", yLevel = 0 }) {
  const plot2DData = useMemo(() => {
    if (!equation) return { data: [], title: "", error: "No equation" };

    try {
      const analysis = analyzeEquation(equation);

      // Case 1: Multi-side single variable equation (e.g. x + 5 = 2x - 3)
      if (analysis.isSingleVariableEquation) {
        let side1Node, side2Node;
        try {
          side1Node = parse(analysis.cleanSides[0]).compile();
          side2Node = parse(analysis.cleanSides[1]).compile();
        } catch (err) {
          return { data: [], title: "", error: `Parse error: ${err.message}` };
        }

        const xValues = [];
        const y1Values = [];
        const y2Values = [];

        const intersections = [];
        let prevDiff = null;
        let prevX = null;

        for (let i = -15; i <= 15; i += 0.05) {
          const xVal = Number(i.toFixed(2));
          xValues.push(xVal);

          let v1 = null, v2 = null;
          try { v1 = side1Node.evaluate({ x: xVal, pi: Math.PI }); } catch (e) {}
          try { v2 = side2Node.evaluate({ x: xVal, pi: Math.PI }); } catch (e) {}

          if (isNaN(v1) || !isFinite(v1)) v1 = null;
          if (isNaN(v2) || !isFinite(v2)) v2 = null;

          y1Values.push(v1);
          y2Values.push(v2);

          // Detect intersection root where v1 - v2 = 0
          if (v1 !== null && v2 !== null) {
            const diff = v1 - v2;
            if (prevDiff !== null && ((prevDiff > 0 && diff <= 0) || (prevDiff < 0 && diff >= 0))) {
              const fraction = Math.abs(prevDiff) / (Math.abs(prevDiff) + Math.abs(diff) || 1);
              const exactX = Number((prevX + fraction * (xVal - prevX)).toFixed(2));
              let exactY = null;
              try {
                exactY = Number(side1Node.evaluate({ x: exactX, pi: Math.PI }).toFixed(2));
              } catch (e) {
                exactY = Number(((v1 + v2) / 2).toFixed(2));
              }
              if (!intersections.some((pt) => Math.abs(pt.x - exactX) < 0.2)) {
                intersections.push({ x: exactX, y: exactY });
              }
            }
            prevDiff = diff;
            prevX = xVal;
          }
        }

        const dataSeries = [
          {
            x: xValues,
            y: y1Values,
            type: "scatter",
            mode: "lines",
            line: { width: 3.5, color: "#2A7A50" },
            name: `y = ${analysis.sides[0]}`,
          },
          {
            x: xValues,
            y: y2Values,
            type: "scatter",
            mode: "lines",
            line: { width: 3.5, color: "#E05638", dash: "dash" },
            name: `y = ${analysis.sides[1]}`,
          },
        ];

        if (intersections.length > 0) {
          dataSeries.push({
            x: intersections.map((p) => p.x),
            y: intersections.map((p) => p.y),
            type: "scatter",
            mode: "markers+text",
            marker: { size: 14, color: "#D97706", symbol: "star" },
            text: intersections.map((p) => `Solution (${p.x}, ${p.y})`),
            textposition: "top center",
            name: "Intersection Point (Solution)",
          });
        }

        const titleText = intersections.length > 0
          ? `Solving ${equation} → Solution: x = ${intersections.map(p => p.x).join(", ")}`
          : `2D Plot of ${equation} (Comparing Both Sides)`;

        return {
          data: dataSeries,
          title: titleText,
          error: null,
        };
      }

      // Case 2: Standard single-expression or function (e.g. 2x + 3)
      const mainClean = analysis.cleanSides[0] || "2*x + 3";
      let parsedNode;
      try {
        parsedNode = parse(mainClean).compile();
      } catch (err) {
        return { data: [], title: "", error: `Parse error: ${err.message}` };
      }

      const xValues = [];
      const yValues = [];

      for (let i = -10; i <= 10; i += 0.1) {
        const xVal = Number(i.toFixed(2));
        xValues.push(xVal);
        let val = null;
        try {
          val = parsedNode.evaluate({ x: xVal, y: Number(yLevel) || 0, pi: Math.PI });
        } catch (e) {}
        if (isNaN(val) || !isFinite(val)) val = null;
        yValues.push(val);
      }

      const displayLabel = equation.includes("=") ? equation : `y = ${equation}`;

      return {
        data: [
          {
            x: xValues,
            y: yValues,
            type: "scatter",
            mode: "lines",
            line: { width: 3.5, color: "#2A7A50" },
            name: displayLabel,
          },
        ],
        title: `2D Plot: ${displayLabel}`,
        error: null,
      };
    } catch (err) {
      console.error("2D Plot Error:", err);
      return { data: [], title: "", error: err.message };
    }
  }, [equation, yLevel]);

  if (plot2DData.error) {
    return (
      <div className="rounded-xl bg-red-50 p-6 text-center text-red-700 border border-red-200 font-mono text-sm">
        ❌ Unable to render 2D graph: {plot2DData.error}
      </div>
    );
  }

  return (
    <div style={{ borderRadius: "12px", background: "#FFFFFF", border: "0.5px solid var(--color-border-medium, #D4D4D4)", boxShadow: "none", overflow: "hidden", width: "100%" }}>
      <Plot
        data={plot2DData.data}
        layout={{
          autosize: true,
          height: 520,
          title: {
            text: plot2DData.title,
            font: { size: 17, color: "#1B5E39", family: "sans-serif" },
          },
          xaxis: {
            title: "X Axis",
            zeroline: true,
            zerolinecolor: "#cbd5e1",
            gridcolor: "#f1f5f9",
            tickfont: { color: "#334155" },
            titlefont: { color: "#2A7A50", size: 14 },
          },
          yaxis: {
            title: "Y Axis",
            zeroline: true,
            zerolinecolor: "#cbd5e1",
            gridcolor: "#f1f5f9",
            tickfont: { color: "#334155" },
            titlefont: { color: "#2A7A50", size: 14 },
          },
          paper_bgcolor: "#ffffff",
          plot_bgcolor: "#fbfdfa",
        }}
        config={{
          responsive: true,
          displaylogo: false,
        }}
        style={{
          width: "100%",
        }}
      />
    </div>
  );
}
