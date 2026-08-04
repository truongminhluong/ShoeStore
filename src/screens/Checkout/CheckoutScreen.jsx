import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useCart } from "../../context/CartContext";
import COLORS from "../../constants/colors";

import { Alert } from "react-native";

import { useAuth } from "../../context/AuthContext";
import { createOrderApi } from "../../services/orderService";
import { useEffect, useState } from "react";
import { getAddressesApi } from "../../services/addressService";
import { createVnpayPaymentApi } from "../../services/vnpayService";

export default function CheckoutScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();

  const { cartItems, clearCart } = useCart();

  const params = route?.params || {};

  const isBuyNow = params.isBuyNow ?? false;
  const buyNowItems = params.items ?? [];

  const checkoutItems = isBuyNow ? buyNowItems : cartItems;

  const { token } = useAuth();

  const [selectedAddress, setSelectedAddress] = useState(null);

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("cod");

  const [selectedVoucher, setSelectedVoucher] = useState(null);

  const loadDefaultAddress = useCallback(async () => {
    try {
      if (!token) return;

      const response = await getAddressesApi(token);

      const addresses = response.data || [];

      const defaultAddress = addresses.find((address) => address.isDefault);

      setSelectedAddress(defaultAddress || null);
    } catch (error) {
      console.log("Lỗi lấy địa chỉ:", error.response?.data || error.message);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      loadDefaultAddress();

      if (route.params?.selectedVoucher) {
        setSelectedVoucher(route.params.selectedVoucher);

        // Xóa params sau khi đã lấy để tránh cập nhật lại nhiều lần
        navigation.setParams({
          selectedVoucher: undefined,
        });
      }
    }, [loadDefaultAddress, route.params?.selectedVoucher]),
  );

  // =========================
  // TÍNH TIỀN
  // =========================

  const subtotal = checkoutItems.reduce((total, item) => {
    if (isBuyNow) {
      const price =
        Number(item.product.discountPrice) > 0
          ? Number(item.product.discountPrice)
          : Number(item.product.price);

      return total + price * item.quantity;
    }

    return total + item.price * item.quantity;
  }, 0);

  const shippingFee = 35000;

  const tax = subtotal * 0.08;

  const discount = selectedVoucher?.discount || 0;

  const total = subtotal + shippingFee + tax - discount;

  const formatPrice = (price) => {
    return `${price.toLocaleString("vi-VN")}đ`;
  };

  const handlePlaceOrder = async () => {
    try {
      // =========================
      // KIỂM TRA GIỎ HÀNG
      // =========================

      if (checkoutItems.length === 0) {
        Alert.alert("Thông báo", "Giỏ hàng đang trống");
        return;
      }

      // =========================
      // KIỂM TRA TOKEN
      // =========================

      if (!token) {
        Alert.alert("Thông báo", "Vui lòng đăng nhập để đặt hàng");
        return;
      }

      // =========================
      // KIỂM TRA ĐỊA CHỈ
      // =========================

      if (!selectedAddress) {
        Alert.alert("Thông báo", "Vui lòng thêm địa chỉ nhận hàng");
        return;
      }

      // =========================
      // TẠO DANH SÁCH SẢN PHẨM
      // =========================

      const orderItems = checkoutItems.map((item) => ({
        product: isBuyNow ? item.product._id : item.productId,
        variant: isBuyNow ? item.variant._id : item.variantId,
        quantity: item.quantity,
      }));

      // =========================
      // DỮ LIỆU ĐẶT HÀNG
      // =========================

      const orderData = {
        items: orderItems,

        shippingAddress: {
          fullName: selectedAddress.fullName,
          phone: selectedAddress.phone,
          address: `${selectedAddress.addressDetail}, ${selectedAddress.ward}, ${selectedAddress.district}, ${selectedAddress.province}`,
        },

        subtotal,
        shippingFee,
        tax,
        discount,
        total,

        voucher: selectedVoucher?._id || null,

        paymentMethod: selectedPaymentMethod,
      };

      console.log("Dữ liệu đặt hàng:", orderData);

      // =========================
      // TẠO ĐƠN HÀNG
      // =========================

      const response = await createOrderApi(orderData, token);

      console.log("Tạo đơn hàng thành công:", response);

      const order = response.data;

      // =====================================================
      // THANH TOÁN COD
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
      // THANH TOÁN VNPAY
      // =====================================================

      if (selectedPaymentMethod === "vnpay") {
        console.log("Đang tạo URL thanh toán VNPAY...");

        const paymentResponse = await createVnpayPaymentApi(order._id, token);

        console.log("URL thanh toán VNPAY:", paymentResponse);

        const paymentUrl = paymentResponse.data.paymentUrl;

        navigation.navigate("VnpayPayment", {
          paymentUrl,
          orderId: order._id,
        });

        return;
      }
    } catch (error) {
      console.log("Lỗi đặt hàng:", error.response?.data || error.message);

      Alert.alert(
        "Đặt hàng thất bại",
        error.response?.data?.message || "Có lỗi xảy ra khi đặt hàng",
      );
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
        },
      ]}
    >
      {/* =========================
          HEADER
      ========================= */}

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={26} color={COLORS.text} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Thanh toán</Text>

        <View style={styles.headerRight} />
      </View>

      {/* =========================
          THANH TIẾN TRÌNH
      ========================= */}

      <View style={styles.progressContainer}>
        {/* BƯỚC 1 */}
        <View style={styles.progressStep}>
          <View style={styles.progressCircleActive}>
            <Text style={styles.progressNumberActive}>✓</Text>
          </View>

          <Text style={styles.progressTextActive}>Giỏ hàng</Text>
        </View>

        {/* THANH NỐI ACTIVE */}
        <View style={styles.progressLineActive} />

        {/* BƯỚC 2 */}
        <View style={styles.progressStep}>
          <View style={styles.progressCircleActive}>
            <Text style={styles.progressNumberActive}>2</Text>
          </View>

          <Text style={styles.progressTextActive}>Thanh toán</Text>
        </View>

        {/* THANH NỐI CHƯA ACTIVE */}
        <View style={styles.progressLine} />

        {/* BƯỚC 3 */}
        <View style={styles.progressStep}>
          <View style={styles.progressCircle}>
            <Text style={styles.progressNumber}>3</Text>
          </View>

          <Text style={styles.progressText}>Hoàn tất</Text>
        </View>
      </View>

      {/* =========================
          NỘI DUNG
      ========================= */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: insets.bottom + 30,
          },
        ]}
      >
        {/* =========================
            ĐỊA CHỈ
        ========================= */}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons
                name="location-outline"
                size={20}
                color={COLORS.primary}
              />

              <Text style={styles.sectionTitle}>Địa chỉ nhận hàng</Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                navigation.navigate("AddAddress");
              }}
            >
              <Text style={styles.changeText}>
                {selectedAddress ? "Thay đổi" : "Thêm địa chỉ"}
              </Text>
            </TouchableOpacity>
          </View>

          {selectedAddress ? (
            // =========================
            // ĐÃ CÓ ĐỊA CHỈ
            // =========================
            <TouchableOpacity
              style={styles.addressBox}
              activeOpacity={0.8}
              onPress={() => {
                navigation.navigate("AddAddress");
              }}
            >
              <View style={styles.addressIconContainer}>
                <Ionicons name="location" size={22} color={COLORS.primary} />
              </View>

              <View style={styles.addressInfo}>
                <View style={styles.addressTopRow}>
                  <Text style={styles.addressName}>
                    {selectedAddress.fullName}
                  </Text>

                  <Text style={styles.defaultAddress}>Mặc định</Text>
                </View>

                <Text style={styles.addressPhone}>{selectedAddress.phone}</Text>

                <Text style={styles.addressText}>
                  {selectedAddress.addressDetail}, {selectedAddress.ward},{" "}
                  {selectedAddress.district}, {selectedAddress.province}
                </Text>
              </View>

              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ) : (
            // =========================
            // CHƯA CÓ ĐỊA CHỈ
            // =========================
            <TouchableOpacity
              style={styles.emptyAddressBox}
              activeOpacity={0.8}
              onPress={() => {
                navigation.navigate("AddAddress");
              }}
            >
              <View style={styles.emptyAddressIcon}>
                <Ionicons
                  name="location-outline"
                  size={24}
                  color={COLORS.primary}
                />
              </View>

              <View style={styles.emptyAddressInfo}>
                <Text style={styles.emptyAddressTitle}>
                  Chưa có địa chỉ nhận hàng
                </Text>

                <Text style={styles.addAddressText}>
                  Nhấn để thêm địa chỉ giao hàng
                </Text>
              </View>

              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        {/* =========================
            PHƯƠNG THỨC THANH TOÁN
        ========================= */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>

          {/* COD */}
          <TouchableOpacity
            style={[
              styles.paymentOption,
              selectedPaymentMethod === "cod" && styles.selectedPayment,
            ]}
            onPress={() => {
              setSelectedPaymentMethod("cod");
            }}
          >
            <Ionicons
              name={
                selectedPaymentMethod === "cod"
                  ? "radio-button-on"
                  : "radio-button-off"
              }
              size={24}
              color={
                selectedPaymentMethod === "cod" ? COLORS.primary : "#9CA3AF"
              }
            />

            <View style={styles.paymentInfo}>
              <Text style={styles.paymentName}>Thanh toán khi nhận hàng</Text>

              <Text style={styles.paymentDescription}>
                Thanh toán bằng tiền mặt khi nhận hàng
              </Text>
            </View>
          </TouchableOpacity>

          {/* VNPAY */}
          <TouchableOpacity
            style={[
              styles.paymentOption,
              {
                marginBottom: 0,
              },
              selectedPaymentMethod === "vnpay" && styles.selectedPayment,
            ]}
            onPress={() => {
              setSelectedPaymentMethod("vnpay");
            }}
          >
            <Ionicons
              name={
                selectedPaymentMethod === "vnpay"
                  ? "radio-button-on"
                  : "radio-button-off"
              }
              size={24}
              color={
                selectedPaymentMethod === "vnpay" ? COLORS.primary : "#9CA3AF"
              }
            />

            <View style={styles.paymentInfo}>
              <Text style={styles.paymentName}>Thanh toán qua VNPAY</Text>

              <Text style={styles.paymentDescription}>
                Thanh toán online qua cổng thanh toán VNPAY
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* =========================
                  VOUCHER
        ========================= */}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons
                name="ticket-outline"
                size={20}
                color={COLORS.primary}
              />

              <Text style={styles.sectionTitle}>Voucher</Text>
            </View>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Voucher", {
                  subtotal,
                  selectedVoucher,
                  onSelectVoucher: (voucher) => {
                    setSelectedVoucher(voucher);
                  },
                })
              }
            >
              <Text style={styles.changeText}>
                {selectedVoucher ? "Thay đổi" : "Chọn"}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.voucherBox}
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate("Voucher", {
                subtotal,
                selectedVoucher,
                onSelectVoucher: (voucher) => {
                  setSelectedVoucher(voucher);
                },
              })
            }
          >
            <View style={styles.voucherLeft}>
              <View style={styles.voucherIcon}>
                <Ionicons name="pricetag" size={22} color="#FFFFFF" />
              </View>

              <View style={styles.voucherInfo}>
                {selectedVoucher ? (
                  <>
                    <Text style={styles.voucherCode}>
                      {selectedVoucher.code}
                    </Text>

                    <Text style={styles.voucherDiscount}>
                      Giảm {selectedVoucher.discount.toLocaleString("vi-VN")}đ
                    </Text>

                    <Text style={styles.voucherDesc}>
                      {selectedVoucher.description}
                    </Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.voucherTitle}>
                      Chưa áp dụng voucher
                    </Text>

                    <Text style={styles.voucherDesc}>
                      Chọn mã giảm giá để tiết kiệm hơn
                    </Text>
                  </>
                )}
              </View>
            </View>

            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* =========================
            TÓM TẮT ĐƠN HÀNG
        ========================= */}

        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Tóm tắt đơn hàng</Text>

          {/* DANH SÁCH SẢN PHẨM */}
          {checkoutItems.map((item) => {
            const image = isBuyNow
              ? item.variant.image || item.product.image
              : item.image;

            const name = isBuyNow ? item.product.name : item.name;

            const color = isBuyNow ? item.variant.colorName : item.colorName;

            const size = isBuyNow ? item.variant.size : item.size;

            const price = isBuyNow
              ? Number(item.product.discountPrice) > 0
                ? Number(item.product.discountPrice)
                : Number(item.product.price)
              : item.price;

            return (
              <View
                key={isBuyNow ? item.variant._id : item.variantId}
                style={styles.productItem}
              >
                <View style={styles.imageContainer}>
                  <Image source={{ uri: image }} style={styles.productImage} />
                </View>

                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={2}>
                    {name}
                  </Text>

                  <Text style={styles.variantText}>
                    {color} • Size: {size}
                  </Text>

                  <Text style={styles.quantityText}>
                    Số lượng: {item.quantity}
                  </Text>
                </View>

                <Text style={styles.productPrice}>
                  {formatPrice(price * item.quantity)}
                </Text>
              </View>
            );
          })}

          <View style={styles.divider} />

          {/* TẠM TÍNH */}

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tạm tính</Text>

            <Text style={styles.summaryValue}>{formatPrice(subtotal)}</Text>
          </View>

          {/* PHÍ VẬN CHUYỂN */}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Phí vận chuyển</Text>

            <Text style={styles.summaryValue}>{formatPrice(shippingFee)}</Text>
          </View>

          {/* GIẢM GIÁ */}

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Giảm giá</Text>

            <Text style={styles.discountText}>-{formatPrice(discount)}</Text>
          </View>

          <View style={styles.divider} />

          {/* THUẾ */}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Thuế (VAT 8%)</Text>

            <Text style={styles.summaryValue}>{formatPrice(tax)}</Text>
          </View>

          {/* TỔNG CỘNG */}

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tổng cộng</Text>

            <Text style={styles.totalValue}>{formatPrice(total)}</Text>
          </View>

          {/* ĐẶT HÀNG */}

          <TouchableOpacity
            style={styles.orderButton}
            onPress={() => {
              handlePlaceOrder();
            }}
          >
            <Text style={styles.orderButtonText}>Đặt hàng</Text>

            <Ionicons
              name="checkmark-circle-outline"
              size={20}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <Text style={styles.noteText}>
            Bằng việc đặt hàng, bạn đồng ý với điều khoản và chính sách của
            chúng tôi
          </Text>
        </View>

        {/* =========================
            CHÍNH SÁCH
        ========================= */}

        <View style={styles.policyContainer}>
          <View style={styles.policyItem}>
            <Ionicons
              name="shield-checkmark-outline"
              size={24}
              color={COLORS.primary}
            />

            <Text style={styles.policyText}>100% Chính hãng</Text>
          </View>

          <View style={styles.policyItem}>
            <Ionicons name="refresh-outline" size={24} color={COLORS.primary} />

            <Text style={styles.policyText}>30 ngày đổi trả</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F7FF",
  },

  // =========================
  // HEADER
  // =========================

  header: {
    height: 64,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
  },

  backButton: {
    width: 42,
    height: 42,
    justifyContent: "center",
    alignItems: "flex-start",
  },

  headerRight: {
    width: 42,
  },

  headerTitle: {
    fontSize: 21,
    fontWeight: "700",
    color: "#1F2937",
  },

  // =========================
  // THANH TIẾN TRÌNH
  // =========================

  progressContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: "#F8F7FF",
  },

  progressStep: {
    alignItems: "center",
    width: 78,
  },

  progressCircleActive: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  progressCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },

  progressNumberActive: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  progressNumber: {
    color: "#9CA3AF",
    fontSize: 15,
    fontWeight: "700",
  },

  progressTextActive: {
    marginTop: 7,
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.primary,
  },

  progressText: {
    marginTop: 7,
    fontSize: 13,
    color: "#9CA3AF",
  },

  // Thanh nối giữa bước 1 và bước 2
  progressLineActive: {
    flex: 1,
    height: 4,
    backgroundColor: COLORS.primary,
    marginTop: 16,
    borderRadius: 2,
  },

  // Thanh nối giữa bước 2 và bước 3
  progressLine: {
    flex: 1,
    height: 4,
    backgroundColor: "#E5E7EB",
    marginTop: 16,
    borderRadius: 2,
  },

  // =========================
  // CONTENT
  // =========================

  content: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 40,
  },

  // =========================
  // SECTION
  // =========================

  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 14,
  },

  changeText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: "600",
  },

  // =========================
  // ĐỊA CHỈ
  // =========================

  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1F2937",
    marginLeft: 8,
  },

  changeText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
  },

  // =========================
  // ĐỊA CHỈ ĐÃ CÓ
  // =========================

  addressBox: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#FFFFFF",

    borderRadius: 16,

    padding: 16,

    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  addressIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,

    backgroundColor: "#E4E7FF",

    justifyContent: "center",
    alignItems: "center",

    marginRight: 12,
  },

  addressInfo: {
    flex: 1,
  },

  addressTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  addressName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2937",
  },

  defaultAddress: {
    fontSize: 11,
    fontWeight: "600",

    color: COLORS.primary,

    backgroundColor: "#E4E7FF",

    paddingHorizontal: 8,
    paddingVertical: 3,

    borderRadius: 6,

    marginLeft: 8,
  },

  addressPhone: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 5,
  },

  addressText: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 19,
    marginTop: 5,
  },

  // =========================
  // CHƯA CÓ ĐỊA CHỈ
  // =========================

  emptyAddressBox: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#FFFFFF",

    borderRadius: 16,

    padding: 16,

    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  emptyAddressIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,

    backgroundColor: "#E4E7FF",

    justifyContent: "center",
    alignItems: "center",

    marginRight: 12,
  },

  emptyAddressInfo: {
    flex: 1,
  },

  emptyAddressTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2937",
  },

  addAddressText: {
    fontSize: 13,
    color: COLORS.primary,
    marginTop: 5,
    fontWeight: "500",
  },

  // =========================
  // THANH TOÁN
  // =========================

  paymentOption: {
    minHeight: 72,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  paymentInfo: {
    marginLeft: 12,
    flex: 1,
  },

  paymentName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
  },

  paymentDescription: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 4,
  },

  // =========================
  // SẢN PHẨM
  // =========================

  productItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  summaryTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 14,
  },

  imageContainer: {
    width: 82,
    height: 82,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    overflow: "hidden",
  },

  productImage: {
    width: "100%",
    height: "100%",
  },

  productInfo: {
    flex: 1,
    marginLeft: 12,
  },

  productName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2937",
  },

  variantText: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 5,
  },

  quantityText: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },

  productPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.primary,
  },

  // =========================
  // TÓM TẮT ĐƠN HÀNG
  // =========================

  summaryContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 18,
    marginTop: 4,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  summaryLabel: {
    fontSize: 14,
    color: "#6B7280",
  },

  summaryValue: {
    fontSize: 14,
    color: "#4B5563",
  },

  freeText: {
    fontSize: 14,
    color: "#16A34A",
    fontWeight: "600",
  },

  discountText: {
    fontSize: 14,
    color: "#DC2626",
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 6,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  totalLabel: {
    fontSize: 19,
    fontWeight: "700",
    color: "#1F2937",
  },

  totalValue: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.primary,
  },

  // =========================
  // ĐẶT HÀNG
  // =========================

  orderButton: {
    height: 52,
    borderRadius: 9,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  orderButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  noteText: {
    fontSize: 10,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 11,
    lineHeight: 15,
  },

  // =========================
  // CHÍNH SÁCH
  // =========================

  policyContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 10,
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-around",
  },

  policyItem: {
    flex: 1,
    alignItems: "center",
    gap: 7,
  },

  policyText: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },

  // =========================
  // VOUCHER
  // =========================

  voucherBox: {
    marginTop: 15,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 18,
    backgroundColor: "#fff",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  voucherLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  voucherIcon: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  voucherInfo: {
    flex: 1,
  },

  voucherTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },

  voucherCode: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primary,
  },

  voucherDesc: {
    marginTop: 4,
    fontSize: 13,
    color: "#6B7280",
  },
});
