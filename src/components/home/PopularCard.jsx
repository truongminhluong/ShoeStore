import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

export default function PopularCard({ item }) {
  return (
    <TouchableOpacity activeOpacity={0.9} style={styles.card}>
      <Image source={item.image} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.title}>
          {item.title}
        </Text>

        <Text style={styles.description}>
          {item.description}
        </Text>

        <Text style={styles.more}>
          Xem ngay →
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 300,
    backgroundColor: "#fff",
    borderRadius: 18,
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: 120,
  },

  content: {
    padding: 16,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
  },

  description: {
    marginTop: 6,
    fontSize: 14,
    color: "#777",
    lineHeight: 22,
  },

  more: {
    marginTop: 12,
    color: "#1157FF",
    fontWeight: "700",
    fontSize: 16,
  },
});