import React, { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const galleryItems = [
  { id: "1", title: "Dreamscape", color: "#1f2937" },
  { id: "2", title: "Neon Portrait", color: "#0f172a" },
  { id: "3", title: "Surreal Garden", color: "#111827" },
  { id: "4", title: "Futuristic City", color: "#1e293b" },
  { id: "5", title: "Abstract Forms", color: "#0b1324" },
  { id: "6", title: "Cosmic Bloom", color: "#101827" },
];

const menuItems = ["Descubra", "Colecoes", "Artistas", "Favoritos"];

export const Home = () => {
  const [collapsed, setCollapsed] = useState(false);
  const logoSource = {
    uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAhMBgQfXlwQAAAAASUVORK5CYII=",
  };

  return (
    <View style={styles.page}>
      <View style={styles.navbar}>
        <View style={styles.logoRow}>
          <Image source={logoSource} style={styles.logoImg} />
          <Text style={styles.logo}>fissium</Text>
        </View>
        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginText}>Entrar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.hero}>
        <View
          style={[
            styles.sidebar,
            collapsed && styles.sidebarCollapsed,
          ]}
        >
          {/* <Pressable
            style={({ hovered, pressed }) => [
              styles.sidebarToggle,
              (hovered || pressed) && styles.sidebarToggleHover,
            ]}
            onPress={() => setCollapsed((prev) => !prev)}
          >
            <Text style={styles.sidebarToggleText}>
              {collapsed ? ">" : "<"}
            </Text>
          </Pressable> */}

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
                            active ? styles.chevronVisible : styles.chevronHidden,
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

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.gallery}
        >
          {galleryItems.map((card) => (
            <View
              key={card.id}
              style={[styles.card, { backgroundColor: card.color }]}
            >
              <Text style={styles.cardTitle}>{card.title}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Criado com imagination + code</Text>
        <Text style={styles.footerText}>morfos - 2025</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: 22,
    paddingHorizontal: 10,
  },
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoImg: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: "#0f172a",
  },
  logo: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  loginButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#1f2937",
    borderWidth: 1,
    borderColor: "#30363d",
  },
  loginText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  hero: {
    flex: 1,
    flexDirection: "row",
    gap: 16,
  },
  sidebar: {
    width: 160,
    padding: 14,
  },
  sidebarCollapsed: {
    width: 52,
    alignItems: "center",
  },
  sidebarToggle: {
    width: "100%",
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1f2937",
    backgroundColor: "#0d1117",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  sidebarToggleHover: {
    backgroundColor: "#1f2937",
  },
  sidebarToggleText: {
    color: "#e5e7eb",
    fontSize: 18,
    fontWeight: "700",
  },
  sidebarTitle: {
    color: "#9ca3af",
    fontSize: 12,
    letterSpacing: 0.4,
    marginBottom: 12,
  },
  sidebarItem: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  sidebarItemHover: {
    backgroundColor: "#060606",
  },
  sidebarItemText: {
    color: "#e5e7eb",
    fontSize: 14,
    fontWeight: "600",
  },
  chevron: {
    color: "#9ca3af",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },
  chevronHidden: {
    opacity: 0,
  },
  chevronVisible: {
    opacity: 1,
  },
  gallery: {
    paddingVertical: 4,
    gap: 12,
  },
  card: {
    width: 200,
    height: 260,
    borderRadius: 16,
    justifyContent: "flex-end",
    padding: 16,
    borderWidth: 1,
    borderColor: "#111827",
  },
  cardTitle: {
    color: "#f9fafb",
    fontSize: 16,
    fontWeight: "700",
  },
  footer: {
    marginTop: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderColor: "#111827",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    color: "#6b7280",
    fontSize: 12,
  },
});

export default Home;
