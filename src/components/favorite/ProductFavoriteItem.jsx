import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import COLORS from "../../constants/colors";
import FONTS from "../../constants/fonts";

const ProductFavoriteItem = ({ item, onRemove }) => {
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: item.image }}
        style={styles.image}
      />

      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() => onRemove(item._id)}
      >
        <Ionicons
          name="heart"
          size={18}
          color="#E53935"
        />
      </TouchableOpacity>

      <View style={styles.body}>
        <View style={styles.brandRow}>
          <Text style={styles.brandName}>{item?.brand?.name || "Brand"}</Text>

          <Text style={styles.categoryName}>{item?.category?.name || "Category"}</Text>
        </View>

        <Text
          numberOfLines={2}
          style={styles.name}
        >
          {item.name}
        </Text>
        <View style={styles.ratingRow}>
          <Ionicons
            name="star"
            size={15}
            color="#FFB800"
          />

          <Text style={styles.rating}>
            {item?.rating || 0}
          </Text>
        </View>

        <View style={styles.bottom}>
          <Text style={styles.price}>
            {(item?.discountPrice > 0
              ? item.discountPrice
              : item?.price || 0
            ).toLocaleString("vi-VN")} đ
          </Text>

          {/* NÚT THÊM VÀO GIỎ */}
          <TouchableOpacity style={styles.cartButton}>
            <Ionicons
              name="cart-outline"
              size={18}
              color={COLORS.white}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ProductFavoriteItem;

const styles = StyleSheet.create({
  card: {
    width: "48%",
    backgroundColor: COLORS.white,
    borderRadius: 14,
    marginBottom: 18,
    overflow: "hidden",
    elevation: 2,
  },

  image: {
    width: "100%",
    height: 140,
    resizeMode: "cover",
  },

  favoriteButton: {
    position: "absolute",
    top: 10,
    right: 10,

    width: 34,
    height: 34,

    borderRadius: 17,

    backgroundColor: COLORS.white,

    justifyContent: "center",
    alignItems: "center",
  },

  body: {
    padding: 12,
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  brandName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#999",
  },

  categoryName: {
    fontSize: 13,
    color: "#999",
  },


  // brand: {
  //   fontSize: 12,
  //   color: "#999",
  //   fontWeight: "600",
  //   textTransform: "uppercase",
  // },

  name: {
    fontSize: 18,
    color: COLORS.black,
    fontFamily: FONTS.bold,
    fontWeight: "700",
    marginTop: 6,
    minHeight: 35,
  },

  bottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  rating: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
  },


  price: {
    color: COLORS.primary,
    fontSize: 18,
    fontFamily: FONTS.bold,
    fontWeight: "700",
  },

  cartButton: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
});