import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";

import { SafeAreaView } from "react-native-safe-area-context";

import COLORS from "../../constants/colors";

import useCreateReviewViewModel from "../../viewmodels/useCreateReviewViewModel";

export default function CreateReviewScreen({ navigation, route }) {
  // =========================
  // NHẬN DỮ LIỆU TỪ MÀN ĐƠN HÀNG
  // =========================

  const { productId, orderId, productName = "Sản phẩm" } = route.params || {};

  // =========================
  // VIEW MODEL
  // =========================

  const {
    rating = 0,
    setRating,

    comment = "",
    setComment,

    loading,
    error,

    createReview,
  } = useCreateReviewViewModel();

  // =========================
  // GỬI ĐÁNH GIÁ
  // =========================

  const handleSubmitReview = async () => {
    if (!rating || rating < 1) {
      Alert.alert("Chưa chọn số sao", "Vui lòng chọn số sao đánh giá");

      return;
    }

    const result = await createReview({
      productId,
      orderId,
    });

    console.log("Kết quả:", result);

    if (result?.success) {
      Alert.alert("Đánh giá thành công", "Cảm ơn bạn đã đánh giá sản phẩm", [
        {
          text: "OK",
          onPress: () => {
            navigation.goBack();
          },
        },
      ]);

      return;
    }

    // Hiển thị lỗi backend trả về
    Alert.alert(
      "Không thể gửi đánh giá",
      result?.message || "Đã xảy ra lỗi, vui lòng thử lại",
    );
  };

  // =========================
  // HIỂN THỊ SAO
  // =========================

  const renderStars = () => {
    return (
      <View style={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            activeOpacity={0.7}
            onPress={() => {
              if (setRating) {
                setRating(star);
              }
            }}
          >
            <Ionicons
              name={star <= rating ? "star" : "star-outline"}
              size={38}
              color={star <= rating ? "#FBBF24" : "#D1D5DB"}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* HEADER */}

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={26} color="#111827" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Đánh giá sản phẩm</Text>

        <View style={styles.headerSpace} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* NỘI DUNG */}

        <View style={styles.content}>
          {/* SẢN PHẨM */}

          <View style={styles.productBox}>
            <Ionicons name="cube-outline" size={28} color={COLORS.primary} />

            <Text style={styles.productName} numberOfLines={2}>
              {productName}
            </Text>
          </View>

          {/* CHỌN SAO */}

          <Text style={styles.label}>Chất lượng sản phẩm</Text>

          {renderStars()}

          <Text style={styles.ratingText}>
            {rating === 0 ? "Chọn số sao" : `${rating}/5 sao`}
          </Text>

          {/* BÌNH LUẬN */}

          <Text style={styles.label}>Nhận xét của bạn</Text>

          <TextInput
            style={styles.commentInput}
            value={comment || ""}
            onChangeText={(text) => {
              if (setComment) {
                setComment(text);
              }
            }}
            placeholder={"Hãy chia sẻ cảm nhận của bạn về sản phẩm..."}
            placeholderTextColor="#9CA3AF"
            multiline
            maxLength={500}
            textAlignVertical="top"
          />

          <Text style={styles.characterCount}>
            {(comment || "").length}/500
          </Text>
        </View>

        {/* NÚT GỬI */}

        <View style={styles.bottom}>
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.disabledButton]}
            disabled={loading}
            onPress={handleSubmitReview}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="send-outline" size={19} color="#FFFFFF" />

                <Text style={styles.submitText}>Gửi đánh giá</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FB",
  },

  keyboardContainer: {
    flex: 1,
  },

  header: {
    height: 64,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8F9FB",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
  },

  headerTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#111827",
  },

  headerSpace: {
    width: 40,
  },

  content: {
    flex: 1,
    padding: 20,
  },

  productBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 14,
    marginBottom: 28,
    backgroundColor: "#FFFFFF",
  },

  productName: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "600",
    color: "#1F2937",
  },

  label: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 14,
  },

  stars: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },

  ratingText: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
    marginTop: 10,
    marginBottom: 30,
  },

  commentInput: {
    height: 145,
    padding: 15,
    borderRadius: 14,
    fontSize: 14,
    lineHeight: 21,
    color: "#1F2937",
    backgroundColor: "#FFFFFF",
  },

  characterCount: {
    alignSelf: "flex-end",
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 7,
  },

  bottom: {
    padding: 18,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
  },

  submitButton: {
    height: 52,
    borderRadius: 13,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    backgroundColor: COLORS.primary,
  },

  disabledButton: {
    opacity: 0.65,
  },

  submitText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
