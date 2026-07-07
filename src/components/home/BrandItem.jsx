import { TouchableOpacity, View, Image, Text, StyleSheet } from "react-native";
import COLORS from "../../constants/colors";

export default function BrandItem({
  item,
  selected,
  onPress,
}) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        selected && styles.selectedContainer,
      ]}
      onPress={onPress}
    >
      <View style={styles.logoContainer}>
        <Image
          source={item.logo}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {selected && (
        <Text style={styles.name}>
          {item.name}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 58,
    paddingHorizontal: 8,
    borderRadius: 28,

    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",

    marginRight: 12,
  },

  selectedContainer: {
    backgroundColor: "#5A9BEF",
  },

  logoContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,

    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    width: 32,
    height: 32,
  },

  name: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
    marginRight: 8,
  },
});