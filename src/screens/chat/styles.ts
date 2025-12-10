import { Platform, StyleSheet } from "react-native";
import { Colors, Fonts } from "../../../constants/theme";

const palette = Colors.light;
const fontSans = Fonts.sans;

export const styles = StyleSheet.create({
  bigInput: {
    flex: 1,
    padding: 20,
    fontSize: 22,
    borderBottomColor: palette.text,
    borderBottomWidth: 2,
    marginRight: 12,
    borderWidth: 0,
    ...Platform.select({
      web: {
        outlineStyle: "none",
        outlineWidth: 0,
      },
    }),
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.canvas,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    width: 450,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: palette.text,
    fontFamily: fontSans,
  },
  chatButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: palette.text,
    // borderWidth: 1,
    // borderColor: palette.border,
    position: "absolute",
    right: 10,
  },
  chatButtonDisabled: {
    opacity: 0.6,
  },
  chatText: {
    color: palette.canvas,
    fontSize: 16,
    fontWeight: "700",
    fontFamily: fontSans,
  },
  animatedGif: {
    width: 26,
    height: 26,
  },
  errorText: {
    marginTop: 10,
    color: "#b91c1c",
    fontSize: 14,
    fontFamily: fontSans,
  },
});
