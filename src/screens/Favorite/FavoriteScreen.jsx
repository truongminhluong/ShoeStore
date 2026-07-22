import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import FONTS from "../../constants/fonts";

import ProductFavoriteItem from "../../components/favorite/ProductFavoriteItem";
import Header from "../../components/home/Header";
import favoriteData from "../../data/favoriteData";

const FavoriteScreen = () => {
  const [products, setProducts] = useState(favoriteData);

  const removeItem = (id) => {
    setProducts(products.filter((item) => item.id !== id));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Sản phẩm yêu thích</Text>
          </View>

          <View style={styles.right}>
            <View style={styles.count}>
              <Text style={styles.countText}>{products.length}</Text>
            </View>

            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="options" size={18} color={COLORS.gray} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="shuffle-outline" size={18} color={COLORS.gray} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.clear} onPress={() => setProducts([])}>
          <Ionicons name="trash-outline" size={17} color="#EF4444" />

          <Text style={styles.clearText}>Xóa tất cả</Text>
        </TouchableOpacity>

        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: "space-between",
          }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ProductFavoriteItem item={item} onRemove={removeItem} />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default FavoriteScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  container: {
    flex: 1,
    paddingHorizontal: 16,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  titleContainer: {
    flex: 1,
    justifyContent: "center",
  },

  title: {
    fontSize: 30,
    fontFamily: FONTS.bold,
    fontWeight: "700",
    color: COLORS.black,
    lineHeight: 38,
    width: "75%",
  },

  right: {
    flexDirection: "row",
    alignItems: "center",
  },

  count: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  countText: {
    color: COLORS.white,
    fontSize: 11,
    fontFamily: FONTS.bold,
  },

  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },

  clear: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",

    paddingVertical: 10,
    paddingHorizontal: 14,

    backgroundColor: "#F3F4F6", // nền xám nhạt
    borderRadius: 12,

    marginBottom: 20,

    // Android
    elevation: 3,

    // iOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },

  clearText: {
    marginLeft: 8,
    color: "#EF4444",
    fontSize: 14,
    fontFamily: FONTS.medium,
  },
});
