import React, { useMemo, useState } from "react";

import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import useProductDetailViewModel from "../../viewmodels/useProductDetailViewModel";
import RelatedProductSection from "../Product/RelatedProductSection";
import ReviewSection from "../../components/product/ReviewSection";

import { useCart } from "../../context/CartContext";
import { useFavorite } from "../../context/FavoriteContext";

import { getImageSource } from "../../utils/imageHelper";

/* =========================================================
   RYDE DESIGN SYSTEM
========================================================= */

const UI = {
  background: "#FAFAF9",
  surface: "#FFFFFF",

  ink: "#0F1B33",
  inkSoft: "#334155",
  muted: "#64748B",
  subtle: "#94A3B8",

  line: "#E7EAF0",

  blue: "#2563EB",
  blueSoft: "#EFF5FF",

  navy: "#071A3A",

  star: "#F59E0B",

  disabled: "#CBD5E1",
};

/* =========================================================
   PRODUCT DETAIL
========================================================= */

export default function ProductDetailScreen({ route, navigation }) {
  const productId = route?.params?.productId;

  const insets = useSafeAreaInsets();

  const { addToCart } = useCart();
  const { favoriteIds, toggleFavorite } = useFavorite();

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

  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

  /* =========================================================
     FAVORITE
  ========================================================= */

  const isFavorite =
    Array.isArray(favoriteIds) && favoriteIds.includes(product?._id);

  /* =========================================================
     PRICE
  ========================================================= */

  const displayPrice = useMemo(() => {
    if (Number(product?.discountPrice) > 0) {
      return Number(product.discountPrice);
    }

    return Number(product?.price) || 0;
  }, [product]);

  const hasDiscount = Number(product?.discountPrice) > 0;

  /* =========================================================
     IMAGE
  ========================================================= */

  const displayImage =
    selectedVariant?.image || selectedColor?.image || product?.image || "";

  /* =========================================================
     DESCRIPTION
  ========================================================= */

  const description = product?.description || "Mô tả đang được cập nhật.";

  const shouldCollapseDescription = description.length > 180;

  const displayedDescription =
    shouldCollapseDescription && !descriptionExpanded
      ? `${description.slice(0, 180).trim()}...`
      : description;

  /* =========================================================
     ADD CART
  ========================================================= */

  const handleAddToCart = () => {
    if (!selectedVariant) {
      Alert.alert(
        "Chọn sản phẩm",
        "Vui lòng chọn màu sắc và kích thước sản phẩm.",
      );
      return;
    }

    addToCart(product, selectedVariant);

    Alert.alert(
      "Đã thêm vào giỏ",
      `${product.name} đã được thêm vào giỏ hàng.`,
    );
  };

  /* =========================================================
     BUY NOW
  ========================================================= */

  const handleBuyNow = () => {
    if (!selectedVariant) {
      Alert.alert(
        "Chọn sản phẩm",
        "Vui lòng chọn màu sắc và kích thước sản phẩm.",
      );
      return;
    }

    navigation.navigate("Checkout", {
      isBuyNow: true,
      items: [
        {
          product,
          variant: selectedVariant,
          quantity: 1,
        },
      ],
    });
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <View style={styles.loadingIcon}>
          <ActivityIndicator size="small" color={UI.blue} />
        </View>

        <Text style={styles.loadingTitle}>Đang tải sản phẩm</Text>

        <Text style={styles.loadingSubtitle}>
          Vui lòng chờ trong giây lát...
        </Text>
      </SafeAreaView>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error || !product) {
    return (
      <SafeAreaView style={styles.center}>
        <View style={styles.errorIcon}>
          <Ionicons name="alert-circle-outline" size={32} color={UI.blue} />
        </View>

        <Text style={styles.errorTitle}>Không tìm thấy sản phẩm</Text>

        <Text style={styles.errorSubtitle}>
          {error || "Sản phẩm có thể đã bị xóa hoặc không còn khả dụng."}
        </Text>

        <TouchableOpacity
          style={styles.errorButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.85}
        >
          <Text style={styles.errorButtonText}>Quay lại</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  /* =========================================================
     UI
  ========================================================= */

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {/* =====================================================
    RYDE HEADER
===================================================== */}

      <View style={styles.header}>
        <View style={styles.headerTop}>
          {/* BACK */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.headerButton}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={22} color={UI.ink} />
          </TouchableOpacity>

          {/* TITLE */}
          <View style={styles.headerTitleBlock}>
            <Text style={styles.headerEyebrow}>PRODUCT</Text>

            <Text style={styles.headerTitle}>Chi tiết sản phẩm</Text>

            <Text style={styles.headerSubtitle}>
              Khám phá sản phẩm bạn yêu thích
            </Text>

            <View style={styles.headerAccent} />
          </View>

          {/* FAVORITE */}
          <TouchableOpacity
            style={[
              styles.headerFavorite,
              isFavorite && styles.headerFavoriteActive,
            ]}
            disabled={!product?._id}
            onPress={() => {
              if (!product?._id) return;
              toggleFavorite(product._id);
            }}
            activeOpacity={0.8}
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={22}
              color={isFavorite ? "#E53935" : UI.ink}
            />
          </TouchableOpacity>
        </View>

        {/* WATERMARK */}
        <Image
          source={getImageSource(displayImage)}
          style={styles.headerShoe}
          resizeMode="contain"
        />
      </View>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: insets.bottom + 125,
          },
        ]}
      >
        {/* ===================================================
            PRODUCT IMAGE
        =================================================== */}

        <View style={styles.imageSection}>
          <View style={styles.imageBadge}>
            <Text style={styles.imageBadgeText}>RYDE SELECT</Text>
          </View>

          <Image
            source={getImageSource(displayImage)}
            style={styles.productImage}
            resizeMode="contain"
          />

          <View style={styles.imageBottomLabel}>
            <View style={styles.imageDot} />

            <Text style={styles.imageBottomText}>AUTHENTIC PRODUCT</Text>
          </View>
        </View>

        {/* ===================================================
            PRODUCT INFO
        =================================================== */}

        <View style={styles.infoContainer}>
          {/* BRAND */}

          <View style={styles.brandRow}>
            <Text style={styles.brandName}>
              {product?.brand?.name || "BRAND"}
            </Text>

            <View style={styles.brandDivider} />

            <Text style={styles.categoryName}>
              {product?.category?.name || "SNEAKER"}
            </Text>
          </View>

          {/* NAME */}

          <Text style={styles.productName}>{product?.name || "Sản phẩm"}</Text>

          {/* RATING */}

          <View style={styles.ratingRow}>
            <View style={styles.ratingStars}>
              <Ionicons name="star" size={15} color={UI.star} />

              <Text style={styles.ratingValue}>{product?.rating || 0}</Text>
            </View>

            <View style={styles.ratingDivider} />

            <Text style={styles.soldText}>Đã bán {product?.sold || 0}</Text>
          </View>

          {/* PRICE */}

          <View style={styles.priceBlock}>
            <Text style={styles.discountPrice}>
              {displayPrice.toLocaleString("vi-VN")}đ
            </Text>

            {hasDiscount && (
              <View style={styles.discountRow}>
                <Text style={styles.originalPrice}>
                  {Number(product?.price || 0).toLocaleString("vi-VN")}đ
                </Text>

                <View style={styles.discountBadge}>
                  <Text style={styles.discountBadgeText}>SALE</Text>
                </View>
              </View>
            )}
          </View>

          {/* =================================================
              COLOR
          ================================================= */}

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionEyebrow}>SELECT</Text>

                <Text style={styles.sectionTitle}>Màu sắc</Text>
              </View>

              {selectedColor && (
                <Text style={styles.selectedValue}>
                  {selectedColor.colorName}
                </Text>
              )}
            </View>

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
                    activeOpacity={0.8}
                  >
                    <View
                      style={[
                        styles.colorCircleOuter,
                        isSelected && styles.selectedColorCircleOuter,
                      ]}
                    >
                      <View
                        style={[
                          styles.colorCircle,
                          {
                            backgroundColor: color.colorCode,
                          },
                        ]}
                      />
                    </View>

                    <Text
                      style={[
                        styles.colorName,
                        isSelected && styles.selectedText,
                      ]}
                    >
                      {color.colorName}
                    </Text>

                    {isSelected && (
                      <Ionicons name="checkmark" size={15} color={UI.blue} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* =================================================
              SIZE
          ================================================= */}

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionEyebrow}>SELECT</Text>

                <Text style={styles.sectionTitle}>Kích thước</Text>
              </View>

              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.sizeGuide}>Hướng dẫn size</Text>
              </TouchableOpacity>
            </View>

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
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.sizeText,
                        isSelected && styles.selectedSizeText,
                        !available && styles.disabledSizeText,
                      ]}
                    >
                      {size}
                    </Text>

                    {!available && <View style={styles.sizeDisabledLine} />}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* STOCK */}

            {selectedVariant && (
              <View
                style={[
                  styles.stockContainer,
                  selectedVariant.stock <= 0 && styles.stockOutContainer,
                ]}
              >
                <View
                  style={[
                    styles.stockDot,
                    selectedVariant.stock <= 0 && styles.stockOutDot,
                  ]}
                />

                <Text
                  style={[
                    styles.stockText,
                    selectedVariant.stock <= 0 && styles.stockOutText,
                  ]}
                >
                  {selectedVariant.stock > 0
                    ? `Còn ${selectedVariant.stock} sản phẩm`
                    : "Sản phẩm đã hết hàng"}
                </Text>
              </View>
            )}
          </View>

          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <View style={styles.descriptionSection}>
            <Text style={styles.sectionEyebrow}>DETAILS</Text>

            <Text style={styles.sectionTitle}>Mô tả sản phẩm</Text>

            <Text style={styles.description}>{displayedDescription}</Text>

            {shouldCollapseDescription && (
              <TouchableOpacity
                style={styles.readMoreButton}
                onPress={() => setDescriptionExpanded((prev) => !prev)}
                activeOpacity={0.7}
              >
                <Text style={styles.readMoreText}>
                  {descriptionExpanded ? "Thu gọn" : "Xem thêm"}
                </Text>

                <Ionicons
                  name={descriptionExpanded ? "chevron-up" : "chevron-down"}
                  size={15}
                  color={UI.blue}
                />
              </TouchableOpacity>
            )}
          </View>

          {/* =================================================
              BENEFITS
          ================================================= */}

          <View style={styles.benefitsContainer}>
            <Benefit
              icon="car-outline"
              title="Miễn phí giao hàng"
              subtitle="Đơn hàng tiêu chuẩn"
            />

            <View style={styles.benefitDivider} />

            <Benefit
              icon="refresh-outline"
              title="Đổi trả 30 ngày"
              subtitle="Đổi size dễ dàng"
            />

            <View style={styles.benefitDivider} />

            <Benefit
              icon="shield-checkmark-outline"
              title="Chính hãng"
              subtitle="Cam kết RYDE"
            />
          </View>
        </View>

        {/* ===================================================
            REVIEWS
        =================================================== */}

        <ReviewSection productId={product._id} />

        {/* ===================================================
            RELATED PRODUCTS
        =================================================== */}

        <View style={styles.relatedSection}>
          <View style={styles.relatedHeader}>
            <View>
              <Text style={styles.sectionEyebrow}>DISCOVER</Text>

              <Text style={styles.relatedTitle}>Có thể bạn sẽ thích</Text>
            </View>

            <Ionicons name="arrow-forward" size={20} color={UI.ink} />
          </View>

          <RelatedProductSection currentProductId={product?._id} />
        </View>
      </ScrollView>

      {/* =====================================================
          BOTTOM CTA
      ===================================================== */}

      <View
        style={[
          styles.bottomContainer,
          {
            paddingBottom: Math.max(insets.bottom, 12) + 8,
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.cartButton,
            !selectedVariant && styles.disabledOutlineButton,
          ]}
          disabled={!selectedVariant}
          onPress={handleAddToCart}
          activeOpacity={0.85}
        >
          <Ionicons
            name="bag-add-outline"
            size={21}
            color={selectedVariant ? UI.navy : UI.subtle}
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

        <TouchableOpacity
          style={[styles.buyButton, !selectedVariant && styles.disabledButton]}
          disabled={!selectedVariant}
          onPress={handleBuyNow}
          activeOpacity={0.9}
        >
          <Text style={styles.buyButtonText}>MUA NGAY</Text>

          <Ionicons name="arrow-forward" size={19} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* =========================================================
   BENEFIT COMPONENT
========================================================= */

function Benefit({ icon, title, subtitle }) {
  return (
    <View style={styles.benefit}>
      <View style={styles.benefitIcon}>
        <Ionicons name={icon} size={17} color={UI.blue} />
      </View>

      <View style={styles.benefitContent}>
        <Text style={styles.benefitTitle}>{title}</Text>

        <Text style={styles.benefitSubtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  /* =======================================================
     BASE
  ======================================================= */

  container: {
    flex: 1,
    backgroundColor: UI.background,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: UI.background,
    paddingHorizontal: 32,
  },

  /* =======================================================
     LOADING
  ======================================================= */

  loadingIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: UI.blueSoft,
  },

  loadingTitle: {
    marginTop: 16,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "800",
    color: UI.ink,
  },

  loadingSubtitle: {
    marginTop: 5,
    fontSize: 13,
    lineHeight: 19,
    color: UI.muted,
  },

  /* =======================================================
     ERROR
  ======================================================= */

  errorIcon: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: UI.blueSoft,
  },

  errorTitle: {
    marginTop: 18,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "800",
    color: UI.ink,
    textAlign: "center",
  },

  errorSubtitle: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    color: UI.muted,
    textAlign: "center",
  },

  errorButton: {
    marginTop: 24,
    height: 50,
    paddingHorizontal: 28,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: UI.navy,
  },

  errorButtonText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  /* =======================================================
   HEADER — SAME STYLE AS CART
======================================================= */

  header: {
    minHeight: 138,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor: UI.surface,
    overflow: "hidden",
  },

  headerTop: {
    minHeight: 112,
    flexDirection: "row",
    alignItems: "center",
  },

  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: UI.surface,
    borderWidth: 1,
    borderColor: UI.line,
  },

  headerTitleBlock: {
    flex: 1,
    marginLeft: 14,
    zIndex: 2,
  },

  headerEyebrow: {
    fontSize: 9,
    lineHeight: 13,
    fontWeight: "900",
    letterSpacing: 1.5,
    color: UI.blue,
  },

  headerTitle: {
    marginTop: 1,
    fontSize: 27,
    lineHeight: 33,
    fontWeight: "800",
    letterSpacing: -0.7,
    color: UI.ink,
  },

  headerSubtitle: {
    marginTop: 2,
    fontSize: 13,
    lineHeight: 19,
    color: UI.muted,
  },

  headerAccent: {
    width: 32,
    height: 3,
    marginTop: 8,
    borderRadius: 2,
    backgroundColor: UI.blue,
  },

  headerFavorite: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: UI.surface,
    borderWidth: 1,
    borderColor: UI.line,
    zIndex: 3,
  },

  headerFavoriteActive: {
    backgroundColor: "#FFF5F5",
    borderColor: "#FFE0E0",
  },

  headerShoe: {
    position: "absolute",
    width: 220,
    height: 145,
    right: -30,
    top: 38,
    opacity: 0.08,
  },

  /* =======================================================
     CONTENT
  ======================================================= */

  content: {
    paddingBottom: 20,
  },

  /* =======================================================
     IMAGE
  ======================================================= */

  imageSection: {
    height: 390,
    marginHorizontal: 16,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#F3F5F7",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },

  productImage: {
    width: "92%",
    height: "86%",
  },

  imageBadge: {
    position: "absolute",
    zIndex: 2,
    left: 16,
    top: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: UI.surface,
  },

  imageBadgeText: {
    fontSize: 9,
    lineHeight: 12,
    fontWeight: "900",
    letterSpacing: 1.1,
    color: UI.ink,
  },

  imageBottomLabel: {
    position: "absolute",
    left: 16,
    bottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  imageDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
    backgroundColor: UI.blue,
  },

  imageBottomText: {
    fontSize: 8,
    lineHeight: 11,
    fontWeight: "800",
    letterSpacing: 1,
    color: UI.muted,
  },

  /* =======================================================
     INFO
  ======================================================= */

  infoContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  brandName: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: "900",
    letterSpacing: 1.2,
    color: UI.blue,
    textTransform: "uppercase",
  },

  brandDivider: {
    width: 3,
    height: 3,
    marginHorizontal: 8,
    borderRadius: 2,
    backgroundColor: UI.subtle,
  },

  categoryName: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: "600",
    color: UI.muted,
  },

  productName: {
    marginTop: 8,
    fontSize: 27,
    lineHeight: 33,
    fontWeight: "800",
    letterSpacing: -0.7,
    color: UI.ink,
  },

  /* =======================================================
     RATING
  ======================================================= */

  ratingRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  ratingStars: {
    flexDirection: "row",
    alignItems: "center",
  },

  ratingValue: {
    marginLeft: 5,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "800",
    color: UI.ink,
  },

  ratingDivider: {
    width: 1,
    height: 14,
    marginHorizontal: 10,
    backgroundColor: UI.line,
  },

  soldText: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "500",
    color: UI.muted,
  },

  /* =======================================================
     PRICE
  ======================================================= */

  priceBlock: {
    marginTop: 17,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: UI.line,
  },

  discountPrice: {
    fontSize: 25,
    lineHeight: 31,
    fontWeight: "900",
    letterSpacing: -0.3,
    color: UI.blue,
  },

  discountRow: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
  },

  originalPrice: {
    fontSize: 12,
    lineHeight: 17,
    color: UI.subtle,
    textDecorationLine: "line-through",
  },

  discountBadge: {
    marginLeft: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 5,
    backgroundColor: "#FFF1F1",
  },

  discountBadgeText: {
    fontSize: 8,
    lineHeight: 11,
    fontWeight: "900",
    letterSpacing: 0.8,
    color: "#E53935",
  },

  /* =======================================================
     SECTIONS
  ======================================================= */

  section: {
    paddingTop: 22,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },

  sectionEyebrow: {
    fontSize: 9,
    lineHeight: 13,
    fontWeight: "900",
    letterSpacing: 1.4,
    color: UI.blue,
  },

  sectionTitle: {
    marginTop: 3,
    fontSize: 17,
    lineHeight: 23,
    fontWeight: "800",
    color: UI.ink,
  },

  selectedValue: {
    marginBottom: 2,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "700",
    color: UI.inkSoft,
  },

  /* =======================================================
     COLORS
  ======================================================= */

  colorList: {
    marginTop: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9,
  },

  colorItem: {
    minHeight: 48,
    paddingHorizontal: 11,
    borderRadius: 13,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: UI.line,
    backgroundColor: UI.surface,
  },

  selectedColorItem: {
    borderColor: UI.blue,
    backgroundColor: UI.blueSoft,
  },

  colorCircleOuter: {
    width: 27,
    height: 27,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: UI.surface,
  },

  selectedColorCircleOuter: {
    borderColor: UI.blue,
  },

  colorCircle: {
    width: 19,
    height: 19,
    borderRadius: 10,
  },

  colorName: {
    marginLeft: 8,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "600",
    color: UI.inkSoft,
  },

  selectedText: {
    fontWeight: "800",
    color: UI.ink,
  },

  /* =======================================================
     SIZE
  ======================================================= */

  sizeGuide: {
    marginBottom: 2,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "700",
    color: UI.blue,
  },

  sizeList: {
    marginTop: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  sizeItem: {
    width: 54,
    height: 48,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: UI.line,
    backgroundColor: UI.surface,
    position: "relative",
  },

  selectedSizeItem: {
    borderColor: UI.navy,
    backgroundColor: UI.navy,
  },

  disabledSizeItem: {
    opacity: 0.4,
  },

  sizeText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700",
    color: UI.ink,
  },

  selectedSizeText: {
    color: "#FFFFFF",
  },

  disabledSizeText: {
    color: UI.muted,
  },

  sizeDisabledLine: {
    position: "absolute",
    width: 30,
    height: 1,
    backgroundColor: UI.subtle,
    transform: [{ rotate: "-35deg" }],
  },

  /* =======================================================
     STOCK
  ======================================================= */

  stockContainer: {
    marginTop: 12,
    paddingHorizontal: 11,
    paddingVertical: 9,
    alignSelf: "flex-start",
    borderRadius: 9,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDF4",
  },

  stockOutContainer: {
    backgroundColor: "#FFF1F2",
  },

  stockDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 7,
    backgroundColor: "#16A34A",
  },

  stockOutDot: {
    backgroundColor: "#E11D48",
  },

  stockText: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "700",
    color: "#15803D",
  },

  stockOutText: {
    color: "#BE123C",
  },

  /* =======================================================
     DESCRIPTION
  ======================================================= */

  descriptionSection: {
    marginTop: 25,
    paddingTop: 21,
    borderTopWidth: 1,
    borderTopColor: UI.line,
  },

  description: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 22,
    color: UI.inkSoft,
  },

  readMoreButton: {
    marginTop: 9,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },

  readMoreText: {
    marginRight: 4,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "800",
    color: UI.blue,
  },

  /* =======================================================
     BENEFITS
  ======================================================= */

  benefitsContainer: {
    marginTop: 24,
    paddingVertical: 15,
    paddingHorizontal: 8,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "stretch",
    backgroundColor: UI.blueSoft,
  },

  benefit: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  benefitIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: UI.surface,
  },

  benefitContent: {
    marginTop: 7,
    alignItems: "center",
  },

  benefitTitle: {
    fontSize: 9,
    lineHeight: 13,
    fontWeight: "900",
    textAlign: "center",
    color: UI.ink,
  },

  benefitSubtitle: {
    marginTop: 1,
    fontSize: 8,
    lineHeight: 12,
    fontWeight: "500",
    textAlign: "center",
    color: UI.subtle,
  },

  benefitDivider: {
    width: 1,
    marginVertical: 3,
    backgroundColor: "#DCE7FA",
  },

  /* =======================================================
     REVIEW
  ======================================================= */

  reviewSection: {
    marginTop: 28,
    paddingHorizontal: 20,
  },

  sectionTitleOutside: {
    marginBottom: 8,
  },

  outsideTitle: {
    marginTop: 3,
    fontSize: 19,
    lineHeight: 25,
    fontWeight: "800",
    color: UI.ink,
  },

  /* =======================================================
     RELATED
  ======================================================= */

  relatedSection: {
    marginTop: 30,
    paddingTop: 25,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: UI.line,
  },

  relatedHeader: {
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  relatedTitle: {
    marginTop: 3,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "800",
    letterSpacing: -0.3,
    color: UI.ink,
  },

  /* =======================================================
     BOTTOM CTA
  ======================================================= */

  bottomContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: UI.background,
    borderTopWidth: 1,
    borderTopColor: UI.line,
  },

  cartButton: {
    flex: 1,
    minHeight: 54,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    backgroundColor: UI.surface,
    borderWidth: 1.3,
    borderColor: UI.navy,
  },

  cartButtonText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "800",
    color: UI.navy,
  },

  buyButton: {
    flex: 1.15,
    minHeight: 54,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: UI.navy,
  },

  buyButtonText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "900",
    letterSpacing: 0.5,
    color: "#FFFFFF",
  },

  disabledButton: {
    backgroundColor: UI.disabled,
  },

  disabledOutlineButton: {
    borderColor: UI.disabled,
  },

  disabledButtonText: {
    color: UI.subtle,
  },
});
