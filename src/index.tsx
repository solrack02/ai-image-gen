import React from "react";
import { StyleSheet, View } from "react-native";

import { registerRootComponent } from "expo";
import { useData } from "./centralData";
import { ActiveScreen } from "./centralData/router";

const App = () => {
  const currentRoute = useData((ct) => ct.router.current);
  
  return (
    <View style={styles.container}>

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
