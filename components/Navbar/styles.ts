import { StyleSheet } from "react-native";
import { Colors, Fonts } from "../../constants/theme";

const palette = Colors.dark;
const fontSans = Fonts.sans;

export const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoImg: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: palette.divider,
  },
  screenTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: palette.text,
    fontFamily: fontSans,
  },
  screenSubtitle: {
    fontSize: 14,
    color: palette.text,
    fontFamily: fontSans,
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: palette.divider,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "transparent",
  },
  secondaryButtonText: {
    color: palette.text,
    fontWeight: "600",
    fontFamily: fontSans,
  },
  ghostButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: palette.divider,
    backgroundColor: palette.surface,
  },
  ghostButtonText: {
    color: palette.text,
    fontWeight: "600",
    fontFamily: fontSans,
  },
  primaryButton: {
    backgroundColor: palette.elevated || palette.text,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 30,
  },
  primaryButtonText: {
    color: palette.text,
    fontWeight: "700",
    fontFamily: fontSans,
  },
  pillActive: {
    backgroundColor: palette.text,
    borderColor: palette.text,
  },
  pillTextActive: {
    color: palette.canvas,
  },
});
