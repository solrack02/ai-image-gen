import { StyleSheet } from "react-native";
import { Colors, Fonts } from "../../../constants/theme";

// Dark theme inspired by the reference landing page.
const palette = Colors.dark;
const fontSans = Fonts.sans;

export const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: palette.canvas,
    paddingHorizontal: 18,
    paddingVertical: 14,
    gap: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    gap: 4,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: palette.text,
    fontFamily: fontSans,
  },
  screenSubtitle: {
    fontSize: 14,
    color: palette.secondaryText,
    fontFamily: fontSans,
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  body: {
    flex: 1,
    flexDirection: "row",
    gap: 18,
  },
  sidebar: {
    width: 220,
    maxWidth: 300
  },
  sidebarContent: {
    paddingVertical: 8,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: palette.text,
    marginBottom: 4,
    fontFamily: fontSans,
  },
  card: {
    backgroundColor: palette.surface,
    borderColor: palette.divider,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: palette.text,
    fontFamily: fontSans,
  },
  cardHint: {
    fontSize: 13,
    color: palette.secondaryText,
    fontFamily: fontSans,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 8,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: palette.divider,
    color: palette.secondaryText,
    fontFamily: fontSans,
  },
  badgeActive: {
    backgroundColor: palette.text,
    color: palette.canvas,
    borderColor: palette.text,
  },
  toggleRow: {
    flexDirection: "row",
    gap: 8,
  },
  toggle: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: palette.canvas,
    borderWidth: 1,
    borderColor: palette.divider,
    color: palette.secondaryText,
    fontFamily: fontSans,
  },
  toggleActive: {
    backgroundColor: palette.text,
    color: palette.canvas,
    borderColor: palette.text,
  },
  referenceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  referenceThumb: {
    width: 52,
    height: 52,
    borderRadius: 8,
  },
  linkButton: {
    paddingVertical: 6,
  },
  linkButtonText: {
    color: palette.accent,
    fontWeight: "600",
    fontFamily: fontSans,
  },
  main: {
    flex: 1,
    gap: 12,
  },
  promptBox: {
    backgroundColor: palette.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.divider,
    padding: 14,
    gap: 6,
  },
  promptLabel: {
    fontSize: 12,
    color: palette.secondaryText,
    fontFamily: fontSans,
  },
  promptText: {
    fontSize: 15,
    color: palette.text,
    fontFamily: fontSans,
  },
  previewGrid: {
    justifyContent: "flex-start",
    flexDirection: "row",
    flexWrap: "wrap",
    flex: 1,
    gap: 12,
  },
  previewCard: {
    backgroundColor: palette.surface,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: palette.divider,
    width: "36%",
    maxWidth: 300,
    minHeight: 220,
  },
  previewImage: {
    width: "100%",
    height: 200,
  },
  previewOverlay: {
    padding: 12,
    gap: 10,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  previewCaption: {
    fontSize: 14,
    color: palette.text,
    fontFamily: fontSans,
  },
  commandBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: palette.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.divider,
    padding: 10,
    gap: 10,
  },
  promptInput: {
    flex: 1,
    height: 48,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: palette.divider,
    fontFamily: fontSans,
    color: palette.text,
  },
  primaryButton: {
    backgroundColor: palette.elevated || palette.text,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
  },
  primaryButtonText: {
    color: palette.canvas,
    fontWeight: "700",
    fontFamily: fontSans,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: palette.divider,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  secondaryButtonText: {
    color: palette.text,
    fontWeight: "600",
    fontFamily: fontSans,
  },
  ghostButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.divider,
    backgroundColor: palette.surface,
  },
  ghostButtonText: {
    color: palette.text,
    fontWeight: "600",
    fontFamily: fontSans,
  },
  downloadButton: {
    marginTop: 4,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: palette.text,
  },
  downloadButtonText: {
    color: palette.canvas,
    fontWeight: "700",
    fontFamily: fontSans,
  },
});
