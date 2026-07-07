import { TouchableOpacity, Text, StyleSheet } from "react-native";
import COLORS from "../../constants/colors";

export default function CustomButton({
  title,
  onPress,
}) {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,
    height: 55,
    borderRadius: 12,

    justifyContent: "center",
    alignItems: "center",
  },

  text: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "600",
  },
});