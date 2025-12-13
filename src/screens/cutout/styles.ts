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
});
