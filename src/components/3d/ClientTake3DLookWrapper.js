"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import GraphErrorBoundary from "./GraphErrorBoundary";

const Take3DLookView = dynamic(() => import("./Take3DLookView"), {
  ssr: false,
  loading: () => (
    <div style={{ minHeight: "85vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0F172A", color: "#F8FAFC", fontFamily: "sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🧊</div>
        <div style={{ fontSize: "18px", fontWeight: "700", color: "#38BDF8", marginBottom: "8px" }}>
          Loading 3D & 2D Graph Engine...
        </div>
        <div style={{ fontSize: "13px", color: "#94A3B8" }}>
          Preparing interactive WebGL canvas and mathematical visualization
        </div>
      </div>
    </div>
  ),
});

function Take3DLookViewWithParams({ propEq }) {
  const searchParams = useSearchParams();
  const eqFromUrl = searchParams ? searchParams.get("eq") : null;
  const initialEquation = propEq || eqFromUrl || "2x + 3";

  return <Take3DLookView initialEquation={initialEquation} />;
}

export default function ClientTake3DLookWrapper({ initialEquation }) {
  return (
    <GraphErrorBoundary>
      <Suspense fallback={
        <div style={{ minHeight: "85vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0F172A", color: "#F8FAFC", fontFamily: "sans-serif" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🧊</div>
            <div style={{ fontSize: "18px", fontWeight: "700", color: "#38BDF8", marginBottom: "8px" }}>
              Loading 3D & 2D Graph Engine...
            </div>
          </div>
        </div>
      }>
        <Take3DLookViewWithParams propEq={initialEquation} />
      </Suspense>
    </GraphErrorBoundary>
  );
}
