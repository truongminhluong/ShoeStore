import { FlatList, StyleSheet, View } from "react-native";

import { brands } from "../../data/brandData";
import BrandItem from "./BrandItem";

export default function BrandSection({ selectedBrandId, onSelectBrand }) {
  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={brands}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <BrandItem
            item={item}
            selected={item.id === selectedBrandId}
            onPress={() => onSelectBrand(item)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },

  listContent: {
    paddingHorizontal: 20,
  },
});
