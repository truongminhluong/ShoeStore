import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";

const { width } = Dimensions.get("window");

export default function ProductCard({ item }) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.card}
    >

      <View style={styles.imageContainer}>

        <Image
          source={{
            uri: item.image,
          }}
          style={styles.image}
          resizeMode="cover"
        />


        <TouchableOpacity style={styles.favorite}>

          <Ionicons
            name={
              item.favorite
                ? "heart"
                : "heart-outline"
            }
            size={20}
            color="#222"
          />

        </TouchableOpacity>

      </View>


      <View style={styles.info}>


        <Text style={styles.category}>
          {item.category?.name}
        </Text>


        <Text
          style={styles.name}
          numberOfLines={1}
        >
          {item.name}
        </Text>


        <Text style={styles.brand}>
          {item.brand?.name}
        </Text>


        <View style={styles.bottomRow}>

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

            {
              item.discountPrice
                ? item.discountPrice.toLocaleString("vi-VN")
                : item.price.toLocaleString("vi-VN")
            }

            đ

          </Text>


        </View>


      </View>

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


  favorite: {
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


  info: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },


  category: {
    fontSize: 12,
    color: "#999",
    fontWeight: "600",
    textTransform: "uppercase",
  },


  brand: {
    marginTop: 4,
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },


  name: {
    fontSize: 17,
    fontWeight: "700",
    color: "#222",
    marginTop: 4,
  },


  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
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
    color: "#1157FF",
    fontSize: 16,
    fontWeight: "700",
  },

});