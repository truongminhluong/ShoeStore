import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useCart } from "../../context/CartContext";
import COLORS from "../../constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "../../components/home/Header";

export default function CartScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity } =
    useCart();

  // =========================
  // TÍNH TẠM TÍNH
  // =========================
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  // Phí vận chuyển
  const shippingFee = cartItems.length > 0 ? 35000 : 0;

  // Thuế VAT 8%
  const tax = subtotal * 0.08;

  // Tổng tiền
  const total = subtotal + shippingFee + tax;

  // =========================
  // FORMAT TIỀN
  // =========================
  const formatPrice = (price) => {
    return `${price.toLocaleString("vi-VN")}đ`;
  };

  // =========================
  // ITEM SẢN PHẨM
  // =========================
  const renderCartItem = ({ item }) => {
    return (
      <View style={styles.cartItem}>
        {/* ẢNH */}
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: item.image,
            }}
            style={styles.productImage}
            resizeMode="cover"
          />
        </View>

        {/* THÔNG TIN */}
        <View style={styles.productInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.productName} numberOfLines={1}>
              {item.name}
            </Text>

            <TouchableOpacity
              onPress={() => removeFromCart(item.productId, item.variantId)}
            >
              <Ionicons name="trash-outline" size={19} color="#4B5563" />
            </TouchableOpacity>
          </View>

          <Text style={styles.variantText}>
            {item.colorName} • Size: {item.size}
          </Text>

          {/* SỐ LƯỢNG + GIÁ */}
          <View style={styles.bottomRow}>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                onPress={() => decreaseQuantity(item.productId, item.variantId)}
                style={styles.quantityButton}
              >
                <Text style={styles.quantityButtonText}>−</Text>
              </TouchableOpacity>

              <Text style={styles.quantityText}>{item.quantity}</Text>

              <TouchableOpacity
                onPress={() => increaseQuantity(item.productId, item.variantId)}
                style={styles.quantityButton}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.itemPrice}>
              {formatPrice(item.price * item.quantity)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  // =========================
  // GIỎ HÀNG TRỐNG
  // =========================
  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="cart-outline" size={70} color={COLORS.primary} />

        <Text style={styles.emptyTitle}>Giỏ hàng đang trống</Text>

        <Text style={styles.emptyText}>
          Hãy thêm sản phẩm yêu thích vào giỏ hàng
        </Text>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.continueButtonText}>Tiếp tục mua sắm</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
        },
      ]}
    >
      {/* HEADER */}
      <Header />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Giỏ hàng của bạn</Text>

        <Text style={styles.productCount}>{cartItems.length} sản phẩm</Text>
      </View>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.variantId}
        renderItem={renderCartItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={
          <>
            {/* TÓM TẮT ĐƠN HÀNG */}
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryTitle}>Tóm tắt đơn hàng</Text>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tạm tính</Text>

                <Text style={styles.summaryValue}>{formatPrice(subtotal)}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Phí vận chuyển</Text>

                <Text style={styles.summaryValue}>
                  {formatPrice(shippingFee)}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Thuế (VAT 8%)</Text>

                <Text style={styles.summaryValue}>{formatPrice(tax)}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Tổng cộng</Text>

                <Text style={styles.totalValue}>{formatPrice(total)}</Text>
              </View>

              {/* THANH TOÁN */}
              <TouchableOpacity
                style={styles.paymentButton}
                onPress={() => {
                  navigation.navigate("Checkout")
                }}
              >
                <Text style={styles.paymentText}>Thanh toán ngay</Text>

                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
              </TouchableOpacity>

              {/* TIẾP TỤC MUA SẮM */}
              <TouchableOpacity
                style={styles.continueButton}
                onPress={() => navigation.navigate("Home")}
              >
                <Text style={styles.continueButtonText}>Tiếp tục mua sắm</Text>
              </TouchableOpacity>

              {/* CHÍNH SÁCH */}
              <View style={styles.policyContainer}>
                <View style={styles.policyItem}>
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={26}
                    color={COLORS.primary}
                  />

                  <Text style={styles.policyText}>Chính hãng{"\n"}100%</Text>
                </View>

                <View style={styles.policyItem}>
                  <Ionicons
                    name="car-outline"
                    size={26}
                    color={COLORS.primary}
                  />

                  <Text style={styles.policyText}>Giao hàng 24h</Text>
                </View>

                <View style={styles.policyItem}>
                  <Ionicons
                    name="refresh-outline"
                    size={26}
                    color={COLORS.primary}
                  />

                  <Text style={styles.policyText}>30 ngày đổi trả</Text>
                </View>
              </View>
            </View>
          </>
        }
      />
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
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1F2937",
  },

  productCount: {
    fontSize: 13,
    color: "#6B7280",
  },

  // =========================
  // DANH SÁCH GIỎ HÀNG
  // =========================
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },

  // =========================
  // CART ITEM
  // =========================
  cartItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    flexDirection: "row",

    // làm card nổi nhẹ
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  imageContainer: {
    width: 105,
    height: 105,
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    overflow: "hidden",
  },

  productImage: {
    width: "100%",
    height: "100%",
  },

  productInfo: {
    flex: 1,
    marginLeft: 14,
    justifyContent: "space-between",
  },

  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  productName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginRight: 10,
  },

  variantText: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 6,
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
  },

  // =========================
  // SỐ LƯỢNG
  // =========================
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEF2FF",
    borderRadius: 10,
    paddingHorizontal: 5,
    height: 34,
  },

  quantityButton: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },

  quantityButtonText: {
    fontSize: 18,
    color: COLORS.primary,
    fontWeight: "600",
  },

  quantityText: {
    minWidth: 28,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
  },

  itemPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primary,
  },

  // =========================
  // TÓM TẮT ĐƠN HÀNG
  // =========================
  summaryContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 20,
    marginTop: 8,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  summaryTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 20,
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
    fontWeight: "500",
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 8,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  totalLabel: {
    fontSize: 19,
    fontWeight: "700",
    color: "#1F2937",
  },

  totalValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#D93816",
  },

  // =========================
  // BUTTON THANH TOÁN
  // =========================
  paymentButton: {
    height: 50,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  paymentText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  continueButton: {
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },

  continueButtonText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: "600",
  },

  // =========================
  // CHÍNH SÁCH
  // =========================
  policyContainer: {
    borderTopWidth: 1,
    borderTopColor: "#F1F1F1",
    marginTop: 20,
    paddingTop: 18,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  policyItem: {
    flex: 1,
    alignItems: "center",
    gap: 8,
  },

  policyText: {
    textAlign: "center",
    fontSize: 12,
    lineHeight: 17,
    color: "#4B5563",
    fontWeight: "500",
  },

  // =========================
  // GIỎ HÀNG TRỐNG
  // =========================
  emptyContainer: {
    flex: 1,
    backgroundColor: "#F8F7FF",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1F2937",
    marginTop: 18,
  },

  emptyText: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 10,
    textAlign: "center",
  },
});
