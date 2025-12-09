import { StyleSheet } from "react-native";
import { Colors, Fonts } from "../../../constants/theme";

const palette = Colors.dark;
const fontSans = Fonts.sans;
const fontRounded = Fonts.rounded;

export const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: palette.canvas,
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
    backgroundColor: palette.divider,
  },
  logo: {
    color: palette.text,
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginBottom: 5,
    marginLeft: 10,
    fontFamily: fontRounded,
  },
  loginButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: palette.elevated,
    borderWidth: 1,
    borderColor: palette.border,
  },
  loginText: {
    color: palette.text,
    fontSize: 14,
    fontWeight: "600",
    fontFamily: fontSans,
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
    color: palette.text,
    fontSize: 14,
    fontWeight: "700",
    fontFamily: fontSans,
  },
  sidebarTitle: {
    color: palette.secondaryText,
    fontSize: 12,
    letterSpacing: 0.4,
    marginBottom: 12,
    fontFamily: fontSans,
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
    backgroundColor: palette.overlay,
  },
  sidebarItemText: {
    color: palette.text,
    fontSize: 14,
    fontWeight: "600",
    fontFamily: fontSans,
  },
  chevron: {
    color: palette.secondaryText,
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 8,
    fontFamily: fontSans,
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
    color: palette.text,
    fontSize: 16,
    fontWeight: "700",
    fontFamily: fontSans,
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
    color: palette.accent,
    fontSize: 20,
    fontWeight: "800",
    fontFamily: fontRounded,
  },
  galleryBadge: {
    fontSize: 18,
    color: palette.accent,
    fontFamily: fontRounded,
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
    borderColor: palette.divider,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    color: palette.muted,
    fontSize: 12,
    fontFamily: fontSans,
  },
});
