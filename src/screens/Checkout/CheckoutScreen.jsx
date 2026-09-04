import React, { useCallback, useState } from "react";

import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";

import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

import { createOrderApi } from "../../services/orderService";
import { getAddressesApi } from "../../services/addressService";
import { createVnpayPaymentApi } from "../../services/vnpayService";

// =========================================================
// ASSET
// =========================================================

const HEADER_SHOE = require("../../../assets/images/login-shoe.png");

// =========================================================
// DESIGN TOKENS
// Đồng bộ trực tiếp với CartScreen
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
  success: "#16A34A",
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

function ScreenHeader({ onBack }) {
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
          <Text style={styles.headerTitle}>Thanh toán</Text>

          <Text style={styles.headerSubtitle}>Hoàn tất đơn hàng của bạn</Text>

          <View style={styles.headerAccent} />
        </View>

        {/* CHECK */}

        <View style={styles.headerCheck}>
          <Ionicons name="shield-checkmark-outline" size={19} color={UI.blue} />
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
// STEP
// =========================================================

function Step({ number, title, active = false, completed = false }) {
  return (
    <View style={styles.step}>
      <View
        style={[
          styles.stepNumber,
          active && styles.stepNumberActive,
          completed && styles.stepNumberCompleted,
        ]}
      >
        {completed ? (
          <Ionicons name="checkmark" size={15} color="#FFFFFF" />
        ) : (
          <Text
            style={[
              styles.stepNumberText,
              active && styles.stepNumberTextActive,
            ]}
          >
            {number}
          </Text>
        )}
      </View>

      <Text
        style={[styles.stepTitle, active && styles.stepTitleActive]}
        numberOfLines={1}
      >
        {title}
      </Text>
    </View>
  );
}

// =========================================================
// PROGRESS
// =========================================================

function CheckoutProgress() {
  return (
    <View style={styles.progressContainer}>
      <Step number="1" title="Địa chỉ" completed />

      <View style={styles.progressLine} />

      <Step number="2" title="Thanh toán" active />

      <View style={styles.progressLine} />

      <Step number="3" title="Hoàn tất" />
    </View>
  );
}

// =========================================================
// SECTION TITLE
// =========================================================

function SectionHeader({ eyebrow, title, right }) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionHeaderText}>
        {eyebrow ? <Text style={styles.sectionEyebrow}>{eyebrow}</Text> : null}

        <Text style={styles.sectionTitle}>{title}</Text>
      </View>

      {right ? right : null}
    </View>
  );
}

// =========================================================
// ADDRESS
// =========================================================

function AddressCard({ address, onPress }) {
  if (!address) {
    return (
      <TouchableOpacity
        style={styles.addressEmpty}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.addressIcon}>
          <Ionicons name="location-outline" size={22} color={UI.blue} />
        </View>

        <View style={styles.addressEmptyCopy}>
          <Text style={styles.addressEmptyTitle}>Chưa chọn địa chỉ</Text>

          <Text style={styles.addressEmptyText}>
            Chọn địa chỉ giao hàng để tiếp tục
          </Text>
        </View>

        <Ionicons name="chevron-forward" size={20} color={UI.subtle} />
      </TouchableOpacity>
    );
  }

  const fullAddress = [
    address.addressDetail,
    address.ward,
    address.district,
    address.province,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <TouchableOpacity
      style={styles.addressCard}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.addressIcon}>
        <Ionicons name="location-outline" size={22} color={UI.blue} />
      </View>

      <View style={styles.addressContent}>
        <View style={styles.addressNameRow}>
          <Text style={styles.addressName} numberOfLines={1}>
            {address.fullName}
          </Text>

          {address.isDefault ? (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultBadgeText}>MẶC ĐỊNH</Text>
            </View>
          ) : null}
        </View>

        <Text style={styles.addressPhone}>{address.phone}</Text>

        <Text style={styles.addressText} numberOfLines={2}>
          {fullAddress}
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={20} color={UI.subtle} />
    </TouchableOpacity>
  );
}

// =========================================================
// PAYMENT OPTION
// =========================================================

function PaymentOption({ icon, title, subtitle, selected, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.paymentOption, selected && styles.paymentOptionSelected]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View
        style={[styles.paymentIcon, selected && styles.paymentIconSelected]}
      >
        <Ionicons
          name={icon}
          size={21}
          color={selected ? UI.blue : UI.inkSoft}
        />
      </View>

      <View style={styles.paymentCopy}>
        <Text style={styles.paymentTitle}>{title}</Text>

        <Text style={styles.paymentSubtitle}>{subtitle}</Text>
      </View>

      <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
        {selected ? <View style={styles.radioInner} /> : null}
      </View>
    </TouchableOpacity>
  );
}

// =========================================================
// PRODUCT ITEM
// =========================================================

function CheckoutProduct({ item, isBuyNow }) {
  const product = isBuyNow ? item.product : null;

  const name = isBuyNow ? product?.name : item.name;

  const image = isBuyNow ? product?.images?.[0] || product?.image : item.image;

  const price = isBuyNow
    ? Number(product?.discountPrice) > 0
      ? Number(product.discountPrice)
      : Number(product?.price || 0)
    : Number(item.price || 0);

  const color = isBuyNow
    ? item.colorName || item.variant?.colorName
    : item.colorName;

  const size = isBuyNow ? item.size || item.variant?.size : item.size;

  return (
    <View style={styles.productItem}>
      <View style={styles.checkoutProductImage}>
        {image ? (
          <Image
            source={{ uri: image }}
            style={styles.checkoutProductImageInner}
            resizeMode="contain"
          />
        ) : (
          <Ionicons name="image-outline" size={28} color={UI.subtle} />
        )}
      </View>

      <View style={styles.checkoutProductInfo}>
        <Text style={styles.checkoutProductName} numberOfLines={2}>
          {name || "Sản phẩm"}
        </Text>

        <Text style={styles.checkoutProductVariant} numberOfLines={1}>
          {color || "Màu mặc định"}
          {size ? ` · Size ${size}` : ""}
        </Text>

        <View style={styles.checkoutProductBottom}>
          <View style={styles.quantityBadge}>
            <Text style={styles.quantityBadgeText}>x{item.quantity}</Text>
          </View>

          <Text style={styles.checkoutProductPrice}>
            {formatPrice(price * item.quantity)}
          </Text>
        </View>
      </View>
    </View>
  );
}

// =========================================================
// SUMMARY ROW
// =========================================================

function SummaryRow({ label, value, highlight = false }) {
  return (
    <View style={styles.summaryRow}>
      <Text
        style={[styles.summaryLabel, highlight && styles.summaryLabelHighlight]}
      >
        {label}
      </Text>

      <Text
        style={[styles.summaryValue, highlight && styles.summaryValueHighlight]}
      >
        {value}
      </Text>
    </View>
  );
}

// =========================================================
// TRUST ITEM
// =========================================================

function TrustItem({ icon, title, subtitle }) {
  return (
    <View style={styles.trustItem}>
      <View style={styles.trustIcon}>
        <Ionicons name={icon} size={17} color={UI.blue} />
      </View>

      <Text style={styles.trustTitle}>{title}</Text>

      <Text style={styles.trustSubtitle}>{subtitle}</Text>
    </View>
  );
}

// =========================================================
// MAIN
// =========================================================

export default function CheckoutScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();

  const { cartItems, clearCart } = useCart();

  const { token } = useAuth();

  const params = route?.params || {};

  const isBuyNow = params.isBuyNow ?? false;

  const buyNowItems = params.items ?? [];

  const checkoutItems = isBuyNow ? buyNowItems : cartItems;

  // =========================================================
  // STATE
  // =========================================================

  const [selectedAddress, setSelectedAddress] = useState(null);

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("cod");

  const [selectedVoucher, setSelectedVoucher] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // =========================================================
  // LOAD ADDRESS
  // =========================================================

  const loadDefaultAddress = useCallback(async () => {
    try {
      if (!token) return;

      const response = await getAddressesApi(token);

      const addresses = response?.data || [];

      const defaultAddress =
        addresses.find((address) => address.isDefault) || addresses[0] || null;

      setSelectedAddress(defaultAddress);
    } catch (error) {
      console.log(
        "❌ Lỗi load địa chỉ:",
        error?.response?.data || error?.message,
      );
    }
  }, [token]);

  // =========================================================
  // FOCUS
  // =========================================================

  useFocusEffect(
    useCallback(() => {
      loadDefaultAddress();

      const voucher = route?.params?.selectedVoucher;

      if (voucher) {
        setSelectedVoucher(voucher);

        navigation.setParams({
          selectedVoucher: undefined,
        });
      }
    }, [loadDefaultAddress, route?.params?.selectedVoucher, navigation]),
  );

  // =========================================================
  // CALCULATE
  // =========================================================

  const subtotal = checkoutItems.reduce((total, item) => {
    if (isBuyNow) {
      const price =
        Number(item?.product?.discountPrice) > 0
          ? Number(item.product.discountPrice)
          : Number(item?.product?.price || 0);

      return total + price * Number(item.quantity || 0);
    }

    return total + Number(item.price || 0) * Number(item.quantity || 0);
  }, 0);

  const shippingFee = checkoutItems.length > 0 ? 35000 : 0;

  const tax = subtotal * 0.08;

  const discount = Number(selectedVoucher?.discount || 0);

  const total = Math.max(0, subtotal + shippingFee + tax - discount);

  // =========================================================
  // ADDRESS SCREEN
  // =========================================================

  const handleSelectAddress = () => {
    navigation.navigate("Address", {
      fromCheckout: true,
    });
  };

  // =========================================================
  // VOUCHER
  // =========================================================

  const handleSelectVoucher = () => {
    navigation.navigate("Voucher", {
      selectedVoucher,
    });
  };

  // =========================================================
  // PLACE ORDER
  // =========================================================

  const handlePlaceOrder = async () => {
    if (isSubmitting) return;

    if (!checkoutItems.length) {
      Alert.alert(
        "Giỏ hàng trống",
        "Vui lòng chọn sản phẩm trước khi thanh toán.",
      );
      return;
    }

    if (!token) {
      Alert.alert(
        "Yêu cầu đăng nhập",
        "Vui lòng đăng nhập để tiếp tục đặt hàng.",
      );
      return;
    }

    if (!selectedAddress) {
      Alert.alert("Chưa có địa chỉ", "Vui lòng chọn địa chỉ giao hàng.", [
        {
          text: "Chọn địa chỉ",
          onPress: handleSelectAddress,
        },
        {
          text: "Hủy",
          style: "cancel",
        },
      ]);
      return;
    }

    try {
      setIsSubmitting(true);

      // =====================================================
      // ORDER ITEMS
      // =====================================================

      const orderItems = checkoutItems.map((item) => ({
        product: isBuyNow ? item.product?._id : item.productId,

        variant: isBuyNow ? item.variant?._id : item.variantId,

        quantity: item.quantity,
      }));

      // =====================================================
      // ADDRESS
      // =====================================================

      const shippingAddress = {
        fullName: selectedAddress.fullName,
        phone: selectedAddress.phone,

        address: [
          selectedAddress.addressDetail,
          selectedAddress.ward,
          selectedAddress.district,
          selectedAddress.province,
        ]
          .filter(Boolean)
          .join(", "),
      };

      // =====================================================
      // ORDER DATA
      // =====================================================

      const orderData = {
        items: orderItems,

        shippingAddress,

        subtotal,

        shippingFee,

        tax,

        discount,

        total,

        voucher: selectedVoucher?._id || null,

        paymentMethod: selectedPaymentMethod,
      };

      console.log("🛒 ORDER DATA:", JSON.stringify(orderData, null, 2));

      // =====================================================
      // CREATE ORDER
      // =====================================================

      const response = await createOrderApi(orderData, token);

      const order = response?.data;

      console.log("✅ ORDER CREATED:", order);

      if (!order?._id) {
        throw new Error("Không nhận được mã đơn hàng.");
      }

      // =====================================================
      // COD
      // =====================================================

      if (selectedPaymentMethod === "cod") {
        if (!isBuyNow) {
          clearCart();
        }

        navigation.replace("OrderSuccess", {
          orderId: order._id,
        });

        return;
      }

      // =====================================================
      // VNPAY
      // =====================================================

      if (selectedPaymentMethod === "vnpay") {
        console.log("💳 Đang tạo URL thanh toán VNPAY...");

        const paymentResponse = await createVnpayPaymentApi(order._id, token);

        console.log("💳 VNPAY RESPONSE:", paymentResponse);

        const paymentUrl = paymentResponse?.data?.paymentUrl;

        if (!paymentUrl) {
          throw new Error("Không nhận được URL thanh toán VNPAY.");
        }

        navigation.navigate("VnpayPayment", {
          paymentUrl,
          orderId: order._id,
        });

        return;
      }
    } catch (error) {
      console.log(
        "❌ ĐẶT HÀNG THẤT BẠI:",
        error?.response?.data || error?.message,
      );

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Không thể tạo đơn hàng. Vui lòng thử lại.";

      Alert.alert("Đặt hàng thất bại", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================================================
  // BUTTON LABEL
  // =========================================================

  const paymentButtonText =
    selectedPaymentMethod === "vnpay" ? "Thanh toán VNPAY" : "Đặt hàng";

  // =========================================================
  // RENDER
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
      {/* =====================================================
          HEADER
      ===================================================== */}

      <ScreenHeader onBack={() => navigation.goBack()} />

      {/* =====================================================
          SCROLL
      ===================================================== */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: Math.max(insets.bottom, 24) + 20,
          },
        ]}
      >
        {/* ===================================================
            PROGRESS
        =================================================== */}

        <CheckoutProgress />

        {/* ===================================================
            ADDRESS
        =================================================== */}

        <View style={styles.section}>
          <SectionHeader
            eyebrow="DELIVERY"
            title="Địa chỉ giao hàng"
            right={
              <TouchableOpacity
                onPress={handleSelectAddress}
                activeOpacity={0.7}
              >
                <Text style={styles.actionText}>Thay đổi</Text>
              </TouchableOpacity>
            }
          />

          <AddressCard
            address={selectedAddress}
            onPress={handleSelectAddress}
          />
        </View>

        {/* ===================================================
            PAYMENT
        =================================================== */}

        <View style={styles.section}>
          <SectionHeader eyebrow="PAYMENT" title="Phương thức thanh toán" />

          <View style={styles.paymentList}>
            <PaymentOption
              icon="cash-outline"
              title="Thanh toán khi nhận hàng"
              subtitle="Thanh toán trực tiếp khi nhận sản phẩm"
              selected={selectedPaymentMethod === "cod"}
              onPress={() => setSelectedPaymentMethod("cod")}
            />

            <PaymentOption
              icon="card-outline"
              title="VNPay"
              subtitle="Thanh toán nhanh và bảo mật qua VNPay"
              selected={selectedPaymentMethod === "vnpay"}
              onPress={() => setSelectedPaymentMethod("vnpay")}
            />
          </View>
        </View>

        {/* ===================================================
            VOUCHER
        =================================================== */}

        <View style={styles.section}>
          <SectionHeader eyebrow="PROMOTION" title="Mã giảm giá" />

          <TouchableOpacity
            style={[
              styles.voucherCard,
              selectedVoucher && styles.voucherCardSelected,
            ]}
            onPress={handleSelectVoucher}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.voucherIcon,
                selectedVoucher && styles.voucherIconSelected,
              ]}
            >
              <Ionicons name="pricetag-outline" size={20} color={UI.blue} />
            </View>

            <View style={styles.voucherCopy}>
              {selectedVoucher ? (
                <>
                  <Text style={styles.voucherTitle} numberOfLines={1}>
                    {selectedVoucher.code ||
                      selectedVoucher.name ||
                      "Voucher đã chọn"}
                  </Text>

                  <Text style={styles.voucherSubtitle} numberOfLines={1}>
                    Đã giảm {formatPrice(discount)}
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.voucherTitle}>Chọn mã giảm giá</Text>

                  <Text style={styles.voucherSubtitle}>
                    Áp dụng voucher để tiết kiệm hơn
                  </Text>
                </>
              )}
            </View>

            <Ionicons name="chevron-forward" size={20} color={UI.subtle} />
          </TouchableOpacity>
        </View>

        {/* ===================================================
            PRODUCTS
        =================================================== */}

        <View style={styles.section}>
          <SectionHeader
            eyebrow="YOUR ORDER"
            title={`${checkoutItems.length} sản phẩm`}
          />

          <View style={styles.productsCard}>
            {checkoutItems.map((item, index) => (
              <React.Fragment
                key={`${isBuyNow ? item.variant?._id : item.variantId}-${index}`}
              >
                <CheckoutProduct item={item} isBuyNow={isBuyNow} />

                {index < checkoutItems.length - 1 && (
                  <View style={styles.productDivider} />
                )}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* ===================================================
            SUMMARY
        =================================================== */}

        <View style={styles.summaryContainer}>
          <View style={styles.summaryHeader}>
            <View>
              <Text style={styles.sectionEyebrow}>CHECKOUT</Text>

              <Text style={styles.summaryTitle}>Tóm tắt đơn hàng</Text>
            </View>

            <View style={styles.secureBadge}>
              <Ionicons
                name="shield-checkmark-outline"
                size={15}
                color={UI.blue}
              />

              <Text style={styles.secureBadgeText}>An toàn</Text>
            </View>
          </View>

          {/* SUMMARY */}

          <View style={styles.summaryRows}>
            <SummaryRow label="Tạm tính" value={formatPrice(subtotal)} />

            <SummaryRow
              label="Phí vận chuyển"
              value={formatPrice(shippingFee)}
            />

            <SummaryRow label="Thuế VAT (8%)" value={formatPrice(tax)} />

            {discount > 0 ? (
              <SummaryRow
                label="Giảm giá"
                value={`-${formatPrice(discount)}`}
                highlight
              />
            ) : null}
          </View>

          {/* DIVIDER */}

          <View style={styles.totalDivider} />

          {/* TOTAL */}

          <View style={styles.totalRow}>
            <View>
              <Text style={styles.totalLabel}>Tổng cộng</Text>

              <Text style={styles.totalHint}>Đã bao gồm VAT</Text>
            </View>

            <Text style={styles.totalValue}>{formatPrice(total)}</Text>
          </View>

          {/* CTA */}

          <TouchableOpacity
            style={[
              styles.paymentButton,
              isSubmitting && styles.paymentButtonDisabled,
            ]}
            onPress={handlePlaceOrder}
            activeOpacity={0.86}
            disabled={isSubmitting}
            accessibilityRole="button"
            accessibilityLabel={`${paymentButtonText} ${formatPrice(total)}`}
          >
            {isSubmitting ? (
              <>
                <ActivityIndicator size="small" color="#FFFFFF" />

                <Text style={styles.paymentText}>Đang xử lý...</Text>
              </>
            ) : (
              <>
                <Text style={styles.paymentText}>{paymentButtonText}</Text>

                <Text style={styles.paymentAmount}>{formatPrice(total)}</Text>

                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
              </>
            )}
          </TouchableOpacity>

          {/* NOTE */}

          <Text style={styles.checkoutNote}>
            Bằng việc đặt hàng, bạn đồng ý với chính sách mua hàng và điều khoản
            của RYDE.
          </Text>
        </View>

        {/* ===================================================
            TRUST
        =================================================== */}

        <View style={styles.trustContainer}>
          <TrustItem
            icon="shield-checkmark-outline"
            title="Chính hãng"
            subtitle="100% cam kết"
          />

          <TrustItem
            icon="car-outline"
            title="Giao hàng"
            subtitle="Toàn quốc"
          />

          <TrustItem
            icon="refresh-outline"
            title="Đổi trả"
            subtitle="Trong 30 ngày"
          />
        </View>
      </ScrollView>
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

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 2,
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

  headerCheck: {
    width: 40,
    height: 40,

    borderRadius: 20,

    backgroundColor: UI.blueSoft,

    justifyContent: "center",
    alignItems: "center",

    zIndex: 3,
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
  // PROGRESS
  // =========================================================

  progressContainer: {
    backgroundColor: UI.surface,

    borderWidth: 1,
    borderColor: UI.line,

    borderRadius: 20,

    minHeight: 76,

    paddingHorizontal: 16,

    flexDirection: "row",

    alignItems: "center",

    marginBottom: 26,
  },

  step: {
    alignItems: "center",

    justifyContent: "center",

    width: 72,
  },

  stepNumber: {
    width: 30,
    height: 30,

    borderRadius: 15,

    backgroundColor: "#F1F3F5",

    justifyContent: "center",
    alignItems: "center",
  },

  stepNumberActive: {
    backgroundColor: UI.blue,
  },

  stepNumberCompleted: {
    backgroundColor: UI.navy,
  },

  stepNumberText: {
    color: UI.muted,

    fontSize: 12,

    fontWeight: "800",
  },

  stepNumberTextActive: {
    color: "#FFFFFF",
  },

  stepTitle: {
    color: UI.subtle,

    fontSize: 9,

    fontWeight: "700",

    marginTop: 5,

    textTransform: "uppercase",

    letterSpacing: 0.4,
  },

  stepTitleActive: {
    color: UI.blue,
  },

  progressLine: {
    flex: 1,

    height: 1,

    backgroundColor: UI.line,

    marginHorizontal: 3,

    marginBottom: 17,
  },

  // =========================================================
  // SECTION
  // =========================================================

  section: {
    marginBottom: 26,
  },

  sectionHeader: {
    flexDirection: "row",

    alignItems: "flex-end",

    justifyContent: "space-between",

    marginBottom: 12,

    paddingHorizontal: 4,
  },

  sectionHeaderText: {
    flex: 1,
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

  actionText: {
    color: UI.blue,

    fontSize: 12,

    fontWeight: "800",

    marginBottom: 2,

    marginLeft: 10,
  },

  // =========================================================
  // ADDRESS
  // =========================================================

  addressCard: {
    minHeight: 108,

    backgroundColor: UI.surface,

    borderWidth: 1,
    borderColor: UI.line,

    borderRadius: 20,

    padding: 14,

    flexDirection: "row",

    alignItems: "center",
  },

  addressEmpty: {
    minHeight: 92,

    backgroundColor: UI.surface,

    borderWidth: 1,
    borderColor: UI.line,

    borderRadius: 20,

    padding: 14,

    flexDirection: "row",

    alignItems: "center",
  },

  addressIcon: {
    width: 42,
    height: 42,

    borderRadius: 21,

    backgroundColor: UI.blueSoft,

    justifyContent: "center",
    alignItems: "center",

    flexShrink: 0,
  },

  addressContent: {
    flex: 1,

    minWidth: 0,

    marginLeft: 12,

    marginRight: 8,
  },

  addressNameRow: {
    flexDirection: "row",

    alignItems: "center",
  },

  addressName: {
    color: UI.ink,

    fontSize: 14,

    lineHeight: 19,

    fontWeight: "800",

    flexShrink: 1,
  },

  defaultBadge: {
    backgroundColor: UI.blueSoft,

    borderRadius: 10,

    paddingHorizontal: 7,
    paddingVertical: 3,

    marginLeft: 7,
  },

  defaultBadgeText: {
    color: UI.blue,

    fontSize: 8,

    fontWeight: "800",

    letterSpacing: 0.4,
  },

  addressPhone: {
    color: UI.inkSoft,

    fontSize: 12,

    fontWeight: "600",

    marginTop: 3,
  },

  addressText: {
    color: UI.muted,

    fontSize: 12,

    lineHeight: 17,

    marginTop: 3,
  },

  addressEmptyCopy: {
    flex: 1,

    marginLeft: 12,

    marginRight: 8,
  },

  addressEmptyTitle: {
    color: UI.ink,

    fontSize: 14,

    fontWeight: "800",
  },

  addressEmptyText: {
    color: UI.muted,

    fontSize: 12,

    marginTop: 3,
  },

  // =========================================================
  // PAYMENT
  // =========================================================

  paymentList: {
    gap: 10,
  },

  paymentOption: {
    minHeight: 78,

    backgroundColor: UI.surface,

    borderWidth: 1,
    borderColor: UI.line,

    borderRadius: 20,

    padding: 12,

    flexDirection: "row",

    alignItems: "center",
  },

  paymentOptionSelected: {
    borderColor: UI.blue,

    backgroundColor: UI.blueSoft,
  },

  paymentIcon: {
    width: 44,
    height: 44,

    borderRadius: 14,

    backgroundColor: "#F4F5F7",

    justifyContent: "center",
    alignItems: "center",
  },

  paymentIconSelected: {
    backgroundColor: "#FFFFFF",
  },

  paymentCopy: {
    flex: 1,

    minWidth: 0,

    marginLeft: 12,
  },

  paymentTitle: {
    color: UI.ink,

    fontSize: 13,

    lineHeight: 18,

    fontWeight: "800",
  },

  paymentSubtitle: {
    color: UI.muted,

    fontSize: 11,

    lineHeight: 16,

    marginTop: 2,
  },

  radioOuter: {
    width: 22,
    height: 22,

    borderRadius: 11,

    borderWidth: 1.5,
    borderColor: UI.subtle,

    justifyContent: "center",
    alignItems: "center",

    marginLeft: 10,
  },

  radioOuterSelected: {
    borderColor: UI.blue,
  },

  radioInner: {
    width: 11,
    height: 11,

    borderRadius: 5.5,

    backgroundColor: UI.blue,
  },

  // =========================================================
  // VOUCHER
  // =========================================================

  voucherCard: {
    minHeight: 76,

    backgroundColor: UI.surface,

    borderWidth: 1,
    borderColor: UI.line,

    borderRadius: 20,

    padding: 12,

    flexDirection: "row",

    alignItems: "center",
  },

  voucherCardSelected: {
    borderColor: UI.blue,

    backgroundColor: UI.blueSoft,
  },

  voucherIcon: {
    width: 44,
    height: 44,

    borderRadius: 14,

    backgroundColor: UI.blueSoft,

    justifyContent: "center",
    alignItems: "center",
  },

  voucherIconSelected: {
    backgroundColor: "#FFFFFF",
  },

  voucherCopy: {
    flex: 1,

    minWidth: 0,

    marginLeft: 12,

    marginRight: 8,
  },

  voucherTitle: {
    color: UI.ink,

    fontSize: 13,

    lineHeight: 18,

    fontWeight: "800",
  },

  voucherSubtitle: {
    color: UI.muted,

    fontSize: 11,

    lineHeight: 16,

    marginTop: 2,
  },

  // =========================================================
  // PRODUCTS
  // =========================================================

  productsCard: {
    backgroundColor: UI.surface,

    borderWidth: 1,
    borderColor: UI.line,

    borderRadius: 20,

    paddingHorizontal: 14,
  },

  productItem: {
    flexDirection: "row",

    paddingVertical: 14,

    minHeight: 116,
  },

  productDivider: {
    height: 1,

    backgroundColor: UI.line,
  },

  checkoutProductImage: {
    width: 88,
    height: 88,

    borderRadius: 15,

    backgroundColor: "#F6F7F9",

    overflow: "hidden",

    justifyContent: "center",
    alignItems: "center",
  },

  checkoutProductImageInner: {
    width: "100%",
    height: "100%",
  },

  checkoutProductInfo: {
    flex: 1,

    minWidth: 0,

    marginLeft: 13,

    justifyContent: "space-between",

    paddingVertical: 1,
  },

  checkoutProductName: {
    color: UI.ink,

    fontSize: 14,

    lineHeight: 19,

    fontWeight: "800",

    paddingRight: 4,
  },

  checkoutProductVariant: {
    color: UI.muted,

    fontSize: 11,

    lineHeight: 17,

    marginTop: 4,
  },

  checkoutProductBottom: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    marginTop: 8,
  },

  quantityBadge: {
    backgroundColor: "#F4F5F7",

    borderRadius: 10,

    minWidth: 34,

    height: 26,

    paddingHorizontal: 8,

    justifyContent: "center",
    alignItems: "center",
  },

  quantityBadgeText: {
    color: UI.inkSoft,

    fontSize: 11,

    fontWeight: "800",
  },

  checkoutProductPrice: {
    color: UI.blue,

    fontSize: 13,

    fontWeight: "800",
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

    marginBottom: 12,
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

  summaryLabelHighlight: {
    color: UI.success,
  },

  summaryValueHighlight: {
    color: UI.success,

    fontWeight: "800",
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
  // CTA
  // =========================================================

  paymentButton: {
    minHeight: 54,

    borderRadius: 15,

    backgroundColor: UI.navy,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    paddingHorizontal: 18,

    gap: 8,
  },

  paymentButtonDisabled: {
    opacity: 0.65,
  },

  paymentText: {
    color: "#FFFFFF",

    fontSize: 14,

    lineHeight: 20,

    fontWeight: "800",
  },

  paymentAmount: {
    color: "#FFFFFF",

    fontSize: 14,

    lineHeight: 20,

    fontWeight: "900",
  },

  checkoutNote: {
    color: UI.subtle,

    textAlign: "center",

    fontSize: 10,

    lineHeight: 16,

    marginTop: 12,

    paddingHorizontal: 8,
  },

  // =========================================================
  // TRUST
  // =========================================================

  trustContainer: {
    flexDirection: "row",

    backgroundColor: UI.surface,

    borderWidth: 1,
    borderColor: UI.line,

    borderRadius: 20,

    paddingVertical: 16,
    paddingHorizontal: 8,

    marginBottom: 8,
  },

  trustItem: {
    flex: 1,

    alignItems: "center",

    paddingHorizontal: 3,
  },

  trustIcon: {
    width: 36,
    height: 36,

    borderRadius: 18,

    backgroundColor: UI.blueSoft,

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 7,
  },

  trustTitle: {
    color: UI.ink,

    fontSize: 10,
    lineHeight: 14,

    fontWeight: "800",

    textAlign: "center",
  },

  trustSubtitle: {
    color: UI.subtle,

    fontSize: 9,
    lineHeight: 13,

    textAlign: "center",

    marginTop: 1,
  },
});
