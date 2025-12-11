import React, { useEffect } from "react";
import { Platform, StyleSheet, View } from "react-native";

import { registerRootComponent } from "expo";
import { ActiveScreen } from "./centralData/router";
import { setData, useData } from "./centralData";

const App = () => {

  useEffect(() => {
    if (Platform.OS === "web") {
      document.title = "Fissium | AI";
    }
  }, []);

  useEffect(() => {
    const key = "fissium_generation";
    if (typeof window === "undefined") return;

    // Hydrate once on load
    try {
      const stored = window.localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        setData((ct) => {
          ct.system.generation = {
            prompt: parsed?.prompt || "",
            images: Array.isArray(parsed?.images) ? parsed.images : [],
          };
        });
      }
    } catch (err) {
      console.warn("Falha ao carregar cache local", err);
    }

    // Persist on changes
    const unsub = useData.subscribe((state) => {
      const generation = state.system.generation;
      try {
        const payload = {
          prompt: generation?.prompt || "",
          images: Array.isArray(generation?.images) ? generation.images : [],
        };
        window.localStorage.setItem(key, JSON.stringify(payload));
      } catch (err) {
        console.warn("Falha ao salvar cache local", err);
      }
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
