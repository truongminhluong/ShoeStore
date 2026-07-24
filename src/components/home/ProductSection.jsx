import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import ProductCard from "./ProductCard";
import useNewestProductsViewModel from "../../viewmodels/useNewestProductsViewModel";

export default function ProductSection(
  { favoriteIds, onToggleFavorite }
) {
  const { products, loading } = useNewestProductsViewModel();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1157FF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Hàng mới về</Text>
        <Text style={styles.more}>Xem tất cả</Text>
      </View>

      <FlatList
        horizontal
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) =>
          <ProductCard
            item={item}
            favoriteIds={favoriteIds}
            onToggleFavorite={onToggleFavorite}
          />}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ width: 15 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },

  loadingContainer: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
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