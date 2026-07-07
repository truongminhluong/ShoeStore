import { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

import { brands } from "../../data/brandData";
import BrandItem from "./BrandItem";

export default function BrandSection() {
  const [selectedId, setSelectedId] = useState("1");

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={brands}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        renderItem={({ item }) => (
          <BrandItem
            item={item}
            selected={item.id === selectedId}
            onPress={() => setSelectedId(item.id)}
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
});