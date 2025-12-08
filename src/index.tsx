import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { registerRootComponent } from "expo";
import { setData, useData } from "./centralData";
import Chat from "./screens/chat";
import Home from "./screens/home";

const App = () => {
  const title = useData((ct) => ct.screens.A0.statics.title);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setData((ct) => {
            ct.screens.A0.statics.title = "Outro titulo";
          });
        }}
      >
        <Text style={styles.buttonLabel}>Atualizar mensagem</Text>
      </TouchableOpacity>
      <Home />
      <Chat />
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
});

registerRootComponent(App);

export default App;
