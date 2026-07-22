import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import COLORS from "../../constants/colors";

export default function OrderSuccessScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();

  const orderId = route.params?.orderId;

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <View style={styles.content}>
        {/* ICON THÀNH CÔNG */}

        <View style={styles.successIcon}>
          <Ionicons name="checkmark" size={55} color="#FFFFFF" />
        </View>

        <Text style={styles.title}>Đặt hàng thành công!</Text>

        <Text style={styles.description}>
          Cảm ơn bạn đã mua hàng.
          {"\n"}
          Đơn hàng của bạn đã được tiếp nhận.
        </Text>

        {/* MÃ ĐƠN HÀNG */}

        {orderId && (
          <View style={styles.orderBox}>
            <Text style={styles.orderLabel}>Mã đơn hàng</Text>

            <Text style={styles.orderId}>#{orderId}</Text>
          </View>
        )}

        {/* NÚT XEM ĐƠN HÀNG */}

        <TouchableOpacity
          style={styles.orderButton}
          onPress={() => {
            navigation.reset({
              index: 1,
              routes: [
                {
                  name: "MainTabs",
                  state: {
                    routes: [
                      {
                        name: "Home",
                      },
                      {
                        name: "Profile",
                      },
                    ],
                    index: 1,
                  },
                },
                {
                  name: "Orders",
                },
              ],
            });
          }}
        >
          <Text style={styles.orderButtonText}>Xem đơn hàng</Text>
        </TouchableOpacity>

        {/* TIẾP TỤC MUA */}

        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => {
            navigation.navigate("MainTabs", {
              screen: "Home",
            });
          }}
        >
          <Text style={styles.continueButtonText}>Tiếp tục mua sắm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F7FF",
  },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#16A34A",
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
    marginTop: 24,
  },

  description: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 23,
    marginTop: 12,
  },

  orderBox: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 18,
    alignItems: "center",
    marginTop: 24,
  },

  orderLabel: {
    fontSize: 13,
    color: "#6B7280",
  },

  orderId: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
    marginTop: 6,
  },

  orderButton: {
    width: "100%",
    height: 52,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },

  orderButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  continueButton: {
    width: "100%",
    height: 52,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },

  continueButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "600",
  },
});
