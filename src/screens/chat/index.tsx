import React, { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { goTo, setData } from "@/src/centralData";
import { requestImages } from "../../../actions";
import { styles } from "./styles";

const logoSource = require("../../../assets/animated_logo.gif");

export const Chat = () => {
  const [prompt, setPrompt] = useState("");

  const handleCreate = async () => {
    const safePrompt = prompt || "Explorar novas variacoes";
    try {
      const { images } = await requestImages({ prompt: safePrompt });
      setData((ct) => {
        ct.system.generation.prompt = safePrompt;
        ct.system.generation.images = images;
      });
    } catch (err) {
      console.error(err);
    } finally {
      goTo("editor");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Whats Next?</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.bigInput}
          value={prompt}
          onChangeText={setPrompt}
          placeholder="Descreva o que quer gerar..."
          placeholderTextColor="#6b7280"
        />
        <TouchableOpacity style={styles.chatButton} onPress={handleCreate}>
          <Image source={logoSource} style={styles.animatedGif} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Chat;
