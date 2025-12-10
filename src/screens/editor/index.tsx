import { requestImages } from "@/actions";
import { useData, setData } from "@/src/centralData";
import React, { useMemo, useState } from "react";
import {
  Image,
  Linking,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "./styles";

const mockPreviews = [
  {
    id: "1",
    uri: "https://images.unsplash.com/photo-1473186578172-c141e6798cf4?auto=format&fit=crop&w=800&q=80",
    caption: "Explorar cores e formas organicas",
  },
  {
    id: "2",
    uri: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80",
    caption: "Iluminacao suave e textura granular",
  },
  {
    id: "3",
    uri: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80",
    caption: "Composicao minimalista, alto contraste",
  },
];

const Editor = () => {
  const generation = useData((ct) => ct.system.generation);
  const [prompt, setPrompt] = useState(
    generation.prompt ||
      "um estilo minimalista com cores suaves e foco em composicao limpa"
  );
  const [isLoading, setIsLoading] = useState(false);

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
      const { images } = await requestImages({ prompt });
      setData((ct) => {
        ct.system.generation.prompt = prompt;
        ct.system.generation.images = images;
      });
    } catch (error) {
      console.error("Falha ao gerar imagens", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.screenTitle}>Editor</Text>
          <Text style={styles.screenSubtitle}>Fissium | AI Studio</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.ghostButton}>
            <Text style={styles.ghostButtonText}>Galeria</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryButton} onPress={handleGenerate}>
            <Text style={styles.primaryButtonText}>Gerar</Text>
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
              {mockPreviews.slice(0, 4).map((item) => (
                <Image
                  key={item.id}
                  source={{ uri: item.uri }}
                  style={styles.referenceThumb}
                />
              ))}
            </View>
            <TouchableOpacity style={styles.linkButton}>
              <Text style={styles.linkButtonText}>Upload ou arraste uma imagem</Text>
            </TouchableOpacity>
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
