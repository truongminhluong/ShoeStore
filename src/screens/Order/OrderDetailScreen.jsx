import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";

import { SafeAreaView } from "react-native-safe-area-context";
import { Alert } from "react-native";
import { cancelOrderApi } from "../../services/orderService";

import COLORS from "../../constants/colors";

import useOrderDetailViewModel from "../../viewmodels/useOrderDetailViewModel";

import { useEffect, useState } from "react";
import reviewService from "../../services/reviewService";

export default function OrderDetailScreen({ navigation, route }) {
  const { token } = useAuth();

  const { orderId } = route.params;

  const [reviewedMap, setReviewedMap] = useState({});

  const { order, loading, error, fetchOrderDetail } =
    useOrderDetailViewModel(orderId);

  useEffect(() => {
    if (!order || order.status !== "delivered") return;

    const checkReviews = async () => {
      const map = {};

      for (const item of order.items) {
        try {
          const res = await reviewService.checkReviewed(
            item.product._id,
            order._id,
          );

          map[item.product._id] = res.reviewed;
        } catch (error) {
          map[item.product._id] = false;
        }
      }

      setReviewedMap(map);
    };

    checkReviews();
  }, [order]);

  // =========================
  // FORMAT TIỀN
  // =========================

  const formatPrice = (price = 0) => {
    return `${Number(price).toLocaleString("vi-VN")}đ`;
  };

  // =========================
  // TRẠNG THÁI ĐƠN HÀNG
  // =========================

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Chờ xác nhận";

      case "confirmed":
        return "Đã xác nhận";

      case "shipping":
        return "Đang giao hàng";

      case "delivered":
        return "Đã giao hàng";

      case "cancelled":
        return "Đã hủy";

      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#F59E0B";

      case "confirmed":
        return "#2563EB";

      case "shipping":
        return "#7C3AED";

      case "delivered":
        return "#16A34A";

      case "cancelled":
        return "#DC2626";

      default:
        return "#6B7280";
    }
  };

  // =========================
  // PHƯƠNG THỨC THANH TOÁN
  // =========================

  const getPaymentMethod = (paymentMethod) => {
    if (paymentMethod === "vnpay") {
      return "Thanh toán VNPAY";
    }

    return "Thanh toán khi nhận hàng";
  };

  const handleCancelOrder = () => {
    Alert.alert(
      "Hủy đơn hàng",
      "Bạn có chắc chắn muốn hủy đơn hàng này không?",
      [
        {
          text: "Không",
          style: "cancel",
        },
        {
          text: "Hủy đơn",
          style: "destructive",
          onPress: async () => {
            try {
              if (!token) {
                Alert.alert("Lỗi", "Phiên đăng nhập đã hết hạn");
                return;
              }

              await cancelOrderApi(order._id, token);

              Alert.alert("Thành công", "Đơn hàng đã được hủy");

              fetchOrderDetail();
            } catch (error) {
              console.log(
                "Lỗi hủy đơn:",
                error.response?.data || error.message,
              );

              Alert.alert(
                "Lỗi",
                error.response?.data?.message || "Không thể hủy đơn hàng",
              );
            }
          },
        },
      ],
    );
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Chi tiết đơn hàng</Text>

          <View style={styles.headerSpace} />
        </View>

        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />

          <Text style={styles.loadingText}>Đang tải chi tiết đơn hàng...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // =========================
  // LỖI
  // =========================

  if (error || !order) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Chi tiết đơn hàng</Text>

          <View style={styles.headerSpace} />
        </View>

        <View style={styles.center}>
          <Ionicons name="alert-circle-outline" size={60} color="#DC2626" />

          <Text style={styles.errorText}>
            {error || "Không tìm thấy đơn hàng"}
          </Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchOrderDetail}
          >
            <Text style={styles.retryText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const statusColor = getStatusColor(order.status);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* HEADER */}

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={23} color="#1F2937" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Chi tiết đơn hàng</Text>

        <View style={styles.headerSpace} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* TRẠNG THÁI */}

        <View style={styles.statusCard}>
          <View
            style={[
              styles.statusIcon,
              {
                backgroundColor: `${statusColor}20`,
              },
            ]}
          >
            <Ionicons name="cube-outline" size={28} color={statusColor} />
          </View>

          <View style={styles.statusContent}>
            <Text
              style={[
                styles.statusTitle,
                {
                  color: statusColor,
                },
              ]}
            >
              {getStatusText(order.status)}
            </Text>

            <Text style={styles.statusDescription}>Mã đơn: #{order._id}</Text>
          </View>
        </View>

        {/* THÔNG TIN NGƯỜI NHẬN */}

        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons
              name="location-outline"
              size={21}
              color={COLORS.primary}
            />

            <Text style={styles.sectionTitle}>Địa chỉ nhận hàng</Text>
          </View>

          <Text style={styles.receiverName}>
            {order.shippingAddress?.fullName}
          </Text>

          <Text style={styles.addressText}>{order.shippingAddress?.phone}</Text>

          <Text style={styles.addressText}>
            {order.shippingAddress?.address}
          </Text>
        </View>

        {/* SẢN PHẨM */}

        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="bag-outline" size={21} color={COLORS.primary} />

            <Text style={styles.sectionTitle}>Sản phẩm đã đặt</Text>
          </View>

          {order.items?.map((item, index) => (
            <View
              key={item._id || `${item.product?._id}-${index}`}
              style={styles.productItem}
            >
              <Image
                source={{
                  uri: item.variant?.image || item.product?.image,
                }}
                style={styles.productImage}
              />

              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>
                  {item.product?.name || "Sản phẩm"}
                </Text>

                <Text style={styles.variantText}>
                  Size: {item.variant?.size || "Chưa có"}
                  {"  •  "}
                  {item.variant?.colorName || "Chưa có"}
                </Text>

                <View style={styles.productBottom}>
                  <Text style={styles.productPrice}>
                    {formatPrice(item.price)}
                  </Text>

                  <Text style={styles.quantity}>x{item.quantity}</Text>
                </View>

                {/* NÚT ĐÁNH GIÁ */}
                {order.status === "delivered" &&
                  item.product?._id &&
                  (reviewedMap[item.product._id] ? (
                    <View style={styles.reviewedContainer}>
                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color="#16A34A"
                      />

                      <Text style={styles.reviewedText}>Đã đánh giá</Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.smallReviewButton}
                      onPress={() =>
                        navigation.navigate("CreateReview", {
                          productId: item.product._id,
                          orderId: order._id,
                          productName: item.product.name || "Sản phẩm",
                        })
                      }
                    >
                      <Ionicons
                        name="star-outline"
                        size={14}
                        color={COLORS.primary}
                      />

                      <Text style={styles.smallReviewText}>Đánh giá</Text>
                    </TouchableOpacity>
                  ))}
              </View>
            </View>
          ))}
        </View>

        {/* THANH TOÁN */}

        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="card-outline" size={21} color={COLORS.primary} />

            <Text style={styles.sectionTitle}>Thanh toán</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Tạm tính</Text>

            <Text style={styles.priceValue}>{formatPrice(order.subtotal)}</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Phí vận chuyển</Text>

            <Text style={styles.priceValue}>
              {formatPrice(order.shippingFee)}
            </Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Giảm giá</Text>

            <Text style={styles.discountValue}>
              -{formatPrice(order.discount)}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tổng thanh toán</Text>

            <Text style={styles.totalValue}>{formatPrice(order.total)}</Text>
          </View>
        </View>

        {/* PHƯƠNG THỨC */}

        <View style={styles.card}>
          <View style={styles.paymentRow}>
            <View>
              <Text style={styles.paymentLabel}>Phương thức thanh toán</Text>

              <Text style={styles.paymentMethod}>
                {getPaymentMethod(order.paymentMethod)}
              </Text>
            </View>

            <Ionicons
              name={
                order.paymentMethod === "vnpay"
                  ? "wallet-outline"
                  : "cash-outline"
              }
              size={28}
              color={COLORS.primary}
            />
          </View>
        </View>

        {/* HỦY ĐƠN HÀNG */}

        {(order.status === "pending" || order.status === "confirmed") && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancelOrder}
          >
            <Ionicons name="close-circle-outline" size={20} color="#FFFFFF" />

            <Text style={styles.cancelButtonText}>Hủy đơn hàng</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
  },

  header: {
    height: 60,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F6F7FB",
  },

  backButton: {
    width: 38,
    height: 38,
    justifyContent: "center",
    alignItems: "center",
  },

  headerSpace: {
    width: 38,
  },

  headerTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#1F2937",
  },

  scrollContent: {
    padding: 16,
    paddingBottom: 35,
  },

  statusCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    marginBottom: 14,
  },

  statusIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  statusContent: {
    flex: 1,
  },

  statusTitle: {
    fontSize: 17,
    fontWeight: "700",
  },

  statusDescription: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 5,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginLeft: 8,
  },

  receiverName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 5,
  },

  addressText: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 21,
  },

  productItem: {
    flexDirection: "row",
    paddingVertical: 13,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },

  productImage: {
    width: 82,
    height: 82,
    borderRadius: 12,
    backgroundColor: "#F1F1F1",
    marginRight: 12,
  },

  productInfo: {
    flex: 1,
    justifyContent: "space-between",
  },

  productName: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "700",
    color: "#1F2937",
  },

  variantText: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 5,
  },

  productBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },

  productPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.primary,
  },

  quantity: {
    fontSize: 13,
    color: "#6B7280",
  },

  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 11,
  },

  priceLabel: {
    fontSize: 14,
    color: "#6B7280",
  },

  priceValue: {
    fontSize: 14,
    color: "#1F2937",
  },

  discountValue: {
    fontSize: 14,
    color: "#16A34A",
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 5,
  },

  totalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },

  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
  },

  totalValue: {
    fontSize: 19,
    fontWeight: "700",
    color: COLORS.primary,
  },

  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  paymentLabel: {
    fontSize: 13,
    color: "#6B7280",
  },

  paymentMethod: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2937",
    marginTop: 5,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6B7280",
  },

  errorText: {
    marginTop: 12,
    textAlign: "center",
    fontSize: 15,
    color: "#DC2626",
  },

  retryButton: {
    marginTop: 18,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 9,
    backgroundColor: COLORS.primary,
  },

  retryText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  reviewButton: {
    height: 38,
    paddingHorizontal: 15,
    borderRadius: 9,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
    alignSelf: "flex-end",
    backgroundColor: COLORS.primary,
  },

  reviewButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  smallReviewButton: {
    marginTop: 10,
    alignSelf: "flex-end",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },

  smallReviewText: {
    marginLeft: 5,
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.primary,
  },

  reviewedContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    marginTop: 10,
  },

  reviewedText: {
    marginLeft: 5,
    fontSize: 13,
    fontWeight: "600",
    color: "#16A34A",
  },

  cancelButton: {
    marginHorizontal: 20,
    marginBottom: 30,
    height: 50,
    borderRadius: 12,
    backgroundColor: "#DC2626",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  cancelButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },
});
