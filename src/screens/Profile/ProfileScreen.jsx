import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  StatusBar,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";

import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import COLORS from "../../constants/colors";

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();

  // =========================================================
  // PROFILE STATS
  // =========================================================

  const [orderCount, setOrderCount] = useState(0);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  const [loadingStats, setLoadingStats] = useState(true);

  // =========================================================
  // LOAD PROFILE STATS
  // =========================================================

  const loadProfileStats = async () => {
    try {
      setLoadingStats(true);

      const [ordersResponse, favoritesResponse, reviewsResponse] =
        await Promise.all([
          api.get("/orders"),
          api.get("/favorites"),
          api.get("/reviews/my/count"),
        ]);

      // -----------------------------------------------------
      // ORDERS
      // -----------------------------------------------------

      const orders = ordersResponse?.data?.data || [];

      setOrderCount(orders.length);

      // -----------------------------------------------------
      // FAVORITES
      // -----------------------------------------------------

      const favorite = favoritesResponse?.data?.data;

      setFavoriteCount(favorite?.products?.length || 0);

      // -----------------------------------------------------
      // REVIEWS
      // -----------------------------------------------------

      const reviews = reviewsResponse?.data?.data;

      setReviewCount(Number(reviews) || 0);
    } catch (error) {
      console.log(
        "❌ Lỗi lấy thống kê Profile:",
        error?.response?.data || error?.message,
      );

      setOrderCount(0);
      setFavoriteCount(0);
      setReviewCount(0);
    } finally {
      setLoadingStats(false);
    }
  };

  // =========================================================
  // RELOAD WHEN SCREEN FOCUS
  // =========================================================

  useFocusEffect(
    useCallback(() => {
      loadProfileStats();
    }, []),
  );

  // =========================================================
  // MENU DATA
  // =========================================================

  const accountMenus = [
    {
      title: "Tài khoản của tôi",
      icon: "person-outline",
      screen: "Account",
    },
    {
      title: "Đơn hàng của tôi",
      icon: "bag-handle-outline",
      screen: "Orders",
    },
    {
      title: "Sổ địa chỉ",
      icon: "location-outline",
      screen: "Address",
    },
    {
      title: "Danh sách yêu thích",
      icon: "heart-outline",
      screen: "Favorite",
    },
  ];

  const otherMenus = [
    {
      title: "Cài đặt",
      icon: "settings-outline",
      screen: "Settings",
    },
    {
      title: "Trợ giúp & Hỗ trợ",
      icon: "headset-outline",
      screen: "Help",
    },
  ];

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất?", [
      {
        text: "Hủy",
        style: "cancel",
      },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: logout,
      },
    ]);
  };

  // =========================================================
  // AVATAR
  // =========================================================

  const avatarUri = user?.avatar || "https://i.pravatar.cc/300";

  // =========================================================
  // RENDER STAT
  // =========================================================

  const renderStat = (icon, number, label, description) => {
    return (
      <View style={styles.statItem}>
        <Ionicons
          name={icon}
          size={29}
          color="#101828"
          style={styles.statIcon}
        />

        {loadingStats ? (
          <ActivityIndicator
            size="small"
            color="#101828"
            style={styles.loading}
          />
        ) : (
          <Text style={styles.statNumber}>
            {String(number).padStart(2, "0")}
          </Text>
        )}

        <Text style={styles.statLabel}>{label}</Text>

        <Text style={styles.statDescription}>{description}</Text>
      </View>
    );
  };

  // =========================================================
  // RENDER MENU
  // =========================================================

  const renderMenu = (items) => {
    return (
      <View style={styles.menuContainer}>
        {items.map((item, index) => (
          <Pressable
            key={item.title}
            onPress={() => {
              navigation.navigate(item.screen);
            }}
            android_ripple={{
              color: "#F1F3F5",
            }}
            style={({ pressed }) => [
              styles.menuItem,

              index === items.length - 1 && styles.menuItemLast,

              pressed && styles.menuItemPressed,
            ]}
          >
            <View style={styles.menuLeft}>
              <Ionicons name={item.icon} size={25} color="#344054" />

              <Text style={styles.menuText}>{item.title}</Text>
            </View>

            <Ionicons name="chevron-forward" size={22} color="#667085" />
          </Pressable>
        ))}
      </View>
    );
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* =================================================
            BACKGROUND DECORATION
        ================================================= */}

        <View pointerEvents="none" style={styles.backgroundDecor}>
          {/* Dots */}

          <View style={styles.dotPattern}>
            {Array.from({ length: 36 }).map((_, index) => (
              <View key={index} style={styles.dot} />
            ))}
          </View>

          {/* Sneaker */}

          <Image
            source={require("../../../assets/images/login-shoe.png")}
            resizeMode="contain"
            style={styles.shoeImage}
          />
        </View>

        {/* =================================================
            TOP HEADER
        ================================================= */}

        <View style={styles.topHeader}>
          <View>
            <Text style={styles.headerTitle}>PROFILE</Text>

            <View style={styles.headerAccent} />
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.settingsButton,
              pressed && styles.settingsPressed,
            ]}
            onPress={() => navigation.navigate("Settings")}
          >
            <Ionicons name="settings-outline" size={27} color="#101828" />
          </Pressable>
        </View>

        {/* =================================================
            MEMBER LABEL
        ================================================= */}

        <Text style={styles.memberLabel}>RYDE MEMBER</Text>

        {/* =================================================
            PROFILE INFO
        ================================================= */}

        <Pressable
          onPress={() => navigation.navigate("Account")}
          style={({ pressed }) => [
            styles.profileInfo,
            pressed && styles.profilePressed,
          ]}
        >
          <View style={styles.avatarWrapper}>
            <Image
              source={{
                uri: avatarUri,
              }}
              style={styles.avatar}
            />

            <View style={styles.avatarStatus} />

            <View style={styles.cameraButton}>
              <Ionicons name="camera" size={13} color="#FFFFFF" />
            </View>
          </View>

          <View style={styles.userInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.name} numberOfLines={1}>
                {user?.fullName || "Người dùng"}
              </Text>

              <View style={styles.vipBadge}>
                <Text style={styles.vipText}>VIP</Text>
              </View>
            </View>

            <Text style={styles.email} numberOfLines={1}>
              {user?.email || ""}
            </Text>

            <Text style={styles.member}>Thành viên RYDE</Text>
          </View>

          <Ionicons name="chevron-forward" size={25} color="#667085" />
        </Pressable>

        {/* =================================================
            STATISTICS
        ================================================= */}

        <View style={styles.statsContainer}>
          {renderStat(
            "bag-handle-outline",
            orderCount,
            "ĐƠN HÀNG",
            "Tất cả đơn hàng",
          )}

          <View style={styles.statDivider} />

          {renderStat(
            "heart-outline",
            favoriteCount,
            "YÊU THÍCH",
            "Sản phẩm đã lưu",
          )}

          <View style={styles.statDivider} />

          {renderStat("star-outline", reviewCount, "ĐÁNH GIÁ", "Đã đánh giá")}
        </View>

        {/* =================================================
            ACCOUNT
        ================================================= */}

        <Text style={styles.sectionTitle}>TÀI KHOẢN</Text>

        {renderMenu(accountMenus)}

        {/* =================================================
            OTHER
        ================================================= */}

        <Text style={[styles.sectionTitle, styles.otherTitle]}>KHÁC</Text>

        {renderMenu(otherMenus)}

        {/* =================================================
            LOGOUT
        ================================================= */}

        <Pressable
          onPress={handleLogout}
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && styles.logoutPressed,
          ]}
        >
          <View style={styles.logoutLeft}>
            <Ionicons name="log-out-outline" size={27} color="#EF4444" />

            <Text style={styles.logoutText}>ĐĂNG XUẤT</Text>
          </View>

          <Ionicons name="chevron-forward" size={22} color="#98A2B3" />
        </Pressable>

        {/* =================================================
            VERSION
        ================================================= */}

        <Text style={styles.version}>RYDE · VERSION 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({
  // ==========================================================
  // CONTAINER
  // ==========================================================

  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 45,
    position: "relative",
    overflow: "hidden",
  },

  // ==========================================================
  // BACKGROUND
  // ==========================================================

  backgroundDecor: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: "none",
  },

  dotPattern: {
    position: "absolute",
    top: 45,
    left: -2,
    width: 75,
    height: 80,
    flexDirection: "row",
    flexWrap: "wrap",
    opacity: 0.42,
  },

  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D7DDE6",
    marginRight: 9,
    marginBottom: 9,
  },

  shoeImage: {
    position: "absolute",
    top: 15,
    right: -95,
    width: 370,
    height: 370,
    opacity: 0.12,
  },

  // ==========================================================
  // TOP HEADER
  // ==========================================================

  topHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",

    position: "relative",
    zIndex: 5,

    minHeight: 88,
  },

  headerTitle: {
    fontSize: 43,
    lineHeight: 48,

    fontWeight: "900",

    letterSpacing: -1.5,

    color: "#101828",
  },

  headerAccent: {
    width: 48,
    height: 4,

    backgroundColor: COLORS?.primary || "#246BFE",

    borderRadius: 2,

    marginTop: 11,
  },

  settingsButton: {
    width: 48,
    height: 48,

    justifyContent: "center",
    alignItems: "center",

    marginTop: 2,
  },

  settingsPressed: {
    opacity: 0.5,
  },

  // ==========================================================
  // MEMBER LABEL
  // ==========================================================

  memberLabel: {
    position: "relative",
    zIndex: 3,

    marginTop: 28,

    fontSize: 15,
    fontWeight: "700",

    letterSpacing: 0.7,

    color: "#667085",
  },

  // ==========================================================
  // PROFILE INFO
  // ==========================================================

  profileInfo: {
    position: "relative",
    zIndex: 3,

    flexDirection: "row",
    alignItems: "center",

    marginTop: 25,

    minHeight: 105,
  },

  profilePressed: {
    opacity: 0.7,
  },

  avatarWrapper: {
    width: 94,
    height: 94,

    position: "relative",

    marginRight: 17,
  },

  avatar: {
    width: 94,
    height: 94,

    borderRadius: 47,

    backgroundColor: "#F2F4F7",
  },

  avatarStatus: {
    position: "absolute",

    width: 13,
    height: 13,

    right: 2,
    bottom: 5,

    borderRadius: 7,

    backgroundColor: "#22C55E",

    borderWidth: 2,
    borderColor: "#FFFFFF",
  },

  cameraButton: {
    position: "absolute",

    right: -1,
    bottom: -1,

    width: 28,
    height: 28,

    borderRadius: 14,

    backgroundColor: "#101828",

    justifyContent: "center",
    alignItems: "center",

    borderWidth: 2,
    borderColor: "#FFFFFF",
  },

  userInfo: {
    flex: 1,
    minWidth: 0,
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",

    paddingRight: 4,
  },

  name: {
    flexShrink: 1,

    fontSize: 20,
    lineHeight: 26,

    fontWeight: "800",

    color: "#101828",

    letterSpacing: -0.3,
  },

  vipBadge: {
    marginLeft: 8,

    paddingHorizontal: 8,
    paddingVertical: 4,

    borderRadius: 5,

    backgroundColor: "#101828",
  },

  vipText: {
    color: "#FFFFFF",

    fontSize: 10,
    fontWeight: "800",

    letterSpacing: 0.5,
  },

  email: {
    marginTop: 6,

    fontSize: 14.5,

    color: "#667085",
  },

  member: {
    marginTop: 5,

    fontSize: 13.5,

    color: "#98A2B3",
  },

  // ==========================================================
  // STATS
  // ==========================================================

  statsContainer: {
    position: "relative",
    zIndex: 3,

    flexDirection: "row",

    marginTop: 38,
    marginBottom: 38,

    minHeight: 160,
  },

  statItem: {
    flex: 1,

    alignItems: "center",
    justifyContent: "flex-start",

    paddingHorizontal: 4,
  },

  statIcon: {
    marginBottom: 9,
  },

  statNumber: {
    fontSize: 32,
    lineHeight: 36,

    fontWeight: "900",

    color: "#101828",

    letterSpacing: -0.7,
  },

  loading: {
    height: 36,
    marginBottom: 0,
  },

  statLabel: {
    marginTop: 7,

    fontSize: 13,
    lineHeight: 18,

    fontWeight: "800",

    color: "#667085",

    letterSpacing: 0.5,
  },

  statDescription: {
    marginTop: 3,

    fontSize: 11.5,
    lineHeight: 16,

    textAlign: "center",

    color: "#98A2B3",
  },

  statDivider: {
    width: 1,
    height: 125,

    marginTop: 4,

    backgroundColor: "#E4E7EC",
  },

  // ==========================================================
  // SECTION
  // ==========================================================

  sectionTitle: {
    position: "relative",
    zIndex: 3,

    marginBottom: 12,

    fontSize: 14,

    fontWeight: "800",

    letterSpacing: 0.8,

    color: "#667085",
  },

  otherTitle: {
    marginTop: 30,
  },

  // ==========================================================
  // MENU
  // ==========================================================

  menuContainer: {
    position: "relative",
    zIndex: 3,

    backgroundColor: "#FFFFFF",

    borderWidth: 1,
    borderColor: "#F0F1F3",

    borderRadius: 18,

    overflow: "hidden",
  },

  menuItem: {
    minHeight: 70,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    paddingHorizontal: 20,

    borderBottomWidth: 1,
    borderBottomColor: "#EEF0F2",
  },

  menuItemLast: {
    borderBottomWidth: 0,
  },

  menuItemPressed: {
    backgroundColor: "#FAFAFA",
  },

  menuLeft: {
    flexDirection: "row",
    alignItems: "center",

    flex: 1,
  },

  menuText: {
    marginLeft: 16,

    fontSize: 16,

    fontWeight: "600",

    color: "#101828",
  },

  // ==========================================================
  // LOGOUT
  // ==========================================================

  logoutButton: {
    position: "relative",
    zIndex: 3,

    minHeight: 70,

    marginTop: 30,

    paddingHorizontal: 20,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    backgroundColor: "#FFFFFF",

    borderTopWidth: 1,
    borderBottomWidth: 1,

    borderColor: "#F0F1F3",
  },

  logoutPressed: {
    backgroundColor: "#FFF7F7",
  },

  logoutLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  logoutText: {
    marginLeft: 16,

    fontSize: 15,

    fontWeight: "800",

    letterSpacing: 0.4,

    color: "#EF4444",
  },

  // ==========================================================
  // VERSION
  // ==========================================================

  version: {
    position: "relative",
    zIndex: 3,

    marginTop: 28,

    textAlign: "center",

    fontSize: 10.5,

    fontWeight: "600",

    letterSpacing: 0.8,

    color: "#B0B7C3",
  },
});
