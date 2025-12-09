import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";

export const Chat = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Whats Next?</Text>
    <View style={styles.inputRow}>
      <TextInput style={styles.bigInput} />
      <TouchableOpacity style={styles.chatButton}>
        <Text style={styles.chatText}>Criar</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default Chat;
