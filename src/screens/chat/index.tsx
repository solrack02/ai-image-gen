import React from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";

const logoSource = require("../../../assets/animated_logo.gif");

export const Chat = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Whats Next?</Text>
    <View style={styles.inputRow}>
      <TextInput style={styles.bigInput} />
      <TouchableOpacity style={styles.chatButton}>
        {/* <Text style={styles.chatText}>Criar</Text> */}
   <Image source={logoSource} style={styles.animatedGif} />
      </TouchableOpacity>
    </View>
  </View>
);

export default Chat;
