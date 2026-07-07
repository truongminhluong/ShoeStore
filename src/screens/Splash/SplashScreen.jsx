import { View, Text, StyleSheet, Image } from "react-native";
import COLORS from "../../constants/colors";

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      {/* <Image
        source={require("../../../assets/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      /> */}

      <Text style={styles.title}>Shoe Store</Text>

      <Text style={styles.subtitle}>
        Premium Sneakers Collection
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    width: 180,
    height: 180,
  },

  title: {
    marginTop: 20,
    fontSize: 34,
    fontWeight: "bold",
    color: COLORS.white,
    letterSpacing: 1,
  },

  subtitle: {
    marginTop: 10,
    color: "#D1D5DB",
    fontSize: 16,
  },
});