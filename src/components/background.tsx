"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type * as THREE from "three";
import { SceneBackgroundProps } from "@/types/components";

function ParticleField({
  count = 900,
  spread = 14,
}: {
  count?: number;
  spread?: number;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // eslint-disable-next-line react-hooks/purity
      arr[i * 3] = (Math.random() - 0.5) * spread;
      // eslint-disable-next-line react-hooks/purity
      arr[i * 3 + 1] = (Math.random() - 0.5) * spread;
      // eslint-disable-next-line react-hooks/purity
      arr[i * 3 + 2] = (Math.random() - 0.5) * spread;
    }
    return arr;
  }, [count, spread]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.getElapsedTime();
    pointsRef.current.rotation.y = t * 0.04;
    pointsRef.current.rotation.x = Math.sin(t * 0.12) * 0.15;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        sizeAttenuation
        color="#16a34a"
        transparent
        opacity={0.55}
        depthWrite={false}
      />
    </points>
  );
}

function FloatingKnot({ intensity }: { intensity: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = t * 0.15;
    meshRef.current.rotation.y = t * 0.2;
    meshRef.current.position.y = Math.sin(t * 0.5) * 0.4;
  });

  return (
    <mesh
      ref={meshRef}
      position={[3.2, 0, -2]}
      scale={1.6 * (0.6 + intensity * 0.6)}
    >
      <torusKnotGeometry args={[1, 0.28, 160, 24]} />
      <meshStandardMaterial
        color="#22c55e"
        roughness={0.35}
        metalness={0.2}
        transparent
        opacity={0.12 + intensity * 0.14}
        wireframe
      />
    </mesh>
  );
}

export function SceneBackground({
  intensity = 0.4,
  className,
}: SceneBackgroundProps) {
  return (
    <div className={className} aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ pointerEvents: "none" }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={0.6} />
        <ParticleField count={Math.round(500 + intensity * 700)} />
        <FloatingKnot intensity={intensity} />
      </Canvas>
    </div>
  );
}
