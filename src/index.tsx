import React, { useEffect } from "react";
import { Platform, StyleSheet, View } from "react-native";

import { registerRootComponent } from "expo";
import { ActiveScreen } from "./centralData/router";

const App = () => {

  useEffect(() => {
    if (Platform.OS === "web") {
      document.title = "Fissium | AI";
    }
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
