import * as ImagePicker from "expo-image-picker";
import React, { useCallback, useMemo } from "react";
import { ScrollView, Text, TouchableOpacity, View, Image } from "react-native";
import { setData, useData } from "../../centralData";
import Navbar from "../../../components/Navbar";
import { styles } from "./styles";

const Cutout = () => {
  const generationImages = useData((ct) => ct.system.generation.images || []);

  const items = useMemo(
    () =>
      generationImages.map((img, idx) => {
        const rawData = img?.data || "";
        const uri = rawData.startsWith("data:")
          ? rawData
          : `data:image/png;base64,${rawData}`;
        return {
          key: `img-${idx}`,
          uri,
          label: img?.prompt || `Imagem ${idx + 1}`,
        };
      }),
    [generationImages]
  );

  const handleAddImage = useCallback(async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        console.warn("Permissao negada para acessar a galeria");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsMultipleSelection: false,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        base64: true,
        quality: 1,
      });
      if (result.canceled) return;
      const asset = result.assets?.[0];
      if (!asset?.base64) {
        console.warn("Nenhuma imagem valida selecionada");
        return;
      }
      const importedImage = asset.base64;
      setData((ct) => {
        const prev = ct.system.generation.images || [];
        ct.system.generation.images = [
          ...prev,
          { data: importedImage, prompt: "Importado" },
        ];
      });
    } catch (error) {
      console.error("Falha ao selecionar imagem", error);
    }
  }, []);

  return (
    <View style={styles.container}>
      <Navbar title="Cutout" subtitle="Fissium | AI Studio" />
      <Text style={styles.title}>Fatiar Personagem</Text>

      <ScrollView contentContainerStyle={styles.grid}>
        {items.map((item) => (
          <View key={item.key} style={styles.thumbCard}>
            <Image source={{ uri: item.uri }} style={styles.thumbnail} />
            <Text style={styles.thumbLabel} numberOfLines={1}>
              {item.label}
            </Text>
          </View>
        ))}

        <TouchableOpacity style={styles.addCard} onPress={handleAddImage}>
          <Text style={styles.addIcon}>+</Text>
          <Text style={styles.addLabel}>Adicionar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Cutout;
