import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import COLORS from "../../constants/colors";

export default function SearchBar({
  value = "",
  onChangeText,
  onClear,
  onFilterPress,
  hasActiveFilters,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={22} color={COLORS.gray} />

        <TextInput
          placeholder="Search shoes..."
          placeholderTextColor={COLORS.gray}
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />

        {value ? (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={onClear}
            activeOpacity={0.8}
          >
            <Ionicons name="close-circle" size={20} color={COLORS.gray} />
          </TouchableOpacity>
        ) : null}
      </View>

      <TouchableOpacity
        style={[
          styles.filterButton,
          hasActiveFilters && styles.activeFilterButton,
        ]}
        onPress={onFilterPress}
        activeOpacity={0.85}
      >
        <Ionicons
          name={hasActiveFilters ? "close-outline" : "options-outline"}
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
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.08)",
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: COLORS.black,
  },

  clearButton: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },

  filterButton: {
    width: 55,
    height: 55,
    marginLeft: 12,
    borderRadius: 15,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.08)",
  },

  activeFilterButton: {
    backgroundColor: COLORS.secondary,
  },
});
