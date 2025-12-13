import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { goTo, useData } from "@/src/centralData";
import { styles } from "./styles";

type NavbarProps = {
  title: string;
  subtitle: string;
};

const Navbar = ({ title, subtitle }: NavbarProps) => {
  const current = useData((ct) => ct.router.current);
  const logoSource = require("../../assets/logo3.png");

  const isActive = (route: "cutout" | "rig2D" | "home") =>
    current === route;

  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Image source={logoSource} style={styles.logoImg} />
        <View>
          <Text style={styles.screenTitle}>{title}</Text>
          <Text style={styles.screenSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <View style={styles.headerActions}>
        <TouchableOpacity
          style={[styles.secondaryButton, isActive("cutout") && styles.pillActive]}
          onPress={() => goTo("cutout")}
        >
          <Text
            style={[
              styles.secondaryButtonText,
              isActive("cutout") && styles.pillTextActive,
            ]}
          >
            Cutout
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.secondaryButton, isActive("rig2D") && styles.pillActive]}
          onPress={() => goTo("rig2D")}
        >
          <Text
            style={[
              styles.secondaryButtonText,
              isActive("rig2D") && styles.pillTextActive,
            ]}
          >
            Rig 2D
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.ghostButton, isActive("home") && styles.pillActive]}
          onPress={() => goTo("home")}
        >
          <Text
            style={[
              styles.ghostButtonText,
              isActive("home") && styles.pillTextActive,
            ]}
          >
            Galeria
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Buscar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Navbar;
