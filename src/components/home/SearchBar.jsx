import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import COLORS from "../../constants/colors";

export default function SearchBar() {
  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <Ionicons
          name="search-outline"
          size={22}
          color={COLORS.gray}
        />

        <TextInput
          placeholder="Search shoes..."
          placeholderTextColor={COLORS.gray}
          style={styles.input}
        />
      </View>

      <TouchableOpacity style={styles.filterButton}>
        <Ionicons
          name="options-outline"
          size={24}
          color={COLORS.white}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },

  searchBox: {
    flex: 1,
    height: 55,
    backgroundColor: COLORS.white,
    borderRadius: 15,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 15,

    elevation: 2,
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },

  filterButton: {
    width: 55,
    height: 55,

    marginLeft: 12,

    borderRadius: 15,

    backgroundColor: COLORS.primary,

    justifyContent: "center",
    alignItems: "center",

    elevation: 2,
  },
});