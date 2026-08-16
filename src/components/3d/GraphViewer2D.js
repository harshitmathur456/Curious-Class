"use client";

import React, { useMemo, useState } from "react";
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

export function cleanExpression(eq) {
  if (!eq) return "2*x + 3";
  let exprStr = String(eq).trim();

  // 1. Strip LaTeX math delimiters
  exprStr = exprStr.replace(/[\$\`]/g, "").trim();

  // 2. Convert LaTeX Greek letters & symbols to mathjs standard identifiers
  exprStr = exprStr
    .replace(/\\pi/g, "pi")
    .replace(/\\theta/g, "theta")
    .replace(/\\alpha/g, "alpha")
    .replace(/\\beta/g, "beta")
    .replace(/\\Delta/g, "Delta")
    .replace(/\\cdot/g, "*")
    .replace(/\\times/g, "*")
    .replace(/\\degree/g, "")
    .replace(/\\text\{[^{}]*\}/g, "");

  // Convert \frac{a}{b} -> ((a)/(b))
  exprStr = exprStr.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, "(($1)/($2))");

  // Convert \sqrt{a} -> sqrt(a)
  exprStr = exprStr.replace(/\\sqrt\{([^{}]+)\}/g, "sqrt($1)");

  // Strip any remaining backslashes
  exprStr = exprStr.replace(/\\/g, "");

  // Strip left hand side e.g. "z =", "y =", "f(x) =", "f(x,y) ="
  const eqMatch = exprStr.match(/^\s*([a-zA-Z](?:\([a-zA-Z\s,]*\))?)\s*=\s*(.*)$/);
  if (eqMatch) {
    exprStr = eqMatch[2].trim();
  } else if (exprStr.includes("=") && !exprStr.includes("==")) {
    const parts = exprStr.split("=");
    exprStr = `(${parts[0].trim()}) - (${parts[1].trim()})`;
  }

  // Replace unicode powers
  exprStr = exprStr
    .replace(/²/g, "^2")
    .replace(/³/g, "^3")
    .replace(/⁴/g, "^4");

  // Insert explicit multiplication for implicit patterns e.g. 2x -> 2*x, 3.5x -> 3.5*x, (a)(b) -> (a)*(b)
  exprStr = exprStr.replace(/(\d)\s*([a-zA-Z\(])/g, "$1*$2");
  exprStr = exprStr.replace(/(\))\s*([\(a-zA-Z0-9])/g, "$1*$2");

  return exprStr;
}

export default function GraphViewer2D({ equation = "2x + 3", yLevel = 0 }) {
  const plot2DData = useMemo(() => {
    if (!equation) return { hasY: false, data: [], error: "No equation" };

    try {
      let exprStr = cleanExpression(equation);
      let parsedNode;
      try {
        parsedNode = parse(exprStr);
      } catch (parseErr) {
        console.warn("Primary mathjs parse failed for:", exprStr, parseErr);
        exprStr = "2*x + 3";
        parsedNode = parse(exprStr);
      }

      const compiled = parsedNode.compile();

      const symbols = new Set(
        parsedNode.filter((n) => n.isSymbolNode).map((n) => n.name)
      );

      const hasY = symbols.has("y");

      const xValues = [];
      const yValues = [];

      for (let i = -10; i <= 10; i += 0.1) {
        const xVal = Number(i.toFixed(2));
        xValues.push(xVal);
        let val = 0;
        try {
          val = compiled.evaluate({ x: xVal, y: Number(yLevel) || 0, pi: Math.PI, theta: 0 });
        } catch (e) {
          val = null;
        }
        if (isNaN(val) || !isFinite(val)) val = null;
        yValues.push(val);
      }

      return {
        hasY,
        data: [
          {
            x: xValues,
            y: yValues,
            type: "scatter",
            mode: "lines",
            line: { width: 3.5, color: "#2A7A50" },
            name: equation,
          },
        ],
        error: null,
      };
    } catch (err) {
      console.error("2D Plot Error:", err);
      return { hasY: false, data: [], error: err.message };
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
            text: `2D Line Plot: y = ${equation}`,
            font: { size: 18, color: "#1B5E39", family: "sans-serif" },
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
            title: "Y / Height Axis",
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
