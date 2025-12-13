import { StyleSheet } from "react-native";
import { Colors, Fonts } from "../../../constants/theme";

const palette = Colors.dark;
const fontSans = Fonts.sans;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.canvas,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: palette.text,
    fontFamily: fontSans,
  },
});
