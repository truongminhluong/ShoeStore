import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

import ProductCard from "./ProductCard";

export default function ProductSection({
  products = [],
  loading = false,
  favoriteIds,
  onToggleFavorite,
  navigation,
}) {
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1157FF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Hàng mới về</Text>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate("AllProducts")}
        >
          <Text style={styles.more}>Xem tất cả</Text>
        </TouchableOpacity>
      </View>

      {/* PRODUCT LIST */}
      <FlatList
        horizontal
        data={products}
        keyExtractor={(item, index) =>
          item?._id?.toString() || index.toString()
        }
        renderItem={({ item }) => (
          <ProductCard
            item={item}
            favoriteIds={favoriteIds}
            onToggleFavorite={onToggleFavorite}
          />
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Chưa có sản phẩm mới</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 14,
  },

  title: {
    fontSize: 21,
    fontWeight: "800",
    color: "#0F172A",
  },

  more: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1157FF",
  },

  listContent: {
    paddingHorizontal: 20,
  },

  separator: {
    width: 15,
  },

  loadingContainer: {
    height: 300,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyContainer: {
    width: 300,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },

  emptyText: {
    fontSize: 14,
    color: "#64748B",
  },
});
