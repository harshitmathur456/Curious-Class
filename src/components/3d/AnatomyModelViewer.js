"use client";

import React, { useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";

/* ─── GLB Model Loader ─────────────────────────────────────── */

function GLBModel({ path }) {
  const { scene } = useGLTF(path);

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    scene.position.sub(center);

    const size = box.getSize(new THREE.Vector3());
    const maxAxis = Math.max(size.x, size.y, size.z);
    scene.scale.setScalar(2.2 / maxAxis);

    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material.side = THREE.DoubleSide;
          child.material.needsUpdate = true;
          child.material.toneMapped = true;
          child.material.transparent = false;
        }
      }
    });
  }, [scene]);

  return <primitive object={scene} dispose={null} />;
}

/* ─── Loading Fallback ─────────────────────────────────────── */

function LoadingFallback() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        fontFamily: "var(--font-sans, Inter, sans-serif)",
        color: "var(--color-primary, #2A7A50)",
        fontSize: "14px",
        fontWeight: 500,
        gap: "8px",
      }}
    >
      <span style={{ fontSize: "20px", animation: "pulse 1.5s ease-in-out infinite" }}>🧬</span>
      Loading 3D Model…
    </div>
  );
}

/* ─── Main Anatomy Model Viewer ────────────────────────────── */

export default function AnatomyModelViewer({ modelPath, label = "3D Model", icon = "🧊" }) {
  if (!modelPath) return null;

  return (
    <div
      style={{
        marginTop: "12px",
        borderRadius: "var(--radius-md, 12px)",
        border: "1px solid var(--color-bg-mint-border, #C0DD97)",
        background: "var(--color-bg-white, #FFFFFF)",
        overflow: "hidden",
        boxShadow: "0 2px 12px rgba(42, 122, 80, 0.08)",
      }}
    >
      {/* Header Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 16px",
          borderBottom: "1px solid var(--color-border-light, #E5E5E5)",
          background: "var(--color-bg-mint, #EAF3DE)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "16px" }}>{icon}</span>
          <span
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "var(--color-primary-dark, #27500A)",
            }}
          >
            Interactive 3D Model
          </span>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "var(--color-primary, #2A7A50)",
              background: "var(--color-bg-white, #FFFFFF)",
              border: "1px solid var(--color-bg-mint-border, #C0DD97)",
              borderRadius: "var(--radius-pill, 20px)",
              padding: "2px 10px",
            }}
          >
            {label}
          </span>
        </div>
        <span
          style={{
            fontSize: "11px",
            color: "var(--color-text-tertiary, #999)",
            fontWeight: 500,
          }}
        >
          Drag to rotate • Scroll to zoom
        </span>
      </div>

      {/* 3D Canvas */}
      <div style={{ height: "420px", width: "100%", background: "#F7FAF6", position: "relative" }}>
        <Suspense fallback={<LoadingFallback />}>
          <Canvas
            shadows
            camera={{ position: [0, 1.5, 4.5], fov: 42 }}
            gl={{ antialias: true }}
          >
            <color attach="background" args={["#F7FAF6"]} />

            <ambientLight intensity={2.0} />
            <directionalLight position={[8, 10, 8]} intensity={3.5} castShadow />
            <directionalLight position={[-8, 5, -8]} intensity={1.5} />

            <Environment preset="studio" />

            <GLBModel path={modelPath} />

            <OrbitControls
              autoRotate
              autoRotateSpeed={1.2}
              enableZoom
              enablePan={false}
              maxPolarAngle={Math.PI / 1.5}
              minDistance={2}
              maxDistance={8}
            />
          </Canvas>
        </Suspense>
      </div>
    </div>
  );
}
