import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { registerRootComponent } from "expo";
import { goTo, useData } from "./centralData";
import Chat from "./screens/chat";
import Home from "./screens/home";

const App = () => {
  const title = useData((ct) => ct.screens.A0.statics.title);
  const currentRoute = useData((ct) => ct.router.current);

  const screens = {
    home: Home,
    chat: Chat,
  } as const;

  const ActiveScreen = screens[currentRoute] ?? Home;

  return (
    <View style={styles.container}>
      <View style={styles.nav}>
        <TouchableOpacity
          style={[
            styles.navButton,
            currentRoute === "home" && styles.navButtonActive,
          ]}
          onPress={() => goTo("home")}
        >
          <Text
            style={[
              styles.navLabel,
              currentRoute === "home" && styles.navLabelActive,
            ]}
          >
            Home
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.navButton,
            currentRoute === "chat" && styles.navButtonActive,
          ]}
          onPress={() => goTo("chat")}
        >
          <Text
            style={[
              styles.navLabel,
              currentRoute === "chat" && styles.navLabelActive,
            ]}
          >
            Chat
          </Text>
        </TouchableOpacity>
      </View>
      <ActiveScreen />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#222",
  },
  button: {
    marginVertical: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#1d4ed8",
  },
  buttonLabel: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  nav: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  navButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#e5e7eb",
  },
  navButtonActive: {
    backgroundColor: "#1d4ed8",
  },
  navLabel: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "600",
  },
  navLabelActive: {
    color: "#fff",
  },
});

registerRootComponent(App);

export default App;
