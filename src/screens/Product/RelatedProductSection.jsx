import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from "react-native";

import ProductCard from "../../components/home/ProductCard";

import useRelatedProductsViewModel from "../../viewmodels/useRelatedProductsViewModel";

export default function RelatedProductSection({
  currentProductId,
}) {
  const {
    products,
    loading,
  } = useRelatedProductsViewModel(
    currentProductId
  );

  if (loading || products.length === 0) {
    return null;
  }

  return (
    <View>
      <Text style={styles.sectionTitle}>
        Có thể bạn sẽ thích
      </Text>

      <FlatList
        data={products}
        numColumns={2}
        scrollEnabled={false}
        keyExtractor={(item) => item._id}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item }) => (
          <ProductCard item={item} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#222",
    marginBottom: 16,
  },

  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
});