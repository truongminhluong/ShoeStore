import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,  
  RefreshControl,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "../../context/AuthContext";
import COLORS from "../../constants/colors";

import useOrderDetailViewModel from "../../viewmodels/useOrderDetailViewModel";
import reviewService from "../../services/reviewService";
import { cancelOrderApi } from "../../services/orderService";

// ============================================================
// RYDE ORDER DETAIL
// ============================================================

export default function OrderDetailScreen({ navigation, route }) {
  const { token } = useAuth();

  const { orderId } = route.params;

  const [reviewedMap, setReviewedMap] = useState({});

  const [refreshing, setRefreshing] = useState(false);

  const { order, loading, error, fetchOrderDetail } =
    useOrderDetailViewModel(orderId);

  // ============================================================
  // CHECK REVIEW
  // ============================================================
  
  const handleRefresh = async () => {
    try {
      setRefreshing(true);

      await fetchOrderDetail();

    } catch (error) {
      console.log("❌ Lỗi refresh:", error?.response?.data || error?.message);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!order || order.status !== "delivered") {
      return;
    }

    const checkReviews = async () => {
      const map = {};

      for (const item of order.items || []) {
        try {
          if (!item.product?._id || !order._id) {
            continue;
          }

          const res = await reviewService.checkReviewed(
            item.product._id,
            order._id,
          );

          map[item.product._id] = res.reviewed;
        } catch (err) {
          map[item.product?._id] = false;
        }
      }

      setReviewedMap(map);
    };

    checkReviews();
  }, [order]);

  // ============================================================
  // FORMAT PRICE
  // ============================================================

  const formatPrice = (price = 0) => {
    return `${Number(price).toLocaleString("vi-VN")} đ`;
  };

  // ============================================================
  // STATUS
  // ============================================================

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
        return status || "Không xác định";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#F59E0B";

      case "confirmed":
        return "#2563EB";

      case "shipping":
        return "#2563EB";

      case "delivered":
        return "#16A34A";

      case "cancelled":
        return "#DC2626";

      default:
        return "#64748B";
    }
  };

  const statusColor = getStatusColor(order?.status);

  // ============================================================
  // PAYMENT
  // ============================================================

  const getPaymentMethod = (paymentMethod) => {
    if (paymentMethod === "vnpay") {
      return {
        title: "Thanh toán VNPAY",
        subtitle: "Thanh toán trực tuyến",
        icon: "card-outline",
      };
    }

    return {
      title: "Thanh toán khi nhận hàng",
      subtitle: "Thanh toán bằng tiền mặt",
      icon: "cash-outline",
    };
  };

  // ============================================================
  // DATE
  // ============================================================

  const formatDate = (date) => {
    if (!date) return "--/--/----";

    try {
      const d = new Date(date);

      return d.toLocaleDateString("vi-VN");
    } catch {
      return "--/--/----";
    }
  };

  const formatDateTime = (date) => {
    if (!date) return "";

    try {
      const d = new Date(date);

      return `${formatDate(date)} • ${d.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } catch {
      return "";
    }
  };

  // ============================================================
  // CANCEL ORDER
  // ============================================================

  const handleCancelOrder = () => {
    if (!order?._id) {
      Alert.alert("Lỗi", "Không tìm thấy mã đơn hàng");
      return;
    }

    if (!token) {
      Alert.alert("Lỗi", "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      return;
    }

    // Kiểm tra ngay trên frontend
    if (!["pending", "confirmed"].includes(order.status)) {
      Alert.alert("Không thể hủy", "Đơn hàng hiện tại không thể hủy.");
      return;
    }

    // VNPAY đã thanh toán thì không cho hủy
    if (order.paymentMethod === "vnpay" && order.paymentStatus === "paid") {
      Alert.alert(
        "Không thể hủy",
        "Đơn hàng đã thanh toán VNPAY và không thể hủy.",
      );
      return;
    }

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
              setCancelling(true);

              console.log("=================================");
              console.log("🗑️ BẮT ĐẦU HỦY ĐƠN");
              console.log("Order ID:", order._id);
              console.log("Status:", order.status);
              console.log("Payment:", order.paymentMethod);
              console.log("Payment Status:", order.paymentStatus);
              console.log("=================================");

              const response = await cancelOrderApi(order._id, token);

              console.log("📥 API HỦY ĐƠN:", response);

              if (!response?.success) {
                throw new Error(response?.message || "Không thể hủy đơn hàng");
              }

              // Load lại order từ backend
              await fetchOrderDetail();

              Alert.alert(
                "Hủy đơn thành công",
                "Đơn hàng của bạn đã được hủy.",
              );
            } catch (error) {
              console.log(
                "❌ LỖI HỦY ĐƠN:",
                error?.response?.data || error?.message,
              );

              const message =
                error?.response?.data?.message ||
                error?.message ||
                "Không thể hủy đơn hàng";

              Alert.alert("Không thể hủy đơn", message);
            } finally {
              setCancelling(false);
            }
          },
        },
      ],
    );
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#0F172A" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Chi tiết đơn hàng</Text>

          <View style={styles.iconButton} />
        </View>

        <View style={styles.center}>
          <ActivityIndicator size="large" color="#1264F5" />

          <Text style={styles.loadingText}>Đang tải chi tiết đơn hàng...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (error || !order) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#0F172A" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Chi tiết đơn hàng</Text>

          <View style={styles.iconButton} />
        </View>

        <View style={styles.center}>
          <View style={styles.errorIcon}>
            <Ionicons name="alert-circle-outline" size={34} color="#EF4444" />
          </View>

          <Text style={styles.errorTitle}>Không thể tải đơn hàng</Text>

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

  // ============================================================
  // VARIABLES
  // ============================================================

  const payment = getPaymentMethod(order.paymentMethod);

  const subtotal = Number(order.subtotal || 0);

  const shippingFee = Number(order.shippingFee || 0);

  const discount = Number(order.discount || 0);

  /*
   * Nếu backend đã có VAT thì lấy VAT.
   * Nếu chưa có thì tính 8% trên subtotal - discount.
   */
  const vat = order.vat ?? Math.max(subtotal - discount, 0) * 0.08;

  // ============================================================
  // MAIN UI
  // ============================================================

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* =====================================================
          HEADER
      ====================================================== */}

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Chi tiết đơn hàng</Text>

          <Text style={styles.headerSubtitle}>
            Theo dõi tình trạng đơn hàng của bạn
          </Text>
        </View>

        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="notifications-outline" size={24} color="#0F172A" />

          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* =================================================
            HERO / ORDER STATUS
        ================================================== */}

        <View style={styles.hero}>
          {/* Watermark sneaker */}
          <View pointerEvents="none" style={styles.shoeWatermark}>
            <Image
              source={require("../../../assets/images/login-shoe.png")}
              style={styles.shoeBackgroundImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.heroTop}>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: `${statusColor}12`,
                },
              ]}
            >
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor: statusColor,
                  },
                ]}
              />

              <Text
                style={[
                  styles.statusBadgeText,
                  {
                    color: statusColor,
                  },
                ]}
              >
                {getStatusText(order.status)}
              </Text>
            </View>
          </View>

          <Text style={styles.orderCode}>Mã đơn: #{order._id}</Text>

          <Text style={styles.orderDate}>
            Ngày đặt:{" "}
            {formatDateTime(
              order.createdAt || order.orderDate || order.created_at,
            )}
          </Text>

          {/* =================================================
              TIMELINE
          ================================================== */}

          <OrderTimeline
            status={order.status}
            statusColor={statusColor}
            order={order}
          />
        </View>

        {/* =================================================
            ADDRESS
        ================================================== */}

        <SectionHeader
          icon="location-outline"
          title="Địa chỉ nhận hàng"
          // action="Sửa"
          onAction={() => {}}
        />

        <View style={styles.addressCard}>
          <Text style={styles.receiverName}>
            {order.shippingAddress?.fullName || "Nguyễn Văn A"}
          </Text>

          <Text style={styles.phoneText}>
            {order.shippingAddress?.phone || ""}
          </Text>

          <Text style={styles.addressText}>
            {order.shippingAddress?.address || "Chưa có địa chỉ"}
          </Text>
        </View>

        {/* =================================================
            PRODUCTS
        ================================================== */}

        <SectionHeader
          icon="bag-outline"
          title={`Sản phẩm đã đặt (${order.items?.length || 0})`}
        />

        <View style={styles.productsCard}>
          {(order.items || []).map((item, index) => {
            const productId = item.product?._id;

            const isReviewed = reviewedMap[productId];

            return (
              <View
                key={item._id || `${productId}-${index}`}
                style={[
                  styles.productItem,
                  index !== 0 && styles.productBorder,
                ]}
              >
                {/* Product image */}

                <View style={styles.productImageBox}>
                  <Image
                    source={{
                      uri: item.variant?.image || item.product?.image,
                    }}
                    style={styles.productImage}
                    resizeMode="contain"
                  />
                </View>

                {/* Product information */}

                <View style={styles.productInfo}>
                  <View style={styles.productHeader}>
                    <Text style={styles.productName} numberOfLines={2}>
                      {item.product?.name || "Sản phẩm"}
                    </Text>

                    <Text style={styles.productPrice}>
                      {formatPrice(item.price)}
                    </Text>
                  </View>

                  <Text style={styles.variantText}>
                    {item.variant?.colorName ||
                      item.variant?.color ||
                      "Màu mặc định"}
                    {"  •  "}
                    Size {item.variant?.size || "N/A"}
                  </Text>

                  <View style={styles.quantityRow}>
                    <Text style={styles.quantityText}>x{item.quantity}</Text>

                    {order.status === "delivered" &&
                      productId &&
                      (isReviewed ? (
                        <View style={styles.reviewedBadge}>
                          <Ionicons
                            name="checkmark-circle"
                            size={15}
                            color="#16A34A"
                          />

                          <Text style={styles.reviewedText}>Đã đánh giá</Text>
                        </View>
                      ) : (
                        <TouchableOpacity
                          style={styles.reviewButton}
                          onPress={() =>
                            navigation.navigate("CreateReview", {
                              productId,
                              orderId: order._id,
                              productName: item.product?.name || "Sản phẩm",
                            })
                          }
                        >
                          <Ionicons
                            name="star-outline"
                            size={14}
                            color="#1264F5"
                          />

                          <Text style={styles.reviewButtonText}>Đánh giá</Text>
                        </TouchableOpacity>
                      ))}
                  </View>
                </View>
              </View>
            );
          })}

          {/* Review summary */}

          {order.status === "delivered" &&
            Object.keys(reviewedMap).length > 0 && (
              <View style={styles.reviewSummary}>
                <View style={styles.reviewSummaryIcon}>
                  <Ionicons name="star" size={17} color="#16A34A" />
                </View>

                <View style={styles.reviewSummaryContent}>
                  <Text style={styles.reviewSummaryTitle}>
                    Bạn đã đánh giá{" "}
                    {Object.values(reviewedMap).filter(Boolean).length}/
                    {order.items?.length || 0} sản phẩm
                  </Text>

                  <Text style={styles.reviewSummarySubtitle}>
                    Chia sẻ trải nghiệm của bạn về sản phẩm
                  </Text>
                </View>

                <Ionicons name="chevron-forward" size={20} color="#16A34A" />
              </View>
            )}
        </View>

        {/* =================================================
            PAYMENT
        ================================================== */}

        <SectionHeader icon="card-outline" title="Thanh toán" />

        <View style={styles.paymentCard}>
          <PriceRow label="Tạm tính" value={formatPrice(subtotal)} />

          <PriceRow label="Phí vận chuyển" value={formatPrice(shippingFee)} />

          <PriceRow
            label="Giảm giá"
            value={`-${formatPrice(discount)}`}
            valueStyle={styles.discountValue}
          />

          <PriceRow label="Thuế VAT (8%)" value={formatPrice(vat)} />

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tổng thanh toán</Text>

            <Text style={styles.totalValue}>{formatPrice(order.total)}</Text>
          </View>
        </View>

        {/* =================================================
            PAYMENT METHOD
        ================================================== */}

        <SectionHeader icon="wallet-outline" title="Phương thức thanh toán" />

        <TouchableOpacity activeOpacity={0.8} style={styles.paymentMethodCard}>
          <View style={styles.paymentIconBox}>
            <Ionicons name={payment.icon} size={25} color="#1264F5" />
          </View>

          <View style={styles.paymentMethodInfo}>
            <Text style={styles.paymentMethodTitle}>{payment.title}</Text>

            <Text style={styles.paymentMethodSubtitle}>{payment.subtitle}</Text>
          </View>

          <Ionicons name="chevron-forward" size={20} color="#64748B" />
        </TouchableOpacity>

        {/* =================================================
            CANCEL
        ================================================== */}

        {(order.status === "pending" || order.status === "confirmed") && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancelOrder}
            activeOpacity={0.8}
          >
            <Ionicons name="close-circle-outline" size={20} color="#EF4444" />

            <Text style={styles.cancelButtonText}>Hủy đơn hàng</Text>
          </TouchableOpacity>
        )}

        {/* =================================================
            SECURITY
        ================================================== */}

        <View style={styles.securityFooter}>
          <Ionicons name="lock-closed-outline" size={14} color="#94A3B8" />

          <Text style={styles.securityText}>
            Thông tin đơn hàng được bảo mật tuyệt đối
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ============================================================
// SECTION HEADER
// ============================================================

function SectionHeader({ icon, title, action, onAction }) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionTitleWrapper}>
        <Ionicons name={icon} size={20} color="#1264F5" />

        <Text style={styles.sectionTitle}>{title}</Text>
      </View>

      {action && (
        <TouchableOpacity
          onPress={onAction}
          hitSlop={{
            top: 10,
            bottom: 10,
            left: 10,
            right: 10,
          }}
        >
          <Text style={styles.sectionAction}>{action}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ============================================================
// PRICE ROW
// ============================================================

function PriceRow({ label, value, valueStyle }) {
  return (
    <View style={styles.priceRow}>
      <Text style={styles.priceLabel}>{label}</Text>

      <Text style={[styles.priceValue, valueStyle]}>{value}</Text>
    </View>
  );
}

// ============================================================
// ORDER TIMELINE
// ============================================================

function OrderTimeline({ status, statusColor }) {
  const steps = [
    {
      key: "pending",
      title: "Chờ xác nhận",
      icon: "receipt-outline",
    },
    {
      key: "confirmed",
      title: "Đã xác nhận",
      icon: "checkmark-outline",
    },
    {
      key: "shipping",
      title: "Đang giao",
      icon: "car-outline",
    },
    {
      key: "delivered",
      title: "Đã giao",
      icon: "checkmark-outline",
    },
  ];

  const getStepIndex = () => {
    switch (status) {
      case "pending":
        return 0;

      case "confirmed":
        return 1;

      case "shipping":
        return 2;

      case "delivered":
        return 3;

      default:
        return -1;
    }
  };

  const currentIndex = getStepIndex();

  if (status === "cancelled") {
    return (
      <View style={styles.cancelledTimeline}>
        <View style={styles.cancelledTimelineIcon}>
          <Ionicons name="close" size={19} color="#DC2626" />
        </View>

        <Text style={styles.cancelledTimelineText}>Đơn hàng đã được hủy</Text>
      </View>
    );
  }

  return (
    <View style={styles.timeline}>
      {steps.map((step, index) => {
        const completed = index <= currentIndex;

        const active = index === currentIndex;

        return (
          <React.Fragment key={step.key}>
            <View style={styles.timelineStep}>
              <View
                style={[
                  styles.timelineCircle,
                  completed && {
                    backgroundColor: active
                      ? "#1264F5"
                      : status === "delivered"
                        ? "#16A34A"
                        : "#E8F0FF",
                  },
                  completed && active && styles.timelineActive,
                ]}
              >
                <Ionicons
                  name={step.icon}
                  size={14}
                  color={
                    completed
                      ? active
                        ? "#FFFFFF"
                        : status === "delivered"
                          ? "#FFFFFF"
                          : "#1264F5"
                      : "#CBD5E1"
                  }
                />
              </View>

              <Text
                style={[
                  styles.timelineLabel,
                  completed && styles.timelineLabelActive,
                  active && styles.timelineLabelCurrent,
                ]}
                numberOfLines={1}
              >
                {step.title}
              </Text>

              <Text style={styles.timelineDate}>
                {completed ? "Đã cập nhật" : ""}
              </Text>
            </View>

            {index < steps.length - 1 && (
              <View
                style={[
                  styles.timelineLine,
                  index < currentIndex && {
                    backgroundColor:
                      status === "delivered" ? "#16A34A" : "#1264F5",
                  },
                ]}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({
  // ==========================================================
  // BASE
  // ==========================================================

  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  scrollContent: {
    paddingHorizontal: 18,
    paddingBottom: 40,
  },

  // ==========================================================
  // HEADER
  // ==========================================================

  header: {
    minHeight: 76,
    paddingHorizontal: 18,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    backgroundColor: "#F8FAFC",

    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  iconButton: {
    width: 42,
    height: 42,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 21,
  },

  headerCenter: {
    flex: 1,
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.4,
  },

  headerSubtitle: {
    marginTop: 3,

    fontSize: 11,
    color: "#64748B",
  },

  notificationDot: {
    position: "absolute",

    width: 7,
    height: 7,

    borderRadius: 4,

    backgroundColor: "#EF4444",

    right: 8,
    top: 8,

    borderWidth: 1,
    borderColor: "#FFFFFF",
  },

  // ==========================================================
  // HERO
  // ==========================================================

  hero: {
    marginTop: 12,
    marginBottom: 18,

    paddingHorizontal: 4,
    paddingTop: 18,
    paddingBottom: 4,

    position: "relative",

    overflow: "hidden",
  },

  shoeWatermark: {
    position: "absolute",

    right: -45,
    top: -12,

    width: 230,
    height: 150,

    opacity: 0.13,

    zIndex: 0,

    transform: [
      {
        rotate: "-12deg",
      },
    ],
  },

  shoeBackgroundImage: {
    width: "100%",
    height: "100%",
  },

  heroTop: {
    flexDirection: "row",
    alignItems: "center",
    zIndex: 2,
  },

  orderCode: {
    marginTop: 13,

    fontSize: 14,
    fontWeight: "700",

    color: "#1E293B",

    zIndex: 2,
  },

  orderDate: {
    marginTop: 5,

    fontSize: 12,
    color: "#64748B",

    zIndex: 2,
  },

  statusBadge: {
    paddingHorizontal: 11,
    paddingVertical: 7,

    borderRadius: 20,

    flexDirection: "row",
    alignItems: "center",
  },

  statusDot: {
    width: 7,
    height: 7,

    borderRadius: 4,

    marginRight: 7,
  },

  statusBadgeText: {
    fontSize: 13,
    fontWeight: "800",
  },

  orderCode: {
    marginTop: 13,

    fontSize: 14,
    fontWeight: "700",

    color: "#1E293B",
  },

  orderDate: {
    marginTop: 5,

    fontSize: 12,
    color: "#64748B",
  },

  // ==========================================================
  // TIMELINE
  // ==========================================================

  timeline: {
    marginTop: 24,

    flexDirection: "row",
    alignItems: "flex-start",

    paddingHorizontal: 1,
  },

  timelineStep: {
    flex: 1,
    alignItems: "center",
  },

  timelineCircle: {
    width: 28,
    height: 28,

    borderRadius: 14,

    backgroundColor: "#F1F5F9",

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  timelineActive: {
    width: 32,
    height: 32,

    borderRadius: 16,

    marginTop: -2,

    shadowColor: "#1264F5",
    shadowOpacity: 0.22,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 4,
  },

  timelineLine: {
    height: 2,

    flex: 0.6,

    marginTop: 13,

    backgroundColor: "#E2E8F0",
  },

  timelineLabel: {
    marginTop: 8,

    fontSize: 9.5,
    color: "#94A3B8",

    textAlign: "center",

    fontWeight: "600",
  },

  timelineLabelActive: {
    color: "#475569",
  },

  timelineLabelCurrent: {
    color: "#1264F5",
    fontWeight: "800",
  },

  timelineDate: {
    marginTop: 3,

    minHeight: 11,

    fontSize: 8.5,

    color: "#94A3B8",

    textAlign: "center",
  },

  cancelledTimeline: {
    marginTop: 20,

    padding: 13,

    borderRadius: 14,

    backgroundColor: "#FEF2F2",

    flexDirection: "row",
    alignItems: "center",
  },

  cancelledTimelineIcon: {
    width: 30,
    height: 30,

    borderRadius: 15,

    backgroundColor: "#FEE2E2",

    alignItems: "center",
    justifyContent: "center",
  },

  cancelledTimelineText: {
    marginLeft: 10,

    fontSize: 13,
    fontWeight: "700",

    color: "#DC2626",
  },

  // ==========================================================
  // SECTION
  // ==========================================================

  sectionHeader: {
    marginTop: 4,
    marginBottom: 10,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  sectionTitleWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },

  sectionTitle: {
    marginLeft: 8,

    fontSize: 15,
    fontWeight: "800",

    color: "#0F172A",
  },

  sectionAction: {
    fontSize: 13,
    fontWeight: "700",

    color: "#1264F5",
  },

  // ==========================================================
  // ADDRESS
  // ==========================================================

  addressCard: {
    backgroundColor: "#FFFFFF",

    borderRadius: 16,

    padding: 15,

    marginBottom: 18,

    borderWidth: 1,
    borderColor: "#EEF2F7",

    shadowColor: "#0F172A",
    shadowOpacity: 0.035,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 1,
  },

  receiverName: {
    fontSize: 14,
    fontWeight: "800",

    color: "#0F172A",
  },

  phoneText: {
    marginTop: 5,

    fontSize: 12,

    color: "#64748B",
  },

  addressText: {
    marginTop: 6,

    fontSize: 12,

    lineHeight: 19,

    color: "#64748B",
  },

  // ==========================================================
  // PRODUCTS
  // ==========================================================

  productsCard: {
    backgroundColor: "#FFFFFF",

    borderRadius: 16,

    paddingHorizontal: 12,

    marginBottom: 18,

    borderWidth: 1,
    borderColor: "#EEF2F7",

    shadowColor: "#0F172A",
    shadowOpacity: 0.035,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 1,
  },

  productItem: {
    paddingVertical: 13,

    flexDirection: "row",
  },

  productBorder: {
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },

  productImageBox: {
    width: 82,
    height: 82,

    borderRadius: 13,

    backgroundColor: "#F8FAFC",

    alignItems: "center",
    justifyContent: "center",

    overflow: "hidden",
  },

  productImage: {
    width: 76,
    height: 76,
  },

  productInfo: {
    flex: 1,

    marginLeft: 12,

    justifyContent: "space-between",
  },

  productHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  productName: {
    flex: 1,

    paddingRight: 8,

    fontSize: 13,

    lineHeight: 18,

    fontWeight: "800",

    color: "#0F172A",
  },

  productPrice: {
    fontSize: 12,

    fontWeight: "800",

    color: "#1264F5",

    textAlign: "right",
  },

  variantText: {
    marginTop: 5,

    fontSize: 11,

    color: "#64748B",
  },

  quantityRow: {
    marginTop: 7,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  quantityText: {
    fontSize: 11,

    color: "#64748B",

    fontWeight: "600",
  },

  reviewButton: {
    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 9,
    paddingVertical: 5,

    borderRadius: 8,

    backgroundColor: "#EFF6FF",

    borderWidth: 1,
    borderColor: "#DBEAFE",
  },

  reviewButtonText: {
    marginLeft: 4,

    fontSize: 10,

    fontWeight: "700",

    color: "#1264F5",
  },

  reviewedBadge: {
    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 7,
    paddingVertical: 4,

    borderRadius: 8,

    backgroundColor: "#F0FDF4",
  },

  reviewedText: {
    marginLeft: 4,

    fontSize: 10,

    fontWeight: "700",

    color: "#16A34A",
  },

  // ==========================================================
  // REVIEW SUMMARY
  // ==========================================================

  reviewSummary: {
    marginTop: 2,
    marginBottom: 12,

    padding: 11,

    borderRadius: 12,

    borderWidth: 1,
    borderColor: "#BBF7D0",

    backgroundColor: "#F0FDF4",

    flexDirection: "row",
    alignItems: "center",
  },

  reviewSummaryIcon: {
    width: 30,
    height: 30,

    borderRadius: 15,

    backgroundColor: "#DCFCE7",

    alignItems: "center",
    justifyContent: "center",
  },

  reviewSummaryContent: {
    flex: 1,

    marginLeft: 9,
  },

  reviewSummaryTitle: {
    fontSize: 11,

    fontWeight: "800",

    color: "#15803D",
  },

  reviewSummarySubtitle: {
    marginTop: 2,

    fontSize: 9.5,

    color: "#65A30D",
  },

  // ==========================================================
  // PAYMENT
  // ==========================================================

  paymentCard: {
    backgroundColor: "#FFFFFF",

    borderRadius: 16,

    padding: 15,

    marginBottom: 18,

    borderWidth: 1,
    borderColor: "#EEF2F7",

    shadowColor: "#0F172A",
    shadowOpacity: 0.035,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 1,
  },

  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    marginBottom: 10,
  },

  priceLabel: {
    fontSize: 12,

    color: "#64748B",
  },

  priceValue: {
    fontSize: 12,

    color: "#1E293B",

    fontWeight: "600",
  },

  discountValue: {
    color: "#EF4444",
  },

  divider: {
    height: 1,

    backgroundColor: "#E2E8F0",

    marginVertical: 4,
  },

  totalRow: {
    marginTop: 8,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  totalLabel: {
    fontSize: 14,

    fontWeight: "800",

    color: "#0F172A",
  },

  totalValue: {
    fontSize: 19,

    fontWeight: "900",

    color: "#1264F5",

    letterSpacing: -0.4,
  },

  // ==========================================================
  // PAYMENT METHOD
  // ==========================================================

  paymentMethodCard: {
    backgroundColor: "#FFFFFF",

    borderRadius: 16,

    padding: 13,

    marginBottom: 20,

    borderWidth: 1,
    borderColor: "#EEF2F7",

    flexDirection: "row",
    alignItems: "center",

    shadowColor: "#0F172A",
    shadowOpacity: 0.035,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 1,
  },

  paymentIconBox: {
    width: 46,
    height: 46,

    borderRadius: 12,

    backgroundColor: "#EFF6FF",

    alignItems: "center",
    justifyContent: "center",
  },

  paymentMethodInfo: {
    flex: 1,

    marginLeft: 11,
  },

  paymentMethodTitle: {
    fontSize: 13,

    fontWeight: "800",

    color: "#0F172A",
  },

  paymentMethodSubtitle: {
    marginTop: 4,

    fontSize: 11,

    color: "#64748B",
  },

  // ==========================================================
  // CANCEL
  // ==========================================================

  cancelButton: {
    height: 50,

    borderRadius: 13,

    backgroundColor: "#FFFFFF",

    borderWidth: 1.2,
    borderColor: "#F87171",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    marginBottom: 15,
  },

  cancelButtonText: {
    marginLeft: 8,

    fontSize: 14,

    fontWeight: "800",

    color: "#EF4444",
  },

  // ==========================================================
  // SECURITY
  // ==========================================================

  securityFooter: {
    paddingTop: 2,
    paddingBottom: 8,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  securityText: {
    marginLeft: 6,

    fontSize: 10.5,

    color: "#94A3B8",
  },

  // ==========================================================
  // LOADING / ERROR
  // ==========================================================

  center: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 30,
  },

  loadingText: {
    marginTop: 12,

    fontSize: 13,

    color: "#64748B",
  },

  errorIcon: {
    width: 64,
    height: 64,

    borderRadius: 32,

    backgroundColor: "#FEF2F2",

    alignItems: "center",
    justifyContent: "center",
  },

  errorTitle: {
    marginTop: 15,

    fontSize: 17,

    fontWeight: "800",

    color: "#0F172A",
  },

  errorText: {
    marginTop: 7,

    fontSize: 13,

    color: "#64748B",

    textAlign: "center",
  },

  retryButton: {
    marginTop: 18,

    paddingHorizontal: 25,
    paddingVertical: 11,

    borderRadius: 10,

    backgroundColor: "#1264F5",
  },

  retryText: {
    color: "#FFFFFF",

    fontSize: 13,

    fontWeight: "800",
  },
});
