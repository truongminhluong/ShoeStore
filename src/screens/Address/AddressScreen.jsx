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

/* =========================================================
   RYDE UI
========================================================= */

const UI = {
  background: "#FAFAF9",
  surface: "#FFFFFF",

  ink: "#0F1B33",
  inkSoft: "#334155",

  muted: "#64748B",
  subtle: "#94A3B8",

  line: "#E7EAF0",

  blue: COLORS.primary,
  blueSoft: "#EFF5FF",

  danger: "#DC2626",
};

export default function AddressScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  const { token } = useAuth();

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================================================
     LẤY DANH SÁCH ĐỊA CHỈ
  ========================================================= */

  const fetchAddresses = useCallback(async () => {
    if (!token) return;

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
  }, [token]);

  /* =========================================================
     ĐẶT ĐỊA CHỈ MẶC ĐỊNH
  ========================================================= */

  const handleSetDefault = async (addressId) => {
    try {
      await setDefaultAddressApi(addressId, token);

      Alert.alert("Thành công", "Đã đặt địa chỉ làm mặc định");

      fetchAddresses();
    } catch (error) {
      console.log(
        "Lỗi đặt địa chỉ mặc định:",
        error.response?.data || error.message,
      );

      Alert.alert(
        "Thông báo",
        error.response?.data?.message || "Không thể đặt địa chỉ làm mặc định",
      );
    }
  };

  /* =========================================================
     XÓA ĐỊA CHỈ
  ========================================================= */

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

  /* =========================================================
     MENU ĐỊA CHỈ
  ========================================================= */

  const handleAddressMenu = (item) => {
    const actions = [
      {
        text: "Hủy",
        style: "cancel",
      },
    ];

    if (!item.isDefault) {
      actions.push({
        text: "Đặt làm mặc định",
        onPress: () => {
          handleSetDefault(item._id);
        },
      });
    }

    actions.push({
      text: "Xóa địa chỉ",
      style: "destructive",
      onPress: () => {
        handleDeleteAddress(item._id);
      },
    });

    Alert.alert(
      "Tùy chọn địa chỉ",
      "Bạn muốn thực hiện thao tác nào?",
      actions,
    );
  };

  /* =========================================================
     LOAD KHI FOCUS
  ========================================================= */

  useFocusEffect(
    useCallback(() => {
      if (token) {
        fetchAddresses();
      }
    }, [token, fetchAddresses]),
  );

  /* =========================================================
     ADDRESS ITEM
  ========================================================= */

  const renderAddressItem = ({ item }) => {
    return (
      <View
        style={[
          styles.addressCard,
          item.isDefault && styles.addressCardDefault,
        ]}
      >
        {/* TOP */}

        <View style={styles.addressTopRow}>
          <View style={styles.addressIdentity}>
            {/* LOCATION ICON */}

            <View
              style={[
                styles.addressIcon,
                item.isDefault && styles.addressIconDefault,
              ]}
            >
              <Ionicons name="location-outline" size={20} color={UI.blue} />
            </View>

            {/* USER INFO */}

            <View style={styles.nameBlock}>
              <View style={styles.nameRow}>
                <Text style={styles.addressName} numberOfLines={1}>
                  {item.fullName}
                </Text>

                {item.isDefault && (
                  <View style={styles.defaultBadge}>
                    <View style={styles.defaultDot} />

                    <Text style={styles.defaultText}>MẶC ĐỊNH</Text>
                  </View>
                )}
              </View>

              <Text style={styles.addressPhone}>{item.phone}</Text>
            </View>
          </View>

          {/* MENU */}

          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.menuButton}
            onPress={() => handleAddressMenu(item)}
          >
            <Ionicons name="ellipsis-horizontal" size={20} color={UI.muted} />
          </TouchableOpacity>
        </View>

        {/* DIVIDER */}

        <View style={styles.cardDivider} />

        {/* ADDRESS */}

        <View style={styles.addressBottom}>
          <Ionicons
            name="navigate-outline"
            size={16}
            color={UI.subtle}
            style={styles.addressSmallIcon}
          />

          <Text style={styles.addressText}>
            {item.addressDetail}, {item.ward}, {item.district}, {item.province}
          </Text>
        </View>
      </View>
    );
  };

  /* =========================================================
     EMPTY STATE
  ========================================================= */

  const renderEmptyState = () => {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIcon}>
          <Ionicons name="location-outline" size={38} color={UI.blue} />
        </View>

        <Text style={styles.emptyEyebrow}>YOUR ADDRESS</Text>

        <Text style={styles.emptyTitle}>Chưa có địa chỉ</Text>

        <Text style={styles.emptyDescription}>
          Thêm địa chỉ nhận hàng để quá trình thanh toán của bạn nhanh chóng và
          thuận tiện hơn.
        </Text>

        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.emptyButton}
          onPress={() => navigation.navigate("AddAddress")}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />

          <Text style={styles.emptyButtonText}>Thêm địa chỉ</Text>
        </TouchableOpacity>
      </View>
    );
  };

  /* =========================================================
     HEADER
  ========================================================= */

  const renderHeader = () => {
    return (
      <>
        <View style={styles.header}>
          {/* HEADER TOP */}

          <View style={styles.headerTop}>
            <TouchableOpacity
              activeOpacity={0.75}
              style={styles.headerButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={21} color={UI.ink} />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.addHeaderButton}
              onPress={() => navigation.navigate("AddAddress")}
            >
              <Ionicons name="add" size={23} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* HEADER CONTENT */}

          <View style={styles.headerContent}>
            <Text style={styles.headerEyebrow}>ACCOUNT</Text>

            <Text style={styles.headerTitle}>Địa chỉ của tôi</Text>

            <Text style={styles.headerSubtitle}>
              Quản lý địa chỉ nhận hàng của bạn
            </Text>

            <View style={styles.headerAccent} />
          </View>

          {/* WATERMARK */}

          <View style={styles.headerWatermark}>
            <Ionicons name="location-outline" size={130} color={UI.blue} />
          </View>
        </View>

        {/* =================================================
            SECTION HEADER
        ================================================= */}

        {addresses.length > 0 && (
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionEyebrow}>YOUR ADDRESSES</Text>

              <Text style={styles.sectionTitle}>Địa chỉ nhận hàng</Text>
            </View>

            <View style={styles.countBadge}>
              <Text style={styles.countText}>{addresses.length}</Text>
            </View>
          </View>
        )}
      </>
    );
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top,
          },
        ]}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={UI.blue} />

          <Text style={styles.loadingText}>Đang tải địa chỉ...</Text>
        </View>
      </View>
    );
  }

  /* =========================================================
     MAIN
  ========================================================= */

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
        },
      ]}
    >
      <FlatList
        data={addresses}
        keyExtractor={(item) => item._id}
        renderItem={renderAddressItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,
          addresses.length === 0 && styles.listContentEmpty,
        ]}
        ListHeaderComponent={renderHeader()}
        ListEmptyComponent={renderEmptyState()}
        ListFooterComponent={
          addresses.length > 0 ? (
            <View style={styles.footerHint}>
              <Ionicons
                name="shield-checkmark-outline"
                size={16}
                color={UI.subtle}
              />

              <Text style={styles.footerHintText}>
                Địa chỉ của bạn được bảo mật
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  /* =======================================================
     CONTAINER
  ======================================================= */

  container: {
    flex: 1,
    backgroundColor: UI.background,
  },

  /* =======================================================
     HEADER
  ======================================================= */

  header: {
    minHeight: 178,

    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 18,

    backgroundColor: UI.surface,

    overflow: "hidden",
  },

  headerTop: {
    minHeight: 48,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    zIndex: 5,
  },

  headerButton: {
    width: 44,
    height: 44,

    borderRadius: 22,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: UI.surface,

    borderWidth: 1,
    borderColor: UI.line,
  },

  addHeaderButton: {
    width: 44,
    height: 44,

    borderRadius: 22,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: UI.blue,
  },

  headerContent: {
    marginTop: 14,

    zIndex: 3,
  },

  headerEyebrow: {
    fontSize: 9,
    lineHeight: 13,

    fontWeight: "900",

    letterSpacing: 1.5,

    color: UI.blue,
  },

  headerTitle: {
    marginTop: 2,

    fontSize: 29,
    lineHeight: 35,

    fontWeight: "800",

    letterSpacing: -0.8,

    color: UI.ink,
  },

  headerSubtitle: {
    marginTop: 3,

    fontSize: 13,
    lineHeight: 19,

    color: UI.muted,
  },

  headerAccent: {
    width: 32,
    height: 3,

    marginTop: 9,

    borderRadius: 2,

    backgroundColor: UI.blue,
  },

  headerWatermark: {
    position: "absolute",

    right: -16,
    bottom: -18,

    opacity: 0.055,

    transform: [
      {
        rotate: "-12deg",
      },
    ],
  },

  /* =======================================================
     SECTION
  ======================================================= */

  sectionHeader: {
    flexDirection: "row",

    alignItems: "flex-end",
    justifyContent: "space-between",

    paddingHorizontal: 16,

    paddingTop: 22,
    paddingBottom: 14,

    backgroundColor: UI.background,
  },

  sectionEyebrow: {
    fontSize: 9,
    lineHeight: 13,

    fontWeight: "900",

    letterSpacing: 1.4,

    color: UI.blue,
  },

  sectionTitle: {
    marginTop: 2,

    fontSize: 19,
    lineHeight: 25,

    fontWeight: "800",

    letterSpacing: -0.3,

    color: UI.ink,
  },

  countBadge: {
    minWidth: 38,
    height: 38,

    paddingHorizontal: 10,

    borderRadius: 19,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: UI.blueSoft,
  },

  countText: {
    fontSize: 13,

    fontWeight: "800",

    color: UI.blue,
  },

  /* =======================================================
     LIST
  ======================================================= */

  listContent: {
    paddingBottom: 30,
  },

  listContentEmpty: {
    flexGrow: 1,
  },

  /* =======================================================
     ADDRESS CARD
  ======================================================= */

  addressCard: {
    marginHorizontal: 16,
    marginBottom: 12,

    padding: 16,

    backgroundColor: UI.surface,

    borderRadius: 18,

    borderWidth: 1,
    borderColor: UI.line,
  },

  addressCardDefault: {
    borderWidth: 1.5,
    borderColor: UI.blue,
  },

  addressTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  addressIdentity: {
    flex: 1,

    flexDirection: "row",
    alignItems: "flex-start",

    minWidth: 0,
  },

  /* =======================================================
     ICON
  ======================================================= */

  addressIcon: {
    width: 38,
    height: 38,

    borderRadius: 19,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#F5F7FA",

    marginRight: 12,
  },

  addressIconDefault: {
    backgroundColor: UI.blueSoft,
  },

  /* =======================================================
     NAME
  ======================================================= */

  nameBlock: {
    flex: 1,

    minWidth: 0,
  },

  nameRow: {
    flexDirection: "row",

    alignItems: "center",

    flexWrap: "wrap",

    paddingRight: 4,
  },

  addressName: {
    flexShrink: 1,

    fontSize: 15,
    lineHeight: 20,

    fontWeight: "800",

    color: UI.ink,
  },

  addressPhone: {
    marginTop: 4,

    fontSize: 13,
    lineHeight: 18,

    color: UI.muted,
  },

  /* =======================================================
     DEFAULT
  ======================================================= */

  defaultBadge: {
    flexDirection: "row",

    alignItems: "center",

    marginLeft: 8,

    paddingHorizontal: 8,
    paddingVertical: 5,

    borderRadius: 999,

    backgroundColor: UI.blueSoft,
  },

  defaultDot: {
    width: 5,
    height: 5,

    borderRadius: 3,

    backgroundColor: UI.blue,

    marginRight: 5,
  },

  defaultText: {
    fontSize: 9,
    lineHeight: 11,

    fontWeight: "900",

    letterSpacing: 0.5,

    color: UI.blue,
  },

  /* =======================================================
     MENU
  ======================================================= */

  menuButton: {
    width: 44,
    height: 44,

    marginTop: -4,
    marginRight: -7,

    alignItems: "center",
    justifyContent: "center",
  },

  /* =======================================================
     DIVIDER
  ======================================================= */

  cardDivider: {
    height: 1,

    backgroundColor: UI.line,

    marginTop: 14,
    marginBottom: 12,
  },

  /* =======================================================
     ADDRESS
  ======================================================= */

  addressBottom: {
    flexDirection: "row",

    alignItems: "flex-start",
  },

  addressSmallIcon: {
    marginTop: 2,

    marginRight: 7,
  },

  addressText: {
    flex: 1,

    fontSize: 13,
    lineHeight: 19,

    color: UI.inkSoft,
  },

  /* =======================================================
     EMPTY
  ======================================================= */

  emptyContainer: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 28,
    paddingTop: 40,
    paddingBottom: 40,
  },

  emptyIcon: {
    width: 76,
    height: 76,

    borderRadius: 38,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: UI.blueSoft,
  },

  emptyEyebrow: {
    marginTop: 22,

    fontSize: 9,
    lineHeight: 13,

    fontWeight: "900",

    letterSpacing: 1.4,

    color: UI.blue,
  },

  emptyTitle: {
    marginTop: 3,

    fontSize: 22,
    lineHeight: 28,

    fontWeight: "800",

    letterSpacing: -0.4,

    color: UI.ink,
  },

  emptyDescription: {
    marginTop: 9,

    maxWidth: 300,

    fontSize: 14,
    lineHeight: 21,

    textAlign: "center",

    color: UI.muted,
  },

  emptyButton: {
    minHeight: 50,

    paddingHorizontal: 22,

    marginTop: 24,

    borderRadius: 15,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    backgroundColor: UI.blue,
  },

  emptyButtonText: {
    marginLeft: 8,

    fontSize: 14,

    fontWeight: "800",

    color: "#FFFFFF",
  },

  /* =======================================================
     FOOTER
  ======================================================= */

  footerHint: {
    flexDirection: "row",

    alignItems: "center",
    justifyContent: "center",

    paddingTop: 8,
    paddingBottom: 4,
  },

  footerHintText: {
    marginLeft: 6,

    fontSize: 11,

    color: UI.subtle,
  },

  /* =======================================================
     LOADING
  ======================================================= */

  loadingContainer: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 12,

    fontSize: 13,

    color: UI.muted,
  },
});
