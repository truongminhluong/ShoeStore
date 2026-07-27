import { useState } from "react";

import { View, ActivityIndicator, StyleSheet } from "react-native";

import { WebView } from "react-native-webview";

import COLORS from "../../constants/colors";

import { useCart } from "../../context/CartContext";

export default function VnpayPaymentScreen({ navigation, route }) {
  const { paymentUrl, orderId } = route.params;

  // Lấy clearCart từ CartContext
  const { clearCart } = useCart();

  const [loading, setLoading] = useState(true);

  const [isHandled, setIsHandled] = useState(false);

  const handleNavigationStateChange = (navState) => {
    const { url } = navState;

    console.log("URL hiện tại:", url);

    // =========================
    // KIỂM TRA URL RETURN VNPAY
    // =========================

    if (url.includes("/api/payment/vnpay/return") && !isHandled) {
      console.log("Đã nhận kết quả thanh toán VNPAY");

      setIsHandled(true);

      // =========================
      // LẤY MÃ KẾT QUẢ THANH TOÁN
      // =========================

      const responseCode = new URL(url).searchParams.get("vnp_ResponseCode");

      console.log("Mã kết quả thanh toán:", responseCode);

      // =========================
      // CHỈ XÓA GIỎ HÀNG
      // KHI THANH TOÁN THÀNH CÔNG
      // =========================

      if (responseCode === "00") {
        console.log("Thanh toán thành công - Xóa giỏ hàng");

        clearCart();
      }

      // =========================
      // CHUYỂN SANG KẾT QUẢ
      // =========================

      navigation.replace("PaymentResult", {
        orderId,
        returnUrl: url,
      });
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        source={{
          uri: paymentUrl,
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        }}
        onLoadStart={() => {
          setLoading(true);
        }}
        onLoadEnd={() => {
          setLoading(false);
        }}
        onNavigationStateChange={handleNavigationStateChange}
        startInLoadingState
        javaScriptEnabled
        domStorageEnabled
      />

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
});
