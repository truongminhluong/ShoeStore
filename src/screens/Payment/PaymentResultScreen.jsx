import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function PaymentResultScreen({
  navigation,
  route,
}) {
  const {
    orderId,
    returnUrl,
  } = route.params;

  // ===============================
  // LẤY MÃ KẾT QUẢ VNPAY
  // ===============================

  const url = new URL(returnUrl);

  const responseCode =
    url.searchParams.get(
      "vnp_ResponseCode",
    );

  const transactionNo =
    url.searchParams.get(
      "vnp_TransactionNo",
    );

  const isSuccess =
    responseCode === "00";

  return (
    <View style={styles.container}>
      {/* ICON */}

      <Text
        style={[
          styles.icon,
          {
            color: isSuccess
              ? "green"
              : "red",
          },
        ]}
      >
        {isSuccess ? "✓" : "✕"}
      </Text>

      {/* TIÊU ĐỀ */}

      <Text style={styles.title}>
        {isSuccess
          ? "Thanh toán thành công"
          : "Thanh toán thất bại"}
      </Text>

      {/* THÔNG BÁO */}

      <Text style={styles.message}>
        {isSuccess
          ? "Đơn hàng của bạn đã được thanh toán thành công."
          : "Thanh toán không thành công. Bạn có thể thử lại sau."}
      </Text>

      {/* MÃ ĐƠN HÀNG */}

      <Text style={styles.orderId}>
        Mã đơn hàng: {orderId}
      </Text>

      {/* MÃ GIAO DỊCH */}

      {transactionNo && (
        <Text style={styles.transactionNo}>
          Mã giao dịch: {transactionNo}
        </Text>
      )}

      {/* NÚT XEM ĐƠN HÀNG */}

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.reset({
            index: 1,

            routes: [
              {
                name: "MainTabs",

                state: {
                  index: 1,

                  routes: [
                    {
                      name: "Home",
                    },
                    {
                      name: "Profile",
                    },
                  ],
                },
              },

              {
                name: "Orders",
              },
            ],
          });
        }}
      >
        <Text style={styles.buttonText}>
          Xem đơn hàng
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    justifyContent: "center",

    alignItems: "center",

    padding: 24,

    backgroundColor: "#FFFFFF",
  },

  icon: {
    fontSize: 64,

    marginBottom: 20,
  },

  title: {
    fontSize: 24,

    fontWeight: "700",

    marginBottom: 12,

    textAlign: "center",
  },

  message: {
    fontSize: 16,

    textAlign: "center",

    marginBottom: 16,
  },

  orderId: {
    fontSize: 14,

    color: "#666666",

    marginBottom: 8,
  },

  transactionNo: {
    fontSize: 14,

    color: "#666666",

    marginBottom: 30,
  },

  button: {
    paddingHorizontal: 24,

    paddingVertical: 14,

    borderRadius: 8,

    backgroundColor: "#000000",
  },

  buttonText: {
    color: "#FFFFFF",

    fontSize: 16,

    fontWeight: "600",
  },
});