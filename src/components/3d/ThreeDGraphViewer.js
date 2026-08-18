"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Grid, Text, Html } from "@react-three/drei";
import { parse } from "mathjs";
import { cleanSingleExpression, cleanExpression, analyzeEquation } from "./GraphViewer2D";

/* ---------------- Color Palette Generators ---------------- */

function computeGradientColor(ratio, palette = "curious") {
  const c = new THREE.Color();
  const clampedRatio = Math.max(0, Math.min(1, ratio));
  switch (palette) {
    case "neon":
      if (clampedRatio < 0.5) c.setHSL(0.78 - clampedRatio * 0.4, 1.0, 0.5);
      else c.setHSL(0.58 - (clampedRatio - 0.5) * 0.4, 1.0, 0.5);
      break;
    case "volcano":
      c.setHSL(0.0 + clampedRatio * 0.16, 1.0, 0.25 + clampedRatio * 0.55);
      break;
    case "ocean":
      c.setHSL(0.65 - clampedRatio * 0.2, 0.9, 0.3 + clampedRatio * 0.4);
      break;
    case "rainbow":
      c.setHSL((1.0 - clampedRatio) * 0.65, 0.95, 0.5);
      break;
    case "emerald":
      c.setHSL(0.42 - clampedRatio * 0.1, 0.85, 0.35 + clampedRatio * 0.3);
      break;
    case "curious":
    default:
      if (clampedRatio < 0.5) {
        c.setHSL(0.38 - clampedRatio * 0.08, 0.75, 0.28 + clampedRatio * 0.35);
      } else {
        c.setHSL(0.34 - (clampedRatio - 0.5) * 0.08, 0.70, 0.45 + (clampedRatio - 0.5) * 0.30);
      }
      break;
  }
  return c;
}

function getPaletteThemeColors(palette = "curious") {
  switch (palette) {
    case "neon":
      return { main: "#c084fc", sec: "#38bdf8" };
    case "volcano":
      return { main: "#f97316", sec: "#ef4444" };
    case "ocean":
      return { main: "#38bdf8", sec: "#06b6d4" };
    case "rainbow":
      return { main: "#ec4899", sec: "#eab308" };
    case "emerald":
      return { main: "#10b981", sec: "#34d399" };
    case "curious":
    default:
      return { main: "#22c55e", sec: "#ef4444" };
  }
}

/* ================================================================
   LinePlot2DIn3D — Renders single-variable equations as lines
   in the X-Y plane within the 3D WebGL canvas, with theme color
   support and smooth hover-point inspection raycasting.
   ================================================================ */

function LinePlot2DIn3D({ equation, range = 10, colorPalette = "curious", onHoverPoint, onClickPoint }) {
  const analysis = useMemo(() => analyzeEquation(equation), [equation]);
  const themeColors = useMemo(() => getPaletteThemeColors(colorPalette), [colorPalette]);

  const { plotData, evalNode } = useMemo(() => {
    const numPoints = 300;
    const step = (range * 2) / numPoints;

    if (analysis.isSingleVariableEquation && analysis.cleanSides.length >= 2) {
      // Two-sided equation: e.g. x+5 = 2x-3 → plot both sides
      let side1Compiled, side2Compiled;
      try {
        side1Compiled = parse(analysis.cleanSides[0]).compile();
        side2Compiled = parse(analysis.cleanSides[1]).compile();
      } catch (e) {
        console.error("[LinePlot2DIn3D] Parse error:", e);
        return { plotData: { lines: [], intersection: null }, evalNode: null };
      }

      const pts1 = [];
      const pts2 = [];
      let bestDiff = Infinity;
      let intersectionX = null;

      for (let i = 0; i <= numPoints; i++) {
        const xVal = -range + i * step;
        let y1 = 0, y2 = 0;
        try { y1 = side1Compiled.evaluate({ x: xVal }); } catch (e) { y1 = 0; }
        try { y2 = side2Compiled.evaluate({ x: xVal }); } catch (e) { y2 = 0; }

        if (isNaN(y1) || !isFinite(y1)) y1 = 0;
        if (isNaN(y2) || !isFinite(y2)) y2 = 0;

        y1 = Math.max(-range * 2, Math.min(range * 2, y1));
        y2 = Math.max(-range * 2, Math.min(range * 2, y2));

        pts1.push(new THREE.Vector3(xVal, y1, 0));
        pts2.push(new THREE.Vector3(xVal, y2, 0));

        const diff = Math.abs(y1 - y2);
        if (diff < bestDiff) {
          bestDiff = diff;
          intersectionX = xVal;
        }
      }

      // Refine intersection with bisection
      let intersection = null;
      if (intersectionX !== null && bestDiff < 2) {
        let lo = intersectionX - step;
        let hi = intersectionX + step;
        for (let iter = 0; iter < 50; iter++) {
          const mid = (lo + hi) / 2;
          let y1Lo, y2Lo, y1Mid, y2Mid;
          try { y1Lo = side1Compiled.evaluate({ x: lo }); } catch (e) { y1Lo = 0; }
          try { y2Lo = side2Compiled.evaluate({ x: lo }); } catch (e) { y2Lo = 0; }
          try { y1Mid = side1Compiled.evaluate({ x: mid }); } catch (e) { y1Mid = 0; }
          try { y2Mid = side2Compiled.evaluate({ x: mid }); } catch (e) { y2Mid = 0; }
          const diffLo = y1Lo - y2Lo;
          const diffMid = y1Mid - y2Mid;
          if (diffLo * diffMid <= 0) { hi = mid; } else { lo = mid; }
        }
        const solX = (lo + hi) / 2;
        let solY;
        try { solY = side1Compiled.evaluate({ x: solX }); } catch (e) { solY = 0; }
        intersection = { x: Math.round(solX * 1000) / 1000, y: Math.round(solY * 1000) / 1000 };
      }

      return {
        plotData: {
          lines: [
            { points: pts1, color: themeColors.main, label: `y = ${analysis.sides[0]}` },
            { points: pts2, color: themeColors.sec, label: `y = ${analysis.sides[1]}`, dashed: true },
          ],
          intersection,
        },
        evalNode: side1Compiled,
      };
    } else {
      // Single expression: e.g. x^2 - 4 or 2x + 3 → plot line with theme color gradient
      let compiled;
      try {
        compiled = parse(analysis.cleanSides[0] || cleanSingleExpression(equation)).compile();
      } catch (e) {
        console.error("[LinePlot2DIn3D] Parse error:", e);
        return { plotData: { lines: [], intersection: null }, evalNode: null };
      }

      const pts = [];
      for (let i = 0; i <= numPoints; i++) {
        const xVal = -range + i * step;
        let yVal = 0;
        try { yVal = compiled.evaluate({ x: xVal }); } catch (e) { yVal = 0; }
        if (isNaN(yVal) || !isFinite(yVal)) yVal = 0;
        yVal = Math.max(-range * 2, Math.min(range * 2, yVal));
        pts.push(new THREE.Vector3(xVal, yVal, 0));
      }

      return {
        plotData: {
          lines: [{
            points: pts,
            color: themeColors.main,
            label: equation.includes("=") ? equation : `y = ${equation}`
          }],
          intersection: null,
        },
        evalNode: compiled,
      };
    }
  }, [equation, range, analysis, themeColors]);

  return (
    <group>
      {/* Invisible Raycast Surface for Cursor Hover / Point Inspection in 2D Planar Mode */}
      <mesh
        visible={false}
        onPointerMove={(e) => {
          e.stopPropagation();
          if (!evalNode) return;
          const rawX = e.point.x;
          if (isNaN(rawX)) return;
          const clampedX = Math.max(-range, Math.min(range, rawX));
          let valY = 0;
          try {
            valY = evalNode.evaluate({ x: clampedX });
          } catch (err) {
            valY = 0;
          }
          if (isNaN(valY) || !isFinite(valY)) valY = 0;
          valY = Math.max(-range * 2, Math.min(range * 2, valY));

          if (onHoverPoint) {
            onHoverPoint({ x: clampedX, y: valY, z: 0 });
          }
        }}
        onPointerOut={() => {
          if (onHoverPoint) onHoverPoint(null);
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (!evalNode) return;
          const rawX = e.point.x;
          if (isNaN(rawX)) return;
          const clampedX = Math.max(-range, Math.min(range, rawX));
          let valY = 0;
          try {
            valY = evalNode.evaluate({ x: clampedX });
          } catch (err) {
            valY = 0;
          }
          if (isNaN(valY) || !isFinite(valY)) valY = 0;
          valY = Math.max(-range * 2, Math.min(range * 2, valY));

          if (onClickPoint) {
            onClickPoint({ x: clampedX, y: valY, z: 0 });
          }
        }}
      >
        <planeGeometry args={[range * 3, range * 3]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {plotData.lines.map((line, idx) => (
        <group key={idx}>
          <line>
            <bufferGeometry
              attach="geometry"
              onUpdate={(geo) => geo.setFromPoints(line.points)}
            />
            {line.dashed ? (
              <lineDashedMaterial
                color={line.color}
                linewidth={1}
                dashSize={0.5}
                gapSize={0.25}
                transparent
                opacity={0.95}
              />
            ) : (
              <lineBasicMaterial color={line.color} linewidth={2} transparent opacity={0.95} />
            )}
          </line>

          {/* Thicker tube for visibility with theme color */}
          <mesh>
            <tubeGeometry args={[
              new THREE.CatmullRomCurve3(line.points.filter((_, i) => i % 3 === 0)),
              200, 0.08, 8, false
            ]} />
            <meshStandardMaterial
              color={line.color}
              emissive={line.color}
              emissiveIntensity={0.5}
              transparent
              opacity={line.dashed ? 0.65 : 0.9}
              roughness={0.2}
            />
          </mesh>

          {/* Line label */}
          <Html
            position={[line.points[Math.floor(line.points.length * 0.85)]?.x || range * 0.7, (line.points[Math.floor(line.points.length * 0.85)]?.y || 0) + 0.8, 0.3]}
            center
            distanceFactor={22}
          >
            <div style={{
              background: "rgba(15, 23, 42, 0.88)",
              color: line.color,
              padding: "3px 10px",
              borderRadius: "8px",
              fontSize: "11px",
              fontWeight: "700",
              fontFamily: "monospace",
              border: `1px solid ${line.color}40`,
              whiteSpace: "nowrap",
              backdropFilter: "blur(4px)",
            }}>
              {line.label}
            </div>
          </Html>
        </group>
      ))}

      {/* Intersection / Solution Point */}
      {plotData.intersection && (
        <group position={[plotData.intersection.x, plotData.intersection.y, 0]}>
          {/* Glowing sphere */}
          <mesh>
            <sphereGeometry args={[0.28, 32, 32]} />
            <meshStandardMaterial
              color="#f59e0b"
              emissive="#f59e0b"
              emissiveIntensity={1.2}
            />
          </mesh>
          {/* Outer ring */}
          <mesh rotation={[0, 0, 0]}>
            <ringGeometry args={[0.4, 0.55, 32]} />
            <meshBasicMaterial color="#f59e0b" side={THREE.DoubleSide} transparent opacity={0.5} />
          </mesh>
          {/* Drop line to X-axis */}
          <line>
            <bufferGeometry
              attach="geometry"
              onUpdate={(geo) =>
                geo.setFromPoints([
                  new THREE.Vector3(0, 0, 0),
                  new THREE.Vector3(0, -plotData.intersection.y, 0),
                ])
              }
            />
            <lineDashedMaterial color="#f59e0b" dashSize={0.3} gapSize={0.15} transparent opacity={0.5} />
          </line>
          {/* Label */}
          <Html position={[0, 1.2, 0.3]} center distanceFactor={20}>
            <div style={{
              background: "rgba(245, 158, 11, 0.15)",
              color: "#fbbf24",
              padding: "5px 12px",
              borderRadius: "10px",
              fontSize: "12px",
              fontWeight: "800",
              fontFamily: "monospace",
              border: "1px solid rgba(245, 158, 11, 0.4)",
              whiteSpace: "nowrap",
              backdropFilter: "blur(6px)",
              textAlign: "center",
            }}>
              <div style={{ fontSize: "10px", opacity: 0.8, marginBottom: "2px" }}>⭐ Solution</div>
              <div>x = {plotData.intersection.x} → ({plotData.intersection.x}, {plotData.intersection.y})</div>
            </div>
          </Html>
        </group>
      )}
    </group>
  );
}

/* ---------------- Animated Surface Geometry Mesh ---------------- */

function SurfaceMesh({
  equation,
  resolution = 60,
  range = 10,
  isWireframe = false,
  isAnimated = false,
  ampScale = 1.0,
  colorPalette = "curious",
  onHoverPoint,
  onClickPoint,
}) {
  const meshRef = useRef();

  const { compiled, planeGeo, posAttr, baseZValues, count } = useMemo(() => {
    try {
      let exprStr = cleanExpression(equation);
      let parsedNode;
      try {
        parsedNode = parse(exprStr);
      } catch (parseErr) {
        console.warn("3D Surface mathjs parse fallback:", exprStr, parseErr);
        exprStr = "2*x + 3";
        parsedNode = parse(exprStr);
      }

      const compiledFunc = parsedNode.compile();

      const symbols = new Set(
        parsedNode.filter((n) => n.isSymbolNode).map((n) => n.name)
      );

      const hasY = symbols.has("y");

      const geo = new THREE.PlaneGeometry(range * 2, range * 2, resolution, resolution);
      const pos = geo.attributes.position;
      const cnt = pos.count;
      const zArr = new Float32Array(cnt);

      for (let i = 0; i < cnt; i++) {
        const rawX = pos.getX(i);
        const rawY = pos.getY(i);

        let val = 0;
        try {
          if (hasY) {
            val = compiledFunc.evaluate({ x: rawX, y: rawY });
          } else {
            val = compiledFunc.evaluate({ x: rawX });
          }
        } catch (err) {
          val = 0;
        }

        if (isNaN(val) || !isFinite(val)) val = 0;
        zArr[i] = val;
      }

      return {
        compiled: compiledFunc,
        planeGeo: geo,
        posAttr: pos,
        baseZValues: zArr,
        count: cnt,
      };
    } catch (err) {
      console.error("3D Surface Geometry Generation Error:", err);
      return { compiled: null, planeGeo: null, posAttr: null, baseZValues: null, count: 0 };
    }
  }, [equation, resolution, range]);

  // Frame animation loop
  useFrame(({ clock }) => {
    if (!posAttr || !baseZValues) return;

    const time = clock.getElapsedTime();
    const colors = new Float32Array(count * 3);

    let localMinZ = Infinity;
    let localMaxZ = -Infinity;

    for (let i = 0; i < count; i++) {
      const rawX = posAttr.getX(i);
      const rawY = posAttr.getY(i);
      
      let baseZ = baseZValues[i] * ampScale;

      if (isAnimated) {
        const dist = Math.sqrt(rawX * rawX + rawY * rawY);
        baseZ += Math.sin(dist * 0.8 - time * 3.0) * 0.6;
      }

      baseZ = Math.max(-range * 3, Math.min(range * 3, baseZ));
      posAttr.setZ(i, baseZ);

      if (baseZ < localMinZ) localMinZ = baseZ;
      if (baseZ > localMaxZ) localMaxZ = baseZ;
    }

    const zRange = localMaxZ - localMinZ || 1;

    for (let i = 0; i < count; i++) {
      const zVal = posAttr.getZ(i);
      const ratio = (zVal - localMinZ) / zRange;
      const colorObj = computeGradientColor(ratio, colorPalette);

      colors[i * 3] = colorObj.r;
      colors[i * 3 + 1] = colorObj.g;
      colors[i * 3 + 2] = colorObj.b;
    }

    planeGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    posAttr.needsUpdate = true;
    planeGeo.computeVertexNormals();
  });

  if (!planeGeo) return null;

  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      <mesh
        ref={meshRef}
        geometry={planeGeo}
        onPointerMove={(e) => {
          e.stopPropagation();
          onHoverPoint({
            x: e.point.x,
            y: e.point.z,
            z: e.point.y,
          });
        }}
        onPointerOut={() => onHoverPoint(null)}
        onClick={(e) => {
          e.stopPropagation();
          onClickPoint({
            x: e.point.x,
            y: e.point.z,
            z: e.point.y,
          });
        }}
      >
        <meshStandardMaterial
          vertexColors
          side={THREE.DoubleSide}
          wireframe={isWireframe}
          roughness={0.25}
          metalness={0.15}
        />
      </mesh>
    </group>
  );
}

/* ---------------- 3D Pinpoint Marker ---------------- */

function PinpointMarker({ point, label, color = "#2A7A50", isTarget = false, is2DMode = false }) {
  if (!point) return null;
  const { x, y, z } = point;

  const posX = x;
  const posY = is2DMode ? y : z;
  const posZ = is2DMode ? 0.15 : y;
  const dropY = is2DMode ? -y : -z;

  return (
    <group position={[posX, posY, posZ]}>
      <mesh>
        <sphereGeometry args={[isTarget ? 0.35 : 0.25, 32, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.3, 0.48, 32]} />
        <meshBasicMaterial color={color} side={THREE.DoubleSide} transparent opacity={0.7} />
      </mesh>

      <line>
        <bufferGeometry
          attach="geometry"
          onUpdate={(geo) =>
            geo.setFromPoints([
              new THREE.Vector3(0, 0, 0),
              new THREE.Vector3(0, dropY, 0),
            ])
          }
        />
        <lineBasicMaterial color={color} opacity={0.6} transparent />
      </line>

      <Html position={[0, 0.65, 0]} center distanceFactor={25}>
        <div className="pointer-events-none whitespace-nowrap rounded-lg bg-slate-900/90 px-3 py-1.5 text-xs font-mono font-bold text-white shadow-2xl border border-emerald-500/50 backdrop-blur flex flex-col gap-0.5">
          <div className="text-[10px] text-emerald-400 font-semibold uppercase">{label}</div>
          <div>
            X: <span className="text-red-400">{x.toFixed(2)}</span> | Y: <span className="text-blue-400">{y.toFixed(2)}</span>
            {!is2DMode && (
              <> | Z: <span className="text-emerald-400">{z.toFixed(2)}</span></>
            )}
          </div>
        </div>
      </Html>
    </group>
  );
}

/* ---------------- 3D Axes — with showZAxis prop ---------------- */

function Axes3D({ range = 10, showZAxis = true, is2DMode = false }) {
  const ticks = useMemo(() => {
    const arr = [];
    const step = range <= 5 ? 2 : 5;
    for (let i = -range; i <= range; i += step) {
      if (i !== 0) arr.push(i);
    }
    return arr;
  }, [range]);

  return (
    <group>
      <Grid
        infiniteGrid={false}
        args={[range * 2, range * 2]}
        sectionSize={2}
        sectionColor="#2A7A50"
        cellColor="#94a3b8"
        fadeDistance={50}
        position={[0, -0.01, 0]}
      />

      {/* X Axis Red — always shown */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[range * 2, 0.06, 0.06]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
      <Text position={[range + 0.8, 0, 0]} fontSize={0.7} color="#ef4444" fontWeight="bold">
        +X
      </Text>

      {ticks.map((t) => (
        <group key={`x-tick-${t}`} position={[t, 0, 0]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.04, 0.25, 0.25]} />
            <meshBasicMaterial color="#f87171" />
          </mesh>
          <Text position={[0, -0.4, 0]} fontSize={0.4} color="#f87171">
            {t}
          </Text>
        </group>
      ))}

      {/* Z Height Axis Green — conditionally shown */}
      {showZAxis && (
        <>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.06, range * 2, 0.06]} />
            <meshBasicMaterial color="#22c55e" />
          </mesh>
          <Text position={[0, range + 0.8, 0]} fontSize={0.7} color="#22c55e" fontWeight="bold">
            +Z (Height)
          </Text>

          {ticks.map((t) => (
            <group key={`z-tick-${t}`} position={[0, t, 0]}>
              <mesh position={[0, 0, 0]}>
                <boxGeometry args={[0.25, 0.04, 0.25]} />
                <meshBasicMaterial color="#4ade80" />
              </mesh>
              <Text position={[0.4, 0, 0]} fontSize={0.4} color="#4ade80">
                {t}
              </Text>
            </group>
          ))}
        </>
      )}

      {/* Y Axis Blue — always shown, relabeled in 2D mode */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.06, 0.06, range * 2]} />
        <meshBasicMaterial color="#3b82f6" />
      </mesh>
      <Text position={[0, 0, range + 0.8]} fontSize={0.7} color="#3b82f6" fontWeight="bold">
        {is2DMode ? "+Y (Output)" : "+Y"}
      </Text>

      {ticks.map((t) => (
        <group key={`y-tick-${t}`} position={[0, 0, t]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.25, 0.25, 0.04]} />
            <meshBasicMaterial color="#60a5fa" />
          </mesh>
          <Text position={[0, -0.4, 0]} fontSize={0.4} color="#60a5fa">
            {t}
          </Text>
        </group>
      ))}
    </group>
  );
}

/* ---------------- Camera Controller ---------------- */

function CameraPresetHandler({ preset, range, is2DMode = false }) {
  const { camera } = useThree();

  useEffect(() => {
    if (!preset) return;

    if (is2DMode && preset === "iso") {
      camera.position.set(0, range * 0.4, range * 2.2);
      camera.lookAt(0, 0, 0);
      return;
    }

    switch (preset) {
      case "top":
        camera.position.set(0, range * 2.5, 0.001);
        break;
      case "front":
        camera.position.set(0, 0, range * 2.5);
        break;
      case "front2d":
        camera.position.set(0, range * 0.15, range * 2.5);
        break;
      case "iso":
      default:
        camera.position.set(range * 1.5, range * 1.2, range * 1.8);
        break;
    }
    camera.lookAt(0, 0, 0);
  }, [preset, range, camera, is2DMode]);

  return null;
}

/* ================================================================
   Main 3D Graph Component
   ================================================================ */

export default function ThreeDGraphViewer({
  equation = "2x + 3",
  wireframe = false,
  autoRotate = false,
  isAnimated = false,
  ampScale = 1.0,
  colorPalette = "curious",
  cameraPreset = "iso",
  inputX = 2,
  inputY = 2,
  is3DFullscreen = false,
}) {
  const range = 10;
  const resolution = 60;

  const [hoverPoint, setHoverPoint] = useState(null);
  const [pinnedPoint, setPinnedPoint] = useState(null);

  const analysis = useMemo(() => {
    try {
      return analyzeEquation(equation);
    } catch (e) {
      return { raw: equation, clean: equation, variables: ["x"], varCount: 1, hasEquals: false, sides: [equation], cleanSides: [equation], isSingleVariableEquation: false };
    }
  }, [equation]);

  const is2DMode = analysis.varCount < 2;

  // Compute target point for surface mode (2+ var)
  const customTargetPoint = useMemo(() => {
    if (!equation || is2DMode) return null;
    try {
      let exprStr = cleanExpression(equation);
      let parsedNode;
      try {
        parsedNode = parse(exprStr);
      } catch (e) {
        exprStr = "2*x + 3";
        parsedNode = parse(exprStr);
      }

      const compiled = parsedNode.compile();
      const numX = Number(inputX) || 0;
      const numY = Number(inputY) || 0;

      let calculatedZ = 0;
      try {
        calculatedZ = compiled.evaluate({ x: numX, y: numY });
      } catch (e) {
        calculatedZ = compiled.evaluate({ x: numX });
      }

      return { x: numX, y: numY, z: calculatedZ * ampScale };
    } catch (e) {
      return { x: Number(inputX) || 0, y: Number(inputY) || 0, z: 0 };
    }
  }, [equation, inputX, inputY, ampScale, is2DMode]);

  return (
    <div style={{ position: "relative", height: is3DFullscreen ? "calc(100vh - 85px)" : "550px", width: "100%", borderRadius: is3DFullscreen ? "0px" : "12px", overflow: "hidden", border: "0.5px solid var(--color-border-medium, #D4D4D4)", background: "#182232", cursor: "crosshair", boxShadow: "none" }}>
      <Canvas
        shadows
        camera={{
          position: is2DMode
            ? [0, range * 0.4, range * 2.2]
            : [range * 1.5, range * 1.2, range * 1.8],
          fov: 45,
        }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={["#182232"]} />

        <ambientLight intensity={1.5} />
        <directionalLight position={[20, 30, 20]} intensity={2.5} castShadow />
        <directionalLight position={[-20, 15, -20]} intensity={1.0} />

        <CameraPresetHandler preset={cameraPreset} range={range} is2DMode={is2DMode} />
        <Axes3D range={range} showZAxis={!is2DMode} is2DMode={is2DMode} />

        {/* Render lines for single-var, surface for multi-var */}
        {is2DMode ? (
          <LinePlot2DIn3D
            equation={equation}
            range={range}
            colorPalette={colorPalette}
            onHoverPoint={setHoverPoint}
            onClickPoint={setPinnedPoint}
          />
        ) : (
          <SurfaceMesh
            equation={equation}
            resolution={resolution}
            range={range}
            isWireframe={wireframe}
            isAnimated={isAnimated}
            ampScale={ampScale}
            colorPalette={colorPalette}
            onHoverPoint={setHoverPoint}
            onClickPoint={setPinnedPoint}
          />
        )}

        {!is2DMode && customTargetPoint && (
          <PinpointMarker
            point={customTargetPoint}
            label="Input Coordinate"
            color="#2A7A50"
            isTarget={true}
          />
        )}

        {hoverPoint && (
          <PinpointMarker
            point={hoverPoint}
            label="Hover Cursor"
            color="#38bdf8"
            is2DMode={is2DMode}
          />
        )}

        {pinnedPoint && (
          <PinpointMarker
            point={pinnedPoint}
            label="Pinned Point"
            color="#ec4899"
            is2DMode={is2DMode}
          />
        )}

        <OrbitControls
          autoRotate={autoRotate}
          autoRotateSpeed={1.5}
          enableZoom={true}
          enablePan={true}
          maxPolarAngle={Math.PI / 2 + 0.1}
        />
      </Canvas>

      {/* Coordinate Inspector Overlay — available in both 2D and 3D mode */}
      {(hoverPoint || pinnedPoint) && (
        <div
          style={{
            position: "absolute",
            top: "12px",
            left: "12px",
            borderRadius: "8px",
            padding: "10px 14px",
            fontSize: "12px",
            background: "rgba(234, 243, 222, 0.95)",
            border: "0.5px solid var(--color-bg-mint-border, #C0DD97)",
            color: "var(--color-text-primary, #1A1A1A)",
            pointerEvents: "none",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            zIndex: 10,
          }}
        >
          <span style={{ fontSize: "11px", fontWeight: 500, color: "var(--color-primary-dark, #27500A)" }}>
            🎯 Coordinate Inspector
          </span>
          {hoverPoint && (
            <div style={{ fontFamily: "monospace", fontSize: "12px", color: "var(--color-text-secondary, #666)" }}>
              Hover: X: <span style={{ color: "#d97706", fontWeight: 500 }}>{hoverPoint.x.toFixed(2)}</span> | Y: <span style={{ color: "#2563eb", fontWeight: 500 }}>{hoverPoint.y.toFixed(2)}</span>{!is2DMode && <> | Z: <span style={{ color: "#2A7A50", fontWeight: 500 }}>{hoverPoint.z.toFixed(2)}</span></>}
            </div>
          )}
          {pinnedPoint && (
            <div style={{ fontFamily: "monospace", fontSize: "12px", color: "var(--color-text-secondary, #666)", paddingTop: "4px", borderTop: "0.5px solid #C0DD97" }}>
              Pinned: X: <span style={{ color: "#d97706", fontWeight: 500 }}>{pinnedPoint.x.toFixed(2)}</span> | Y: <span style={{ color: "#2563eb", fontWeight: 500 }}>{pinnedPoint.y.toFixed(2)}</span>{!is2DMode && <> | Z: <span style={{ color: "#2A7A50", fontWeight: 500 }}>{pinnedPoint.z.toFixed(2)}</span></>}
            </div>
          )}
        </div>
      )}

      {/* Info Banner Overlay */}
      <div
        style={{
          position: "absolute",
          bottom: "12px",
          left: "12px",
          right: "12px",
          borderRadius: "8px",
          padding: "8px 14px",
          fontSize: "12px",
          fontWeight: 500,
          background: "rgba(250, 238, 218, 0.95)",
          color: "var(--color-amber-text, #633806)",
          border: "0.5px solid #F5E1BF",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pointerEvents: "none",
        }}
      >
        <span>
          {is2DMode
            ? "💡 Move cursor over canvas to inspect (X, Y) points • Click to pin coordinate • Drag to rotate 360°"
            : "💡 Drag to rotate 360° • Scroll to zoom • Click surface to pin coordinate"
          }
        </span>
        <span style={{ fontSize: "11px", fontWeight: 400, opacity: 0.8 }}>CuriousClass Visual Engine</span>
      </div>
    </div>
  );
}
