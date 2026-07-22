import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useCart } from "../../context/CartContext";
import COLORS from "../../constants/colors";

import { Alert } from "react-native";

import { useAuth } from "../../context/AuthContext";
import { createOrderApi } from "../../services/orderService";

export default function CheckoutScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  const { cartItems, clearCart } = useCart();

  const { token } = useAuth();

  // =========================
  // TÍNH TIỀN
  // =========================

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const shippingFee = 0;
  const discount = 0;

  const total = subtotal + shippingFee - discount;

  const formatPrice = (price) => {
    return `${price.toLocaleString("vi-VN")}đ`;
  };

  const handlePlaceOrder = async () => {
    try {
      // =========================
      // KIỂM TRA GIỎ HÀNG
      // =========================

      if (cartItems.length === 0) {
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
      // CHUYỂN DỮ LIỆU GIỎ HÀNG
      // SANG FORMAT BACKEND
      // =========================

      const orderItems = cartItems.map((item) => ({
        product: item.productId,
        variant: item.variantId,
        quantity: item.quantity,
      }));

      // =========================
      // DỮ LIỆU ĐẶT HÀNG
      // =========================

      const orderData = {
        items: orderItems,

        shippingAddress: {
          fullName: "Nguyễn Văn A",
          phone: "0981234567",
          address: "123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh",
        },

        paymentMethod: "cod",
      };

      console.log("Dữ liệu đặt hàng:", orderData);

      // =========================
      // GỌI API TẠO ĐƠN HÀNG
      // =========================

      const response = await createOrderApi(orderData, token);

      console.log("Đặt hàng thành công:", response);

      // =========================
      // LẤY ĐƠN HÀNG VỪA TẠO
      // =========================

      const order = response.data;

      // =========================
      // XÓA GIỎ HÀNG
      // =========================

      clearCart();

      // =========================
      // CHUYỂN SANG MÀN HÌNH
      // ĐẶT HÀNG THÀNH CÔNG
      // =========================

      navigation.replace("OrderSuccess", {
        orderId: order._id,
      });
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
            <Text style={styles.sectionTitle}>Địa chỉ nhận hàng</Text>

            <TouchableOpacity>
              <Text style={styles.changeText}>Thay đổi</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.addressBox}>
            <View style={styles.addressIcon}>
              <Ionicons
                name="location-outline"
                size={24}
                color={COLORS.primary}
              />
            </View>

            <View style={styles.addressInfo}>
              <Text style={styles.addressName}>Nguyễn Văn A</Text>

              <Text style={styles.addressPhone}>(+84) 098 123 4567</Text>

              <Text style={styles.addressText}>
                123 Đường Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh
              </Text>
            </View>
          </View>
        </View>

        {/* =========================
            PHƯƠNG THỨC THANH TOÁN
        ========================= */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>

          <TouchableOpacity
            style={[styles.paymentOption, styles.selectedPayment]}
          >
            <Ionicons name="radio-button-on" size={24} color={COLORS.primary} />

            <View style={styles.paymentInfo}>
              <Text style={styles.paymentName}>Thanh toán khi nhận hàng</Text>

              <Text style={styles.paymentDescription}>
                Thanh toán bằng tiền mặt khi nhận hàng
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.paymentOption}>
            <Ionicons name="radio-button-off" size={24} color="#9CA3AF" />

            <View style={styles.paymentInfo}>
              <Text style={styles.paymentName}>Ví điện tử MoMo</Text>

              <Text style={styles.paymentDescription}>
                Thanh toán nhanh qua ví điện tử
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              {
                marginBottom: 0,
              },
            ]}
          >
            <Ionicons name="radio-button-off" size={24} color="#9CA3AF" />

            <View style={styles.paymentInfo}>
              <Text style={styles.paymentName}>Thẻ Visa / Mastercard</Text>

              <Text style={styles.paymentDescription}>
                Thanh toán bằng thẻ quốc tế
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* =========================
            TÓM TẮT ĐƠN HÀNG
        ========================= */}

        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Tóm tắt đơn hàng</Text>

          {/* DANH SÁCH SẢN PHẨM */}

          {cartItems.map((item) => (
            <View key={item.variantId} style={styles.productItem}>
              <View style={styles.imageContainer}>
                <Image
                  source={{
                    uri: item.image,
                  }}
                  style={styles.productImage}
                  resizeMode="cover"
                />
              </View>

              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>
                  {item.name}
                </Text>

                <Text style={styles.variantText}>
                  {item.colorName} • Size: {item.size}
                </Text>

                <Text style={styles.quantityText}>
                  Số lượng: {item.quantity}
                </Text>
              </View>

              <Text style={styles.productPrice}>
                {formatPrice(item.price * item.quantity)}
              </Text>
            </View>
          ))}

          <View style={styles.divider} />

          {/* TẠM TÍNH */}

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tạm tính</Text>

            <Text style={styles.summaryValue}>{formatPrice(subtotal)}</Text>
          </View>

          {/* PHÍ VẬN CHUYỂN */}

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Phí vận chuyển</Text>

            <Text style={styles.freeText}>Miễn phí</Text>
          </View>

          {/* GIẢM GIÁ */}

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Giảm giá</Text>

            <Text style={styles.discountText}>-{formatPrice(discount)}</Text>
          </View>

          <View style={styles.divider} />

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

  addressBox: {
    flexDirection: "row",
    backgroundColor: "#F3F4FF",
    borderRadius: 10,
    padding: 14,
  },

  addressIcon: {
    marginRight: 12,
  },

  addressInfo: {
    flex: 1,
  },

  addressName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2937",
  },

  addressPhone: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },

  addressText: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 19,
    marginTop: 5,
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
});
