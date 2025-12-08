import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { registerRootComponent } from 'expo';

const App = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Hello from src/index.tsx</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222',
  },
});

registerRootComponent(App);

export default App;
