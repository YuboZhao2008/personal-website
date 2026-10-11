"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Group, MathUtils } from "three";

function Sculpture({ running }: { running: boolean }) {
  const root = useRef<Group>(null);
  const core = useRef<Group>(null);
  const orbit = useRef<Group>(null);
  const rotation = useRef(0);
  useFrame((state, delta) => {
    if (!running || !root.current || !core.current || !orbit.current) return;
    const step = Math.min(delta, 0.05);
    rotation.current += step;
    root.current.rotation.y = MathUtils.damp(
      root.current.rotation.y,
      state.pointer.x * 0.18,
      3,
      step,
    );
    root.current.rotation.x = MathUtils.damp(
      root.current.rotation.x,
      -0.12 + state.pointer.y * 0.1,
      3,
      step,
    );
    root.current.position.y = Math.sin(rotation.current * 0.42) * 0.07;
    orbit.current.rotation.y = rotation.current * 0.075;
    core.current.rotation.y = rotation.current * 0.16;
    core.current.rotation.z = rotation.current * 0.075;
  });
  return (
    <group ref={root} rotation={[-0.12, 0, -0.25]}>
      <group ref={core} rotation={[0.2, 0.4, 0]}>
        <mesh>
          <icosahedronGeometry args={[0.86, 0]} />
          <meshStandardMaterial
            color="#8caeed"
            metalness={0.62}
            roughness={0.26}
            emissive="#213f85"
            emissiveIntensity={0.32}
            flatShading
          />
        </mesh>
        <mesh scale={1.015}>
          <icosahedronGeometry args={[0.86, 0]} />
          <meshBasicMaterial
            color="#c3dffe"
            wireframe
            transparent
            opacity={0.32}
          />
        </mesh>
      </group>
      <group ref={orbit}>
        <group rotation={[1.02, 0.38, 0]}>
          <mesh>
            <torusGeometry args={[1.92, 0.062, 12, 120]} />
            <meshStandardMaterial
              color="#b6cbe6"
              metalness={0.87}
              roughness={0.27}
            />
          </mesh>
          <mesh position={[1.92, 0, 0]}>
            <sphereGeometry args={[0.14, 18, 18]} />
            <meshStandardMaterial
              color="#d0ebff"
              metalness={0.55}
              roughness={0.2}
              emissive="#689bd6"
              emissiveIntensity={0.3}
            />
          </mesh>
        </group>
        <group rotation={[0.36, 1.12, 0.8]}>
          <mesh>
            <torusGeometry args={[2.1, 0.034, 10, 120]} />
            <meshStandardMaterial
              color="#577ed4"
              metalness={0.7}
              roughness={0.26}
            />
          </mesh>
          <mesh position={[-1.83, 1.03, 0]}>
            <sphereGeometry args={[0.11, 16, 16]} />
            <meshStandardMaterial
              color="#8eb5ff"
              metalness={0.55}
              roughness={0.24}
              emissive="#315fbb"
              emissiveIntensity={0.6}
            />
          </mesh>
        </group>
        <group rotation={[0.7, -0.75, -0.5]}>
          <mesh>
            <torusGeometry args={[2.28, 0.016, 8, 128]} />
            <meshStandardMaterial
              color="#a5cfea"
              metalness={0.6}
              roughness={0.3}
            />
          </mesh>
          <mesh position={[0, -2.28, 0]}>
            <sphereGeometry args={[0.065, 12, 12]} />
            <meshBasicMaterial color="#b6dfff" />
          </mesh>
        </group>
      </group>
      <mesh rotation={[1.38, 0.1, 0.18]}>
        <torusGeometry args={[2.65, 0.007, 6, 160]} />
        <meshBasicMaterial color="#708cae" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

/** Signal after a rendered frame, and restore the SVG if the GPU context is lost. */
function SceneLifecycle({
  onReady,
  onFailure,
}: {
  onReady: (ready: boolean) => void;
  onFailure: () => void;
}) {
  const gl = useThree((state) => state.gl);
  const frame = useRef<number | null>(null);
  useFrame(() => {
    if (frame.current === null)
      frame.current = requestAnimationFrame(() => onReady(true));
  });
  useEffect(() => {
    const canvas = gl.domElement;
    const lost = (event: Event) => {
      event.preventDefault();
      onFailure();
    };
    canvas.addEventListener("webglcontextlost", lost);
    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      frame.current = null;
      canvas.removeEventListener("webglcontextlost", lost);
      onReady(false);
    };
  }, [gl, onReady, onFailure]);
  return null;
}
export default function SceneCanvas({
  running,
  onReady,
  onFailure,
}: {
  running: boolean;
  onReady: (ready: boolean) => void;
  onFailure: () => void;
}) {
  return (
    <div className="hero-scene-canvas" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 7.5], fov: 45 }}
        dpr={[1, 1.5]}
        frameloop={running ? "always" : "demand"}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        fallback={null}
        style={{ touchAction: "pan-y" }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[-4, 5, 5]} intensity={4} color="#d4e6ff" />
        <directionalLight
          position={[4, -2, 2]}
          intensity={2.3}
          color="#4d80f4"
        />
        <pointLight position={[0, 2, -3]} intensity={12} color="#9dccff" />
        <Sculpture running={running} />
        <SceneLifecycle onReady={onReady} onFailure={onFailure} />
      </Canvas>
    </div>
  );
}
