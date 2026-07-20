import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

export default function ProductCard({ item }) {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate("ProductDetail", {
      productId: item._id,
    });
  };

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={handlePress}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.image}
          resizeMode="cover"
        />

        <TouchableOpacity style={styles.favoriteButton}>
          <Ionicons
            name="heart-outline"
            size={22}
            color="#222"
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.category}>
        {item.category?.name}
      </Text>

      <Text
        style={styles.name}
        numberOfLines={2}
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
          {item.rating}
        </Text>
      </View>

      <Text style={styles.price}>
        {(item.discountPrice || item.price).toLocaleString(
          "vi-VN"
        )}{" "}
        đ
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: (width - 55) / 2,
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
  },

  imageContainer: {
    width: "100%",
    height: 180,
    backgroundColor: "#F5F7FA",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  favoriteButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  category: {
    fontSize: 12,
    color: "#999",
    fontWeight: "600",
    textTransform: "uppercase",
    marginTop: 10,
    marginHorizontal: 12,
  },

  name: {
    fontSize: 17,
    fontWeight: "700",
    color: "#222",
    marginTop: 4,
    marginHorizontal: 12,
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginHorizontal: 12,
  },

  rating: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
  },

  price: {
    color: "#1157FF",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 8,
    marginBottom: 12,
    marginHorizontal: 12,
  },
});