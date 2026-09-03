import React, { useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useCart } from "../../context/CartContext";
import COLORS from "../../constants/colors";

// =========================================================
// ASSET
// Dùng sneaker watermark giống Login / Account / Order
// =========================================================

const HEADER_SHOE = require("../../../assets/images/login-shoe.png");

// =========================================================
// DESIGN TOKENS
// =========================================================

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

  danger: "#64748B",
};

// =========================================================
// FORMAT PRICE
// =========================================================

const formatPrice = (price = 0) => {
  return `${Number(price).toLocaleString("vi-VN")}đ`;
};

// =========================================================
// HEADER
// =========================================================

function ScreenHeader({ itemCount, onBack }) {
  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        {/* BACK */}
        <TouchableOpacity
          style={styles.headerIconButton}
          onPress={onBack}
          activeOpacity={0.75}
          accessibilityRole="button"
          accessibilityLabel="Quay lại"
        >
          <Ionicons name="arrow-back" size={22} color={UI.ink} />
        </TouchableOpacity>

        {/* TITLE */}
        <View style={styles.headerTitleBlock}>
          <Text style={styles.headerTitle}>Giỏ hàng của bạn</Text>

          <Text style={styles.headerSubtitle}>
            Quản lý các sản phẩm bạn đã chọn
          </Text>

          <View style={styles.headerAccent} />
        </View>

        {/* COUNT */}
        <View
          style={styles.headerCount}
          accessible
          accessibilityLabel={`${itemCount} sản phẩm trong giỏ hàng`}
        >
          <Text style={styles.headerCountText}>{itemCount}</Text>
        </View>
      </View>

      {/* SNEAKER WATERMARK */}
      <Image
        source={HEADER_SHOE}
        style={styles.headerShoe}
        resizeMode="contain"
        pointerEvents="none"
      />
    </View>
  );
}

// =========================================================
// QUANTITY CONTROL
// =========================================================

function QuantityControl({ item, onDecrease, onIncrease }) {
  return (
    <View style={styles.quantityControl}>
      {/* MINUS */}
      <TouchableOpacity
        style={styles.quantityButton}
        onPress={onDecrease}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`Giảm số lượng ${item.name}`}
      >
        <Ionicons name="remove" size={17} color={UI.ink} />
      </TouchableOpacity>

      {/* NUMBER */}
      <Text
        style={styles.quantityText}
        accessibilityLabel={`Số lượng ${item.quantity}`}
      >
        {item.quantity}
      </Text>

      {/* PLUS */}
      <TouchableOpacity
        style={styles.quantityButton}
        onPress={onIncrease}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`Tăng số lượng ${item.name}`}
      >
        <Ionicons name="add" size={17} color={UI.ink} />
      </TouchableOpacity>
    </View>
  );
}

// =========================================================
// CART ITEM
// =========================================================

function CartItem({ item, onRemove, onDecrease, onIncrease }) {
  const itemTotal = item.price * item.quantity;

  return (
    <View style={styles.cartItem}>
      {/* PRODUCT IMAGE */}

      <View style={styles.productImageFrame}>
        <Image
          source={{
            uri: item.image,
          }}
          style={styles.productImage}
          resizeMode="contain"
          accessibilityLabel={`Ảnh ${item.name}`}
        />
      </View>

      {/* PRODUCT INFO */}

      <View style={styles.productInfo}>
        {/* TOP */}

        <View style={styles.productTopRow}>
          <View style={styles.productCopy}>
            <Text style={styles.productName} numberOfLines={2}>
              {item.name}
            </Text>

            <Text style={styles.variantText} numberOfLines={1}>
              {item.colorName} · Size {item.size}
            </Text>
          </View>

          {/* DELETE */}

          <TouchableOpacity
            style={styles.removeButton}
            onPress={onRemove}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={`Xóa ${item.name} khỏi giỏ hàng`}
          >
            <Ionicons name="trash-outline" size={19} color={UI.danger} />
          </TouchableOpacity>
        </View>

        {/* BOTTOM */}

        <View style={styles.productBottomRow}>
          <QuantityControl
            item={item}
            onDecrease={onDecrease}
            onIncrease={onIncrease}
          />

          <Text style={styles.itemPrice}>{formatPrice(itemTotal)}</Text>
        </View>
      </View>
    </View>
  );
}

// =========================================================
// BENEFIT ITEM
// =========================================================

function Benefit({ icon, title, subtitle }) {
  return (
    <View style={styles.benefit}>
      <View style={styles.benefitIcon}>
        <Ionicons name={icon} size={18} color={UI.blue} />
      </View>

      <Text style={styles.benefitTitle}>{title}</Text>

      <Text style={styles.benefitSubtitle}>{subtitle}</Text>
    </View>
  );
}

// =========================================================
// EMPTY CART
// =========================================================

function EmptyCart({ navigation, insets }) {
  return (
    <View
      style={[
        styles.screen,
        {
          paddingTop: insets.top,
        },
      ]}
    >
      <ScreenHeader itemCount={0} onBack={() => navigation.goBack()} />

      <View style={styles.emptyContent}>
        {/* ICON */}

        <View style={styles.emptyMark}>
          <Ionicons name="bag-handle-outline" size={34} color={UI.blue} />
        </View>

        {/* EYEBROW */}

        <Text style={styles.emptyEyebrow}>YOUR CART</Text>

        {/* TITLE */}

        <Text style={styles.emptyTitle}>Giỏ hàng đang trống</Text>

        {/* DESCRIPTION */}

        <Text style={styles.emptyText}>
          Bạn chưa thêm sản phẩm nào. Khám phá những mẫu giày mới nhất của
          RydeStore nhé.
        </Text>

        {/* CTA */}

        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.primaryButton}
          onPress={() => navigation.navigate("Home")}
          accessibilityRole="button"
          accessibilityLabel="Tiếp tục mua sắm"
        >
          <Text style={styles.primaryButtonText}>Tiếp tục mua sắm</Text>

          <Ionicons name="arrow-forward" size={19} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// =========================================================
// MAIN SCREEN
// =========================================================

export default function CartScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity } =
    useCart();

  // =========================================================
  // CALCULATE SUMMARY
  // =========================================================

  const summary = useMemo(() => {
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const shippingFee = cartItems.length > 0 ? 35000 : 0;

    const tax = subtotal * 0.08;

    const total = subtotal + shippingFee + tax;

    return {
      subtotal,
      shippingFee,
      tax,
      total,
    };
  }, [cartItems]);

  // =========================================================
  // EMPTY
  // =========================================================

  if (cartItems.length === 0) {
    return <EmptyCart navigation={navigation} insets={insets} />;
  }

  // =========================================================
  // RENDER ITEM
  // =========================================================

  const renderItem = ({ item }) => {
    return (
      <CartItem
        item={item}
        onRemove={() => removeFromCart(item.productId, item.variantId)}
        onDecrease={() => decreaseQuantity(item.productId, item.variantId)}
        onIncrease={() => increaseQuantity(item.productId, item.variantId)}
      />
    );
  };

  // =========================================================
  // MAIN
  // =========================================================

  return (
    <View
      style={[
        styles.screen,
        {
          paddingTop: insets.top,
        },
      ]}
    >
      {/* HEADER */}

      <ScreenHeader
        itemCount={cartItems.length}
        onBack={() => navigation.goBack()}
      />

      {/* LIST */}

      <FlatList
        data={cartItems}
        keyExtractor={(item) => `${item.productId}-${item.variantId}`}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,
          {
            paddingBottom: Math.max(insets.bottom, 24) + 16,
          },
        ]}
        // =====================================================
        // LIST HEADER
        // =====================================================

        ListHeaderComponent={
          <View style={styles.listIntro}>
            <Text style={styles.sectionEyebrow}>ĐÃ CHỌN</Text>

            <Text style={styles.sectionTitle}>
              {cartItems.length} sản phẩm trong giỏ
            </Text>
          </View>
        }
        // =====================================================
        // FOOTER
        // =====================================================

        ListFooterComponent={
          <View>
            {/* =================================================
                SUMMARY
            ================================================= */}

            <View style={styles.summaryContainer}>
              {/* SUMMARY HEADER */}

              <View style={styles.summaryHeader}>
                <View>
                  <Text style={styles.sectionEyebrow}>CHECKOUT</Text>

                  <Text style={styles.summaryTitle}>Tóm tắt đơn hàng</Text>
                </View>

                {/* SECURE */}

                <View style={styles.secureBadge}>
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={15}
                    color={UI.blue}
                  />

                  <Text style={styles.secureBadgeText}>An toàn</Text>
                </View>
              </View>

              {/* SUMMARY ROWS */}

              <View style={styles.summaryRows}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Tạm tính</Text>

                  <Text style={styles.summaryValue}>
                    {formatPrice(summary.subtotal)}
                  </Text>
                </View>

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Phí vận chuyển</Text>

                  <Text style={styles.summaryValue}>
                    {formatPrice(summary.shippingFee)}
                  </Text>
                </View>

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Thuế VAT (8%)</Text>

                  <Text style={styles.summaryValue}>
                    {formatPrice(summary.tax)}
                  </Text>
                </View>
              </View>

              {/* DIVIDER */}

              <View style={styles.totalDivider} />

              {/* TOTAL */}

              <View style={styles.totalRow}>
                <View>
                  <Text style={styles.totalLabel}>Tổng cộng</Text>

                  <Text style={styles.totalHint}>Đã bao gồm VAT</Text>
                </View>

                <Text style={styles.totalValue}>
                  {formatPrice(summary.total)}
                </Text>
              </View>

              {/* PAYMENT */}

              <TouchableOpacity
                style={styles.paymentButton}
                onPress={() => navigation.navigate("Checkout")}
                activeOpacity={0.86}
                accessibilityRole="button"
                accessibilityLabel={`Thanh toán ${formatPrice(summary.total)}`}
              >
                <Text style={styles.paymentText}>Thanh toán ngay</Text>

                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
              </TouchableOpacity>

              {/* NOTE */}

              <Text style={styles.checkoutNote}>
                Bạn có thể kiểm tra lại địa chỉ và phương thức thanh toán ở bước
                tiếp theo.
              </Text>
            </View>

            {/* =================================================
                BENEFITS
            ================================================= */}

            <View style={styles.benefits}>
              <Benefit
                icon="shield-checkmark-outline"
                title="Chính hãng"
                subtitle="100% cam kết"
              />

              <Benefit
                icon="car-outline"
                title="Giao hàng"
                subtitle="Toàn quốc"
              />

              <Benefit
                icon="refresh-outline"
                title="Đổi trả"
                subtitle="Trong 30 ngày"
              />
            </View>
          </View>
        }
      />
    </View>
  );
}

// =========================================================
// STYLES
// =========================================================

const styles = StyleSheet.create({
  // =========================================================
  // SCREEN
  // =========================================================

  screen: {
    flex: 1,
    backgroundColor: UI.background,
  },

  // =========================================================
  // HEADER
  // =========================================================

  header: {
    position: "relative",
    minHeight: 138,
    overflow: "hidden",

    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 10,
  },

  headerTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    minHeight: 112,
  },

  headerIconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,

    backgroundColor: UI.surface,

    borderWidth: 1,
    borderColor: UI.line,

    justifyContent: "center",
    alignItems: "center",

    zIndex: 3,
  },

  headerTitleBlock: {
    flex: 1,

    marginLeft: 14,
    paddingTop: 2,

    zIndex: 2,
  },

  headerTitle: {
    color: UI.ink,

    fontSize: 29,
    lineHeight: 35,

    fontWeight: "800",

    letterSpacing: -0.7,
  },

  headerSubtitle: {
    color: UI.muted,

    fontSize: 14,
    lineHeight: 20,

    marginTop: 3,

    maxWidth: 245,
  },

  headerAccent: {
    width: 32,
    height: 3,

    borderRadius: 2,

    backgroundColor: UI.blue,

    marginTop: 12,
  },

  headerCount: {
    minWidth: 40,
    height: 40,

    paddingHorizontal: 11,

    borderRadius: 20,

    backgroundColor: UI.blueSoft,

    justifyContent: "center",
    alignItems: "center",

    zIndex: 3,
  },

  headerCountText: {
    color: UI.blue,

    fontSize: 14,

    fontWeight: "800",
  },

  headerShoe: {
    position: "absolute",

    width: 220,
    height: 145,

    right: -30,
    top: 38,

    opacity: 0.1,

    zIndex: 1,
  },

  // =========================================================
  // LIST
  // =========================================================

  listContent: {
    paddingHorizontal: 16,
  },

  listIntro: {
    paddingHorizontal: 4,
    paddingBottom: 14,
  },

  sectionEyebrow: {
    color: UI.blue,

    fontSize: 10,
    lineHeight: 14,

    fontWeight: "800",

    letterSpacing: 1.2,
  },

  sectionTitle: {
    color: UI.ink,

    fontSize: 18,
    lineHeight: 24,

    fontWeight: "700",

    marginTop: 2,
  },

  // =========================================================
  // CART ITEM
  // =========================================================

  cartItem: {
    flexDirection: "row",

    backgroundColor: UI.surface,

    borderWidth: 1,
    borderColor: UI.line,

    borderRadius: 20,

    padding: 12,

    marginBottom: 12,
  },

  productImageFrame: {
    width: 106,
    height: 106,

    borderRadius: 15,

    backgroundColor: "#F6F7F9",

    overflow: "hidden",

    justifyContent: "center",
    alignItems: "center",
  },

  productImage: {
    width: "100%",
    height: "100%",
  },

  productInfo: {
    flex: 1,

    minWidth: 0,

    marginLeft: 14,

    justifyContent: "space-between",

    paddingVertical: 1,
  },

  productTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  productCopy: {
    flex: 1,
    minWidth: 0,
  },

  productName: {
    color: UI.ink,

    fontSize: 15,
    lineHeight: 20,

    fontWeight: "700",

    paddingRight: 4,
  },

  variantText: {
    color: UI.muted,

    fontSize: 12,
    lineHeight: 18,

    marginTop: 5,
  },

  // =========================================================
  // DELETE
  // =========================================================

  removeButton: {
    width: 44,
    height: 44,

    marginTop: -5,
    marginRight: -5,

    justifyContent: "center",
    alignItems: "center",
  },

  // =========================================================
  // BOTTOM PRODUCT ROW
  // =========================================================

  productBottomRow: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    marginTop: 12,
  },

  // =========================================================
  // QUANTITY
  // =========================================================

  quantityControl: {
    height: 44,

    minWidth: 118,

    borderWidth: 1,
    borderColor: UI.line,

    borderRadius: 14,

    backgroundColor: UI.surface,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    paddingHorizontal: 2,
  },

  quantityButton: {
    width: 40,
    height: 40,

    borderRadius: 12,

    justifyContent: "center",
    alignItems: "center",
  },

  quantityText: {
    minWidth: 28,

    textAlign: "center",

    color: UI.ink,

    fontSize: 14,

    fontWeight: "700",
  },

  itemPrice: {
    color: UI.blue,

    fontSize: 14,
    lineHeight: 19,

    fontWeight: "800",

    marginLeft: 8,
  },

  // =========================================================
  // SUMMARY
  // =========================================================

  summaryContainer: {
    backgroundColor: UI.surface,

    borderWidth: 1,
    borderColor: UI.line,

    borderRadius: 22,

    padding: 20,

    marginTop: 8,
  },

  summaryHeader: {
    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "flex-start",
  },

  summaryTitle: {
    color: UI.ink,

    fontSize: 20,
    lineHeight: 26,

    fontWeight: "800",

    marginTop: 2,
  },

  secureBadge: {
    flexDirection: "row",

    alignItems: "center",

    backgroundColor: UI.blueSoft,

    borderRadius: 20,

    paddingHorizontal: 10,

    height: 30,

    marginLeft: 10,
  },

  secureBadgeText: {
    color: UI.blue,

    fontSize: 11,

    fontWeight: "700",

    marginLeft: 4,
  },

  summaryRows: {
    marginTop: 22,
  },

  summaryRow: {
    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    marginBottom: 14,
  },

  summaryLabel: {
    color: UI.muted,

    fontSize: 13,

    lineHeight: 19,
  },

  summaryValue: {
    color: UI.inkSoft,

    fontSize: 13,

    lineHeight: 19,

    fontWeight: "600",
  },

  totalDivider: {
    height: 1,

    backgroundColor: UI.line,

    marginTop: 1,

    marginBottom: 17,
  },

  totalRow: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    marginBottom: 18,
  },

  totalLabel: {
    color: UI.ink,

    fontSize: 16,
    lineHeight: 21,

    fontWeight: "800",
  },

  totalHint: {
    color: UI.subtle,

    fontSize: 11,
    lineHeight: 16,

    marginTop: 2,
  },

  totalValue: {
    color: UI.blue,

    fontSize: 20,
    lineHeight: 26,

    fontWeight: "800",

    letterSpacing: -0.3,
  },

  // =========================================================
  // PAYMENT BUTTON
  // =========================================================

  paymentButton: {
    minHeight: 54,

    borderRadius: 15,

    backgroundColor: UI.navy,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    paddingHorizontal: 18,

    gap: 9,
  },

  paymentText: {
    color: "#FFFFFF",

    fontSize: 15,
    lineHeight: 20,

    fontWeight: "800",
  },

  checkoutNote: {
    color: UI.subtle,

    textAlign: "center",

    fontSize: 11,
    lineHeight: 16,

    marginTop: 12,

    paddingHorizontal: 8,
  },

  // =========================================================
  // BENEFITS
  // =========================================================

  benefits: {
    flexDirection: "row",

    backgroundColor: UI.surface,

    borderWidth: 1,
    borderColor: UI.line,

    borderRadius: 20,

    paddingVertical: 16,
    paddingHorizontal: 8,

    marginTop: 12,
    marginBottom: 8,
  },

  benefit: {
    flex: 1,

    alignItems: "center",

    paddingHorizontal: 3,
  },

  benefitIcon: {
    width: 36,
    height: 36,

    borderRadius: 18,

    backgroundColor: UI.blueSoft,

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 7,
  },

  benefitTitle: {
    color: UI.ink,

    fontSize: 10,
    lineHeight: 14,

    fontWeight: "800",

    textAlign: "center",
  },

  benefitSubtitle: {
    color: UI.subtle,

    fontSize: 9,
    lineHeight: 13,

    textAlign: "center",

    marginTop: 1,
  },

  // =========================================================
  // EMPTY CART
  // =========================================================

  emptyContent: {
    flex: 1,

    alignItems: "center",

    justifyContent: "center",

    paddingHorizontal: 34,

    paddingBottom: 50,
  },

  emptyMark: {
    width: 82,
    height: 82,

    borderRadius: 41,

    backgroundColor: UI.blueSoft,

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 20,
  },

  emptyEyebrow: {
    color: UI.blue,

    fontSize: 10,

    fontWeight: "800",

    letterSpacing: 1.5,

    marginBottom: 5,
  },

  emptyTitle: {
    color: UI.ink,

    fontSize: 24,
    lineHeight: 31,

    fontWeight: "800",

    letterSpacing: -0.5,

    textAlign: "center",
  },

  emptyText: {
    color: UI.muted,

    fontSize: 14,
    lineHeight: 22,

    textAlign: "center",

    marginTop: 11,

    maxWidth: 330,
  },

  primaryButton: {
    minHeight: 54,

    width: "100%",

    borderRadius: 15,

    backgroundColor: UI.navy,

    flexDirection: "row",

    justifyContent: "center",

    alignItems: "center",

    gap: 9,

    marginTop: 26,

    paddingHorizontal: 20,
  },

  primaryButtonText: {
    color: "#FFFFFF",

    fontSize: 15,
    lineHeight: 20,

    fontWeight: "800",
  },
});
