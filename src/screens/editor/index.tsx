import { requestImgToImg, requestTxtToImg } from "@/actions";
import { setData, useData } from "@/src/centralData";
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
import Navbar from "../../../components/Navbar";
import { styles } from "./styles";

const mockPreviews = [
  {
    id: "1",
    uri: "https://leonardo.ai/wp-content/uploads/2023/07/Default_by_zemotion13_an_abstract_high_tech_background17_magic_0-500x500.jpg",
    caption: "Explorar cores e formas organicas",
  },
  {
    id: "2",
    uri: "https://leonardo.ai/wp-content/uploads/2023/07/image-129.jpeg",
    caption: "Iluminacao suave e textura granular",
  },
  {
    id: "3",
    uri: "https://leonardo.ai/wp-content/uploads/2023/07/440942558_122147594636192269_4903850649949505816_n.jpg",
    caption: "Composicao minimalista, alto contraste",
  },
];

const ratioOptions = ["1:1", "3:4", "4:5", "16:9", "9:16", "2:3"];
const contentOptions = [
  "Dark Fantasy",
  "Neon",
  "Fotorrealism",
  "Manga",
  "Cartoon",
  "Concept Art",
  "Cyberpunk",
  "Surrealism",
];

const Editor = () => {
  const generation = useData((ct) => ct.system.generation);
  const [prompt, setPrompt] = useState(generation.prompt || "");
  const [isLoading, setIsLoading] = useState(false);
  // const [referenceImages, setReferenceImages] = useState<string[]>(
  //   mockPreviews.map((item) => item.uri)
  // );
  const [referenceImages, setReferenceImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [aspectRatio, setAspectRatio] = useState(ratioOptions[0]);
  const [contentStyle, setContentStyle] = useState(contentOptions[0]);

  const previews = useMemo(() => {
    const isCrop = (img: any) =>
      Boolean((img as any)?.parentId) || typeof img?.prompt === "string"
        ? img.prompt.toLowerCase().includes("crop")
        : false;

    const baseImages = (generation.images || []).filter(
      (img: any) => !isCrop(img)
    );

    if (baseImages.length) {
      return baseImages.map((img: any, idx: number) => {
        const rawData = img?.data || "";
        const uri = rawData.startsWith("data:")
          ? rawData
          : `data:image/png;base64,${rawData}`;
        return {
          id: `generated-${idx}`,
          uri,
          caption: img?.prompt || `Geracao ${idx + 1}`,
          isGenerated: true,
          sourceIndex: idx,
        };
      });
    }
    return mockPreviews.map((item) => ({
      ...item,
      isGenerated: false,
      sourceIndex: -1,
    }));
  }, [generation.images]);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const promptWithStyle = contentStyle
        ? `${prompt} | Estilo: ${contentStyle}`
        : prompt;
      const useImgToImg = referenceImages.length > 0;
      const requester = useImgToImg ? requestImgToImg : requestTxtToImg;
      const { images } = await requester(
        useImgToImg
          ? {
              prompt: promptWithStyle,
              references: referenceImages,
              aspectRatio,
            }
          : {
              prompt: promptWithStyle,
              references: referenceImages,
              aspectRatio,
              contentStyle,
            }
      );
      setData((ct) => {
        const prevImages = ct.system.generation.images || [];
        ct.system.generation.prompt = promptWithStyle;
        ct.system.generation.images = [
          ...prevImages,
          ...images.map((img) => ({ data: img, prompt: promptWithStyle })),
        ];
      });
    } catch (error) {
      console.error("Falha ao gerar imagens", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePickClick = () => {
    if (Platform.OS === "web" && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveReference = (targetIdx: number) => {
    setReferenceImages((prev) => prev.filter((_, idx) => idx !== targetIdx));
  };

  const handleDownload = (uri: string, filename: string) => {
    if (!uri) return;

    if (Platform.OS === "web" && typeof document !== "undefined") {
      const link = document.createElement("a");
      link.href = uri;
      link.download = `${filename || "imagem"}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    Linking.openURL(uri);
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
        setReferenceImages((prev) => [...prev, ...loaded].slice(-8));
      } catch (err) {
        console.error("Falha ao ler arquivo", err);
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    },
    []
  );

  const handleRemoveGenerated = (idx: number) => {
    setData((ct) => {
      const images = ct.system.generation.images || [];
      ct.system.generation.images = images.filter(
        (_, imageIdx) => imageIdx !== idx
      );
    });
  };

  return (
    <View style={styles.page}>
      <Navbar title="Editor" subtitle="Fissium | AI Studio" />

      <View style={styles.body}>
        <ScrollView
          style={styles.sidebar}
          contentContainerStyle={styles.sidebarContent}
        >
          <Text style={styles.sectionTitle}>Configuracoes</Text>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Modelo</Text>
            <Text style={styles.cardHint}>Fissium Vision 3</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Proporcao</Text>
            <View style={styles.pillRow}>
              {ratioOptions.map((opt) => {
                const active = aspectRatio === opt;
                return (
                  <TouchableOpacity
                    key={opt}
                    style={[styles.pill, active && styles.pillActive]}
                    onPress={() => setAspectRatio(opt)}
                  >
                    <Text
                      style={[styles.pillText, active && styles.pillTextActive]}
                    >
                      {opt}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Tipo de conteudo</Text>
            <View style={styles.pillRow}>
              {contentOptions.map((opt) => {
                const active = contentStyle === opt;
                return (
                  <TouchableOpacity
                    key={opt}
                    style={[styles.pill, active && styles.pillActive]}
                    onPress={() => setContentStyle(opt)}
                  >
                    <Text
                      style={[styles.pillText, active && styles.pillTextActive]}
                    >
                      {opt}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Referencias</Text>
            <View style={styles.referenceGrid}>
              {referenceImages.map((uri, idx) => (
                <View key={`${uri}-${idx}`} style={styles.referenceItem}>
                  <Image source={{ uri }} style={styles.referenceThumb} />
                  <TouchableOpacity
                    style={styles.removeBadge}
                    onPress={() => handleRemoveReference(idx)}
                  >
                    <Text style={styles.removeBadgeText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <TouchableOpacity
              style={styles.linkButton}
              onPress={handlePickClick}
            >
              <Text style={styles.linkButtonText}>
                Upload ou arraste uma imagem
              </Text>
            </TouchableOpacity>
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
          </View>
        </ScrollView>

        <View style={styles.main}>
          <View style={styles.promptBox}>
            <Text style={styles.promptLabel}>Solicitacao</Text>
            <Text style={styles.promptText}>{prompt}</Text>
          </View>

          <View style={styles.previewGrid}>
            {previews.map((item) => (
              <View key={item.id} style={styles.previewCard}>
                <Image source={{ uri: item.uri }} style={styles.previewImage} />
                <View style={styles.previewOverlay}>
                  <ScrollView
                    style={{height: 80}}
                    contentContainerStyle={{ padding: 8 }}
                    showsVerticalScrollIndicator={false}
                  >
                    <Text style={styles.previewCaption}>{item.caption}</Text>
                  </ScrollView>

                  <View style={styles.header}>
                    {item.isGenerated ? (
                      <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={() => handleRemoveGenerated(item.sourceIndex)}
                      >
                        <Text style={styles.secondaryButtonText}>Excluir</Text>
                      </TouchableOpacity>
                    ) : (
                      <View style={{ width: 1 }} />
                    )}

                    <View style={styles.lineRow}>
                      <TouchableOpacity style={styles.secondaryButton}>
                        <Text style={styles.secondaryButtonText}>Refinar</Text>
                      </TouchableOpacity>

                      {item.isGenerated ? (
                        <TouchableOpacity
                          style={styles.downloadButton}
                          onPress={() => handleDownload(item.uri, item.caption)}
                        >
                          <Text style={styles.downloadButtonText}>Baixar</Text>
                        </TouchableOpacity>
                      ) : null}
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.commandBar}>
            <TextInput
              placeholder="Descreva a proxima variacao..."
              placeholderTextColor="#6b7280"
              style={styles.promptInput}
              value={prompt}
              onChangeText={setPrompt}
            />
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleGenerate}
              disabled={isLoading}
            >
              <Text style={styles.primaryButtonText}>
                {isLoading ? "Gerando..." : "Gerar"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Editor;
