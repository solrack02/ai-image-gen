import { StyleSheet } from 'react-native';
import { Colors, Fonts } from '../../../constants/theme';

const palette = Colors.light;
const fontSans = Fonts.sans;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.canvas,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: palette.text,
    fontFamily: fontSans,
  },
});
