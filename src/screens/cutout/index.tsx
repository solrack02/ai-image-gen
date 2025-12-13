import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import * as FileSystem from "expo-file-system";
import React, { useCallback, useEffect, useMemo } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
  GestureResponderEvent,
  Platform,
} from "react-native";
import { setData, useData } from "../../centralData";
import Navbar from "../../../components/Navbar";
import { styles } from "./styles";

const Cutout = () => {
  const generationImages = useData((ct) => ct.system.generation.images || []);
  const [dragStart, setDragStart] = React.useState<{ x: number; y: number } | null>(null);
  const [bbox, setBbox] = React.useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [displaySize, setDisplaySize] = React.useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });
  const [naturalSize, setNaturalSize] = React.useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });
  const [isCropping, setIsCropping] = React.useState(false);
  const [selectedBaseId, setSelectedBaseId] = React.useState<string | null>(null);

  const items = useMemo(
    () =>
      generationImages.map((img, idx) => {
        const rawData = img?.data || "";
        const uri = rawData.startsWith("data:")
          ? rawData
          : `data:image/png;base64,${rawData}`;
        const id = (img as any)?.id || `img-${idx}`;
        const parentId = (img as any)?.parentId || null;
        const isCrop = Boolean(parentId) || (img?.prompt || "").toLowerCase().includes("crop");
        return {
          key: `img-${idx}`,
          id,
          uri,
          label: img?.prompt || `Imagem ${idx + 1}`,
          raw: rawData,
          parentId,
          isCrop,
        };
      }),
    [generationImages]
  );

  const croppedItems = useMemo(
    () => items.filter((item) => item.isCrop && item.parentId === selectedBaseId),
    [items, selectedBaseId]
  );

  const baseItems = useMemo(() => items.filter((item) => !item.isCrop), [items]);

  const firstBaseId = useMemo(() => baseItems[0]?.id || null, [baseItems]);

  useEffect(() => {
    if (selectedBaseId || !firstBaseId) return;
    setSelectedBaseId(firstBaseId);
  }, [selectedBaseId, firstBaseId]);

  const selectedItem = useMemo(
    () => items.find((item) => item.id === selectedBaseId) || null,
    [items, selectedBaseId]
  );

  useEffect(() => {
    const uri = selectedItem?.uri;
    if (!uri) return;
    if (typeof window === "undefined" || !("Image" in window)) return;

    const logPrefix = "NaturalSize";
    console.log(logPrefix, "loading size for", uri.slice(0, 60));

    const loader = new window.Image();
    loader.onload = () => {
      const size = { width: loader.width, height: loader.height };
      console.log(logPrefix, "resolved", size);
      setNaturalSize(size);
    };
    loader.onerror = (err) => console.warn(logPrefix, "failed", err);
    loader.src = uri;

    return () => {
      loader.onload = null;
      loader.onerror = null;
    };
  }, [selectedItem?.uri]);

  const resetBbox = () => {
    setDragStart(null);
    setBbox(null);
  };

  const handleImageLayout = (e: any) => {
    const { width, height } = e.nativeEvent.layout;
    setDisplaySize({ width, height });
  };

  const handleImageLoaded = (e: any) => {
    const w = e?.nativeEvent?.source?.width || 0;
    const h = e?.nativeEvent?.source?.height || 0;
    if (w && h) {
      setNaturalSize({ width: w, height: h });
    }
  };

  const handleStartDrag = (e: GestureResponderEvent) => {
    const { locationX, locationY } = e.nativeEvent;
    setDragStart({ x: locationX, y: locationY });
    setBbox({ x: locationX, y: locationY, width: 0, height: 0 });
  };

  const handleMoveDrag = (e: GestureResponderEvent) => {
    if (!dragStart) return;
    const { locationX, locationY } = e.nativeEvent;
    const x = Math.min(locationX, dragStart.x);
    const y = Math.min(locationY, dragStart.y);
    const width = Math.abs(locationX - dragStart.x);
    const height = Math.abs(locationY - dragStart.y);
    setBbox({ x, y, width, height });
  };

  const handleEndDrag = (e: GestureResponderEvent) => {
    if (!dragStart) return;
    handleMoveDrag(e);
    setDragStart(null);
  };

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
      const newId = `img-${Date.now()}`;
      setData((ct) => {
        const prev = ct.system.generation.images || [];
        ct.system.generation.images = [
          ...prev,
          { id: newId, data: importedImage, prompt: "Importado" },
        ];
      });
      setSelectedBaseId(newId);
    } catch (error) {
      console.error("Falha ao selecionar imagem", error);
    }
  }, []);

  const handleSelectThumb = (id: string) => {
    setSelectedBaseId(id);
    resetBbox();
  };

  const handleCrop = useCallback(async () => {
    if (!selectedItem) {
      console.warn("Crop: nenhum item selecionado");
      return;
    }
    if (!bbox || !bbox.width || !bbox.height) {
      console.warn("Crop: bbox vazio");
      return;
    }
    if (!displaySize.width || !displaySize.height) {
      console.warn("Crop: display sem tamanho", displaySize);
      return;
    }
    if (!naturalSize.width || !naturalSize.height) {
      console.warn("Crop: natural size vazio", naturalSize);
      return;
    }

    const containerW = displaySize.width;
    const containerH = displaySize.height;
    const naturalW = naturalSize.width;
    const naturalH = naturalSize.height;
    const scale = Math.min(containerW / naturalW, containerH / naturalH);
    const renderW = naturalW * scale;
    const renderH = naturalH * scale;
    const offsetX = (containerW - renderW) / 2;
    const offsetY = (containerH - renderH) / 2;

    // Ajusta bbox para dentro da area efetiva da imagem renderizada (removendo letterboxing)
    const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));
    const relX = clamp(bbox.x - offsetX, 0, renderW);
    const relY = clamp(bbox.y - offsetY, 0, renderH);
    const relW = clamp(bbox.width - Math.max(0, offsetX - bbox.x), 0, renderW - relX);
    const relH = clamp(bbox.height - Math.max(0, offsetY - bbox.y), 0, renderH - relY);

    const minSize = 4;
    if (relW < minSize || relH < minSize) {
      console.warn("Crop: area muito pequena", { relW, relH, bbox });
      return;
    }

    setIsCropping(true);
    try {
      const originX = Math.max(0, Math.round((relX / renderW) * naturalW));
      const originY = Math.max(0, Math.round((relY / renderH) * naturalH));
      const width = Math.max(1, Math.min(naturalW - originX, Math.round((relW / renderW) * naturalW)));
      const height = Math.max(1, Math.min(naturalH - originY, Math.round((relH / renderH) * naturalH)));

      console.log("Crop sizes", {
        bbox,
        displaySize,
        naturalSize,
        render: { renderW, renderH, offsetX, offsetY },
        crop: { originX, originY, width, height },
      });

      const isWeb = Platform.OS === "web";

      const getCroppedBase64 = async (): Promise<string | null> => {
        if (isWeb) {
          // Web: crop direto no canvas sem manipulator/file system
          try {
            const img = new window.Image();
            const dataUrl = selectedItem.uri;
            await new Promise<void>((resolve, reject) => {
              img.onload = () => resolve();
              img.onerror = (err) => reject(err);
              img.src = dataUrl;
            });
            const canvas = document.createElement("canvas");
            canvas.width = Math.max(1, Math.floor(width));
            canvas.height = Math.max(1, Math.floor(height));
            const ctx = canvas.getContext("2d");
            if (!ctx) throw new Error("canvas ctx null");
            ctx.drawImage(
              img,
              originX,
              originY,
              width,
              height,
              0,
              0,
              canvas.width,
              canvas.height
            );
            const out = canvas.toDataURL("image/png");
            const base64Out = out.split(",")[1] || "";
            console.log("Crop canvas result", {
              size: `${canvas.width}x${canvas.height}`,
              len: base64Out.length,
              origin: { originX, originY, width, height },
            });
            return base64Out || null;
          } catch (err) {
            console.warn("Crop canvas fallback failed", err);
          }
        }

        const base64Data = selectedItem.raw.startsWith("data:")
          ? selectedItem.raw.split(",")[1] || ""
          : selectedItem.raw;

        if (!base64Data) {
          console.warn("Crop: base64 vazio");
          return null;
        }

        const fileUri = `${FileSystem.cacheDirectory}cutout-${Date.now()}.png`;
        await FileSystem.writeAsStringAsync(fileUri, base64Data, {
          encoding: FileSystem.EncodingType.Base64,
        });
        console.log("Crop: wrote temp file", fileUri);

        const result = await ImageManipulator.manipulateAsync(
          fileUri,
          [{ crop: { originX, originY, width, height } }],
          { compress: 1, format: ImageManipulator.SaveFormat.PNG, base64: true }
        );

        console.log("Crop result", {
          uri: result.uri,
          size: result.width && result.height ? `${result.width}x${result.height}` : "n/d",
          hasBase64: !!result.base64,
        });

        return result.base64 || null;
      };

      const croppedBase64 = await getCroppedBase64();

      if (croppedBase64) {
        setData((ct) => {
          const prev = ct.system.generation.images || [];
          ct.system.generation.images = [
            ...prev,
            {
              id: `crop-${Date.now()}`,
              data: croppedBase64,
              prompt: `${selectedItem.label} | Crop`,
              parentId: selectedItem.id,
            },
          ];
        });
      } else {
        console.warn("Crop: resultado sem base64");
      }
    } catch (error) {
      console.error("Falha ao cortar imagem", error);
    } finally {
      setIsCropping(false);
    }
  }, [bbox, displaySize, naturalSize, selectedItem]);

  return (
    <View style={styles.container}>
      <Navbar title="Cutout" subtitle="Fissium | AI Studio" />

      <Text style={styles.title}>Fatiar Personagem</Text>

      {selectedItem ? (
        <View style={styles.workspace}>
          <View style={styles.stageRow}>
            <View
              style={styles.previewArea}
              onLayout={handleImageLayout}
              onStartShouldSetResponder={() => true}
              onMoveShouldSetResponder={() => true}
              onResponderGrant={handleStartDrag}
              onResponderMove={handleMoveDrag}
              onResponderRelease={handleEndDrag}
              onResponderTerminate={handleEndDrag}
            >
              <Image
                source={{ uri: selectedItem.uri }}
                style={styles.largeImage}
                resizeMode="contain"
                onLoad={handleImageLoaded}
              />
              {bbox ? (
                <View
                  pointerEvents="none"
                  style={[
                    styles.cropBox,
                    {
                      left: bbox.x,
                      top: bbox.y,
                      width: bbox.width,
                      height: bbox.height,
                    },
                  ]}
                />
              ) : null}
            </View>

            <View style={styles.cropsPanel}>
              <Text style={styles.cropsTitle}>Recortes</Text>
              <ScrollView contentContainerStyle={styles.cropsList}>
                {croppedItems.length === 0 ? (
                  <Text style={styles.cropsEmpty}>Nenhum recorte ainda</Text>
                ) : (
                  croppedItems.map((crop) => (
                    <View key={crop.key} style={styles.cropsItem}>
                      <Image source={{ uri: crop.uri }} style={styles.cropsThumb} />
                      <Text style={styles.cropsLabel} numberOfLines={1}>
                        {crop.label}
                      </Text>
                    </View>
                  ))
                )}
              </ScrollView>
            </View>
          </View>

          <View style={styles.actionsRow}>
            <Text style={styles.helpText}>
              Arraste para selecionar a area de corte. Depois clique em cortar para gerar nova imagem.
            </Text>
            <TouchableOpacity
              style={[styles.primaryButton, (!bbox || isCropping) && styles.primaryButtonDisabled]}
              onPress={handleCrop}
              disabled={!bbox || isCropping}
            >
              <Text style={styles.primaryButtonText}>{isCropping ? "Cortando..." : "Cortar"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <Text style={styles.emptyText}>Selecione ou adicione uma imagem para cortar.</Text>
      )}

      <ScrollView contentContainerStyle={styles.grid}>
        {baseItems.map((item) => {
          const active = selectedItem?.id === item.id;
          return (
            <TouchableOpacity
              key={item.key}
              style={[styles.thumbCard, active && styles.thumbCardActive]}
              onPress={() => handleSelectThumb(item.id)}
            >
              <Image source={{ uri: item.uri }} style={styles.thumbnail} />
              <Text style={styles.thumbLabel} numberOfLines={1}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity style={styles.addCard} onPress={handleAddImage}>
          <Text style={styles.addIcon}>+</Text>
          <Text style={styles.addLabel}>Adicionar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Cutout;
