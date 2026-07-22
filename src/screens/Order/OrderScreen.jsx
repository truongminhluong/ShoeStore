import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import COLORS from "../../constants/colors";

import useOrderViewModel from "../../viewmodels/useOrderViewModel";

export default function OrderScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  const { orders, loading, error, fetchOrders } = useOrderViewModel();

  // =========================
  // FORMAT TIỀN
  // =========================

  const formatPrice = (price) => {
    return `${price.toLocaleString("vi-VN")}đ`;
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
  // HIỂN THỊ ĐƠN HÀNG
  // =========================

  const renderOrderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.orderCard}
        onPress={() =>
          navigation.navigate("OrderDetail", {
            orderId: item._id,
          })
        }
      >
        {/* HEADER ĐƠN HÀNG */}

        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderLabel}>Mã đơn hàng</Text>

            <Text style={styles.orderId}>#{item._id}</Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: `${getStatusColor(item.status)}20`,
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                {
                  color: getStatusColor(item.status),
                },
              ]}
            >
              {getStatusText(item.status)}
            </Text>
          </View>
        </View>

        {/* DANH SÁCH SẢN PHẨM */}

        {item.items.map((orderItem, index) => (
          <View key={index} style={styles.productRow}>
            <View style={styles.productInfo}>
              <Text style={styles.productName} numberOfLines={1}>
                {orderItem.product?.name}
              </Text>

              <Text style={styles.productVariant}>
                Size: {orderItem.variant?.size}
                {" • "}
                {orderItem.variant?.colorName}
              </Text>

              <Text style={styles.quantity}>
                Số lượng: {orderItem.quantity}
              </Text>
            </View>

            <Text style={styles.productPrice}>
              {formatPrice(orderItem.price * orderItem.quantity)}
            </Text>
          </View>
        ))}

        {/* FOOTER */}

        <View style={styles.divider} />

        <View style={styles.orderFooter}>
          <Text style={styles.totalLabel}>Tổng cộng</Text>

          <Text style={styles.totalPrice}>{formatPrice(item.total)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top,
          },
        ]}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Đơn hàng của tôi</Text>

          <View style={{ width: 24 }} />
        </View>

        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />

          <Text style={styles.loadingText}>Đang tải đơn hàng...</Text>
        </View>
      </View>
    );
  }

  // =========================
  // LỖI
  // =========================

  if (error) {
    return (
      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top,
          },
        ]}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Đơn hàng của tôi</Text>

          <View style={{ width: 24 }} />
        </View>

        <View style={styles.center}>
          <Ionicons name="alert-circle-outline" size={60} color="#DC2626" />

          <Text style={styles.errorText}>{error}</Text>

          <TouchableOpacity style={styles.retryButton} onPress={fetchOrders}>
            <Text style={styles.retryText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
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

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Đơn hàng của tôi</Text>

        <View style={{ width: 24 }} />
      </View>

      {/* DANH SÁCH */}

      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        renderItem={renderOrderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          orders.length === 0 ? styles.emptyList : styles.listContent
        }
        refreshing={loading}
        onRefresh={fetchOrders}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={70} color={COLORS.primary} />

            <Text style={styles.emptyTitle}>Chưa có đơn hàng</Text>

            <Text style={styles.emptyText}>
              Các đơn hàng của bạn sẽ hiển thị ở đây
            </Text>
          </View>
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

  header: {
    height: 60,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8F7FF",
  },

  headerTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#1F2937",
  },

  listContent: {
    padding: 16,
    paddingBottom: 30,
  },

  orderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
  },

  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  orderLabel: {
    fontSize: 12,
    color: "#6B7280",
  },

  orderId: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1F2937",
    marginTop: 4,
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },

  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },

  productRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },

  productInfo: {
    flex: 1,
    marginRight: 10,
  },

  productName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2937",
  },

  productVariant: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 5,
  },

  quantity: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },

  productPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.primary,
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 16,
  },

  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  totalLabel: {
    fontSize: 14,
    color: "#6B7280",
  },

  totalPrice: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.primary,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  loadingText: {
    fontSize: 15,
    color: "#6B7280",
    marginTop: 12,
  },

  errorText: {
    fontSize: 15,
    color: "#DC2626",
    textAlign: "center",
    marginTop: 12,
  },

  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },

  retryText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  emptyList: {
    flexGrow: 1,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    marginTop: 16,
  },

  emptyText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 8,
  },
});
