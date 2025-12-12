import React, { useEffect, useMemo, useRef, useState } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const poseData = require("./mediaPipeRes.json");

type Landmark = { x: number; y: number; z?: number; visibility?: number };

const poseConnections: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 4],
  [3, 7],
  [4, 8],
  [0, 9],
  [0, 10],
  [11, 12],
  [11, 13],
  [13, 15],
  [15, 17],
  [15, 19],
  [15, 21],
  [17, 19],
  [12, 14],
  [14, 16],
  [16, 18],
  [16, 20],
  [16, 22],
  [18, 20],
  [11, 23],
  [12, 24],
  [23, 24],
  [23, 25],
  [24, 26],
  [25, 27],
  [26, 28],
  [27, 29],
  [28, 30],
  [29, 31],
  [30, 32],
];

const normalizePoints = (landmarks: Landmark[], width: number, height: number) =>
  landmarks.map((pt) => ({
    x: Math.max(0, Math.min(width, pt.x * width)),
    y: Math.max(0, Math.min(height, pt.y * height)),
    z: pt.z ?? 0,
    visibility: pt.visibility ?? 1,
  }));

const drawSkeleton = (
  canvas: HTMLCanvasElement,
  landmarks: Landmark[],
  connections: [number, number][]
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

  const points = normalizePoints(landmarks, width, height);

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

  ctx.strokeStyle = "#ff2b00";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";

  connections.forEach(([a, b]) => {
    const pa = points[a];
    const pb = points[b];
    if (!pa || !pb) return;
    if (pa.visibility < 0.1 || pb.visibility < 0.1) return;
    ctx.beginPath();
    ctx.moveTo(pa.x, pa.y);
    ctx.lineTo(pb.x, pb.y);
    ctx.stroke();
  });

  points.forEach((pt, idx) => {
    if (pt.visibility < 0.1) return;
    ctx.beginPath();
    ctx.fillStyle = idx === 0 ? "#fff" : "#fcbe84";
    ctx.arc(pt.x, pt.y, 6, 0, Math.PI * 2);
    ctx.fill();
  });
};

const Rig2D = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [lastDraw, setLastDraw] = useState<number | null>(null);

  const landmarks = useMemo(() => {
    const list = (poseData as any)?.poseLandmarks;
    return Array.isArray(list) ? (list as Landmark[]) : [];
  }, []);

  useEffect(() => {
    if (Platform.OS !== "web") return;
    const canvas = canvasRef.current;
    if (!canvas || !landmarks.length) return;
    drawSkeleton(canvas, landmarks, poseConnections);
    setLastDraw(Date.now());
  }, [landmarks]);

  const handleRedraw = () => {
    if (Platform.OS !== "web") return;
    const canvas = canvasRef.current;
    if (!canvas || !landmarks.length) return;
    drawSkeleton(canvas, landmarks, poseConnections);
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
            <Text style={styles.caption}>PoseLandmarks (canvas)</Text>
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
            Landmarks: {landmarks.length} | Ultimo desenho:{" "}
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
