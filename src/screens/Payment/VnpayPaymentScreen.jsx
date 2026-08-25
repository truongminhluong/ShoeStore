import { useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

import COLORS from "../../constants/colors";
import { useCart } from "../../context/CartContext";

export default function VnpayPaymentScreen({ navigation, route }) {
  const { paymentUrl, orderId } = route.params;

  const { clearCart } = useCart();

  const [loading, setLoading] = useState(true);
  const [isHandled, setIsHandled] = useState(false);

  const handleNavigationStateChange = async (navState) => {
    const { url } = navState;

    console.log("🌐 URL hiện tại:", url);

    if (url.includes("/api/payment/vnpay/return") && !isHandled) {
      console.log("🔥 BẮT CALLBACK VNPAY");

      try {
        const parsedUrl = new URL(url);

        const responseCode = parsedUrl.searchParams.get("vnp_ResponseCode");

        const transactionNo = parsedUrl.searchParams.get("vnp_TransactionNo");

        const txnRef = parsedUrl.searchParams.get("vnp_TxnRef");

        console.log("ResponseCode:", responseCode);
        console.log("TransactionNo:", transactionNo);
        console.log("TxnRef:", txnRef);

        if (!responseCode) {
          console.log("⚠️ Không có ResponseCode");
          return;
        }

        setIsHandled(true);

        // ==========================================
        // GỌI BACKEND CALLBACK
        // ==========================================

        console.log("📡 Đang gửi callback tới Backend...");

        const response = await fetch(url);

        const result = await response.json();

        console.log("📥 Kết quả Backend:", result);

        // ==========================================
        // BACKEND XÁC NHẬN THANH TOÁN THÀNH CÔNG
        // ==========================================

        if (result.success === true && result.data?.paymentStatus === "paid") {
          console.log("✅ Backend xác nhận thanh toán thành công");

          clearCart();

          navigation.replace("PaymentResult", {
            orderId: txnRef || orderId,
            returnUrl: url,
          });

          return;
        }

        // ==========================================
        // THANH TOÁN THẤT BẠI
        // ==========================================

        console.log("❌ Backend xác nhận thanh toán thất bại");

        navigation.replace("PaymentResult", {
          orderId: txnRef || orderId,
          returnUrl: url,
        });
      } catch (error) {
        console.log("🔥 LỖI GỌI CALLBACK BACKEND:", error);
      }
    }
  };

  const handleVnpayCallback = async (url) => {
    if (isHandled) return;

    try {
      setIsHandled(true);

      const parsedUrl = new URL(url);

      const responseCode = parsedUrl.searchParams.get("vnp_ResponseCode");

      const transactionNo = parsedUrl.searchParams.get("vnp_TransactionNo");

      const txnRef = parsedUrl.searchParams.get("vnp_TxnRef");

      console.log("ResponseCode:", responseCode);
      console.log("TransactionNo:", transactionNo);
      console.log("TxnRef:", txnRef);

      // ==========================================
      // GỌI BACKEND
      // ==========================================

      console.log("📡 Gọi Backend callback...");

      const response = await fetch(url);

      const result = await response.json();

      console.log("📥 Backend trả về:", result);

      // ==========================================
      // BACKEND XÁC NHẬN PAID
      // ==========================================

      if (result.success === true && result.data?.paymentStatus === "paid") {
        console.log("✅ BACKEND XÁC NHẬN THANH TOÁN THÀNH CÔNG");

        clearCart();
      }

      // ==========================================
      // CHUYỂN PAYMENT RESULT
      // ==========================================

      navigation.replace("PaymentResult", {
        orderId: txnRef || orderId,
        returnUrl: url,
      });
    } catch (error) {
      console.log("❌ Lỗi callback VNPAY:", error);

      setIsHandled(false);
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        source={{
          uri: paymentUrl,
        }}
        onLoadStart={() => {
          setLoading(true);
        }}
        onLoadEnd={() => {
          setLoading(false);
        }}
        onNavigationStateChange={handleNavigationStateChange}
        onShouldStartLoadWithRequest={(request) => {
          const { url } = request;

          console.log("🌐 WebView chuẩn bị load:", url);

          if (url.includes("/api/payment/vnpay/return") && !isHandled) {
            console.log("🔥 BẮT CALLBACK TRƯỚC KHI WEBVIEW LOAD");

            handleVnpayCallback(url);

            return false;
          }

          return true;
        }}
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
