import { View, Text, FlatList, StyleSheet } from "react-native";
import ProductCard from "./ProductCard";
import { products } from "../../data/productData";

export default function ProductSection() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Hàng mới về</Text>
        <Text style={styles.more}>Xem tất cả</Text>
      </View>

      <FlatList
        horizontal
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProductCard item={item} />}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ width: 15 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 25,
  },

  header: {
    paddingHorizontal: 20,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  listContent: {
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#222",
  },

  more: {
    color: "#1157FF",
    fontWeight: "600",
    fontSize: 15,
  },
});