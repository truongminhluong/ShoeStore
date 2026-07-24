import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import FONTS from "../../constants/fonts";

import Header from "../../components/home/Header";
import ProductFavoriteItem from "../../components/favorite/ProductFavoriteItem";
import { useFavorite } from "../../context/FavoriteContext";

const normalizeFavorites = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.data?.products)) {
    return payload.data.products;
  }

  if (Array.isArray(payload?.products)) {
    return payload.products;
  }

  if (Array.isArray(payload?.favorites)) {
    return payload.favorites;
  }

  return [];
};

const FavoriteScreen = () => {

  const [deleting, setDeleting] = useState(false);
  const {
    favorites,
    loading,
    fetchFavorites,
    removeFromFavorite,
    clearAllFavorites,
  } = useFavorite();
  // useEffect(() => {
  //   fetchFavorites_();
  // }, []);

  // const fetchFavorites_ = async () => {
  //   try {
  //     setLoading(true);

  //     await fetchFavorites();

  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const removeItem = (id) => {
    Alert.alert(
      "Xóa sản phẩm",
      "Bạn có chắc muốn xóa sản phẩm khỏi danh sách yêu thích?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              setDeleting(true);

              await removeFromFavorite(id);
            } catch (error) {
              console.log(error.response?.data || error.message);
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
        />
      </SafeAreaView>
    );
  }

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
              <Text style={styles.countText}>
                {favorites.length}
              </Text>
            </View>

            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="options" size={18} color={COLORS.gray} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconButton}>
              <Ionicons
                name="shuffle-outline"
                size={17}
                color={COLORS.gray}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Xóa tất cả */}

        <TouchableOpacity
          style={styles.clear}
          onPress={() => {
            Alert.alert(
              "Xóa tất cả",
              "Bạn có chắc muốn xóa toàn bộ sản phẩm yêu thích?",
              [
                {
                  text: "Hủy",
                  style: "cancel",
                },
                {
                  text: "Xóa",
                  style: "destructive",
                  onPress: clearAllFavorites,
                },
              ]
            );
          }}
        >
          <Ionicons
            name="trash-outline"
            size={17}
            color="#EF4444"
          />

          <Text style={styles.clearText}>Xóa tất cả</Text>
        </TouchableOpacity>

        {/* Danh sách */}
        {deleting && (
          <ActivityIndicator
            size="small"
            color={COLORS.primary}
            style={{ marginBottom: 10 }}
          />
        )}

        <FlatList
          data={favorites}
          keyExtractor={(item, index) => item?._id || item?.id || `favorite-${index}`}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={{
            justifyContent: "space-between",
          }}
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
