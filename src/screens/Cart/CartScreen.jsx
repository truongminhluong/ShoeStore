import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather, Ionicons } from "@expo/vector-icons";

import Header from "../../components/home/Header";
import COLORS from "../../constants/colors";
import FONTS from "../../constants/fonts";

const INITIAL_CART_ITEMS = [
  {
    id: "1",
    brand: "NIKE",
    name: "Air Max Pulse",
    color: "White / Black",
    size: 42,
    price: 4250000,
    quantity: 1,
    image: require("../../../assets/products/shoe1.jpg"),
  },
  {
    id: "2",
    brand: "ADIDAS",
    name: "Forum Low CL",
    color: "Cloud White",
    size: 41,
    price: 2800000,
    quantity: 2,
    image: require("../../../assets/products/shoe1.jpg"),
  },
  {
    id: "3",
    brand: "PUMA",
    name: "MB.03 Toxic",
    color: "Lime Green",
    size: 43,
    price: 3650000,
    quantity: 1,
    image: require("../../../assets/products/shoe1.jpg"),
  },
];

const SHIPPING_FEE = 30000;
const DISCOUNT = 150000;

const formatCurrency = (value) => `${value.toLocaleString("vi-VN")}đ`;

export default function CartScreen() {
  const [cartItems, setCartItems] = useState(INITIAL_CART_ITEMS);
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();

  const subtotal = useMemo(
    () =>
      cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    [cartItems],
  );

  const totalItems = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems],
  );

  const shippingFee = cartItems.length > 0 ? SHIPPING_FEE : 0;
  const discount = cartItems.length > 0 ? DISCOUNT : 0;
  const total = Math.max(subtotal + shippingFee - discount, 0);

  const updateQuantity = (id, type) => {
    setCartItems((items) =>
      items.map((item) => {
        if (item.id !== id) {
          return item;
        }

        const nextQuantity =
          type === "increase"
            ? item.quantity + 1
            : Math.max(item.quantity - 1, 1);

        return {
          ...item,
          quantity: nextQuantity,
        };
      }),
    );
  };

  const removeItem = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <Header />

      <View style={styles.screen}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.content,
            {
              paddingBottom: tabBarHeight + insets.bottom + 150,
            },
          ]}
        >
          <View style={styles.heading}>
            <View>
              <Text style={styles.eyebrow}>My Cart</Text>
              <Text style={styles.title}>Giỏ hàng</Text>
            </View>

            <View style={styles.badge}>
              <Ionicons name="bag-handle" size={17} color={COLORS.white} />
              <Text style={styles.badgeText}>{totalItems}</Text>
            </View>
          </View>

          <View style={styles.deliveryCard}>
            <View style={styles.deliveryIcon}>
              <Feather name="map-pin" size={18} color={COLORS.primary} />
            </View>

            <View style={styles.deliveryInfo}>
              <Text style={styles.deliveryLabel}>Giao tới</Text>
              <Text style={styles.deliveryAddress} numberOfLines={1}>
                12 Nguyen Trai, Quan 1, TP.HCM
              </Text>
            </View>

            <TouchableOpacity activeOpacity={0.8} style={styles.changeButton}>
              <Text style={styles.changeText}>Đổi</Text>
            </TouchableOpacity>
          </View>

          {cartItems.length > 0 ? (
            <>
              <View style={styles.items}>
                {cartItems.map((item) => (
                  <View key={item.id} style={styles.cartItem}>
                    <Image source={item.image} style={styles.productImage} />

                    <View style={styles.itemBody}>
                      <View style={styles.itemTop}>
                        <View style={styles.itemTitleWrap}>
                          <Text style={styles.brand}>{item.brand}</Text>
                          <Text style={styles.productName} numberOfLines={1}>
                            {item.name}
                          </Text>
                        </View>

                        <TouchableOpacity
                          activeOpacity={0.8}
                          style={styles.deleteButton}
                          onPress={() => removeItem(item.id)}
                        >
                          <Feather name="trash-2" size={16} color="#EF4444" />
                        </TouchableOpacity>
                      </View>

                      <Text style={styles.meta} numberOfLines={1}>
                        Size {item.size} • {item.color}
                      </Text>

                      <View style={styles.itemBottom}>
                        <Text style={styles.price}>
                          {formatCurrency(item.price)}
                        </Text>
                        <View style={styles.quantity}>
                          <TouchableOpacity
                            activeOpacity={0.8}
                            style={[
                              styles.quantityButton,
                              item.quantity === 1 && styles.disabledButton,
                            ]}
                            onPress={() => updateQuantity(item.id, "decrease")}
                          >
                            <Feather
                              name="minus"
                              size={15}
                              color={
                                item.quantity === 1 ? "#B8C0CC" : COLORS.black
                              }
                            />
                          </TouchableOpacity>

                          <Text style={styles.quantityText}>
                            {item.quantity}
                          </Text>

                          <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.quantityButton}
                            onPress={() => updateQuantity(item.id, "increase")}
                          >
                            <Feather
                              name="plus"
                              size={15}
                              color={COLORS.black}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>

              <View style={styles.promoCard}>
                <View style={styles.promoLeft}>
                  <View style={styles.promoIcon}>
                    <Feather name="tag" size={18} color={COLORS.secondary} />
                  </View>

                  <View>
                    <Text style={styles.promoTitle}>Mã giảm giá</Text>
                    <Text style={styles.promoCode}>KICKSTORE150</Text>
                  </View>
                </View>

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.applyButton}
                >
                  <Text style={styles.applyText}>Áp dụng</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Tóm tắt đơn hàng</Text>

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Tạm tính</Text>
                  <Text style={styles.summaryValue}>
                    {formatCurrency(subtotal)}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Phí vận chuyển</Text>
                  <Text style={styles.summaryValue}>
                    {formatCurrency(shippingFee)}
                  </Text>
                </View>

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Giảm giá</Text>
                  <Text style={styles.discountValue}>
                    -{formatCurrency(discount)}
                  </Text>
                </View>
              </View>
            </>
          ) : (
            <View style={styles.emptyCard}>
              <View style={styles.emptyIcon}>
                <Ionicons
                  name="cart-outline"
                  size={34}
                  color={COLORS.primary}
                />
              </View>
              <Text style={styles.emptyTitle}>Giỏ hàng đang trống</Text>
              <Text style={styles.emptyText}>
                Chọn thêm vài đôi giày yêu thích để tiếp tục mua sắm.
              </Text>
            </View>
          )}
        </ScrollView>

        <View
          style={[
            styles.checkoutBar,
            {
              paddingBottom: insets.bottom + 14,
            },
          ]}
        >
          <View>
            <Text style={styles.totalLabel}>Tổng cộng</Text>
            <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.9}
            style={[
              styles.checkoutButton,
              cartItems.length === 0 && styles.checkoutDisabled,
            ]}
            disabled={cartItems.length === 0}
          >
            <Text style={styles.checkoutText}>Thanh toán</Text>
            <Feather name="arrow-right" size={18} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  screen: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },

  heading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  eyebrow: {
    fontSize: 13,
    color: COLORS.gray,
    fontFamily: FONTS.medium,
    fontWeight: "600",
  },
  title: {
    marginTop: 2,
    fontSize: 30,
    lineHeight: 38,
    color: COLORS.black,
    fontFamily: FONTS.bold,
    fontWeight: "800",
  },

  badge: {
    height: 38,
    minWidth: 58,
    paddingHorizontal: 12,
    borderRadius: 19,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  badgeText: {
    marginLeft: 6,
    color: COLORS.white,
    fontSize: 14,
    fontFamily: FONTS.bold,
    fontWeight: "800",
  },

  deliveryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 14,
    marginBottom: 18,
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.08)",
  },

  deliveryIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  deliveryInfo: {
    flex: 1,
    paddingHorizontal: 12,
  },

  deliveryLabel: {
    fontSize: 12,
    color: COLORS.gray,
    fontFamily: FONTS.medium,
    fontWeight: "600",
  },

  deliveryAddress: {
    marginTop: 3,
    fontSize: 14,
    color: COLORS.black,
    fontFamily: FONTS.bold,
    fontWeight: "700",
  },

  changeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
  },

  changeText: {
    fontSize: 13,
    color: COLORS.primary,
    fontFamily: FONTS.bold,
    fontWeight: "700",
  },

  items: {
    gap: 14,
  },

  cartItem: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 12,
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.08)",
  },

  productImage: {
    width: 104,
    height: 112,
    borderRadius: 14,
    backgroundColor: "#F3F4F6",
  },

  itemBody: {
    flex: 1,
    paddingLeft: 12,
    justifyContent: "space-between",
  },

  itemTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  itemTitleWrap: {
    flex: 1,
    paddingRight: 8,
  },

  brand: {
    fontSize: 12,
    color: COLORS.gray,
    fontFamily: FONTS.medium,
    fontWeight: "700",
  },

  productName: {
    marginTop: 3,
    fontSize: 17,
    color: COLORS.black,
    fontFamily: FONTS.bold,
    fontWeight: "800",
  },

  deleteButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
  },

  meta: {
    fontSize: 13,
    color: COLORS.gray,
    fontFamily: FONTS.medium,
    fontWeight: "500",
  },

  itemBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  price: {
    fontSize: 16,
    color: COLORS.primary,
    fontFamily: FONTS.bold,
    fontWeight: "800",
  },

  quantity: {
    height: 34,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 4,
  },

  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 9,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },

  disabledButton: {
    backgroundColor: "#F9FAFB",
  },

  quantityText: {
    minWidth: 28,
    textAlign: "center",
    fontSize: 15,
    color: COLORS.black,
    fontFamily: FONTS.bold,
    fontWeight: "800",
  },

  promoCard: {
    marginTop: 18,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.08)",
  },

  promoLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  promoIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#FFF7ED",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  promoTitle: {
    fontSize: 13,
    color: COLORS.gray,
    fontFamily: FONTS.medium,
    fontWeight: "600",
  },

  promoCode: {
    marginTop: 2,
    fontSize: 15,
    color: COLORS.black,
    fontFamily: FONTS.bold,
    fontWeight: "800",
  },

  applyButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 11,
    backgroundColor: COLORS.primary,
  },

  applyText: {
    fontSize: 13,
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontWeight: "800",
  },

  summaryCard: {
    marginTop: 18,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.08)",
  },

  summaryTitle: {
    marginBottom: 14,
    fontSize: 18,
    color: COLORS.black,
    fontFamily: FONTS.bold,
    fontWeight: "800",
  },

  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },

  summaryLabel: {
    fontSize: 14,
    color: COLORS.gray,
    fontFamily: FONTS.medium,
    fontWeight: "600",
  },

  summaryValue: {
    fontSize: 15,
    color: COLORS.black,
    fontFamily: FONTS.bold,
    fontWeight: "800",
  },

  discountValue: {
    fontSize: 15,
    color: "#16A34A",
    fontFamily: FONTS.bold,
    fontWeight: "800",
  },

  emptyCard: {
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 18,
    paddingVertical: 42,
    paddingHorizontal: 24,
    marginTop: 24,
  },

  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  emptyTitle: {
    fontSize: 19,
    color: COLORS.black,
    fontFamily: FONTS.bold,
    fontWeight: "800",
  },

  emptyText: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.gray,
    fontFamily: FONTS.medium,
    fontWeight: "500",
  },
  checkoutBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 14,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0 -4px 10px rgba(0, 0, 0, 0.1)",
  },

  totalLabel: {
    fontSize: 13,
    color: COLORS.gray,
    fontFamily: FONTS.medium,
    fontWeight: "600",
  },

  totalValue: {
    marginTop: 3,
    fontSize: 20,
    color: COLORS.black,
    fontFamily: FONTS.bold,
    fontWeight: "900",
  },

  checkoutButton: {
    height: 52,
    minWidth: 154,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
  },

  checkoutDisabled: {
    backgroundColor: "#CBD5E1",
  },

  checkoutText: {
    marginRight: 8,
    fontSize: 16,
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontWeight: "800",
  },
});
