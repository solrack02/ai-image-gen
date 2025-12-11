import { requestTxtToImg, requestImgToImg } from "@/actions";
import { goTo, setData, useData } from "@/src/centralData";
import React, { useMemo, useState, useRef, useCallback } from "react";
import {
  Image,
  Linking,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
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

const Editor = () => {
  const logoSource = require("../../../assets/logo3.png");
  const generation = useData((ct) => ct.system.generation);
  const [prompt, setPrompt] = useState(
    generation.prompt ||
      "um estilo minimalista com cores suaves e foco em composicao limpa"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [referenceImages, setReferenceImages] = useState<string[]>(
    mockPreviews.map((item) => item.uri)
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const previews = useMemo(() => {
    if (generation.images?.length) {
      return generation.images.map((img, idx) => ({
        id: `generated-${idx}`,
        uri: `data:image/png;base64,${img}`,
        caption: generation.prompt || `Geracao ${idx + 1}`,
        isGenerated: true,
      }));
    }
    return mockPreviews.map((item) => ({ ...item, isGenerated: false }));
  }, [generation.images, generation.prompt]);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const useImgToImg = referenceImages.length > 0;
      const requester = useImgToImg ? requestImgToImg : requestTxtToImg;
      const { images } = await requester({
        prompt,
        references: referenceImages,
      });
      setData((ct) => {
        const prevImages = ct.system.generation.images || [];
        ct.system.generation.prompt = prompt;
        ct.system.generation.images = [...prevImages, ...images];
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

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={logoSource} style={styles.logoImg} />
          <View>
            <Text style={styles.screenTitle}>Editor</Text>
            <Text style={styles.screenSubtitle}>Fissium | AI Studio</Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.ghostButton} onPress={() => goTo("home")}>
            <Text style={styles.ghostButtonText}>Galeria</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.primaryButton}
            // onPress={handleGenerate}
          >
            <Text style={styles.primaryButtonText}>Buscar</Text>
          </TouchableOpacity>
        </View>
      </View>

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
            <View style={styles.badgeRow}>
              <Text style={[styles.badge, styles.badgeActive]}>1:1</Text>
              <Text style={styles.badge}>3:4</Text>
              <Text style={styles.badge}>16:9</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Tipo de conteudo</Text>
            <View style={styles.toggleRow}>
              <Text style={[styles.toggle, styles.toggleActive]}>Arte</Text>
              <Text style={styles.toggle}>Foto</Text>
              <Text style={styles.toggle}>Esboco</Text>
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
            <TouchableOpacity style={styles.linkButton} onPress={handlePickClick}>
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
                  <Text style={styles.previewCaption}>{item.caption}</Text>
                  <TouchableOpacity style={styles.secondaryButton}>
                    <Text style={styles.secondaryButtonText}>Refinar</Text>
                  </TouchableOpacity>
                  {item.isGenerated ? (
                    <TouchableOpacity
                      style={styles.downloadButton}
                      onPress={() => Linking.openURL(item.uri)}
                    >
                      <Text style={styles.downloadButtonText}>Baixar</Text>
                    </TouchableOpacity>
                  ) : null}
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
