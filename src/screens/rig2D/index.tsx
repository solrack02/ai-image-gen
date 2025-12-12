import { requestImgToImg } from "@/actions";
import { goTo, setData, useData } from "@/src/centralData";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Image,
  Linking,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "./styles";

const logoSource = require("../../../assets/logo3.png");

const framePresets = [
  "8 poses laterais",
  "12 poses isometricas",
  "6 poses top-down",
];

const promptIdeas = [
  "heroi cyberpunk com chamas neon discretas",
  "mascote low-poly com bordas grossas",
  "andarilho medieval aquarelado com capa",
  "robo azul cartoon minimalista",
];

const guardrails = [
  "Mantenha a sequencia e o ritmo de poses do sheet original.",
  "Use fundo simples para recortar facil.",
  "Evite close-up ou retrato unico.",
];

const Rig2D = () => {
  const generation = useData((ct) => ct.system.generation);
  const [stylePrompt, setStylePrompt] = useState(
    generation.prompt ||
      "Sprite sheet lateral de personagem com silhueta clara e cores fortes"
  );
  const [negativePrompt, setNegativePrompt] = useState(
    "retrato unico, close, zoom, corpo cortado"
  );
  const [preset, setPreset] = useState(framePresets[0]);
  const [referenceSheets, setReferenceSheets] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const generatedSheets = useMemo(() => {
    const items = Array.isArray(generation.images) ? generation.images : [];
    return items
      .map((img, idx) => {
        const raw = (img as any)?.data || "";
        const uri = raw.startsWith("data:")
          ? raw
          : raw
          ? `data:image/png;base64,${raw}`
          : "";
        if (!uri) return null;
        return {
          id: `rig-${idx}`,
          uri,
          caption: (img as any)?.prompt || "Rig 2D",
          index: idx,
        };
      })
      .filter(Boolean) as { id: string; uri: string; caption: string; index: number }[];
  }, [generation.images]);

  const handlePickClick = () => {
    if (Platform.OS === "web" && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFilesSelected = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || !files.length) return;
      const readers = Array.from(files).map(
        (file) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
          })
      );
      try {
        const loaded = await Promise.all(readers);
        setReferenceSheets((prev) => [...prev, ...loaded].slice(-6));
      } catch (err) {
        setStatusMessage("Falha ao ler arquivo. Tente novamente.");
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    },
    []
  );

  const handleRemoveReference = (idx: number) => {
    setReferenceSheets((prev) => prev.filter((_, refIdx) => refIdx !== idx));
  };

  const handlePromptIdea = (idea: string) => {
    setStylePrompt((prev) => `${prev} | ${idea}`);
  };

  const handleDownload = (uri: string, filename: string) => {
    if (!uri) return;
    if (Platform.OS === "web" && typeof document !== "undefined") {
      const link = document.createElement("a");
      link.href = uri;
      link.download = `${filename || "rig2d"}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }
    Linking.openURL(uri);
  };

  const handleRemoveGenerated = (idx: number) => {
    setData((ct) => {
      const items = ct.system.generation.images || [];
      ct.system.generation.images = items.filter((_, imageIdx) => imageIdx !== idx);
    });
  };

  const handleGenerate = async () => {
    const trimmedPrompt = stylePrompt.trim();
    if (!referenceSheets.length) {
      setStatusMessage("Adicione pelo menos um sprite sheet de referencia.");
      return;
    }
    if (!trimmedPrompt) {
      setStatusMessage("Descreva o estilo desejado antes de gerar.");
      return;
    }

    setIsLoading(true);
    setStatusMessage("Preparando rig 2D...");
    const composedPrompt = `${trimmedPrompt} | rig: ${preset}`;
    try {
      const { images } = await requestImgToImg({
        prompt: composedPrompt,
        references: referenceSheets,
        aspectRatio: "16:9",
        negativePrompt: negativePrompt.trim() || undefined,
      });
      setData((ct) => {
        const prev = ct.system.generation.images || [];
        const next = images.map((img) => ({ data: img, prompt: composedPrompt }));
        ct.system.generation.prompt = composedPrompt;
        ct.system.generation.images = [...next, ...prev];
      });
      setStatusMessage("Rig concluido. Baixe ou refine a variacao.");
    } catch (err: any) {
      const message =
        err?.message || "Nao foi possivel gerar agora. Tente de novo em instantes.";
      setStatusMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <Image source={logoSource} style={styles.logoImg} />
          <View>
            <Text style={styles.kicker}>Pipeline</Text>
            <Text style={styles.title}>Rig 2D Lab</Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.ghostButton} onPress={() => goTo("home")}>
            <Text style={styles.ghostButtonText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ghostButton} onPress={() => goTo("editor")}>
            <Text style={styles.ghostButtonText}>Editor</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.primaryButton, isLoading && styles.primaryButtonDisabled]}
            onPress={handleGenerate}
            disabled={isLoading}
          >
            <Text style={styles.primaryButtonText}>
              {isLoading ? "Gerando..." : "Gerar rig 2D"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        <View style={styles.heroRow}>
          <View style={[styles.panel, styles.panelWide]}>
            <View style={styles.panelHeader}>
              <Text style={styles.panelTitle}>Checklist rapido</Text>
              <View style={styles.statusRow}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>
                  {statusMessage || "Pronto para gerar sprite sheets"}
                </Text>
              </View>
            </View>
            <View style={styles.timeline}>
              {guardrails.map((rule, idx) => (
                <View key={rule} style={styles.timelineItem}>
                  <View style={styles.timelineMarker}>
                    <Text style={styles.timelineMarkerText}>{idx + 1}</Text>
                  </View>
                  <Text style={styles.timelineText}>{rule}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.statsColumn}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Referencias</Text>
              <Text style={styles.statValue}>{referenceSheets.length}</Text>
              <Text style={styles.statHint}>Sprite sheets anexados</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Variacoes</Text>
              <Text style={styles.statValue}>{generatedSheets.length}</Text>
              <Text style={styles.statHint}>Ultimas geracoes</Text>
            </View>
          </View>
        </View>

        <View style={styles.columns}>
          <View style={[styles.panel, styles.panelStack]}>
            <View style={styles.panelHeader}>
              <Text style={styles.panelTitle}>Referencias do rig</Text>
              <View style={styles.pillRow}>
                <TouchableOpacity
                  style={[styles.pill, referenceSheets.length > 0 && styles.pillActive]}
                  onPress={handlePickClick}
                >
                  <Text
                    style={[
                      styles.pillText,
                      referenceSheets.length > 0 && styles.pillTextActive,
                    ]}
                  >
                    Upload ou arraste
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity style={styles.dropzone} onPress={handlePickClick}>
              <Text style={styles.dropTitle}>Arraste o sprite sheet aqui</Text>
              <Text style={styles.dropSubtitle}>
                PNG com todos os frames lado a lado. Maximo 6 arquivos.
              </Text>
              {Platform.OS === "web" ? (
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: "none" }}
                  onChange={handleFilesSelected}
                />
              ) : null}
            </TouchableOpacity>
            <View style={styles.referenceGrid}>
              {referenceSheets.map((uri, idx) => (
                <View key={`${uri}-${idx}`} style={styles.referenceItem}>
                  <Image source={{ uri }} style={styles.referenceThumb} />
                  <TouchableOpacity
                    style={styles.removeBadge}
                    onPress={() => handleRemoveReference(idx)}
                  >
                    <Text style={styles.removeBadgeText}>x</Text>
                  </TouchableOpacity>
                </View>
              ))}
              {!referenceSheets.length ? (
                <Text style={styles.emptyText}>Nenhuma referencia adicionada.</Text>
              ) : null}
            </View>
          </View>

          <View style={[styles.panel, styles.panelStack]}>
            <View style={styles.panelHeader}>
              <Text style={styles.panelTitle}>Prompt e presets</Text>
              <View style={styles.pillRow}>
                {framePresets.map((item) => {
                  const active = preset === item;
                  return (
                    <TouchableOpacity
                      key={item}
                      style={[styles.pill, active && styles.pillActive]}
                      onPress={() => setPreset(item)}
                    >
                      <Text style={[styles.pillText, active && styles.pillTextActive]}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.inputBlock}>
              <Text style={styles.inputLabel}>Estilo desejado</Text>
              <TextInput
                style={styles.textArea}
                multiline
                numberOfLines={4}
                placeholder="Descreva o estilo que quer aplicar..."
                placeholderTextColor="#6b7280"
                value={stylePrompt}
                onChangeText={setStylePrompt}
              />
            </View>

            <View style={styles.inputBlock}>
              <Text style={styles.inputLabel}>Evitar</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Ex: close, rosto unico, corpo cortado"
                placeholderTextColor="#6b7280"
                value={negativePrompt}
                onChangeText={setNegativePrompt}
              />
            </View>

            <View style={styles.hintRow}>
              {promptIdeas.map((idea) => (
                <TouchableOpacity
                  key={idea}
                  style={styles.ideaChip}
                  onPress={() => handlePromptIdea(idea)}
                >
                  <Text style={styles.ideaChipText}>{idea}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={[styles.panel, styles.panelStack]}>
            <View style={styles.panelHeader}>
              <Text style={styles.panelTitle}>Saidas recentes</Text>
              <Text style={styles.panelHint}>Clique para baixar ou remover</Text>
            </View>
            <View style={styles.previewGrid}>
              {generatedSheets.map((item) => (
                <View key={item.id} style={styles.previewCard}>
                  <Image source={{ uri: item.uri }} style={styles.previewImage} />
                  <View style={styles.previewMeta}>
                    <Text style={styles.previewCaption} numberOfLines={2}>
                      {item.caption}
                    </Text>
                    <View style={styles.previewActions}>
                      <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={() => handleDownload(item.uri, item.caption)}
                      >
                        <Text style={styles.secondaryButtonText}>Baixar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.ghostButton}
                        onPress={() => handleRemoveGenerated(item.index)}
                      >
                        <Text style={styles.ghostButtonText}>Excluir</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
              {!generatedSheets.length ? (
                <Text style={styles.emptyText}>Gere um rig para ver aqui.</Text>
              ) : null}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Rig2D;
