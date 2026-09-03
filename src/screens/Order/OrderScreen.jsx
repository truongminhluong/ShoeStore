import React, { useCallback, useMemo, useState } from "react";

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  Platform,
} from "react-native";

import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import COLORS from "../../constants/colors";
import useOrderViewModel from "../../viewmodels/useOrderViewModel";

/**
 * ============================================================
 * RYDE — ORDER SCREEN
 * Visual direction:
 * - Login screen
 * - Account screen
 * - Editorial / premium sportswear
 * - Navy + electric blue
 * - White canvas
 * - Large typography
 * - Very subtle product watermark
 * ============================================================
 */

const COLORS_UI = {
  background: "#FFFFFF",
  surface: "#FFFFFF",
  navy: "#111827",
  navySoft: "#263449",
  blue: "#2563EB",
  blueSoft: "#EFF6FF",

  text: "#111827",
  textSecondary: "#64748B",
  textMuted: "#94A3B8",

  border: "#E2E8F0",
  borderSoft: "#EEF2F7",

  success: "#16A34A",
  successBg: "#ECFDF3",

  warning: "#D97706",
  warningBg: "#FFF8E7",

  purple: "#6D4AFF",
  purpleBg: "#F3F0FF",

  danger: "#DC2626",
  dangerBg: "#FEF2F2",

  gray: "#64748B",
  grayBg: "#F1F5F9",
};

const HEADER_SHOE = require("../../../assets/images/login-shoe.png");

/**
 * Nếu product của backend có tên field ảnh khác nhau,
 * helper này vẫn cố gắng lấy ảnh phổ biến nhất.
 */
const getProductImage = (product) => {
  if (!product) return null;

  if (typeof product.image === "string") {
    return product.image;
  }

  if (typeof product.imageUrl === "string") {
    return product.imageUrl;
  }

  if (typeof product.thumbnail === "string") {
    return product.thumbnail;
  }

  if (Array.isArray(product.images) && product.images.length > 0) {
    const first = product.images[0];

    if (typeof first === "string") {
      return first;
    }

    if (typeof first?.url === "string") {
      return first.url;
    }
  }

  return null;
};

export default function OrderScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  const { orders = [], loading, error, fetchOrders } = useOrderViewModel();

  const [activeTab, setActiveTab] = useState("all");
  const [showAll, setShowAll] = useState(false);

  /**
   * ==========================================================
   * LOAD ORDERS
   * ==========================================================
   */

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [fetchOrders]),
  );

  /**
   * ==========================================================
   * FORMAT
   * ==========================================================
   */

  const formatPrice = (price = 0) => {
    return `${Number(price).toLocaleString("vi-VN")} đ`;
  };

  const formatDate = (date) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    const day = String(parsedDate.getDate()).padStart(2, "0");
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const year = parsedDate.getFullYear();

    const hours = String(parsedDate.getHours()).padStart(2, "0");
    const minutes = String(parsedDate.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} • ${hours}:${minutes}`;
  };

  /**
   * ==========================================================
   * STATUS
   * ==========================================================
   */

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Chờ xác nhận";

      case "confirmed":
        return "Đã xác nhận";

      case "shipping":
        return "Đang giao";

      case "delivered":
        return "Đã giao";

      case "cancelled":
        return "Đã hủy";

      default:
        return status || "Không xác định";
    }
  };

  const getStatusTheme = (status) => {
    switch (status) {
      case "pending":
        return {
          color: COLORS_UI.warning,
          background: COLORS_UI.warningBg,
        };

      case "confirmed":
        return {
          color: COLORS_UI.blue,
          background: COLORS_UI.blueSoft,
        };

      case "shipping":
        return {
          color: COLORS_UI.blue,
          background: COLORS_UI.blueSoft,
        };

      case "delivered":
        return {
          color: COLORS_UI.success,
          background: COLORS_UI.successBg,
        };

      case "cancelled":
        return {
          color: COLORS_UI.gray,
          background: COLORS_UI.grayBg,
        };

      default:
        return {
          color: COLORS_UI.gray,
          background: COLORS_UI.grayBg,
        };
    }
  };

  /**
   * ==========================================================
   * FILTER
   * ==========================================================
   */

  const tabs = [
    {
      id: "all",
      label: "Tất cả",
    },
    {
      id: "pending",
      label: "Chờ xác nhận",
    },
    {
      id: "shipping",
      label: "Đang giao",
    },
    {
      id: "delivered",
      label: "Đã giao",
    },
    {
      id: "cancelled",
      label: "Đã hủy",
    },
  ];

  const filteredOrders = useMemo(() => {
    if (activeTab === "all") {
      return orders;
    }

    return orders.filter((order) => {
      if (activeTab === "shipping") {
        return order.status === "confirmed" || order.status === "shipping";
      }

      return order.status === activeTab;
    });
  }, [orders, activeTab]);

  /**
   * Chỉ hiển thị 3 đơn.
   * Khi bấm "Xem thêm" mới render toàn bộ.
   */
  const visibleOrders = useMemo(() => {
    if (showAll) {
      return filteredOrders;
    }

    return filteredOrders.slice(0, 3);
  }, [filteredOrders, showAll]);

  const hasMoreOrders = !showAll && filteredOrders.length > 3;

  /**
   * ==========================================================
   * ORDER DATE
   * ==========================================================
   */

  const getOrderDate = (item) => {
    return item.createdAt || item.orderDate || item.date || item.created_at;
  };

  /**
   * ==========================================================
   * PRODUCT THUMBNAIL
   * ==========================================================
   */

  const ProductThumbnail = ({ orderItem, size = "normal" }) => {
    const image = getProductImage(orderItem?.product);

    const imageStyle =
      size === "large" ? styles.productImageLarge : styles.productImage;

    return (
      <View
        style={[
          styles.productImageBox,
          size === "large" && styles.productImageBoxLarge,
        ]}
      >
        {image ? (
          <Image
            source={{ uri: image }}
            style={imageStyle}
            resizeMode="contain"
          />
        ) : (
          <Ionicons
            name="footsteps-outline"
            size={size === "large" ? 38 : 28}
            color={COLORS_UI.textMuted}
          />
        )}
      </View>
    );
  };

  /**
   * ==========================================================
   * ORDER CARD
   * ==========================================================
   */

  const renderOrderItem = ({ item }) => {
    const statusTheme = getStatusTheme(item.status);

    const items = Array.isArray(item.items) ? item.items : [];

    const itemCount = items.reduce(
      (sum, product) => sum + Number(product.quantity || 0),
      0,
    );

    const isMultiProduct = items.length > 1;

    const openOrderDetail = () => {
      navigation.navigate("OrderDetail", {
        orderId: item._id,
      });
    };

    const openOrderTracking = () => {
      navigation.navigate("OrderDetail", {
        orderId: item._id,
        tracking: true,
      });
    };

    return (
      <View style={styles.orderCard}>
        {/* ====================================================
            ORDER HEADER
        ==================================================== */}

        <View style={styles.orderCardHeader}>
          <View style={styles.orderHeaderLeft}>
            <Text style={styles.orderId}>#{item._id}</Text>

            <Text style={styles.orderDate}>
              {formatDate(getOrderDate(item))}
            </Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: statusTheme.background,
              },
            ]}
          >
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor: statusTheme.color,
                },
              ]}
            />

            <Text
              style={[
                styles.statusText,
                {
                  color: statusTheme.color,
                },
              ]}
            >
              {getStatusText(item.status)}
            </Text>
          </View>
        </View>

        {/* ====================================================
            SINGLE PRODUCT
        ==================================================== */}

        {!isMultiProduct && items[0] && (
          <View style={styles.singleProductSection}>
            <ProductThumbnail orderItem={items[0]} size="large" />

            <View style={styles.singleProductContent}>
              <Text style={styles.productName} numberOfLines={2}>
                {items[0].product?.name || "Sản phẩm"}
              </Text>

              <Text style={styles.productMeta}>
                {items[0].variant?.colorName || "—"} •{" "}
                {items[0].variant?.size || "—"} • x
                {Number(items[0].quantity || 0)}
              </Text>

              <Text style={styles.productPrice}>
                {formatPrice(
                  Number(items[0].price || 0) * Number(items[0].quantity || 0),
                )}
              </Text>
            </View>
          </View>
        )}

        {/* ====================================================
            MULTI PRODUCT
        ==================================================== */}

        {isMultiProduct && (
          <View style={styles.productsSection}>
            <View style={styles.productsTitleRow}>
              <Text style={styles.productsTitle}>
                Sản phẩm đã đặt ({items.length})
              </Text>
            </View>

            {items.map((orderItem, index) => {
              const product = orderItem.product;

              const productName = product?.name || "Sản phẩm";
              const size = orderItem.variant?.size || "—";
              const color = orderItem.variant?.colorName || "—";
              const quantity = Number(orderItem.quantity || 0);
              const itemTotal = Number(orderItem.price || 0) * quantity;

              return (
                <View
                  key={`${item._id}-${index}`}
                  style={[
                    styles.productRow,
                    index === items.length - 1 && styles.productRowLast,
                  ]}
                >
                  <ProductThumbnail orderItem={orderItem} size="normal" />

                  <View style={styles.productContent}>
                    <Text style={styles.productName} numberOfLines={2}>
                      {productName}
                    </Text>

                    <Text style={styles.productMeta}>
                      {color} • {size}
                    </Text>

                    <Text style={styles.productQuantity}>x{quantity}</Text>
                  </View>

                  <Text style={styles.productPrice}>
                    {formatPrice(itemTotal)}
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        {/* ====================================================
            FOOTER
        ==================================================== */}

        <View style={styles.cardDivider} />

        {isMultiProduct ? (
          <>
            <View style={styles.summaryRow}>
              <View style={styles.summaryLabelRow}>
                <Ionicons
                  name="cube-outline"
                  size={22}
                  color={COLORS_UI.textMuted}
                />

                <Text style={styles.summaryLabel}>Tổng số lượng</Text>
              </View>

              <Text style={styles.summaryValue}>{itemCount} sản phẩm</Text>
            </View>

            <View style={styles.summaryRow}>
              <View style={styles.summaryLabelRow}>
                <Ionicons
                  name="card-outline"
                  size={22}
                  color={COLORS_UI.textMuted}
                />

                <Text style={styles.summaryLabel}>Tổng tiền</Text>
              </View>

              <Text style={styles.summaryTotal}>{formatPrice(item.total)}</Text>
            </View>

            <View style={styles.multiActionRow}>
              <TouchableOpacity
                style={styles.secondaryAction}
                activeOpacity={0.8}
                onPress={openOrderDetail}
              >
                <Ionicons
                  name="create-outline"
                  size={19}
                  color={COLORS_UI.navy}
                />

                <Text style={styles.secondaryActionText}>
                  Chi tiết đơn hàng
                </Text>

                <Ionicons
                  name="arrow-forward"
                  size={18}
                  color={COLORS_UI.navy}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.primaryAction}
                activeOpacity={0.85}
                onPress={openOrderTracking}
              >
                <Text style={styles.primaryActionText}>Theo dõi đơn hàng</Text>

                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.orderFooter}>
            <View style={styles.singleTotalBlock}>
              <Text style={styles.totalLabel}>Tổng tiền</Text>

              <Text style={styles.singleTotalPrice}>
                {formatPrice(item.total)}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.detailButton}
              activeOpacity={0.8}
              onPress={openOrderDetail}
            >
              <Text style={styles.detailButtonText}>Xem chi tiết</Text>

              <Ionicons name="arrow-forward" size={18} color={COLORS_UI.navy} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  /**
   * ==========================================================
   * HEADER
   * ==========================================================
   */

  const ScreenHeader = () => {
    return (
      <View style={styles.header}>
        <View style={styles.dotDecoration}>
          {Array.from({ length: 12 }).map((_, index) => (
            <View key={index} style={styles.dot} />
          ))}
        </View>

        <Image
          source={HEADER_SHOE}
          resizeMode="contain"
          style={styles.headerShoe}
        />

        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={25} color={COLORS_UI.navy} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.notificationButton}
            activeOpacity={0.7}
          >
            <Ionicons
              name="notifications-outline"
              size={25}
              color={COLORS_UI.navy}
            />

            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        <View style={styles.titleBlock}>
          <Text style={styles.screenTitle}>Đơn hàng của tôi</Text>

          <Text style={styles.screenSubtitle}>
            Theo dõi và quản lý tất cả đơn hàng của bạn
          </Text>

          <View style={styles.titleAccent} />
        </View>
      </View>
    );
  };

  /**
   * ==========================================================
   * TAB BAR
   * ==========================================================
   */

  const OrderTabs = () => {
    return (
      <View style={styles.tabsWrapper}>
        <FlatList
          horizontal
          data={tabs}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContent}
          renderItem={({ item }) => {
            const active = activeTab === item.id;

            return (
              <TouchableOpacity
                activeOpacity={0.75}
                style={styles.tab}
                onPress={() => {
                  setActiveTab(item.id);
                  setShowAll(false);
                }}
              >
                <Text style={[styles.tabText, active && styles.tabTextActive]}>
                  {item.label}
                </Text>

                {active && <View style={styles.tabIndicator} />}
              </TouchableOpacity>
            );
          }}
        />

        <View style={styles.tabsBottomLine} />
      </View>
    );
  };


  /**
   * ==========================================================
   * LOADING
   * ==========================================================
   */

  if (loading && orders.length === 0) {
    return (
      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top,
          },
        ]}
      >
        <ScreenHeader />

        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS_UI.blue} />

          <Text style={styles.loadingText}>Đang tải đơn hàng...</Text>
        </View>
      </View>
    );
  }

  /**
   * ==========================================================
   * ERROR
   * ==========================================================
   */

  if (error && orders.length === 0) {
    return (
      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top,
          },
        ]}
      >
        <ScreenHeader />

        <View style={styles.center}>
          <View style={styles.errorIcon}>
            <Ionicons
              name="alert-circle-outline"
              size={38}
              color={COLORS_UI.danger}
            />
          </View>

          <Text style={styles.errorTitle}>Không thể tải đơn hàng</Text>

          <Text style={styles.errorText}>{error}</Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchOrders}
            activeOpacity={0.85}
          >
            <Text style={styles.retryText}>Thử lại</Text>

            <Ionicons name="refresh" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  /**
   * ==========================================================
   * EMPTY
   * ==========================================================
   */

  const isEmpty = filteredOrders.length === 0;

  /**
   * ==========================================================
   * MAIN
   * ==========================================================
   */

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
        },
      ]}
    >
      <ScreenHeader />

      <OrderTabs />

      <FlatList
        data={visibleOrders}
        keyExtractor={(item) => item._id}
        renderItem={renderOrderItem}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={fetchOrders}
        contentContainerStyle={[
          styles.listContent,
          isEmpty && styles.listContentEmpty,
        ]}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="receipt-outline"
                size={38}
                color={COLORS_UI.blue}
              />
            </View>

            <Text style={styles.emptyTitle}>Chưa có đơn hàng</Text>

            <Text style={styles.emptyText}>
              {activeTab === "all"
                ? "Các đơn hàng của bạn sẽ hiển thị ở đây."
                : "Không có đơn hàng trong trạng thái này."}
            </Text>
          </View>
        }
        ListFooterComponent={
          <>
            {hasMoreOrders && (
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.showMoreButton}
                onPress={() => setShowAll(true)}
              >
                <Text style={styles.showMoreText}>Xem thêm đơn hàng</Text>

                <Ionicons
                  name="chevron-down"
                  size={19}
                  color={COLORS_UI.blue}
                />
              </TouchableOpacity>
            )}

            {showAll && filteredOrders.length > 3 && (
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.showMoreButton}
                onPress={() => setShowAll(false)}
              >
                <Text style={styles.showMoreText}>Thu gọn</Text>

                <Ionicons name="chevron-up" size={19} color={COLORS_UI.blue} />
              </TouchableOpacity>
            )}

            <View style={{ height: 110 }} />
          </>
        }
      />

    </View>
  );
}

/**
 * ============================================================
 * STYLES
 * ============================================================
 */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS_UI.background,
  },

  /**
   * ==========================================================
   * HEADER
   * ==========================================================
   */

  header: {
    minHeight: 245,
    paddingHorizontal: 24,
    position: "relative",
    overflow: "hidden",
  },

  topBar: {
    height: 62,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 5,
  },

  backButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },

  notificationButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  notificationDot: {
    position: "absolute",
    top: 8,
    right: 7,
    width: 7,
    height: 7,
    borderRadius: 99,
    backgroundColor: "#EF4444",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },

  titleBlock: {
    marginTop: 23,
    zIndex: 4,
  },

  screenTitle: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "800",
    letterSpacing: -1.1,
    color: COLORS_UI.navy,
  },

  screenSubtitle: {
    marginTop: 10,
    maxWidth: "78%",
    fontSize: 16,
    lineHeight: 24,
    color: COLORS_UI.textSecondary,
    fontWeight: "500",
  },

  titleAccent: {
    marginTop: 17,
    width: 40,
    height: 4,
    borderRadius: 10,
    backgroundColor: COLORS_UI.blue,
  },

  dotDecoration: {
    position: "absolute",
    left: 26,
    bottom: 18,
    width: 72,
    height: 48,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
    opacity: 0.7,
    zIndex: 1,
  },

  dot: {
    width: 3,
    height: 3,
    borderRadius: 10,
    backgroundColor: "#D8E1EE",
  },

  headerShoe: {
    position: "absolute",
    width: 330,
    height: 210,
    right: -62,
    top: 48,
    opacity: 0.1,
    transform: [
      {
        rotate: "-7deg",
      },
    ],
  },

  /**
   * ==========================================================
   * TABS
   * ==========================================================
   */

  tabsWrapper: {
    height: 64,
    position: "relative",
    backgroundColor: "#FFFFFF",
  },

  tabsContent: {
    paddingHorizontal: 20,
  },

  tab: {
    minWidth: 92,
    height: 64,
    marginRight: 24,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  tabText: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS_UI.textSecondary,
  },

  tabTextActive: {
    color: COLORS_UI.blue,
    fontWeight: "700",
  },

  tabIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    borderRadius: 10,
    backgroundColor: COLORS_UI.blue,
  },

  tabsBottomLine: {
    position: "absolute",
    bottom: 0,
    left: 24,
    right: 24,
    height: 1,
    backgroundColor: COLORS_UI.borderSoft,
    zIndex: -1,
  },

  /**
   * ==========================================================
   * LIST
   * ==========================================================
   */

  listContent: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 24,
  },

  listContentEmpty: {
    flexGrow: 1,
  },

  /**
   * ==========================================================
   * ORDER CARD
   * ==========================================================
   */

  orderCard: {
    backgroundColor: COLORS_UI.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS_UI.borderSoft,
    padding: 18,
    marginBottom: 14,

    ...Platform.select({
      ios: {
        shadowColor: "#0F172A",
        shadowOffset: {
          width: 0,
          height: 8,
        },
        shadowOpacity: 0.055,
        shadowRadius: 18,
      },

      android: {
        elevation: 2,
      },
    }),
  },

  orderCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  orderHeaderLeft: {
    flex: 1,
    paddingRight: 12,
  },

  orderId: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "800",
    letterSpacing: -0.2,
    color: COLORS_UI.navy,
  },

  orderDate: {
    marginTop: 5,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500",
    color: COLORS_UI.textSecondary,
  },

  statusBadge: {
    minHeight: 32,
    paddingHorizontal: 11,
    borderRadius: 99,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 10,
  },

  statusText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700",
  },

  /**
   * ==========================================================
   * PRODUCTS
   * ==========================================================
   */

  productsSection: {
    marginTop: 20,
  },

  productsTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  productsTitle: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "800",
    color: COLORS_UI.navy,
  },

  quantitySummary: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS_UI.textMuted,
  },

  singleProductSection: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
    minHeight: 118,
  },

  singleProductContent: {
    flex: 1,
    minWidth: 0,
    marginLeft: 16,
    paddingVertical: 3,
  },

  productRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 82,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: COLORS_UI.borderSoft,
  },

  productRowLast: {
    borderBottomWidth: 0,
  },

  productImageBox: {
    width: 72,
    height: 72,
    borderRadius: 17,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  productImageBoxLarge: {
    width: 100,
    height: 100,
    borderRadius: 20,
  },

  productImage: {
    width: 62,
    height: 62,
  },

  productImageLarge: {
    width: 88,
    height: 88,
  },

  productContent: {
    flex: 1,
    minWidth: 0,
    marginLeft: 14,
  },

  productName: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "700",
    color: COLORS_UI.navy,
  },

  productMeta: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500",
    color: COLORS_UI.textSecondary,
  },

  productPrice: {
    marginTop: 5,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "800",
    color: COLORS_UI.blue,
  },

  productQuantity: {
    marginTop: 2,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
    color: COLORS_UI.textSecondary,
  },

  /**
   * ==========================================================
   * FOOTER
   * ==========================================================
   */

  cardDivider: {
    height: 1,
    backgroundColor: COLORS_UI.borderSoft,
    marginTop: 8,
    marginBottom: 14,
  },

  orderFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  singleTotalBlock: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 12,
    flex: 1,
  },

  totalLabel: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500",
    color: COLORS_UI.textSecondary,
  },

  singleTotalPrice: {
    fontSize: 17,
    lineHeight: 23,
    fontWeight: "800",
    letterSpacing: -0.3,
    color: COLORS_UI.navy,
  },

  detailButton: {
    minHeight: 46,
    paddingHorizontal: 16,
    borderRadius: 13,
    borderWidth: 1.2,
    borderColor: "#AEBACB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },

  detailButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS_UI.navy,
  },

  summaryRow: {
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  summaryLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  summaryLabel: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
    color: COLORS_UI.navySoft,
  },

  summaryValue: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS_UI.textSecondary,
  },

  summaryTotal: {
    fontSize: 18,
    lineHeight: 23,
    fontWeight: "800",
    color: COLORS_UI.blue,
  },

  multiActionRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },

  secondaryAction: {
    flex: 1,
    minHeight: 48,
    paddingHorizontal: 12,
    borderRadius: 13,
    borderWidth: 1.2,
    borderColor: "#AEBACB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 7,
  },

  secondaryActionText: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: "700",
    color: COLORS_UI.navy,
  },

  primaryAction: {
    flex: 1,
    minHeight: 48,
    paddingHorizontal: 12,
    borderRadius: 13,
    backgroundColor: COLORS_UI.navy,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 7,
  },

  primaryActionText: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  /**
   * ==========================================================
   * SHOW MORE
   * ==========================================================
   */

  showMoreButton: {
    minHeight: 48,
    marginTop: 2,
    marginBottom: 10,
    alignSelf: "center",
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  showMoreText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS_UI.blue,
  },

  /**
   * ==========================================================
   * LOADING / ERROR
   * ==========================================================
   */

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  loadingText: {
    marginTop: 14,
    fontSize: 14,
    fontWeight: "500",
    color: COLORS_UI.textSecondary,
  },

  errorIcon: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: COLORS_UI.dangerBg,
    alignItems: "center",
    justifyContent: "center",
  },

  errorTitle: {
    marginTop: 18,
    fontSize: 19,
    fontWeight: "800",
    color: COLORS_UI.navy,
  },

  errorText: {
    marginTop: 8,
    maxWidth: 300,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    color: COLORS_UI.textSecondary,
  },

  retryButton: {
    marginTop: 20,
    minHeight: 46,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: COLORS_UI.navy,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  retryText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  /**
   * ==========================================================
   * EMPTY
   * ==========================================================
   */

  emptyContainer: {
    flex: 1,
    minHeight: 420,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  emptyIcon: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: COLORS_UI.blueSoft,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyTitle: {
    marginTop: 18,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "800",
    color: COLORS_UI.navy,
  },

  emptyText: {
    marginTop: 8,
    maxWidth: 280,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    color: COLORS_UI.textSecondary,
  },

  /**
   * ==========================================================
   * BOTTOM NAVIGATION
   * ==========================================================
   */

  bottomNav: {
    position: "absolute",
    left: 14,
    right: 14,
    bottom: 8,
    minHeight: 72,
    paddingTop: 8,
    paddingHorizontal: 8,

    backgroundColor: "rgba(255,255,255,0.98)",

    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS_UI.borderSoft,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",

    ...Platform.select({
      ios: {
        shadowColor: "#0F172A",
        shadowOffset: {
          width: 0,
          height: 8,
        },
        shadowOpacity: 0.08,
        shadowRadius: 20,
      },

      android: {
        elevation: 8,
      },
    }),
  },

  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 58,
  },

  navText: {
    marginTop: 4,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "600",
    color: COLORS_UI.textMuted,
  },

  navTextActive: {
    color: COLORS_UI.blue,
    fontWeight: "700",
  },
});
