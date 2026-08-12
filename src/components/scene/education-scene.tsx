"use client";

import { Html, Line, OrbitControls, Text } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { MathUtils, type Group, type Mesh } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

import { FloatingLabel } from "@/components/ui/floating-label";
import { TooltipCard } from "@/components/ui/tooltip-card";

type SceneTheme = "dark" | "light";
type SceneObjectId = "client" | "http" | "tcp" | "server";

type HoverCardProps = {
  title: string;
  purpose: string;
  description: string;
  position: [number, number, number];
  icon?: ReactNode;
  children: ReactNode;
  hovered: boolean;
  onHover: () => void;
  onLeave: () => void;
};

function HoverCard({ title, purpose, description, position, icon, children, hovered, onHover, onLeave }: HoverCardProps) {
  return (
    <group position={position}>
      <group
        onPointerOver={(event) => {
          event.stopPropagation();
          onHover();
        }}
        onPointerOut={onLeave}
        scale={hovered ? 1.06 : 1}
      >
        {children}
      </group>

      {hovered && (
        <Html position={[0, 3, 0]} center style={{ pointerEvents: "none" }}>
          <TooltipCard title={title} purpose={purpose} description={description} icon={icon} />
        </Html>
      )}
    </group>
  );
}

function ClientComputer({ hovered, theme }: { hovered: boolean; theme: SceneTheme }) {
  const ref = useRef<Group>(null);
  const powerLight = useRef<Mesh>(null);
  const dimmed = hovered;

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.y = 0.25 + Math.sin(state.clock.elapsedTime * 1.4) * 0.12;

    if (powerLight.current) {
      const material = powerLight.current.material;
      if (material && "emissiveIntensity" in material) {
        material.emissiveIntensity = hovered ? 3.2 : 1.8 + Math.sin(state.clock.elapsedTime * 3) * 0.4;
      }
    }
  });

  return (
    <group ref={ref}>
      <mesh castShadow receiveShadow position={[0, 1.1, 0]}>
        <boxGeometry args={[2.3, 1.4, 0.18]} />
        <meshStandardMaterial
          color={theme === "dark" ? "#0b2545" : "#f8fafc"}
          emissive={theme === "dark" ? "#06243a" : "#f1f5f9"}
          emissiveIntensity={hovered ? 1.9 : 0.6}
          metalness={0.7}
          roughness={0.22}
        />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 1.1, 0.12]}>
        <boxGeometry args={[1.9, 1.05, 0.04]} />
        <meshStandardMaterial
          color={theme === "dark" ? "#092a56" : "#e2e8f0"}
          emissive={theme === "dark" ? "#ff7a00" : "#ffb36b"}
          emissiveIntensity={hovered ? 1.8 : dimmed ? 0.2 : 0.9}
        />
      </mesh>
      <mesh castShadow receiveShadow position={[0, -0.2, 0]}>
        <boxGeometry args={[1.7, 0.18, 0.8]} />
        <meshStandardMaterial color={theme === "dark" ? "#0f2646" : "#dbeafe"} metalness={0.6} roughness={0.2} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, -0.55, 0]}>
        <boxGeometry args={[0.55, 0.7, 0.28]} />
        <meshStandardMaterial color={theme === "dark" ? "#0b2346" : "#94a3b8"} metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh ref={powerLight} position={[0.85, 1.63, 0.2]}>
        <sphereGeometry args={[0.12, 28, 28]} />
        <meshStandardMaterial color="#4ade80" emissive="#4ade80" emissiveIntensity={hovered ? 3.2 : 2} />
      </mesh>
      {hovered && (
        <mesh position={[0, 1.2, -0.5]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.5, 0.08, 12, 80]} />
          <meshStandardMaterial color="#ff7a00" emissive="#ff7a00" emissiveIntensity={1.8} transparent opacity={0.8} />
        </mesh>
      )}
    </group>
  );
}

function HttpPackage({ hovered, theme }: { hovered: boolean; theme: SceneTheme }) {
  const hue = theme === "dark" ? "#f7c3ff" : "#f0abfc";
  const glow = hovered ? 1.7 : 0.8;

  return (
    <group rotation={[0.38, 0.3, -0.2]} scale={hovered ? 1.08 : 1}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.45, 1.1, 0.9]} />
        <meshStandardMaterial
          color={theme === "dark" ? "#c084fc" : "#e9d5ff"}
          emissive={hue}
          emissiveIntensity={glow}
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[0, 0.12, 0.48]}>
        <boxGeometry args={[1.18, 0.76, 0.03]} />
        <meshStandardMaterial color="#fff7ed" emissive="#f8fafc" emissiveIntensity={0.7} />
      </mesh>
      <Text position={[0, 0.15, 0.55]} fontSize={0.15} color={theme === "dark" ? "#0f172a" : "#1f2937"} anchorX="center" anchorY="middle">
        GET
      </Text>
      <Text position={[-0.35, -0.1, 0.55]} fontSize={0.09} color={theme === "dark" ? "#0f172a" : "#1f2937"} anchorX="center" anchorY="middle">
        Headers
      </Text>
      <Text position={[0.3, -0.18, 0.55]} fontSize={0.08} color={theme === "dark" ? "#0f172a" : "#1f2937"} anchorX="center" anchorY="middle">
        Body
      </Text>
      <Text position={[0.1, -0.35, 0.55]} fontSize={0.08} color={theme === "dark" ? "#0f172a" : "#1f2937"} anchorX="center" anchorY="middle">
        Cookies
      </Text>
      {hovered && (
        <mesh position={[0, 0, -0.56]}>
          <boxGeometry args={[1.7, 1.4, 0.1]} />
          <meshStandardMaterial color="#ff7a00" emissive="#ff7a00" emissiveIntensity={1.4} transparent opacity={0.32} />
        </mesh>
      )}
    </group>
  );
}

function TcpVehicle({ hovered, theme }: { hovered: boolean; theme: SceneTheme }) {
  return (
    <group scale={hovered ? 1.08 : 1} rotation={[0.12, 0.32, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.1, 0.8, 1.2]} />
        <meshStandardMaterial
          color={theme === "dark" ? "#1d4ed8" : "#2563eb"}
          emissive={theme === "dark" ? "#60a5fa" : "#93c5fd"}
          emissiveIntensity={hovered ? 1.8 : 1.1}
          metalness={0.82}
          roughness={0.16}
        />
      </mesh>
      <mesh position={[0.25, 0.52, 0]}>
        <boxGeometry args={[1.15, 0.48, 0.9]} />
        <meshStandardMaterial color={theme === "dark" ? "#bfdbfe" : "#dbeafe"} emissive="#f8fafc" emissiveIntensity={hovered ? 1.6 : 0.85} />
      </mesh>
      {[-1.05, 1.05].map((x) => (
        <group key={x}>
          <mesh position={[x, -0.38, 0.48]}>
            <cylinderGeometry args={[0.2, 0.2, 0.28, 22]} />
            <meshStandardMaterial color="#e2e8f0" emissive="#f8fafc" emissiveIntensity={1.2} />
          </mesh>
          <mesh position={[x, -0.38, -0.48]}>
            <cylinderGeometry args={[0.2, 0.2, 0.28, 22]} />
            <meshStandardMaterial color="#e2e8f0" emissive="#f8fafc" emissiveIntensity={1.2} />
          </mesh>
        </group>
      ))}
      {hovered && (
        <mesh position={[0, 0, -0.7]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.25, 0.09, 12, 80]} />
          <meshStandardMaterial color="#ff7a00" emissive="#ff7a00" emissiveIntensity={1.8} transparent opacity={0.75} />
        </mesh>
      )}
    </group>
  );
}

function ServerComputer({ hovered, theme }: { hovered: boolean; theme: SceneTheme }) {
  const ref = useRef<Group>(null);
  const ledRefs = useRef<Mesh[]>([]);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.y = 0.1 + Math.sin(state.clock.elapsedTime * 2) * 0.12;
    const cycle = ((state.clock.elapsedTime * 0.8) % 12 + 12) % 12;
    const serverGlow = cycle > 4 && cycle < 8 ? 2.9 : 0.8 + Math.sin(state.clock.elapsedTime * 7) * 0.45;

    ledRefs.current.forEach((mesh) => {
      const material = mesh.material;
      if (material && "emissiveIntensity" in material) {
        material.emissiveIntensity = hovered ? 3.2 : serverGlow;
      }
    });
  });

  return (
    <group ref={ref}>
      <mesh castShadow receiveShadow position={[0, 1.15, 0]}>
        <boxGeometry args={[2.8, 1.7, 0.78]} />
        <meshStandardMaterial
          color={theme === "dark" ? "#092a56" : "#eef2ff"}
          emissive={theme === "dark" ? "#06243a" : "#e0e7ff"}
          emissiveIntensity={hovered ? 2.2 : 0.8}
          metalness={0.85}
          roughness={0.18}
        />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.05, 0]}>
        <boxGeometry args={[2.8, 0.4, 0.86]} />
        <meshStandardMaterial color={theme === "dark" ? "#1f2937" : "#dbeafe"} metalness={0.8} roughness={0.2} />
      </mesh>
      {[-0.95, -0.28, 0.4].map((x, index) => (
        <mesh
          key={x}
          ref={(node) => {
            if (node) ledRefs.current[index] = node;
          }}
          position={[x, 1.15, 0.42]}
        >
          <boxGeometry args={[0.5, 0.16, 0.04]} />
          <meshStandardMaterial color="#ff7a00" emissive="#ff7a00" emissiveIntensity={hovered ? 3.3 : 1.7} />
        </mesh>
      ))}
      {[-0.95, -0.28, 0.4].map((x, index) => (
        <mesh
          key={`${x}-lower`}
          ref={(node) => {
            if (node) ledRefs.current[index + 3] = node;
          }}
          position={[x, 0.73, 0.42]}
        >
          <boxGeometry args={[0.5, 0.16, 0.04]} />
          <meshStandardMaterial color="#4ade80" emissive="#4ade80" emissiveIntensity={hovered ? 3.1 : 1.5} />
        </mesh>
      ))}
      {hovered && (
        <mesh position={[0, 1.15, -0.7]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[3.2, 0.1, 12, 80]} />
          <meshStandardMaterial color="#ff7a00" emissive="#ff7a00" emissiveIntensity={1.8} transparent opacity={0.75} />
        </mesh>
      )}
    </group>
  );
}

function VehicleProxy({ hovered, theme }: { hovered: boolean; theme: SceneTheme }) {
  const ref = useRef<Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.elapsedTime * 0.7;
    const cycle = (time % 12 + 12) % 12;
    const isOutbound = cycle < 5;
    const x = isOutbound ? MathUtils.lerp(-4.8, 4.8, cycle / 5) : cycle < 8 ? 4.8 : MathUtils.lerp(4.8, -4.8, (cycle - 8) / 4);
    const y = 1.8 + Math.sin(time * 3.8) * 0.18;
    ref.current.position.set(x, y, 0.3);
    ref.current.rotation.y = isOutbound ? 0.12 : cycle < 8 ? 0.15 : -0.12;
  });

  return (
    <group ref={ref}>
      <TcpVehicle hovered={hovered} theme={theme} />
    </group>
  );
}

function AnimatedRequestStep({
  client,
  server,
  isPlaying,
  hovered,
  theme,
}: {
  client: [number, number, number];
  server: [number, number, number];
  isPlaying: boolean;
  hovered: SceneObjectId | null;
  theme: SceneTheme;
}) {
  const requestRef = useRef<Group>(null);
  const responseRef = useRef<Group>(null);

  useFrame((state) => {
    const cycle = (state.clock.elapsedTime * 0.7) % 12;

    if (requestRef.current) {
      if (!isPlaying) {
        requestRef.current.visible = false;
      } else {
        const x = cycle < 4.5 ? MathUtils.lerp(client[0] + 0.5, server[0] - 0.8, cycle / 4.5) : server[0] - 0.8;
        const y = cycle < 4.5 ? 1.5 + Math.sin(cycle * 2.4) * 0.22 : 2.2;
        const z = cycle < 4.5 ? 0.9 : 0.55;
        requestRef.current.position.set(x, y, z);
        requestRef.current.visible = cycle < 9;
      }
    }

    if (responseRef.current) {
      if (!isPlaying) {
        responseRef.current.visible = false;
      } else {
        const responseCycle = cycle > 5 ? cycle - 5 : 0;
        const x = cycle > 5 && cycle < 9 ? MathUtils.lerp(server[0] - 0.9, client[0] + 0.6, responseCycle / 4) : client[0] + 0.4;
        const y = cycle > 5 && cycle < 9 ? 1.7 + Math.sin(responseCycle * 3.1) * 0.18 : 1.5;
        const z = cycle > 5 && cycle < 9 ? -0.6 : 0.8;
        responseRef.current.position.set(x, y, z);
        responseRef.current.visible = cycle > 5 && cycle < 10;
      }
    }
  });

  return (
    <>
      <group ref={requestRef}>
        <HttpPackage hovered={hovered === "http"} theme={theme} />
      </group>
      <group ref={responseRef}>
        <HttpPackage hovered={hovered === "http"} theme={theme} />
      </group>
    </>
  );
}

function SceneContent({ isPlaying, theme, autoRotate, resetSignal }: { isPlaying: boolean; theme: SceneTheme; autoRotate: boolean; resetSignal: number }) {
  const groupRef = useRef<Group>(null);
  const orbitRef = useRef<OrbitControlsImpl | null>(null);
  const [hoveredObject, setHoveredObject] = useState<SceneObjectId | null>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    if (!isPlaying) {
      groupRef.current.rotation.y = 0.3;
      groupRef.current.rotation.x = 0.15;
      return;
    }

    if (autoRotate) {
      groupRef.current.rotation.y = 0.3 + Math.sin(state.clock.elapsedTime * 0.5) * 0.28;
      groupRef.current.rotation.x = 0.15 + Math.sin(state.clock.elapsedTime * 0.7) * 0.12;
    } else {
      groupRef.current.rotation.y = 0.3;
      groupRef.current.rotation.x = 0.15;
    }
  });

  useEffect(() => {
    if (orbitRef.current) {
      orbitRef.current.reset();
      orbitRef.current.enableRotate = true;
      orbitRef.current.enablePan = true;
      orbitRef.current.enableZoom = true;
      orbitRef.current.minDistance = 7;
      orbitRef.current.maxDistance = 18;
      orbitRef.current.minPolarAngle = Math.PI / 2.8;
      orbitRef.current.maxPolarAngle = Math.PI / 1.8;
    }
  }, [resetSignal]);

  const clientPos = [-4.8, 0.15, 0] as [number, number, number];
  const serverPos = [4.8, 0.15, 0] as [number, number, number];

  const particles = useMemo(() => {
    // deterministic pseudo-random using sine; avoids Math.random in render while remaining pure
    const out: { x: number; y: number; z: number; s: number }[] = [];
    for (let i = 0; i < 36; i++) {
      const r1 = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
      const r2 = Math.abs(Math.sin((i + 7) * 78.233) * 127.1) % 1;
      const r3 = Math.abs(Math.sin((i + 13) * 45.164) * 371.7) % 1;
      const x = (r1 * 2 - 1) * 10;
      const y = 0.5 + r2 * 2;
      const z = (r3 * 2 - 1) * 6;
      const s = 0.02 + r2 * 0.06;
      out.push({ x, y, z, s });
    }
    return out;
  }, []);
  const isDimmed = Boolean(hoveredObject);
  const laneLength = Math.abs(serverPos[0] - clientPos[0]) - 0.6;

  return (
    <group ref={groupRef}>
      {/* soft fog for depth */}
      <fog attach="fog" args={[theme === "dark" ? "#020817" : "#f8fafc", 6, 22]} />

      {/* glowing transport lane (premium ribbon) */}
      <group position={[0, 0.12, 0]} rotation={[0, 0, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[laneLength, 0.06, 0.86]} />
          <meshStandardMaterial
            color={theme === "dark" ? "#081028" : "#f1f5f9"}
            emissive={theme === "dark" ? "#0b1226" : "#fff7ed"}
            emissiveIntensity={isDimmed ? 0.35 : 0.55}
            transparent
            opacity={0.65}
            metalness={0.4}
            roughness={0.18}
          />
        </mesh>
        {/* center glow */}
        <mesh position={[0, 0.03, 0]}>
          <boxGeometry args={[laneLength * 0.92, 0.02, 0.28]} />
          <meshStandardMaterial color="#ff7a00" emissive="#ff7a00" emissiveIntensity={isDimmed ? 0.8 : 1.6} transparent opacity={0.22} />
        </mesh>
      </group>

      {/* subtle secondary guide */}
      <Line points={[[clientPos[0] + 0.2, -0.4, 0], [serverPos[0] - 0.2, -0.4, 0]]} color={theme === "dark" ? "#f8fafc" : "#cbd5e1"} lineWidth={1} transparent opacity={isDimmed ? 0.18 : 0.4} />

      <group position={clientPos}>
        <HoverCard
          title="Client"
          purpose="The device that initiates the request."
          description="The browser or application sends the user request into the network stack."
          position={[0, 0, 0]}
          icon={<span>◉</span>}
          hovered={hoveredObject === "client"}
          onHover={() => setHoveredObject("client")}
          onLeave={() => setHoveredObject(null)}
        >
          <ClientComputer hovered={hoveredObject === "client"} theme={theme} />
        </HoverCard>
        <FloatingLabel text="CLIENT" position={[0, 3.2, 0]} />
      </group>

      <group position={[0, 1.9, 0.5]}>
        <HoverCard
          title="HTTP Request"
          purpose="Contains method, headers, cookies and body."
          description="The request package carries the user intent and payload from client to server."
          position={[0, 0, 0]}
          icon={<span>⬢</span>}
          hovered={hoveredObject === "http"}
          onHover={() => setHoveredObject("http")}
          onLeave={() => setHoveredObject(null)}
        >
          <AnimatedRequestStep
            client={clientPos}
            server={serverPos}
            isPlaying={isPlaying}
            hovered={hoveredObject}
            theme={theme}
          />
        </HoverCard>
      </group>

      <group position={[0, 1.9, 0]}>
        <HoverCard
          title="TCP"
          purpose="Reliable transport protocol responsible for delivering packets."
          description="TCP moves data safely across the network and ensures the message arrives intact."
          position={[0, 0, 0]}
          icon={<span>⇄</span>}
          hovered={hoveredObject === "tcp"}
          onHover={() => setHoveredObject("tcp")}
          onLeave={() => setHoveredObject(null)}
        >
          <VehicleProxy hovered={hoveredObject === "tcp"} theme={theme} />
        </HoverCard>
        <FloatingLabel text="TCP" position={[0, 3.2, 0]} />
      </group>

      <group position={serverPos}>
        <HoverCard
          title="Server"
          purpose="Processes the request and returns a response."
          description="The server interprets the request, performs work, and creates the response payload."
          position={[0, 0, 0]}
          icon={<span>◌</span>}
          hovered={hoveredObject === "server"}
          onHover={() => setHoveredObject("server")}
          onLeave={() => setHoveredObject(null)}
        >
          <ServerComputer hovered={hoveredObject === "server"} theme={theme} />
        </HoverCard>
        <FloatingLabel text="SERVER" position={[0, 3.3, 0]} />
      </group>

      {/* platform */}
      <mesh position={[0, -1.1, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[5.4, 5.4, 0.26, 64]} />
        <meshStandardMaterial
          color={theme === "dark" ? "#071226" : "#f8fafc"}
          emissive={theme === "dark" ? "#021024" : "#f8fafc"}
          emissiveIntensity={0.15}
          metalness={0.2}
          roughness={0.45}
          transparent
          opacity={theme === "dark" ? 0.95 : 0.98}
        />
      </mesh>

      {/* reflective disc for subtle reflection */}
      <mesh position={[0, -1.02, 0]} rotation={[0, 0, 0]}>
        <circleGeometry args={[4.8, 64]} />
        <meshStandardMaterial color={theme === "dark" ? "#020617" : "#f1f5f9"} metalness={0.62} roughness={0.18} opacity={0.85} transparent />
      </mesh>

      {/* ambient particles */}
      <group>
        {particles.map((p, i) => (
          <mesh key={i} position={[p.x, p.y, p.z]}>
            <sphereGeometry args={[p.s, 10, 10]} />
            <meshStandardMaterial color={theme === "dark" ? "#93c5fd" : "#2563eb"} emissive={theme === "dark" ? "#93c5fd" : "#60a5fa"} emissiveIntensity={0.12} transparent opacity={0.9} />
          </mesh>
        ))}
      </group>

      {/* lights (adjusted when dimming) */}
      <pointLight position={[-5, 3, 4]} intensity={isDimmed ? 8 : 24} color={theme === "dark" ? "#ff7a00" : "#fdba74"} />
      <pointLight position={[5, 4, 4]} intensity={isDimmed ? 6 : 18} color={theme === "dark" ? "#93c5fd" : "#60a5fa"} />
      <ambientLight intensity={isDimmed ? (theme === "dark" ? 0.45 : 0.6) : theme === "dark" ? 1.5 : 1.2} />
      <directionalLight position={[5, 7, 6]} intensity={isDimmed ? 0.8 : theme === "dark" ? 1.8 : 1.6} color={theme === "dark" ? "#fff7ed" : "#f8fafc"} />

      <OrbitControls ref={orbitRef} enablePan enableZoom enableRotate minDistance={7} maxDistance={18} minPolarAngle={Math.PI / 2.8} maxPolarAngle={Math.PI / 1.8} />
    </group>
  );
}

export function EducationScene({
  isPlaying = true,
  autoRotate = true,
  resetSignal = 0,
  theme = "dark",
}: {
  isPlaying?: boolean;
  autoRotate?: boolean;
  resetSignal?: number;
  theme?: SceneTheme;
}) {
  return (
    <div className="h-[480px] w-full overflow-hidden rounded-[28px] border border-[var(--border)] bg-[var(--panel-strong)] shadow-[0_20px_70px_rgba(15,23,42,0.18)]">
      <Canvas camera={{ position: [0, 1.4, 12], fov: 34 }}>
        <color attach="background" args={[theme === "dark" ? "#020817" : "#f8fafc"]} />
        <SceneContent isPlaying={isPlaying} theme={theme} autoRotate={autoRotate} resetSignal={resetSignal} />
      </Canvas>
    </div>
  );
}
