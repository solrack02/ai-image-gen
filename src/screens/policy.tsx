import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Policy = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Policy</Text>
  </View>
);

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
});

export default Policy;
