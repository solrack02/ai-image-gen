import React, { useEffect, useMemo, useRef, useState } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const poseData = require("./mediaPipeRes.json");

type Joint = { x: number; y: number };
type SkeletonData = { joints: Record<string, Joint>; bones: [string, string][] };

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

  const skeleton = useMemo(() => {
    const data = poseData as SkeletonData;
    const joints = data?.joints || {};
    const bones = Array.isArray(data?.bones) ? data.bones : [];
    return { joints, bones };
  }, []);

  useEffect(() => {
    if (Platform.OS !== "web") return;
    const canvas = canvasRef.current;
    if (!canvas || !Object.keys(skeleton.joints).length) return;
    drawSkeleton(canvas, skeleton.joints, skeleton.bones);
    setLastDraw(Date.now());
  }, [skeleton]);

  const handleRedraw = () => {
    if (Platform.OS !== "web") return;
    const canvas = canvasRef.current;
    if (!canvas || !Object.keys(skeleton.joints).length) return;
    drawSkeleton(canvas, skeleton.joints, skeleton.bones);
    setLastDraw(Date.now());
  };

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Rig 2D - MediaPipe</Text>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.refresh} onPress={handleRedraw}>
            <Text style={styles.refreshText}>Redesenhar</Text>
          </TouchableOpacity>
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
            Juntas: {Object.keys(skeleton.joints).length} | Ultimo desenho:{" "}
            {lastDraw ? new Date(lastDraw).toLocaleTimeString() : "ainda nao"}
          </Text>
          <Text style={styles.metaText}>
            Arquivo: src/screens/rig2D/mediaPipeRes.json
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Rig2D;
