import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import ProductCard from "./ProductCard";
import COLORS from "../../constants/colors";

export default function ProductSection({
  products = [],
  searchText = "",
  selectedBrandName,
  onClearFilters,
}) {
  const hasFilters = Boolean(searchText.trim() || selectedBrandName);
  const title = hasFilters ? "Kết quả phù hợp" : "Hàng mới về";

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{title}</Text>

          {hasFilters ? (
            <Text style={styles.subtitle}>
              {products.length} sản phẩm được tìm thấy
            </Text>
          ) : null}
        </View>

        {hasFilters ? (
          <TouchableOpacity onPress={onClearFilters} activeOpacity={0.8}>
            <Text style={styles.more}>Đặt lại</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.more}>Xem tất cả</Text>
        )}
      </View>

      {products.length > 0 ? (
        <FlatList
          horizontal
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ProductCard item={item} />}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Không tìm thấy sản phẩm</Text>
          <Text style={styles.emptyText}>
            Thử đổi từ khóa hoặc chọn một logo thương hiệu khác.
          </Text>

          <TouchableOpacity
            style={styles.emptyButton}
            onPress={onClearFilters}
            activeOpacity={0.85}
          >
            <Text style={styles.emptyButtonText}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>
      )}
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
    alignItems: "flex-end",
  },

  titleBlock: {
    flex: 1,
    paddingRight: 14,
  },

  listContent: {
    paddingHorizontal: 20,
  },

  separator: {
    width: 15,
  },

  title: {
    fontSize: 28,
     fontWeight: "700",
    color: COLORS.black,
  },

  subtitle: {
    marginTop: 4,
    color: COLORS.gray,
    fontSize: 14,
    fontWeight: "600",
  },

  more: {
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: 15,
  },

  emptyCard: {
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    alignItems: "center",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.08)",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.black,
  },

  emptyText: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.gray,
    textAlign: "center",
  },

  emptyButton: {
    marginTop: 16,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
  },

  emptyButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "700",
  },
});