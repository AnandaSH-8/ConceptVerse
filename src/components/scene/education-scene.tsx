"use client";

import { Html, OrbitControls, Text } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { MathUtils, Vector3, type Group, type Mesh } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

import { TooltipCard } from "@/components/ui/tooltip-card";

type SceneTheme = "dark" | "light";
type SceneObjectId = "client" | "http" | "tcp" | "server";
type AnimationPhase = 0 | 1 | 2 | 3 | 4 | 5;

type ScenePalette = {
  background: string;
  floor: { base: string; accent: string; glow: string };
  lane: { base: string; glow: string; accent: string };
  client: { body: string; panel: string; screen: string; accent: string; detail: string };
  server: { body: string; panel: string; screen: string; led: string; ledAccent: string };
  httpRequest: { body: string; panel: string; text: string };
  httpResponse: { body: string; panel: string; text: string };
  tcp: { body: string; cabin: string; glow: string; wheel: string }; 
  lighting: { hemiSky: string; hemiGround: string; key: string; dir: string; ambient: number; pointA: string; pointB: string };
};

const TIMELINE_STEPS = [
  { label: "Create Request", description: "Client generates the HTTP request package." },
  { label: "TCP Transport", description: "TCP moves the request package along the transport lane." },
  { label: "Server Processing", description: "Server receives the request and processes it." },
  { label: "Response", description: "Server builds the response and hands it back to TCP." },
  { label: "Client Receives", description: "TCP returns the response and the client receives it." },
] as const;

const ANIMATION_PHASE_DURATIONS = [1.4, 1.6, 2.4, 1.6, 2.0, 1.0] as const;
const ANIMATION_LOOP_DURATION = ANIMATION_PHASE_DURATIONS.reduce((sum, duration) => sum + duration, 0);

function getPhaseInfo(elapsed: number) {
  const time = elapsed % ANIMATION_LOOP_DURATION;
  let accumulated = 0;
  for (let index = 0; index < ANIMATION_PHASE_DURATIONS.length; index += 1) {
    const duration = ANIMATION_PHASE_DURATIONS[index];
    if (time < accumulated + duration) {
      return {
        phase: index as AnimationPhase,
        phaseProgress: (time - accumulated) / duration,
        globalTime: time,
      };
    }
    accumulated += duration;
  }

  return {
    phase: 0 as AnimationPhase,
    phaseProgress: 0,
    globalTime: 0,
  };
}

function getTimelineStep(phase: AnimationPhase) {
  if (phase === 0) return 0;
  if (phase === 1 || phase === 2) return 1;
  if (phase === 3) return 2;
  if (phase === 4) return 3;
  return 4;
}

const SCENE_THEME_CONFIG: Record<SceneTheme, ScenePalette> = {
  dark: {
    background: "#050A14",
    floor: { base: "#122138", accent: "#1F3A63", glow: "#FF8A1F" },
    lane: { base: "#163A66", glow: "#FF8A1F", accent: "#4F8CFF" },
    client: { body: "#263449", panel: "#3A4A60", screen: "#7DD3FC", accent: "#FF8A1F", detail: "#AFC8E9" },
    server: { body: "#263449", panel: "#3A4A60", screen: "#7DD3FC", led: "#FF8A1F", ledAccent: "#34D399" },
    httpRequest: { body: "#FF8A1F", panel: "#FFDCC2", text: "#111827" },
    httpResponse: { body: "#34D399", panel: "#D3FAE2", text: "#0F172A" },
    tcp: { body: "#4F8CFF", cabin: "#1E40AF", glow: "#FF8A1F", wheel: "#CBD5E1" },
    lighting: { hemiSky: "#3A5B8F", hemiGround: "#07141F", key: "#FFE6B0", dir: "#F6E9D7", ambient: 0.7, pointA: "#FF8A1F", pointB: "#7DD3FC" },
  },
  light: {
    background: "#F5F7FA",
    floor: { base: "#DDE6F0", accent: "#B9C9DE", glow: "#FF8A1F" },
    lane: { base: "#B7C8E3", glow: "#FF8A1F", accent: "#2563EB" },
    client: { body: "#D9E0E8", panel: "#AEB8C5", screen: "#DFF4FF", accent: "#FF8A1F", detail: "#475569" },
    server: { body: "#D9E0E8", panel: "#AEB8C5", screen: "#DFF4FF", led: "#FF8A1F", ledAccent: "#22B981" },
    httpRequest: { body: "#FF8A1F", panel: "#FFE8D1", text: "#0F172A" },
    httpResponse: { body: "#22B981", panel: "#D7F8E5", text: "#0F172A" },
    tcp: { body: "#2563EB", cabin: "#1D4ED8", glow: "#FF8A1F", wheel: "#334155" },
    lighting: { hemiSky: "#F7F9FC", hemiGround: "#E7EDF7", key: "#FFFBF2", dir: "#FFFFFF", ambient: 1.0, pointA: "#FF8A1F", pointB: "#2563EB" },
  },
};

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

function SceneLabel({ text, position, active, visible = true }: { text: string; position: [number, number, number]; active?: boolean; visible?: boolean }) {
  if (!visible) return null;

  return (
    <Html position={position} center style={{ pointerEvents: "none", opacity: active ? 1 : 0.56, transition: "opacity 180ms ease" }}>
      <span className="rounded-full border border-[var(--border)] bg-[var(--panel-soft)] px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.24em] text-[var(--text)] shadow-[0_8px_18px_rgba(15,23,42,0.08)] backdrop-blur-sm">
        {text}
      </span>
    </Html>
  );
}

function HoverCard({ title, purpose, description, position, icon, children, hovered, onHover, onLeave }: HoverCardProps) {
  const groupRef = useRef<Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      const targetScale = hovered ? 1.06 : 1;
      groupRef.current.scale.lerp(new Vector3(targetScale, targetScale, targetScale), 0.08);
    }
  });

  return (
    <group position={position} ref={groupRef}>
      <group
        onPointerOver={(event) => {
          event.stopPropagation();
          onHover();
        }}
        onPointerOut={onLeave}
      >
        {children}
      </group>

      {hovered && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <circleGeometry args={[1.6, 48]} />
          <meshStandardMaterial color="#FF8A1F" emissive="#FF8A1F" emissiveIntensity={0.8} transparent opacity={0.18} roughness={1} />
        </mesh>
      )}

      {hovered && (
        <Html position={[0, 3, 0]} center style={{ pointerEvents: "none" }}>
          <TooltipCard title={title} purpose={purpose} description={description} icon={icon} />
        </Html>
      )}
    </group>
  );
}

function ClientComputer({ highlighted, dimmed, theme }: { highlighted: boolean; dimmed: boolean; theme: SceneTheme }) {
  const style = SCENE_THEME_CONFIG[theme].client;
  const ref = useRef<Group>(null);
  const powerLight = useRef<Mesh>(null);
  const intensity = highlighted ? 1.2 : dimmed ? 0.5 : 0.85;

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.y = 0.15 + Math.sin(state.clock.elapsedTime * 1.4) * 0.035;

    if (powerLight.current) {
      const material = powerLight.current.material;
      if (material && "emissiveIntensity" in material) {
        material.emissiveIntensity = highlighted ? 3.2 : 2 + Math.sin(state.clock.elapsedTime * 3) * 0.3;
      }
    }
  });

  return (
    <group ref={ref} scale={[1.24, 1.24, 1.24]}>
      <mesh castShadow receiveShadow position={[0, 1.08, 0]}>
        <boxGeometry args={[2.2, 1.25, 0.24]} />
        <meshPhysicalMaterial color={style.body} emissive={style.panel} emissiveIntensity={intensity * 0.55} metalness={0.45} roughness={0.24} clearcoat={0.18} clearcoatRoughness={0.35} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 1.08, 0.14]}>
        <boxGeometry args={[1.9, 0.95, 0.05]} />
        <meshStandardMaterial color={style.panel} emissive={style.screen} emissiveIntensity={highlighted ? 1.4 : 0.95} metalness={0.1} roughness={0.2} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, -0.22, 0]}>
        <boxGeometry args={[1.7, 0.16, 0.8]} />
        <meshPhysicalMaterial color={style.body} metalness={0.35} roughness={0.25} clearcoat={0.12} clearcoatRoughness={0.45} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, -0.58, 0]}>
        <boxGeometry args={[0.55, 0.72, 0.28]} />
        <meshPhysicalMaterial color={style.panel} metalness={0.7} roughness={0.28} clearcoat={0.14} clearcoatRoughness={0.42} />
      </mesh>
      <mesh ref={powerLight} position={[0.9, 1.61, 0.2]}>
        <sphereGeometry args={[0.12, 28, 28]} />
        <meshStandardMaterial color={style.accent} emissive={style.accent} emissiveIntensity={highlighted ? 3.2 : 2.6} />
      </mesh>
      <mesh position={[-0.75, 1.05, 0.16]} rotation={[0, 0, 0.18]}>
        <boxGeometry args={[0.36, 0.22, 0.02]} />
        <meshStandardMaterial color={style.detail} metalness={0.2} roughness={0.4} />
      </mesh>
      <mesh position={[0.75, 1.05, 0.16]} rotation={[0, 0, -0.18]}>
        <boxGeometry args={[0.36, 0.22, 0.02]} />
        <meshStandardMaterial color={style.detail} metalness={0.2} roughness={0.4} />
      </mesh>
      {highlighted && (
        <mesh position={[0, 1.08, -0.65]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.15, 0.08, 12, 80]} />
          <meshStandardMaterial color="#ff7a00" emissive="#ff7a00" emissiveIntensity={1.8} transparent opacity={0.78} />
        </mesh>
      )}
    </group>
  );
}

function HttpPackage({ highlighted, dimmed, theme, variant }: { highlighted: boolean; dimmed: boolean; theme: SceneTheme; variant: "request" | "response" }) {
  const palette = SCENE_THEME_CONFIG[theme];
  const isRequest = variant === "request";
  const style = isRequest ? palette.httpRequest : palette.httpResponse;
  const glow = highlighted ? 1.8 : dimmed ? 0.28 : 1.05;
  const label = isRequest ? "GET" : "200";
  const subLabels = isRequest ? ["Headers", "Body", "Cookies"] : ["Headers", "Body", "Status"];

  return (
    <group rotation={[0.22, 0.22, -0.12]} scale={highlighted ? 1.28 : 1.2}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.45, 1.1, 0.9]} />
        <meshPhysicalMaterial color={style.body} emissive={style.body} emissiveIntensity={glow * 0.55} metalness={0.35} roughness={0.16} clearcoat={0.18} clearcoatRoughness={0.3} />
      </mesh>
      <mesh position={[0, 0.12, 0.48]}>
        <boxGeometry args={[1.18, 0.76, 0.03]} />
        <meshPhysicalMaterial color={style.panel} emissive={style.panel} emissiveIntensity={0.42} metalness={0.05} roughness={0.14} clearcoat={0.1} />
      </mesh>
      <Text position={[0, 0.18, 0.55]} fontSize={0.16} color={style.text} anchorX="center" anchorY="middle">
        {label}
      </Text>
      <Text position={[-0.3, -0.05, 0.55]} fontSize={0.085} color={style.text} anchorX="center" anchorY="middle">
        {subLabels[0]}
      </Text>
      <Text position={[0.32, -0.12, 0.55]} fontSize={0.075} color={style.text} anchorX="center" anchorY="middle">
        {subLabels[1]}
      </Text>
      <Text position={[0.08, -0.31, 0.55]} fontSize={0.075} color={style.text} anchorX="center" anchorY="middle">
        {subLabels[2]}
      </Text>
      {highlighted && (
        <mesh position={[0, 0, -0.56]}>
          <boxGeometry args={[1.7, 1.4, 0.1]} />
          <meshStandardMaterial color="#ff7a00" emissive="#ff7a00" emissiveIntensity={1.35} transparent opacity={0.22} />
        </mesh>
      )}
    </group>
  );
}


function TcpVehicle({ highlighted, dimmed, theme, cargo }: { highlighted: boolean; dimmed: boolean; theme: SceneTheme; cargo: "request" | "response" | null }) {
  const style = SCENE_THEME_CONFIG[theme].tcp;
  const intensity = highlighted ? 1.7 : dimmed ? 0.35 : 1;
  const cargoStyle = cargo === "request" ? SCENE_THEME_CONFIG[theme].httpRequest : cargo === "response" ? SCENE_THEME_CONFIG[theme].httpResponse : null;

  return (
    <group scale={highlighted ? 1.34 : 1.24} rotation={[0.12, 0.32, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.65, 1.05]} />
        <meshPhysicalMaterial color={style.body} emissive={style.cabin} emissiveIntensity={0.22 * intensity} metalness={0.68} roughness={0.18} clearcoat={0.3} clearcoatRoughness={0.25} />
      </mesh>
      <mesh position={[0.2, 0.45, 0]}>
        <boxGeometry args={[1.2, 0.4, 0.76]} />
        <meshPhysicalMaterial color={style.cabin} emissive={style.cabin} emissiveIntensity={highlighted ? 1.2 : 0.6} metalness={0.15} roughness={0.2} clearcoat={0.22} clearcoatRoughness={0.28} />
      </mesh>
      {cargoStyle && (
        <mesh position={[0, 0.55, 0]}>
          <boxGeometry args={[0.7, 0.46, 0.6]} />
          <meshPhysicalMaterial color={cargoStyle.body} emissive={cargoStyle.panel} emissiveIntensity={0.45 * intensity} metalness={0.18} roughness={0.16} clearcoat={0.18} clearcoatRoughness={0.3} />
        </mesh>
      )}
      <mesh position={[0, 0.05, -0.55]}>
        <boxGeometry args={[1.9, 0.08, 0.16]} />
        <meshStandardMaterial color={style.glow} emissive={style.glow} emissiveIntensity={highlighted ? 1.75 : 1.1} metalness={0.96} roughness={0.12} />
      </mesh>
      <mesh position={[0, 0.15, 0.6]}>
        <boxGeometry args={[1.8, 0.18, 0.2]} />
        <meshStandardMaterial color={style.glow} emissive={style.glow} emissiveIntensity={highlighted ? 1.45 : 0.85} roughness={0.16} />
      </mesh>
      {[ -1.05, 1.05 ].map((x) => (
        <group key={x}>
          <mesh position={[x, -0.35, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.18, 0.18, 0.22, 24]} />
            <meshPhysicalMaterial color={style.wheel} metalness={0.7} roughness={0.16} clearcoat={0.1} />
          </mesh>
          <mesh position={[x, -0.35, -0.4]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.18, 0.18, 0.22, 24]} />
            <meshPhysicalMaterial color={style.wheel} metalness={0.7} roughness={0.16} clearcoat={0.1} />
          </mesh>
        </group>
      ))}
      <mesh position={[-0.55, 0.35, 0.47]} rotation={[0, 0, Math.PI / 12]}>
        <boxGeometry args={[0.3, 0.08, 0.3]} />
        <meshStandardMaterial color={style.glow} emissive={style.glow} emissiveIntensity={highlighted ? 1.45 : 0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.55, 0.35, 0.47]} rotation={[0, 0, -Math.PI / 12]}>
        <boxGeometry args={[0.3, 0.08, 0.3]} />
        <meshStandardMaterial color={style.glow} emissive={style.glow} emissiveIntensity={highlighted ? 1.45 : 0.8} roughness={0.2} />
      </mesh>
      {highlighted && (
        <mesh position={[0, 0, -0.75]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.25, 0.08, 14, 80]} />
          <meshStandardMaterial color="#ff7a00" emissive="#ff7a00" emissiveIntensity={1.8} transparent opacity={0.72} />
        </mesh>
      )}
    </group>
  );
}

function ServerComputer({ highlighted, dimmed, theme }: { highlighted: boolean; dimmed: boolean; theme: SceneTheme }) {
  const style = SCENE_THEME_CONFIG[theme].server;
  const ref = useRef<Group>(null);
  const ledRefs = useRef<Mesh[]>([]);
  const intensity = highlighted ? 1.3 : dimmed ? 0.35 : 0.85;

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.y = 0.08 + Math.sin(state.clock.elapsedTime * 1.8) * 0.03;
    const cycle = ((state.clock.elapsedTime * 0.8) % 12 + 12) % 12;
    const serverGlow = cycle > 4 && cycle < 8 ? 2.4 : 1 + Math.sin(state.clock.elapsedTime * 7) * 0.25;

    ledRefs.current.forEach((mesh) => {
      const material = mesh.material;
      if (material && "emissiveIntensity" in material) {
        material.emissiveIntensity = highlighted ? 3.2 : serverGlow * intensity;
      }
    });
  });

  return (
    <group ref={ref} scale={[1.18, 1.18, 1.18]}>
      <mesh castShadow receiveShadow position={[0, 1.15, 0]}>
        <boxGeometry args={[2.8, 1.7, 0.78]} />
        <meshPhysicalMaterial color={style.body} emissive={style.panel} emissiveIntensity={intensity * 0.7} metalness={0.68} roughness={0.2} clearcoat={0.12} clearcoatRoughness={0.3} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.05, 0]}>
        <boxGeometry args={[2.8, 0.4, 0.86]} />
        <meshPhysicalMaterial color={style.panel} metalness={0.62} roughness={0.24} clearcoat={0.14} clearcoatRoughness={0.35} />
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
          <meshStandardMaterial color={style.led} emissive={style.led} emissiveIntensity={highlighted ? 3.3 : 1.7 * intensity} />
        </mesh>
      ))}
      {[-0.95, -0.28, 0.4].map((x, index) => (
        <mesh
          key={`${x}-lower`}
          ref={(node) => {
            if (node) ledRefs.current[index + 3] = node;
          }}
          position={[x, 0.75, 0.42]}
        >
          <boxGeometry args={[0.5, 0.16, 0.04]} />
          <meshStandardMaterial color={style.ledAccent} emissive={style.ledAccent} emissiveIntensity={highlighted ? 3.1 : 1.5 * intensity} />
        </mesh>
      ))}
      <mesh position={[0, 1.1, 0.46]} rotation={[0, 0, 0]}>
        <boxGeometry args={[1.4, 0.16, 0.1]} />
        <meshStandardMaterial color={style.screen} emissive={style.screen} emissiveIntensity={highlighted ? 1.4 : 0.8} roughness={0.24} />
      </mesh>
      {highlighted && (
        <mesh position={[0, 1.15, -0.7]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[3.2, 0.1, 12, 80]} />
          <meshStandardMaterial color="#ff7a00" emissive="#ff7a00" emissiveIntensity={1.8} transparent opacity={0.75} />
        </mesh>
      )}
    </group>
  );
}

function VehicleProxy({ highlighted, dimmed, theme, cargo }: { highlighted: boolean; dimmed: boolean; theme: SceneTheme; cargo: "request" | "response" | null }) {
  return (
    <group>
      <TcpVehicle highlighted={highlighted} dimmed={dimmed} theme={theme} cargo={cargo} />
    </group>
  );
}

function SceneContent({ isPlaying, theme, autoRotate, resetSignal, onStepChange }: { isPlaying: boolean; theme: SceneTheme; autoRotate: boolean; resetSignal: number; onStepChange?: (step: number) => void }) {
  const groupRef = useRef<Group>(null);
  const orbitRef = useRef<OrbitControlsImpl | null>(null);
  const requestRef = useRef<Group>(null);
  const responseRef = useRef<Group>(null);
  const vehicleRef = useRef<Group>(null);
  const [hoveredObject, setHoveredObject] = useState<SceneObjectId | null>(null);
  const [animationPhase, setAnimationPhase] = useState<AnimationPhase>(0);
  const lastStepRef = useRef<number>(0);
  const lastPhaseRef = useRef<AnimationPhase>(0);

  const clientPos = [-4.1, 0.15, 0] as [number, number, number];
  const serverPos = [4.1, 0.15, 0] as [number, number, number];

  useFrame((state) => {
    if (!groupRef.current) return;
    if (!isPlaying) {
      groupRef.current.rotation.y = 0.3;
      groupRef.current.rotation.x = 0.15;
      return;
    }

    const { phase, phaseProgress } = getPhaseInfo(state.clock.elapsedTime);
    if (phase !== lastPhaseRef.current) {
      lastPhaseRef.current = phase;
      setAnimationPhase(phase);
      const nextStep = getTimelineStep(phase);
      if (nextStep !== lastStepRef.current) {
        lastStepRef.current = nextStep;
        onStepChange?.(nextStep);
      }
    }

    const clientX = clientPos[0] + 1.25;
    const serverX = serverPos[0] - 1.25;
    const vehicleStartX = clientPos[0] + 0.75;

    let vehicleX = vehicleStartX;
    const vehicleY = 1.05 + Math.sin(state.clock.elapsedTime * 2.8) * 0.04;
    let vehicleRotation = 0.08;
    let requestX = clientX;
    let requestZ = 0.5;
    let requestVisible = phase <= 2;
    let responseX = clientX;
    let responseZ = 0.5;
    let responseVisible = phase >= 3;

    if (phase === 1) {
      vehicleX = MathUtils.lerp(vehicleStartX, clientX, phaseProgress);
      requestX = clientX;
      vehicleRotation = 0.08;
    } else if (phase === 2) {
      vehicleX = MathUtils.lerp(clientX, serverX, phaseProgress);
      requestX = vehicleX;
      requestZ = 0.5;
      requestVisible = true;
      vehicleRotation = 0.08;
    } else if (phase === 3) {
      vehicleX = serverX;
      requestVisible = false;
      responseX = serverX;
      responseVisible = true;
      responseZ = 0.5;
      vehicleRotation = -0.08;
    } else if (phase === 4) {
      vehicleX = MathUtils.lerp(serverX, clientX, phaseProgress);
      responseX = vehicleX;
      responseZ = 0.5;
      responseVisible = true;
      vehicleRotation = -0.08;
    } else if (phase === 5) {
      vehicleX = clientX;
      responseX = clientX;
      responseVisible = true;
      responseZ = 0.75;
      vehicleRotation = -0.08;
    }

    if (vehicleRef.current) {
      vehicleRef.current.position.set(vehicleX, vehicleY, 0.28);
      vehicleRef.current.rotation.y = MathUtils.lerp(vehicleRef.current.rotation.y, vehicleRotation, 0.12);
    }

    if (requestRef.current) {
      requestRef.current.visible = requestVisible;
      requestRef.current.position.set(requestX, 1.2, requestZ);
      requestRef.current.rotation.set(0.22, 0.22, -0.12);
    }

    if (responseRef.current) {
      responseRef.current.visible = responseVisible;
      responseRef.current.position.set(responseX, 1.2, responseZ);
      responseRef.current.rotation.set(0.22, 0.22, -0.12);
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
      orbitRef.current.target.set(0, 1.1, 0);
      orbitRef.current.update();
      orbitRef.current.enableRotate = true;
      orbitRef.current.enablePan = true;
      orbitRef.current.enableZoom = true;
      orbitRef.current.minDistance = 8;
      orbitRef.current.maxDistance = 20;
      orbitRef.current.minPolarAngle = Math.PI / 3.6;
      orbitRef.current.maxPolarAngle = Math.PI / 1.9;
      orbitRef.current.maxAzimuthAngle = Math.PI / 3;
      orbitRef.current.minAzimuthAngle = -Math.PI / 3;
      orbitRef.current.enableDamping = true;
    }
  }, [resetSignal]);

  const isDimmed = Boolean(hoveredObject);
  const clientHighlighted = hoveredObject === "client" || (!hoveredObject && (animationPhase === 0 || animationPhase === 5));
  const serverHighlighted = hoveredObject === "server" || (!hoveredObject && (animationPhase === 3 || animationPhase === 4));
  const laneLength = Math.abs(serverPos[0] - clientPos[0]) - 0.4;

  const palette = SCENE_THEME_CONFIG[theme];

  return (
    <group ref={groupRef}>
      <color attach="background" args={[palette.background]} />

      <group position={[0, -1.1, 0]}> 
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[laneLength * 1.08, 6]} />
          <meshStandardMaterial color={palette.floor.base} roughness={0.48} metalness={0.22} emissive={palette.floor.accent} emissiveIntensity={0.04} />
        </mesh>
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[laneLength * 0.96, 2.4]} />
          <meshStandardMaterial color={palette.lane.base} emissive={palette.lane.base} emissiveIntensity={0.16} roughness={0.28} metalness={0.15} transparent opacity={0.95} />
        </mesh>
        <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[laneLength * 0.72, 0.18]} />
          <meshStandardMaterial color={palette.lane.glow} emissive={palette.lane.glow} emissiveIntensity={isDimmed ? 0.38 : 0.68} transparent opacity={0.26} />
        </mesh>
        <mesh position={[0, 0.025, 1.12]}>
          <boxGeometry args={[laneLength * 0.92, 0.04, 0.06]} />
          <meshStandardMaterial color={palette.lane.accent} emissive={palette.lane.accent} emissiveIntensity={0.25} transparent opacity={0.6} roughness={0.35} metalness={0.2} />
        </mesh>
        <mesh position={[0, 0.025, -1.12]}>
          <boxGeometry args={[laneLength * 0.92, 0.04, 0.06]} />
          <meshStandardMaterial color={palette.lane.accent} emissive={palette.lane.accent} emissiveIntensity={0.25} transparent opacity={0.6} roughness={0.35} metalness={0.2} />
        </mesh>
        {[...Array(5)].map((_, index) => (
          <mesh key={`stripe-${index}`} position={[(index - 2) * 1.3, 0.03, 0]}>
            <boxGeometry args={[0.5, 0.02, 0.06]} />
            <meshStandardMaterial color={palette.lane.base} emissive={palette.lane.glow} emissiveIntensity={0.35} transparent opacity={0.7} roughness={0.4} />
          </mesh>
        ))}
      </group>

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
          <ClientComputer highlighted={clientHighlighted} dimmed={isDimmed && hoveredObject !== "client"} theme={theme} />
        </HoverCard>
        <SceneLabel text="CLIENT" position={[0, 2.05, 0]} active={hoveredObject === "client" || clientHighlighted} />
      </group>

      <group position={[0, 0, 0]}>
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
          <group>
            <group ref={requestRef}>
              <SceneLabel
                text="HTTP REQUEST"
                position={[0, 1.35, 0]}
                active={hoveredObject === "http" || (!hoveredObject && [0, 1, 2].includes(animationPhase))}
                visible={animationPhase <= 2}
              />
              <HttpPackage
                highlighted={hoveredObject === "http" || (!hoveredObject && [0, 2, 3, 4, 5].includes(animationPhase))}
                dimmed={isDimmed && hoveredObject !== "http"}
                theme={theme}
                variant="request"
              />
            </group>
            <group ref={responseRef}>
              <SceneLabel
                text="HTTP RESPONSE"
                position={[0, 1.35, 0]}
                active={hoveredObject === "http" || (!hoveredObject && [3, 4, 5].includes(animationPhase))}
                visible={animationPhase >= 3}
              />
              <HttpPackage
                highlighted={hoveredObject === "http" || (!hoveredObject && [3, 4, 5].includes(animationPhase))}
                dimmed={isDimmed && hoveredObject !== "http"}
                theme={theme}
                variant="response"
              />
            </group>
          </group>
        </HoverCard>
      </group>

      <group position={[0, 0, 0]}>
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
          <group ref={vehicleRef}>
            <VehicleProxy
              highlighted={hoveredObject === "tcp" || (!hoveredObject && [1, 2, 4].includes(animationPhase))}
              dimmed={isDimmed && hoveredObject !== "tcp"}
              theme={theme}
              cargo={animationPhase === 2 ? "request" : animationPhase === 4 ? "response" : null}
            />
          </group>
          <SceneLabel text="TCP" position={[0, 1.55, 0]} active={hoveredObject === "tcp" || (!hoveredObject && [1, 2, 4].includes(animationPhase))} />
        </HoverCard>
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
          <ServerComputer highlighted={serverHighlighted} dimmed={isDimmed && hoveredObject !== "server"} theme={theme} />
        </HoverCard>
        <SceneLabel text="SERVER" position={[0, 2.35, 0]} active={hoveredObject === "server" || serverHighlighted} />
      </group>


      {/* lights (adjusted when dimming) */}
      <hemisphereLight
        args={[palette.lighting.hemiSky, palette.lighting.hemiGround, isDimmed ? palette.lighting.ambient * 0.55 : palette.lighting.ambient]}
      />
      <pointLight position={[-5, 3, 4]} intensity={isDimmed ? 5 : 14} color={palette.lighting.pointA} />
      <pointLight position={[5, 4, 4]} intensity={isDimmed ? 4.2 : 11} color={palette.lighting.pointB} />
      <ambientLight intensity={isDimmed ? palette.lighting.ambient * 0.5 : palette.lighting.ambient} />
      <directionalLight
        position={[5, 7, 6]}
        intensity={isDimmed ? 0.7 : theme === "dark" ? 1.2 : 1.1}
        color={palette.lighting.dir}
      />
 
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
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="w-full overflow-hidden rounded-[28px] border border-[var(--border)] bg-[var(--panel-strong)] shadow-[0_20px_70px_rgba(15,23,42,0.18)]">
      <div className="h-[580px] w-full">
        <Canvas camera={{ position: [0, 2.35, 12], fov: 30 }}>
          <SceneContent
            isPlaying={isPlaying}
            theme={theme}
            autoRotate={autoRotate}
            resetSignal={resetSignal}
            onStepChange={setActiveStep}
          />
        </Canvas>
      </div>
      <div className="border-t border-[var(--border)] bg-[var(--panel)] px-3 py-3">
        <div className="mb-2 flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.26em] text-[var(--text-soft)]">
          <span>Animation timeline</span>
          <span className="text-[var(--text)]">Step {activeStep + 1} of {TIMELINE_STEPS.length}</span>
        </div>
        <div className="grid gap-2 md:grid-cols-5">
          {TIMELINE_STEPS.map((step, index) => (
            <div
              key={step.label}
              className={`rounded-2xl border px-2.5 py-2 text-xs transition ${index === activeStep ? "border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--brand)] shadow-[0_8px_24px_rgba(255,122,0,0.12)]" : "border-transparent bg-[var(--panel-soft)] text-[var(--text-soft)]"}`}
            >
              <p className="font-semibold">{index + 1}. {step.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
