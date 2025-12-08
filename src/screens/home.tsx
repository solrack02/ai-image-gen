import React, { useMemo, useState } from "react";
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
  const logoSource = {
    uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAhMBgQfXlwQAAAAASUVORK5CYII=",
  };
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
          {/* <Image source={logoSource} style={styles.logoImg} /> */}
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
              <Text style={styles.sidebarTitle}>Explorar</Text>
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
<View style={styles.galleryShell}>
        <ScrollView
          horizontal
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.galleryContent}
        >
          {/* <View style={styles.galleryHeader}>
            <Text style={styles.galleryTitle}>Platform Gallery</Text>
          </View> */}
          <View style={styles.galleryGrid}>
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
    marginBottom: 5,
    marginLeft: 10,
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
    width: 26,
    height: 26,
    // borderRadius: 3,
    // borderWidth: 1,
    // borderColor: "#1f2937",
    // backgroundColor: "#030606",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.8,
  },
  sidebarToggleHover: {
    // backgroundColor: "#0b0e10ff",
    opacity: 1,
  },
  sidebarToggleText: {
    color: "#e5e7eb",
    fontSize: 14,
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
    backgroundColor: "#080808",
  },
  sidebarItemText: {
    color: "#e5e7eb",
    fontSize: 14,
    fontWeight: "600",
  },
  chevron: {
    color: "#9ca3af",
    fontSize: 14,
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
    width: 300,
    height: 280,
    // borderRadius: 16,
    justifyContent: "flex-end",
    padding: 10,
    // borderWidth: 1,
    // borderColor: "#000000",
    // #b52b00
    // #0010b5
    // #b9275c
  },
  cardTitle: {
    color: "#f9fafb",
    fontSize: 16,
    fontWeight: "700",
  },
   galleryContent: {
    paddingHorizontal: 4,
    paddingBottom: 24,
  },
  galleryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  galleryTitle: {
    color: "#c084fc",
    fontSize: 20,
    fontWeight: "800",
  },
  galleryBadge: {
    fontSize: 18,
    color: "#c084fc",
  },
  galleryGrid: {
    flexDirection: "row",
    gap: 12,
  },
  galleryColumn: {
    flex: 1,
    gap: 12,
  },
  cardTall: {
    height: 150,
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
    galleryShell: {
    flex: 1,
    alignItems: "center",
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
