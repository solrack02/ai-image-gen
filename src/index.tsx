import React, { useEffect } from "react";
import { Platform, StyleSheet, View } from "react-native";

import { registerRootComponent } from "expo";
import { ActiveScreen } from "./centralData/router";
import { setData, useData } from "./centralData";
import { loadGeneration, saveGeneration } from "./storage/generationStore";

const App = () => {

  useEffect(() => {
    if (Platform.OS === "web") {
      document.title = "Fissium | AI";
    }
  }, []);

  useEffect(() => {
    const key = "fissium_generation";
    if (typeof window === "undefined") return;

    const normalizeImages = (images: any[], promptFallback: string) => {
      if (!Array.isArray(images)) return [];
      const now = Date.now();
      return images
        .map((img: any, idx: number) => {
          if (typeof img === "string") {
            return { id: `img-${now}-${idx}`, data: img, prompt: promptFallback, parentId: null };
          }
          if (img?.data) {
            const isCrop =
              Boolean(img.parentId) ||
              (typeof img.prompt === "string" && img.prompt.toLowerCase().includes("crop"));
            const id = img.id || `${isCrop ? "crop" : "img"}-${now}-${idx}`;
            const parentId = img.parentId || null;
            return { id, data: img.data, prompt: img?.prompt || promptFallback, parentId };
          }
          return null;
        })
        .filter(Boolean) as { id: string; data: string; prompt: string; parentId: string | null }[];
    };

    // Hydrate once on load (IndexedDB -> localStorage fallback)
    loadGeneration(key)
      .then((stored) => {
        if (!stored) return;
        const normalizedImages = normalizeImages(
          stored.images,
          stored.prompt || ""
        );
        setData((ct) => {
          ct.system.generation = {
            prompt: stored.prompt || "",
            images: normalizedImages,
          };
        });
      })
      .catch((err) => console.warn("Falha ao carregar cache persistente", err));

    // Persist on changes
    const unsub = useData.subscribe((state) => {
      const generation = state.system.generation;
      const payload = {
        prompt: generation?.prompt || "",
        images: normalizeImages(generation?.images || [], generation?.prompt || ""),
      };
      saveGeneration(key, payload).catch((err) =>
        console.warn("Falha ao salvar cache persistente", err)
      );
    });

    return () => unsub();
  }, []);

  return (
    <View style={styles.container}>
      <ActiveScreen />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "flex-start",
    backgroundColor: "#000",
  },
});

registerRootComponent(App);

export default App;
