"use client";

import dynamic from "next/dynamic";

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

export default function ClientTake3DLookWrapper({ initialEquation }) {
  return <Take3DLookView initialEquation={initialEquation} />;
}
