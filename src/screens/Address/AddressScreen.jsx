import { useCallback, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";

import { useFocusEffect } from "@react-navigation/native";

import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "../../context/AuthContext";

import {
  getAddressesApi,
  setDefaultAddressApi,
  deleteAddressApi,
} from "../../services/addressService";

import COLORS from "../../constants/colors";

export default function AddressScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  const { token } = useAuth();

  const [addresses, setAddresses] = useState([]);

  const [loading, setLoading] = useState(true);

  // =========================
  // LẤY DANH SÁCH ĐỊA CHỈ
  // =========================

  const fetchAddresses = async () => {
    try {
      setLoading(true);

      const response = await getAddressesApi(token);

      console.log("Danh sách địa chỉ:", response.data);

      setAddresses(response.data || []);
    } catch (error) {
      console.log(
        "Lỗi lấy danh sách địa chỉ:",
        error.response?.data || error.message,
      );

      Alert.alert(
        "Thông báo",
        error.response?.data?.message || "Không thể lấy danh sách địa chỉ",
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // ĐẶT ĐỊA CHỈ LÀM MẶC ĐỊNH
  // =========================

  const handleSetDefault = async (addressId) => {
    try {
      await setDefaultAddressApi(addressId, token);

      Alert.alert("Thành công", "Đã đặt địa chỉ làm mặc định");

      // Load lại danh sách
      fetchAddresses();
    } catch (error) {
      console.log(
        "Lỗi đặt địa chỉ mặc định:",
        error.response?.data || error.message,
      );

      Alert.alert(
        "Thông báo",
        error.response?.data?.message || "Không thể đặt địa chỉ mặc định",
      );
    }
  };

  // =========================
  // XÓA ĐỊA CHỈ
  // =========================

  const handleDeleteAddress = (addressId) => {
    Alert.alert("Xóa địa chỉ", "Bạn có chắc chắn muốn xóa địa chỉ này không?", [
      {
        text: "Hủy",
        style: "cancel",
      },

      {
        text: "Xóa",
        style: "destructive",

        onPress: async () => {
          try {
            await deleteAddressApi(addressId, token);

            Alert.alert("Thành công", "Xóa địa chỉ thành công");

            // Load lại danh sách
            fetchAddresses();
          } catch (error) {
            console.log(
              "Lỗi xóa địa chỉ:",
              error.response?.data || error.message,
            );

            Alert.alert(
              "Thông báo",
              error.response?.data?.message || "Không thể xóa địa chỉ",
            );
          }
        },
      },
    ]);
  };

  // =========================
  // GỌI API KHI MỞ MÀN HÌNH
  // =========================

  useFocusEffect(
    useCallback(() => {
      if (token) {
        fetchAddresses();
      }
    }, [token]),
  );

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

        <Text style={styles.headerTitle}>Địa chỉ của tôi</Text>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("AddAddress");
          }}
        >
          <Ionicons name="add" size={28} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* LOADING */}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />

          <Text style={styles.loadingText}>Đang tải địa chỉ...</Text>
        </View>
      ) : (
        <FlatList
          data={addresses}
          keyExtractor={(item) => item._id}
          contentContainerStyle={[
            styles.content,
            addresses.length === 0 && {
              flexGrow: 1,
            },
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name="location-outline"
                size={70}
                color={COLORS.primary}
              />

              <Text style={styles.emptyTitle}>Chưa có địa chỉ</Text>

              <Text style={styles.emptyDescription}>
                Bạn chưa thêm địa chỉ nhận hàng nào
              </Text>

              <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                  navigation.navigate("AddAddress");
                }}
              >
                <Ionicons name="add" size={20} color="#FFFFFF" />

                <Text style={styles.addButtonText}>Thêm địa chỉ</Text>
              </TouchableOpacity>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.addressCard}>
              {/* ICON */}

              <View style={styles.addressIcon}>
                <Ionicons
                  name="location-outline"
                  size={24}
                  color={COLORS.primary}
                />
              </View>

              {/* THÔNG TIN */}

              <View style={styles.addressInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.addressName}>{item.fullName}</Text>

                  {item.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultText}>Mặc định</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.addressPhone}>{item.phone}</Text>

                <Text style={styles.addressText}>
                  {item.addressDetail}, {item.ward}, {item.district},{" "}
                  {item.province}
                </Text>
              </View>

              {/* MENU */}

              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    "Tùy chọn địa chỉ",
                    "Bạn muốn thực hiện thao tác nào?",
                    [
                      {
                        text: "Hủy",
                        style: "cancel",
                      },

                      // Chỉ hiển thị nếu chưa phải mặc định
                      ...(!item.isDefault
                        ? [
                            {
                              text: "Đặt làm mặc định",
                              onPress: () => {
                                handleSetDefault(item._id);
                              },
                            },
                          ]
                        : []),

                      {
                        text: "Xóa địa chỉ",
                        style: "destructive",
                        onPress: () => {
                          handleDeleteAddress(item._id);
                        },
                      },
                    ],
                  );
                }}
              >
                <Ionicons name="ellipsis-vertical" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FC",
  },

  header: {
    height: 60,

    paddingHorizontal: 20,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    backgroundColor: "#FFFFFF",

    borderBottomWidth: 1,

    borderBottomColor: "#F0F0F0",
  },

  headerTitle: {
    fontSize: 18,

    fontWeight: "700",

    color: "#1F2937",
  },

  content: {
    flexGrow: 1,

    padding: 20,
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

    marginTop: 18,
  },

  emptyDescription: {
    fontSize: 14,

    color: "#6B7280",

    marginTop: 8,

    textAlign: "center",
  },

  addButton: {
    height: 50,

    paddingHorizontal: 24,

    borderRadius: 14,

    backgroundColor: COLORS.primary,

    flexDirection: "row",

    justifyContent: "center",

    alignItems: "center",

    marginTop: 24,
  },

  addButtonText: {
    color: "#FFFFFF",

    fontSize: 15,

    fontWeight: "700",

    marginLeft: 8,
  },

  addressCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  addressIcon: {
    width: 42,

    height: 42,

    borderRadius: 21,

    backgroundColor: "#F0F2FF",

    justifyContent: "center",

    alignItems: "center",

    marginRight: 12,
  },

  addressInfo: {
    flex: 1,
  },

  addressName: {
    fontSize: 15,

    fontWeight: "700",

    color: "#1F2937",
  },

  addressPhone: {
    fontSize: 13,

    color: "#6B7280",

    marginTop: 4,
  },

  addressText: {
    fontSize: 13,

    color: "#6B7280",

    lineHeight: 19,

    marginTop: 5,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6B7280",
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },

  defaultBadge: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "#E8F5E9",
  },

  defaultText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#2E7D32",
  },
});
