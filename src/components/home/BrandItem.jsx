import { TouchableOpacity, View, Image, Text, StyleSheet } from "react-native";

export default function BrandItem({ item, onPress }) {
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View style={styles.logoContainer}>
        <Image
          source={{ uri: item.logo }}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Text numberOfLines={1} style={styles.name}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 12,
    height: 54,

    backgroundColor: "#FFFFFF",

    borderRadius: 18,

    borderWidth: 1,
    borderColor: "#E5E7EB",

    marginRight: 10,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,

    elevation: 2,
  },

  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,

    backgroundColor: "#FFFFFF",

    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    width: 24,
    height: 24,
  },

  name: {
    marginLeft: 10,

    color: "#1F2937",

    fontSize: 15,
    fontWeight: "600",
  },
});
