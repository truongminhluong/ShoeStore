import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  View,
} from "react-native";

import BrandItem from "./BrandItem";
import useBrandViewModel from "../../viewmodels/useBrandViewModel";

export default function BrandSection() {
  const { brands, loading } = useBrandViewModel();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={brands}
        keyExtractor={(item) => item._id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
        renderItem={({ item }) => (
          <BrandItem
            item={item}
            onPress={() => {}}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 18,
  },

  content: {
    paddingHorizontal: 20,
    paddingRight: 10,
  },

  loadingContainer: {
    marginTop: 20,
    alignItems: "center",
  },
});