import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import COLORS from "../../constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Header() {
  return (
    <View style={styles.container}>
      <TouchableOpacity>
        <Ionicons
          name="menu-outline"
          size={28}
          color={COLORS.black}
        />
      </TouchableOpacity>

      <Text style={styles.logo}>KickStore</Text>

      <TouchableOpacity>
        <Ionicons
          name="search-outline"
          size={26}
          color={COLORS.black}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingHorizontal: 20,
  paddingVertical: 10,
},

  logo: {
    fontSize: 24,

    fontWeight: "bold",

    color: COLORS.black,
  },
});