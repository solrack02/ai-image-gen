import { StyleSheet } from "react-native";
import { Colors, Fonts } from "../../../constants/theme";

const palette = Colors.dark;
const fontSans = Fonts.sans;
const fontMono = Fonts.mono;

export const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: palette.canvas,
    padding: 16,
    gap: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: palette.text,
    fontSize: 18,
    fontWeight: "800",
    fontFamily: fontSans,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  refresh: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: palette.divider,
    backgroundColor: palette.surface,
  },
  refreshText: {
    color: palette.text,
    fontWeight: "700",
    fontFamily: fontSans,
  },
  body: {
    flex: 1,
    gap: 12,
  },
  canvasCard: {
    flex: 1,
    backgroundColor: palette.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: palette.divider,
    padding: 12,
    gap: 10,
  },
  caption: {
    color: palette.secondaryText,
    fontSize: 12,
    letterSpacing: 0.3,
    fontFamily: fontMono,
  },
  canvas: {
    width: "100%",
    minHeight: 320,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.divider,
    backgroundColor: "#050505",
  },
  metaCard: {
    backgroundColor: palette.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.divider,
    padding: 12,
    gap: 6,
  },
  metaText: {
    color: palette.text,
    fontSize: 13,
    fontFamily: fontSans,
  },
  frameRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  frameButton: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: palette.divider,
    backgroundColor: palette.surface,
  },
  frameButtonActive: {
    backgroundColor: palette.elevated,
    borderColor: palette.elevated,
  },
  frameButtonText: {
    color: palette.text,
    fontWeight: "700",
    fontFamily: fontSans,
  },
  frameButtonTextActive: {
    color: palette.canvas,
  },
});
