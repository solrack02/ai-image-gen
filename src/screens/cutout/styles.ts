import { StyleSheet } from "react-native";
import { Colors, Fonts } from "../../../constants/theme";

const palette = Colors.dark;
const fontSans = Fonts.sans;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 18,
    backgroundColor: palette.canvas,
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: palette.text,
    fontFamily: fontSans,
    marginBottom: 14,
  },
  workspace: {
    backgroundColor: palette.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.divider,
    padding: 18,
    gap: 10,
  },
  stageRow: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: 12,
  },
  previewArea: {
    width: "100%",
    minHeight: 520,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: palette.divider,
    overflow: "hidden",
    backgroundColor: "#050505",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    flex: 1,
  },
  largeImage: {
    width: "100%",
    height: 640,
    maxHeight: 860,
  },
  cropsPanel: {
    width: 180,
    maxWidth: 200,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: palette.divider,
    backgroundColor: "#0b0b0b",
    padding: 10,
    gap: 8,
  },
  cropsTitle: {
    fontSize: 12,
    color: palette.secondaryText,
    fontFamily: fontSans,
    fontWeight: "700",
  },
  cropsList: {
    gap: 10,
  },
  cropsEmpty: {
    fontSize: 12,
    color: palette.secondaryText,
    fontFamily: fontSans,
  },
  cropsItem: {
    gap: 4,
  },
  cropsThumb: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 8,
    backgroundColor: palette.canvas,
  },
  cropsLabel: {
    fontSize: 11,
    color: palette.text,
    fontFamily: fontSans,
  },
  cropBox: {
    position: "absolute",
    borderWidth: 2,
    borderColor: palette.accent,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  helpText: {
    flex: 1,
    fontSize: 12,
    color: palette.secondaryText,
    fontFamily: fontSans,
  },
  primaryButton: {
    backgroundColor: palette.elevated || palette.text,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: palette.text,
    fontWeight: "700",
    fontFamily: fontSans,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  thumbCard: {
    width: 100,
    maxWidth: 100,
    alignItems: "center",
    gap: 6,
    padding: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "transparent",
  },
  thumbCardActive: {
    borderColor: palette.accent,
  },
  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: palette.surface,
  },
  thumbLabel: {
    fontSize: 12,
    color: palette.secondaryText,
    fontFamily: fontSans,
  },
  addCard: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: palette.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.surface,
    gap: 4,
  },
  addIcon: {
    fontSize: 32,
    lineHeight: 34,
    color: palette.text,
    fontFamily: fontSans,
  },
  addLabel: {
    fontSize: 12,
    color: palette.secondaryText,
    fontFamily: fontSans,
  },
  emptyText: {
    fontSize: 14,
    color: palette.secondaryText,
    fontFamily: fontSans,
  },
});
