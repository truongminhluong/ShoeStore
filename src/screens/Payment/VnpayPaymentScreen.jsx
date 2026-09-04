import { useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

import COLORS from "../../constants/colors";
import { useCart } from "../../context/CartContext";

export default function VnpayPaymentScreen({ navigation, route }) {
  const { paymentUrl, orderId, buyNow = false } = route.params || {};

  const { clearCart } = useCart();

  const [loading, setLoading] = useState(true);
  const [isHandled, setIsHandled] = useState(false);

  /**
   * =========================================================
   * XỬ LÝ CALLBACK VNPAY
   * =========================================================
   */
  const handleVnpayCallback = async (url) => {
    // Chặn callback bị gọi nhiều lần
    if (isHandled) {
      console.log("⚠️ Callback đã được xử lý, bỏ qua");
      return;
    }

    try {
      console.log("======================================");
      console.log("🔥 BẮT CALLBACK VNPAY");
      console.log("======================================");

      console.log("🌐 Callback URL:");
      console.log(url);

      /**
       * -------------------------------------------------------
       * PARSE URL
       * -------------------------------------------------------
       */
      const urlObj = new URL(url);

      const responseCode = urlObj.searchParams.get("vnp_ResponseCode");

      const transactionNo = urlObj.searchParams.get("vnp_TransactionNo");

      const txnRef = urlObj.searchParams.get("vnp_TxnRef");

      console.log("ResponseCode:", responseCode);
      console.log("TransactionNo:", transactionNo);
      console.log("TxnRef:", txnRef);

      /**
       * Không có ResponseCode
       */
      if (!responseCode) {
        console.log("⚠️ Không tìm thấy vnp_ResponseCode");
        return;
      }

      /**
       * Đánh dấu đã xử lý ngay trước khi gọi backend
       * để tránh callback chạy nhiều lần.
       */
      setIsHandled(true);

      /**
       * =====================================================
       * GỌI BACKEND CALLBACK
       * =====================================================
       */

      console.log("📡 Đang gọi Backend callback...");

      const response = await fetch(url);

      console.log("📡 Backend HTTP status:", response.status);

      const result = await response.json();

      console.log("📥 Backend trả về:", JSON.stringify(result));

      /**
       * =====================================================
       * THANH TOÁN THÀNH CÔNG
       * =====================================================
       */

      if (result?.success === true && result?.data?.paymentStatus === "paid") {
        console.log("======================================");
        console.log("✅ BACKEND XÁC NHẬN THANH TOÁN THÀNH CÔNG");
        console.log("======================================");

        /**
         * ---------------------------------------------------
         * CHỈ XÓA CART KHI THANH TOÁN THÀNH CÔNG
         * ---------------------------------------------------
         *
         * Nếu là Buy Now:
         * → không cần xóa toàn bộ cart
         *
         * Nếu mua từ Cart:
         * → xóa cart
         */
        if (!buyNow) {
          try {
            await clearCart();

            console.log("🛒 Đã xóa giỏ hàng sau khi thanh toán thành công");
          } catch (cartError) {
            console.log(
              "⚠️ Thanh toán thành công nhưng xóa cart lỗi:",
              cartError,
            );
          }
        }

        /**
         * ---------------------------------------------------
         * CHUYỂN SANG PAYMENT RESULT
         * ---------------------------------------------------
         */

        navigation.replace("PaymentResult", {
          orderId: result?.data?.orderId || txnRef || orderId,

          paymentStatus: "paid",

          transactionNo: result?.data?.transactionNo || transactionNo,

          returnUrl: url,
        });

        return;
      }

      /**
       * =====================================================
       * THANH TOÁN THẤT BẠI / HỦY
       * =====================================================
       */

      console.log("======================================");
      console.log("❌ BACKEND XÁC NHẬN THANH TOÁN THẤT BẠI");
      console.log("======================================");

      console.log("ResponseCode:", responseCode);

      /**
       * Không xóa Cart ở đây.
       *
       * Người dùng có thể quay lại Checkout
       * và thanh toán lại.
       */

      navigation.replace("PaymentResult", {
        orderId: result?.data?.orderId || txnRef || orderId,

        paymentStatus: "failed",

        responseCode,

        transactionNo,

        returnUrl: url,
      });
    } catch (error) {
      console.log("======================================");
      console.log("🔥 LỖI XỬ LÝ CALLBACK VNPAY");
      console.log("======================================");

      console.log(error);

      /**
       * Không xóa Cart.
       *
       * Nếu callback bị lỗi mạng:
       * → giữ lại sản phẩm trong Cart.
       */

      navigation.replace("PaymentResult", {
        orderId,
        paymentStatus: "failed",
      });
    }
  };

  /**
   * =========================================================
   * UI
   * =========================================================
   */

  return (
    <View style={styles.container}>
      <WebView
        source={{
          uri: paymentUrl,
        }}
        /**
         * ---------------------------------------------------
         * LOAD START
         * ---------------------------------------------------
         */
        onLoadStart={() => {
          setLoading(true);
        }}
        /**
         * ---------------------------------------------------
         * LOAD END
         * ---------------------------------------------------
         */
        onLoadEnd={() => {
          setLoading(false);
        }}
        /**
         * ---------------------------------------------------
         * BẮT URL TRƯỚC KHI WEBVIEW LOAD
         * ---------------------------------------------------
         *
         * Đây là nơi quan trọng nhất.
         *
         * Khi VNPAY redirect về:
         *
         * /api/payment/vnpay/return
         *
         * chúng ta KHÔNG cho WebView load trang JSON.
         *
         * Thay vào đó:
         *
         * 1. Lấy callback URL
         * 2. Gửi URL tới Backend
         * 3. Backend verify chữ ký
         * 4. Backend cập nhật Order
         * 5. Chuyển sang PaymentResult
         */
        onShouldStartLoadWithRequest={(request) => {
          const { url } = request;

          console.log("🌐 WebView chuẩn bị load:", url);

          /**
           * Kiểm tra callback VNPAY
           */
          if (url.includes("/api/payment/vnpay/return")) {
            console.log("🔥 PHÁT HIỆN CALLBACK VNPAY");

            /**
             * Không cho WebView load callback URL.
             */
            handleVnpayCallback(url);

            return false;
          }

          return true;
        }}
        /**
         * ---------------------------------------------------
         * WEBVIEW CONFIG
         * ---------------------------------------------------
         */
        startInLoadingState
        javaScriptEnabled
        domStorageEnabled
        /**
         * Cho phép cookies/session của VNPAY
         */
        thirdPartyCookiesEnabled
        sharedCookiesEnabled
      />
      /** * ===================================================== * LOADING *
      ===================================================== */
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      )}
    </View>
  );
}

/**
 * ===========================================================
 * STYLES
 * ===========================================================
 */

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
