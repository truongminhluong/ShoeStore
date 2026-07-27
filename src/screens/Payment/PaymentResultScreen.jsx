import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function PaymentResultScreen({ navigation, route }) {
  const { orderId, returnUrl } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>✓</Text>

      <Text style={styles.title}>Thanh toán thành công</Text>

      <Text style={styles.message}>
        Đơn hàng của bạn đã được thanh toán thành công.
      </Text>

      <Text style={styles.orderId}>Mã đơn hàng: {orderId}</Text>

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
        <Text style={styles.buttonText}>Xem đơn hàng</Text>
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
    color: "green",
    marginBottom: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
  },

  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },

  orderId: {
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
