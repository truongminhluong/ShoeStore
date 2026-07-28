import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";

import useProductReviewsViewModel from "../../viewmodels/useProductReviewsViewModel";

export default function ReviewSection({ productId }) {
  const { reviews, loading } = useProductReviewsViewModel(productId);

  const renderStars = (rating) => {
    return (
      <View style={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= rating ? "star" : "star-outline"}
            size={16}
            color="#F5A623"
          />
        ))}
      </View>
    );
  };

  const renderReview = ({ item }) => {
    return (
      <View style={styles.reviewItem}>
        {/* AVATAR */}
        {item.user?.avatar ? (
          <Image
            source={{
              uri: item.user.avatar,
            }}
            style={styles.avatar}
          />
        ) : (
          <View style={styles.avatar}>
            <Ionicons name="person" size={20} color="#666" />
          </View>
        )}

        {/* NỘI DUNG */}
        <View style={styles.reviewContent}>
          <Text style={styles.userName}>
            {item.user?.fullName || "Người dùng"}
          </Text>

          {renderStars(item.rating)}

          {item.comment && <Text style={styles.comment}>{item.comment}</Text>}

          <Text style={styles.date}>
            {new Date(item.createdAt).toLocaleDateString("vi-VN")}
          </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* TIÊU ĐỀ */}
      <View style={styles.header}>
        <Text style={styles.title}>Đánh giá sản phẩm</Text>

        <Text style={styles.count}>({reviews.length})</Text>
      </View>

      {reviews.length === 0 ? (
        <Text style={styles.empty}>Chưa có đánh giá nào</Text>
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item._id}
          renderItem={renderReview}
          scrollEnabled={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
  },

  count: {
    marginLeft: 6,
    fontSize: 16,
    color: "#777777",
  },

  reviewItem: {
    flexDirection: "row",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    marginRight: 12,
  },

  reviewContent: {
    flex: 1,
  },

  userName: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },

  stars: {
    flexDirection: "row",
    marginBottom: 6,
  },

  comment: {
    fontSize: 14,
    lineHeight: 20,
    color: "#444444",
  },

  date: {
    marginTop: 6,
    fontSize: 12,
    color: "#999999",
  },

  empty: {
    fontSize: 14,
    color: "#999999",
  },

  loading: {
    padding: 20,
    alignItems: "center",
  },
});
