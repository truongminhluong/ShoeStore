import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Alert } from "react-native";

import COLORS from "../../constants/colors";
import useProductDetailViewModel from "../../viewmodels/useProductDetailViewModel";
import RelatedProductSection from "../Product/RelatedProductSection";
import { useCart } from "../../context/CartContext";

export default function ProductDetailScreen({ route, navigation }) {
  const { productId } = route.params;

  const { addToCart } = useCart();

  const {
    product,
    colors,
    sizes,
    selectedColor,
    selectedSize,
    selectedVariant,
    loading,
    error,
    isSizeAvailable,
    handleSelectColor,
    handleSelectSize,
  } = useProductDetailViewModel(productId);

  const insets = useSafeAreaInsets();

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>Đang tải sản phẩm...</Text>
      </SafeAreaView>
    );
  }

  if (error || !product) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.errorText}>
          {error || "Không tìm thấy sản phẩm"}
        </Text>
      </SafeAreaView>
    );
  }

  const handleAddToCart = () => {
    if (!selectedVariant) {
      Alert.alert("Thông báo", "Vui lòng chọn màu sắc và kích thước sản phẩm");

      return;
    }

    addToCart(product, selectedVariant);

    console.log("Đã thêm vào giỏ hàng:", product.name, selectedVariant);

    Alert.alert("Thành công", "Đã thêm sản phẩm vào giỏ hàng");
  };

  // =========================
  // ẢNH HIỂN THỊ
  // =========================

  const displayImage =
    selectedVariant?.image || selectedColor?.image || product.image;

  // =========================
  // GIÁ HIỂN THỊ
  // =========================

  const displayPrice =
    product.discountPrice > 0 ? product.discountPrice : product.price;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* HEADER */}

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerButton}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Chi tiết sản phẩm</Text>

        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="heart-outline" size={25} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* ẢNH SẢN PHẨM */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: displayImage }}
            style={styles.productImage}
            resizeMode="cover"
          />
        </View>

        {/* THÔNG TIN SẢN PHẨM */}
        <View style={styles.infoContainer}>
          {/* THƯƠNG HIỆU + DANH MỤC */}
          <View style={styles.brandRow}>
            <Text style={styles.brandName}>{product.brand?.name}</Text>

            <Text style={styles.categoryName}>{product.category?.name}</Text>
          </View>

          {/* TÊN */}
          <Text style={styles.productName}>{product.name}</Text>

          {/* ĐÁNH GIÁ */}
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={18} color="#F59E0B" />

            <Text style={styles.ratingText}>{product.rating}</Text>

            <Text style={styles.soldText}>| Đã bán {product.sold}</Text>
          </View>

          {/* GIÁ */}
          <View style={styles.priceRow}>
            <Text style={styles.discountPrice}>
              {displayPrice.toLocaleString("vi-VN")}đ
            </Text>

            {product.discountPrice > 0 && (
              <Text style={styles.originalPrice}>
                {product.price.toLocaleString("vi-VN")}đ
              </Text>
            )}
          </View>

          {/* MÀU SẮC */}
          <Text style={styles.sectionTitle}>Màu sắc</Text>

          <View style={styles.colorList}>
            {colors.map((color) => {
              const isSelected = selectedColor?.colorCode === color.colorCode;

              return (
                <TouchableOpacity
                  key={color.colorCode}
                  style={[
                    styles.colorItem,
                    isSelected && styles.selectedColorItem,
                  ]}
                  onPress={() => handleSelectColor(color)}
                >
                  <View
                    style={[
                      styles.colorCircle,
                      {
                        backgroundColor: color.colorCode,
                      },
                    ]}
                  />

                  <Text
                    style={[
                      styles.colorName,
                      isSelected && styles.selectedText,
                    ]}
                  >
                    {color.colorName}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* SIZE */}
          <Text style={styles.sectionTitle}>Kích thước</Text>

          <View style={styles.sizeList}>
            {sizes.map((size) => {
              const available = isSizeAvailable(size);
              const isSelected = selectedSize === size;

              return (
                <TouchableOpacity
                  key={size}
                  disabled={!available}
                  style={[
                    styles.sizeItem,
                    isSelected && styles.selectedSizeItem,
                    !available && styles.disabledSizeItem,
                  ]}
                  onPress={() => handleSelectSize(size)}
                >
                  <Text
                    style={[
                      styles.sizeText,
                      isSelected && styles.selectedText,
                      !available && styles.disabledSizeText,
                    ]}
                  >
                    {size}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* TỒN KHO */}
          {selectedVariant && (
            <Text style={styles.stockText}>
              {selectedVariant.stock > 0
                ? `Còn ${selectedVariant.stock} sản phẩm`
                : "Hết hàng"}
            </Text>
          )}

          {/* MÔ TẢ */}
          <Text style={styles.sectionTitle}>Mô tả sản phẩm</Text>

          <Text style={styles.description}>{product.description}</Text>

          {/* CHÍNH SÁCH */}
          <View style={styles.policyContainer}>
            {/* MIỄN PHÍ GIAO HÀNG */}
            <View style={styles.policyBox}>
              <Ionicons name="car-outline" size={22} color={COLORS.primary} />

              <Text style={styles.policyTitle}>Miễn phí giao hàng</Text>
            </View>

            {/* ĐỔI TRẢ */}
            <View style={styles.policyBox}>
              <Ionicons
                name="refresh-outline"
                size={22}
                color={COLORS.primary}
              />

              <Text style={styles.policyTitle}>Đổi trả 30 ngày</Text>
            </View>
          </View>
        </View>

        {/* ĐÁNH GIÁ */}
        <View style={styles.reviewSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Đánh giá sản phẩm</Text>

            <TouchableOpacity>
              <Text style={styles.viewAllText}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.ratingSummary}>
            <Text style={styles.bigRating}>{product.rating}</Text>

            <View>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons key={star} name="star" size={18} color="#F59E0B" />
                ))}
              </View>

              <Text style={styles.reviewCount}>
                Dựa trên đánh giá của khách hàng
              </Text>
            </View>
          </View>

          {/* REVIEW DEMO */}
          <View style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>A</Text>
              </View>

              <View>
                <Text style={styles.reviewerName}>Nguyễn Văn A</Text>

                <View style={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons
                      key={star}
                      name="star"
                      size={13}
                      color="#F59E0B"
                    />
                  ))}
                </View>
              </View>
            </View>

            <Text style={styles.reviewText}>
              Sản phẩm đẹp, đi rất êm chân và đúng size.
            </Text>
          </View>
        </View>

        {/* SẢN PHẨM KHÁC */}
        <View style={styles.relatedSection}>
          <RelatedProductSection currentProductId={product._id} />
        </View>
      </ScrollView>

      {/* BUTTON THÊM VÀO GIỎ */}
      <View
        style={[
          styles.bottomContainer,
          {
            paddingBottom: insets.bottom + 12,
          },
        ]}
      >
        {/* THÊM VÀO GIỎ */}
        <TouchableOpacity
          style={[
            styles.cartButton,
            !selectedVariant && styles.disabledOutlineButton,
          ]}
          disabled={!selectedVariant}
          onPress={handleAddToCart}
        >
          <Ionicons
            name="cart-outline"
            size={22}
            color={selectedVariant ? COLORS.primary : "#9CA3AF"}
          />

          <Text
            style={[
              styles.cartButtonText,
              !selectedVariant && styles.disabledButtonText,
            ]}
          >
            Thêm vào giỏ
          </Text>
        </TouchableOpacity>

        {/* MUA NGAY */}
        <TouchableOpacity
          style={[styles.buyButton, !selectedVariant && styles.disabledButton]}
          disabled={!selectedVariant}
          onPress={() => {
            console.log("Mua ngay:", selectedVariant);
          }}
        >
          <Text style={styles.buyButtonText}>Mua ngay</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.textSecondary,
  },

  errorText: {
    fontSize: 16,
    color: "red",
  },

  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },

  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },

  content: {
    paddingBottom: 120,
  },

  imageContainer: {
    width: "100%",
    height: 380,
    backgroundColor: "#F5F7FA",
  },

  productImage: {
    width: "100%",
    height: "100%",
  },

  infoContainer: {
    padding: 20,
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  brandName: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
  },

  categoryName: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },

  productName: {
    marginTop: 8,
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text,
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  ratingText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: "600",
  },

  soldText: {
    marginLeft: 8,
    fontSize: 13,
    color: COLORS.textSecondary,
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },

  discountPrice: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.primary,
  },

  originalPrice: {
    marginLeft: 10,
    fontSize: 14,
    color: COLORS.textSecondary,
    textDecorationLine: "line-through",
  },

  description: {
    marginTop: 20,
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.textSecondary,
  },

  sectionTitle: {
    marginTop: 24,
    marginBottom: 12,
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },

  colorList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  colorItem: {
    minWidth: 90,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  selectedColorItem: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },

  colorCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    marginRight: 8,
  },

  colorName: {
    fontSize: 13,
    color: COLORS.text,
  },

  selectedText: {
    fontWeight: "700",
  },

  sizeList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  sizeItem: {
    width: 52,
    height: 44,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  selectedSizeItem: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },

  disabledSizeItem: {
    opacity: 0.35,
  },

  sizeText: {
    fontSize: 14,
    fontWeight: "600",
  },

  stockText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.textSecondary,
  },

  bottomContainer: {
    flexDirection: "row",
    gap: 12,

    paddingHorizontal: 20,
    paddingTop: 12,

    backgroundColor: COLORS.background,

    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },

  cartButton: {
    flex: 1,
    height: 56,

    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.primary,

    backgroundColor: COLORS.background,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 8,
  },

  cartButtonText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: "700",
  },

  buyButton: {
    flex: 1,
    height: 56,

    borderRadius: 16,

    backgroundColor: COLORS.primary,

    alignItems: "center",
    justifyContent: "center",
  },

  buyButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  addCartButton: {
    height: 56,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  disabledButton: {
    backgroundColor: "#BFC5D2",
  },

  disabledOutlineButton: {
    borderColor: "#BFC5D2",
  },

  disabledButtonText: {
    color: "#9CA3AF",
  },

  addCartText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  policyContainer: {
    marginTop: 24,
    flexDirection: "row",
    gap: 10,
  },

  policyBox: {
    flex: 1,
    height: 80,
    paddingHorizontal: 14,
    backgroundColor: "#F1F3FF",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  policyItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  policyContent: {
    marginLeft: 12,
    flex: 1,
  },

  policyTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
  },

  policyText: {
    marginTop: 4,
    fontSize: 12,
    color: COLORS.textSecondary,
  },

  reviewSection: {
    marginTop: 10,
    padding: 20,
    backgroundColor: "#FFFFFF",
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  viewAllText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: "600",
  },

  ratingSummary: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  bigRating: {
    fontSize: 40,
    fontWeight: "700",
    color: COLORS.text,
    marginRight: 16,
  },

  starsRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  reviewCount: {
    marginTop: 4,
    fontSize: 12,
    color: COLORS.textSecondary,
  },

  reviewCard: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },

  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  avatarText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },

  reviewerName: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
  },

  reviewText: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.textSecondary,
  },

  relatedSection: {
    marginTop: 10,
    padding: 20,
    backgroundColor: COLORS.background,
  },

  relatedProduct: {
    marginTop: 4,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
  },

  relatedImage: {
    width: "100%",
    height: 180,
  },

  relatedName: {
    padding: 12,
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
  },
});
