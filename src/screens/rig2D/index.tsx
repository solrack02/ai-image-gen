import React, { useEffect, useMemo, useRef, useState } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";

type Joint = { x: number; y: number };
type SkeletonFrame = { joints: Record<string, Joint>; bones: [string, string][] };
type SkeletonData = SkeletonFrame[];

type PoseFrame = { joints: Record<string, Joint>; bones?: [string, string][] };
type PoseFile =
  | PoseFrame[]
  | {
      name?: string;
      skeleton?: string;
      direction?: string;
      loop?: boolean;
      fps?: number;
      phases?: string[];
      frames: PoseFrame[];
    };

type PoseMeta = {
  name?: string;
  skeleton?: string;
  direction?: string;
  loop?: boolean;
  fps?: number;
  phases?: string[];
};

const skeletonBones: Record<string, [string, string][]> = {
  humanoid: [
    ["head", "neck"],
    ["neck", "shoulder_l"],
    ["shoulder_l", "elbow_l"],
    ["elbow_l", "hand_l"],
    ["neck", "shoulder_r"],
    ["shoulder_r", "elbow_r"],
    ["elbow_r", "hand_r"],
    ["neck", "hip"],
    ["hip", "knee_l"],
    ["knee_l", "foot_l"],
    ["hip", "knee_r"],
    ["knee_r", "foot_r"],
  ],
};

type PresetItem = {
  id: string;
  label: string;
  file: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
};

const presets: PresetItem[] = [
  {
    id: "walk_side_right",
    label: "Walk Side Right",
    file: "src/screens/rig2D/presets/walk_side_right.json",
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    data: require("./presets/walk_side_right.json"),
  },
  {
    id: "run_side_right",
    label: "Run Side Right",
    file: "src/screens/rig2D/presets/run_side_right.json",
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    data: require("./presets/run_side_right.json"),
  },
];

const buildSkeleton = (raw: PoseFile): { frames: SkeletonData; meta: PoseMeta } => {
  if (Array.isArray(raw)) {
    const frames = raw.map((frame) => ({
      joints: frame.joints || {},
      bones: frame.bones || skeletonBones.humanoid || [],
    }));
    return { frames, meta: {} };
  }

  const defaultBones =
    (raw?.skeleton && skeletonBones[raw.skeleton]) || skeletonBones.humanoid || [];

  const frames = (raw?.frames || []).map((frame) => ({
    joints: frame.joints || {},
    bones: frame.bones || defaultBones,
  }));

  return {
    frames,
    meta: {
      name: raw?.name,
      skeleton: raw?.skeleton,
      direction: raw?.direction,
      loop: raw?.loop,
      fps: raw?.fps,
      phases: raw?.phases,
    },
  };
};

const normalizePoints = (joints: Record<string, Joint>, width: number, height: number) =>
  Object.entries(joints).reduce<Record<string, { x: number; y: number }>>(
    (acc, [key, pt]) => {
      acc[key] = {
        x: Math.max(0, Math.min(width, pt.x * width)),
        y: Math.max(0, Math.min(height, pt.y * height)),
      };
      return acc;
    },
    {}
  );

const drawSkeleton = (
  canvas: HTMLCanvasElement,
  joints: Record<string, Joint>,
  bones: [string, string][]
) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const width = canvas.clientWidth || canvas.width;
  const height = Math.round(width * (9 / 16));
  canvas.width = width;
  canvas.height = height;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#050505";
  ctx.fillRect(0, 0, width, height);

  const points = normalizePoints(joints, width, height);

  // grid
  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 10; i++) {
    const x = (i / 10) * width;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let i = 0; i <= 10; i++) {
    const y = (i / 10) * height;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // bones
  ctx.strokeStyle = "#ff2b00";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  bones.forEach(([a, b]) => {
    const pa = points[a];
    const pb = points[b];
    if (!pa || !pb) return;
    ctx.beginPath();
    ctx.moveTo(pa.x, pa.y);
    ctx.lineTo(pb.x, pb.y);
    ctx.stroke();
  });

  // joints
  Object.entries(points).forEach(([name, pt]) => {
    ctx.beginPath();
    const main = name === "head" || name === "hip" || name === "neck";
    ctx.fillStyle = main ? "#fff" : "#fcbe84";
    ctx.arc(pt.x, pt.y, main ? 7 : 5, 0, Math.PI * 2);
    ctx.fill();
  });
};

const Rig2D = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [lastDraw, setLastDraw] = useState<number | null>(null);
  const [frameIndex, setFrameIndex] = useState<number>(0);
  const [presetId, setPresetId] = useState<string>(presets[0]?.id);

  const currentPreset = presets.find((item) => item.id === presetId) || presets[0];
  const { frames: skeleton, meta } = useMemo(
    () => buildSkeleton(currentPreset?.data as PoseFile),
    [currentPreset]
  );
  const loopLabel = meta.loop === undefined ? "n/d" : meta.loop ? "sim" : "nao";
  const fpsLabel = meta.fps ?? "n/d";
  const directionLabel = meta.direction || "n/d";
  const presetLabel = meta.name || currentPreset?.label || currentPreset?.id || "preset";
  const skeletonLabel = meta.skeleton || "humanoid";
  const poseFileLabel = currentPreset?.file || "";

  useEffect(() => {
    if (Platform.OS !== "web") return;
    const canvas = canvasRef.current;
    const current = skeleton[frameIndex];
    if (!canvas || !current || !Object.keys(current.joints).length) return;
    drawSkeleton(canvas, current.joints, current.bones);
    setLastDraw(Date.now());
  }, [skeleton, frameIndex]);

  const handleRedraw = () => {
    if (Platform.OS !== "web") return;
    const canvas = canvasRef.current;
    const current = skeleton[frameIndex];
    if (!canvas || !current || !Object.keys(current.joints).length) return;
    drawSkeleton(canvas, current.joints, current.bones);
    setLastDraw(Date.now());
  };

  const handlePresetChange = (id: string) => {
    if (id === presetId) return;
    setPresetId(id);
    setFrameIndex(0);
  };

  const handleFrameChange = (idx: number) => {
    if (idx < 0 || idx >= skeleton.length) return;
    setFrameIndex(idx);
  };

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Rig 2D - MediaPipe</Text>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.refresh} onPress={handleRedraw}>
            <Text style={styles.refreshText}>Redesenhar</Text>
          </TouchableOpacity>
          <View style={styles.frameRow}>
            {presets.map((preset) => {
              const active = preset.id === presetId;
              return (
                <TouchableOpacity
                  key={preset.id}
                  style={[styles.frameButton, active && styles.frameButtonActive]}
                  onPress={() => handlePresetChange(preset.id)}
                >
                  <Text style={[styles.frameButtonText, active && styles.frameButtonTextActive]}>
                    {preset.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>

      <View style={styles.body}>
        {Platform.OS === "web" ? (
          <View style={styles.canvasCard}>
            <Text style={styles.caption}>Pose (canvas)</Text>
            {/* eslint-disable-next-line react/no-unknown-property */}
            <canvas ref={canvasRef} style={styles.canvas} />
          </View>
        ) : (
          <View style={styles.canvasCard}>
            <Text style={styles.caption}>
              Visualizacao do esqueleto disponivel apenas na web.
            </Text>
          </View>
        )}

        <View style={styles.metaCard}>
          <Text style={styles.caption}>Dados carregados</Text>
          <Text style={styles.metaText}>
            Quadros: {skeleton.length} | Juntas:{" "}
            {skeleton[frameIndex] ? Object.keys(skeleton[frameIndex].joints).length : 0} | Ultimo desenho:{" "}
            {lastDraw ? new Date(lastDraw).toLocaleTimeString() : "ainda nao"}
          </Text>
          <Text style={styles.metaText}>
            Arquivo: {poseFileLabel}
          </Text>
          <Text style={styles.metaText}>
            Preset: {presetLabel} | Skeleton: {skeletonLabel} | Direcao: {directionLabel} | FPS: {fpsLabel} | Loop:{" "}
            {loopLabel}
          </Text>
          <View style={styles.frameRow}>
            {skeleton.map((_, idx) => {
              const active = idx === frameIndex;
              return (
                <TouchableOpacity
                  key={idx}
                  style={[styles.frameButton, active && styles.frameButtonActive]}
                  onPress={() => handleFrameChange(idx)}
                >
                  <Text style={[styles.frameButtonText, active && styles.frameButtonTextActive]}>
                    {idx + 1}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
};

export default Rig2D;
