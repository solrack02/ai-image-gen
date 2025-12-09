import { goTo } from "@/src/centralData";
import React, { useMemo, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "./styles";

const galleryItems = [
  {
    id: "1",
    uri: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    tall: true,
  },
  {
    id: "2",
    uri: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "3",
    uri: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
    tall: true,
  },
  {
    id: "4",
    uri: "https://images.unsplash.com/photo-1504600770771-fb03a6961d33?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "5",
    uri: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "6",
    uri: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=80",
    tall: true,
  },
  {
    id: "7",
    uri: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "8",
    uri: "https://images.unsplash.com/photo-1504890001746-a9b7c7a2a0f2?auto=format&fit=crop&w=1200&q=80",
  },
];

const menuItems = ["Descubra", "Colecoes", "Artistas", "Favoritos"];

export const Home = () => {
  const [collapsed, setCollapsed] = useState(false);
  const logoSource = require("../../../assets/logo3.png");
  const columns = useMemo(() => {
    const colCount = 3;
    return Array.from({ length: colCount }, (_, col) =>
      galleryItems.filter((_, idx) => idx % colCount === col)
    );
  }, []);

  return (
    <View style={styles.page}>
      <View style={styles.navbar}>
        <View style={styles.logoRow}>
          <Image source={logoSource} style={styles.logoImg} />
          <Text style={styles.logo}>fissium</Text>
          <Pressable
            style={({ hovered, pressed }) => [
              styles.sidebarToggle,
              (hovered || pressed) && styles.sidebarToggleHover,
            ]}
            onPress={() => setCollapsed((prev) => !prev)}
          >
            <Text style={styles.sidebarToggleText}>
              {collapsed ? "◧" : "◨"}
            </Text>
          </Pressable>
        </View>
        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginText}>Entrar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.hero}>
        <View style={[styles.sidebar, collapsed && styles.sidebarCollapsed]}>
          {!collapsed && (
            <>
              {/* <Text style={styles.sidebarTitle}>Explorar</Text> */}
              {menuItems.map((item) => (
                <Pressable key={item}>
                  {({ hovered, pressed }) => {
                    const active = hovered || pressed;
                    return (
                      <View
                        style={[
                          styles.sidebarItem,
                          active && styles.sidebarItemHover,
                        ]}
                      >
                        <Text style={styles.sidebarItemText}>{item}</Text>
                        <Text
                          style={[
                            styles.chevron,
                            active
                              ? styles.chevronVisible
                              : styles.chevronHidden,
                          ]}
                        >
                          ›
                        </Text>
                      </View>
                    );
                  }}
                </Pressable>
              ))}
            </>
          )}
        </View>

        <View style={styles.heroMain}>
          <View style={styles.heroCopy}>
            <Text style={styles.heroKicker}>Investigações</Text>
            <Text style={styles.heroTitle}>FISSIUM 3</Text>
            <Text style={styles.heroSubtitle}>
              O FISSIUM 3 compreende significativamente mais nuances e detalhes
              do que nossos sistemas anteriores, permitindo que você converta
              facilmente suas ideias em imagens excepcionalmente precisas.
            </Text>

            <TouchableOpacity style={styles.testButton} onPress={() => goTo("chat")}>
              <Text style={styles.loginText}>Testar Grátis  ⇢</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.galleryShell}>
            <ScrollView
              horizontal
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.galleryContent}
            >
              <View style={styles.galleryGrid}>
                {/* <View style={styles.galleryHeader}>
            <Text style={styles.galleryTitle}>Platform Gallery</Text>
          </View> */}
                {columns.map((items, idx) => (
                  <View key={idx} style={styles.galleryColumn}>
                    {items.map((card) => (
                      <View
                        key={card.id}
                        style={[styles.card, card.tall && styles.cardTall]}
                      >
                        <Image
                          source={{ uri: card.uri }}
                          style={styles.cardImage}
                          resizeMode="cover"
                        />
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Criado com imagination + code</Text>
        <Text style={styles.footerText}>morfos - 2025</Text>
      </View>
    </View>
  );
};

export default Home;
