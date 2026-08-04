import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import COLORS from "../../constants/colors";
import {
  getVouchersApi,
  validateVoucherApi,
} from "../../services/voucherService";

export default function VoucherScreen({ navigation, route }) {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedVoucher, setSelectedVoucher] = useState(
    route.params?.selectedVoucher || null,
  );

  const subtotal = route.params?.subtotal || 0;

  const isBuyNow = route.params?.isBuyNow ?? false;
  const items = route.params?.items ?? [];

  useEffect(() => {
    loadVouchers();
  }, []);

  const loadVouchers = async () => {
    try {
      setLoading(true);

      const response = await getVouchersApi();

      setVouchers(response.data || []);
    } catch (error) {
      console.log(error.response?.data || error.message);
      Alert.alert("Thông báo", "Không thể tải danh sách voucher");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyVoucher = async () => {
    if (!selectedVoucher) return;

    try {
      const response = await validateVoucherApi({
        code: selectedVoucher.code,
        subtotal,
      });

      const voucher = {
        ...selectedVoucher,
        discount: response.data.discount,
      };

      route.params?.onSelectVoucher?.(voucher);

      navigation.goBack();
    } catch (error) {
      Alert.alert(
        "Thông báo",
        error.response?.data?.message || "Voucher không hợp lệ",
      );
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Chọn voucher</Text>

        <View style={styles.headerRight} />
      </View>

      <FlatList
        data={vouchers}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 120,
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              selectedVoucher?._id === item._id && styles.selectedCard,
            ]}
            onPress={() => setSelectedVoucher(item)}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.code}>{item.code}</Text>

              <Text style={styles.title}>{item.name}</Text>

              <Text style={styles.description}>{item.description}</Text>

              <Text style={styles.minOrder}>
                Đơn tối thiểu {item.minOrderValue.toLocaleString("vi-VN")}đ
              </Text>
            </View>

            <Ionicons
              name={
                selectedVoucher?._id === item._id
                  ? "radio-button-on"
                  : "radio-button-off"
              }
              size={24}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        )}
      />

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.button, !selectedVoucher && styles.disabledButton]}
          disabled={!selectedVoucher}
          onPress={handleApplyVoucher}
        >
          <Text style={styles.buttonText}>Áp dụng</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F6F7FB",
  },

  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
  },

  header: {
    height: 60,
    backgroundColor: "#F6F7FB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#111827",
  },

  headerRight: {
    width: 40,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ECECEC",
  },

  selectedCard: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },

  code: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.primary,
  },

  title: {
    marginTop: 8,
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },

  description: {
    marginTop: 5,
    fontSize: 14,
    color: "#6B7280",
  },

  minOrder: {
    marginTop: 6,
    color: "#EF4444",
    fontWeight: "600",
  },

  bottomContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#ECECEC",
    backgroundColor: "#F6F7FB",
  },

  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    paddingVertical: 16,
    alignItems: "center",
  },

  disabledButton: {
    opacity: 0.5,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
