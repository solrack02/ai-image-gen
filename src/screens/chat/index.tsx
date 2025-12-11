import React, { useMemo, useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { goTo, setData } from "@/src/centralData";
import { requestImages } from "../../../actions";
import { styles } from "./styles";

const logoSource = require("../../../assets/animated_logo.gif");

export const Chat = () => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const buttonContent = useMemo(() => {
    if (isLoading) {
      return <Image source={logoSource} style={styles.animatedGif} />;
    }
    return <Text style={styles.chatText}>Gerar</Text>;
  }, [isLoading]);

  const handleCreate = async () => {
    const safePrompt =
      prompt.trim() || "Explorar novas variacoes com luz suave e minimalismo";
    setErrorMessage(null);
    setIsLoading(true);
    try {
      const { images } = await requestImages({ prompt: safePrompt });
      setData((ct) => {
        ct.system.generation.prompt = safePrompt;
        const prevImages = ct.system.generation.images || [];
        ct.system.generation.images = [
          ...prevImages,
          ...images.map((img) => ({ data: img, prompt: safePrompt })),
        ];
      });
      goTo("editor");
    } catch (err: any) {
      const msg =
        err?.message ||
        "Nao foi possivel gerar a imagem. Tente novamente em instantes.";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
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
          editable={!isLoading}
        />
        <TouchableOpacity
          style={[
            styles.chatButton,
            isLoading ? styles.chatButtonDisabled : null,
          ]}
          onPress={handleCreate}
          disabled={isLoading}
        >
          {buttonContent}
        </TouchableOpacity>
      </View>
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
    </View>
  );
};

export default Chat;
