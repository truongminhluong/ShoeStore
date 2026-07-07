import { View, Text, FlatList, StyleSheet } from "react-native";
import PopularCard from "./PopularCard";
import { popularProducts } from "../../data/popularData";

export default function PopularSection() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Phổ biến nhất
      </Text>

      <FlatList
        horizontal
        data={popularProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PopularCard item={item} />
        )}
        ItemSeparatorComponent={() => (
          <View style={{ width: 15 }} />
        )}
        contentContainerStyle={{
          paddingHorizontal: 20,
        }}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 28,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#222",
    marginBottom: 16,
    paddingHorizontal: 20,
  },
});