import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import Ionicons from "@expo/vector-icons/Ionicons";

import { useCallback } from "react";

import { useFocusEffect } from "@react-navigation/native";

import { useAuth } from "../../context/AuthContext";

export default function AccountScreen({ navigation }) {
  const { user, refreshProfile } = useAuth();

  // ==========================================
  // REFRESH PROFILE MỖI LẦN MỞ ACCOUNT
  // ==========================================

  useFocusEffect(
    useCallback(() => {
      refreshProfile();
    }, []),
  );

  const isActive = user?.isActive === true;

  const roleLabel =
    user?.role === "user"
      ? "Khách hàng"
      : user?.role || "Khách hàng";

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top"]}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FAFAFA"
      />

      <View style={styles.screen}>

        {/* ================================================= */}
        {/* BACKGROUND - SNEAKER */}
        {/* ================================================= */}

        <Image
          source={require("../../../assets/images/login-shoe.png")}
          style={styles.backgroundShoe}
          resizeMode="contain"
          pointerEvents="none"
        />

        {/* ================================================= */}
        {/* BACKGROUND - DOT PATTERN */}
        {/* ================================================= */}

        <View
          style={styles.dotPattern}
          pointerEvents="none"
        >
          {Array.from({ length: 30 }).map((_, index) => (
            <View
              key={index}
              style={styles.dot}
            />
          ))}
        </View>

        {/* ================================================= */}
        {/* SUBTLE BOTTOM SHAPE */}
        {/* ================================================= */}

        <View
          style={styles.bottomShape}
          pointerEvents="none"
        />

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <View style={styles.header}>

          <Pressable
            onPress={() => navigation.goBack()}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.pressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Quay lại"
            hitSlop={6}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color="#111827"
            />
          </Pressable>

          <Text style={styles.headerTitle}>
            Tài khoản
          </Text>

          <View style={styles.headerSpacer} />

        </View>

        {/* ================================================= */}
        {/* CONTENT */}
        {/* ================================================= */}

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >

          {/* ================================================= */}
          {/* PROFILE HERO */}
          {/* ================================================= */}

          <View style={styles.profileHero}>

            <View style={styles.avatarContainer}>

              <Image
                source={{
                  uri:
                    user?.avatar ||
                    "https://i.pravatar.cc/300",
                }}
                style={styles.avatar}
                accessibilityLabel="Ảnh đại diện"
              />

              {/* Camera badge */}
              <View
                style={styles.cameraButton}
                accessibilityElementsHidden
                importantForAccessibility="no"
              >
                <Ionicons
                  name="camera-outline"
                  size={18}
                  color="#111827"
                />
              </View>

            </View>

            <Text
              style={styles.name}
              numberOfLines={2}
            >
              {user?.fullName || "Người dùng"}
            </Text>

            <Text
              style={styles.email}
              numberOfLines={1}
            >
              {user?.email || "Chưa cập nhật email"}
            </Text>

            {/* ACTIVE BADGE */}

            <View
              style={[
                styles.profileStatus,
                isActive
                  ? styles.profileStatusActive
                  : styles.profileStatusInactive,
              ]}
            >
              <View
                style={[
                  styles.profileStatusDot,
                  {
                    backgroundColor: isActive
                      ? "#16A34A"
                      : "#DC2626",
                  },
                ]}
              />

              <Text
                style={[
                  styles.profileStatusText,
                  {
                    color: isActive
                      ? "#15803D"
                      : "#B91C1C",
                  },
                ]}
              >
                {isActive
                  ? "Đang hoạt động"
                  : "Đã khóa"}
              </Text>
            </View>

          </View>

          {/* ================================================= */}
          {/* PERSONAL INFORMATION */}
          {/* ================================================= */}

          <View style={styles.section}>

            <Text style={styles.sectionTitle}>
              Thông tin cá nhân
            </Text>

            <View style={styles.accentLine} />

            {/* FULL NAME */}

            <View style={styles.infoRow}>

              <View style={styles.infoIcon}>
                <Ionicons
                  name="person-outline"
                  size={23}
                  color="#111827"
                />
              </View>

              <View style={styles.infoContent}>

                <Text style={styles.label}>
                  Họ và tên
                </Text>

                <Text
                  style={styles.value}
                  numberOfLines={2}
                >
                  {user?.fullName ||
                    "Chưa cập nhật"}
                </Text>

              </View>

            </View>

            <View style={styles.divider} />

            {/* EMAIL */}

            <View style={styles.infoRow}>

              <View style={styles.infoIcon}>
                <Ionicons
                  name="mail-outline"
                  size={23}
                  color="#111827"
                />
              </View>

              <View style={styles.infoContent}>

                <Text style={styles.label}>
                  Email
                </Text>

                <Text
                  style={styles.value}
                  numberOfLines={2}
                >
                  {user?.email ||
                    "Chưa cập nhật"}
                </Text>

              </View>

            </View>

            <View style={styles.divider} />

            {/* PHONE */}

            <View style={styles.infoRow}>

              <View style={styles.infoIcon}>
                <Ionicons
                  name="call-outline"
                  size={23}
                  color="#111827"
                />
              </View>

              <View style={styles.infoContent}>

                <Text style={styles.label}>
                  Số điện thoại
                </Text>

                <Text
                  style={styles.value}
                  numberOfLines={1}
                >
                  {user?.phone ||
                    "Chưa cập nhật"}
                </Text>

              </View>

            </View>

          </View>

          {/* ================================================= */}
          {/* ACCOUNT INFORMATION */}
          {/* ================================================= */}

          <View style={styles.section}>

            <Text style={styles.sectionTitle}>
              Tài khoản
            </Text>

            <View style={styles.accentLine} />

            {/* STATUS */}

            <View style={styles.infoRow}>

              <View style={styles.statusIcon}>

                <View
                  style={[
                    styles.statusIconOuter,
                    {
                      backgroundColor: isActive
                        ? "#DCFCE7"
                        : "#FEE2E2",
                    },
                  ]}
                >

                  <View
                    style={[
                      styles.statusIconInner,
                      {
                        backgroundColor: isActive
                          ? "#16A34A"
                          : "#DC2626",
                      },
                    ]}
                  />

                </View>

              </View>

              <View style={styles.infoContent}>

                <Text style={styles.label}>
                  Trạng thái
                </Text>

                <Text
                  style={[
                    styles.value,
                    {
                      color: isActive
                        ? "#15803D"
                        : "#B91C1C",
                      fontWeight: "600",
                    },
                  ]}
                >
                  {isActive
                    ? "Đang hoạt động"
                    : "Đã khóa"}
                </Text>

              </View>

            </View>

            <View style={styles.divider} />

            {/* ROLE */}

            <View style={styles.infoRow}>

              <View style={styles.infoIcon}>
                <Ionicons
                  name="person-circle-outline"
                  size={25}
                  color="#111827"
                />
              </View>

              <View style={styles.infoContent}>

                <Text style={styles.label}>
                  Loại tài khoản
                </Text>

                <Text style={styles.value}>
                  {roleLabel}
                </Text>

              </View>

            </View>

          </View>

          {/* ================================================= */}
          {/* EDIT BUTTON */}
          {/* ================================================= */}

          <Pressable
            style={({ pressed }) => [
              styles.editButton,
              pressed && styles.editButtonPressed,
            ]}
            onPress={() => {
              // TODO:
              navigation.navigate("EditProfile", {
                user: user
              });
            }}
            accessibilityRole="button"
            accessibilityLabel="Chỉnh sửa thông tin"
          >

            <Ionicons
              name="create-outline"
              size={21}
              color="#FFFFFF"
            />

            <Text style={styles.editButtonText}>
              CHỈNH SỬA THÔNG TIN
            </Text>

            <Ionicons
              name="arrow-forward"
              size={21}
              color="#FFFFFF"
              style={styles.editArrow}
            />

          </Pressable>

        </ScrollView>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  // =====================================================
  // BASE
  // =====================================================

  safeArea: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },

  screen: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    overflow: "hidden",
    position: "relative",
  },

  // =====================================================
  // BACKGROUND SNEAKER
  // =====================================================

  backgroundShoe: {
    position: "absolute",

    width: 330,
    height: 330,

    right: -85,
    top: 20,

    opacity: 0.15,

    zIndex: 0,
  },

  // =====================================================
  // DOT PATTERN
  // =====================================================

  dotPattern: {
    position: "absolute",

    left: 12,
    top: 72,

    width: 60,
    height: 70,

    flexDirection: "row",
    flexWrap: "wrap",

    alignContent: "flex-start",

    zIndex: 0,

    opacity: 0.5,
  },

  dot: {
    width: 3,
    height: 3,

    borderRadius: 2,

    backgroundColor: "#CBD5E1",

    marginRight: 7,
    marginBottom: 7,
  },

  // =====================================================
  // BOTTOM ABSTRACT SHAPE
  // =====================================================

  bottomShape: {
    position: "absolute",

    width: 320,
    height: 130,

    left: -150,
    bottom: -75,

    borderRadius: 160,

    backgroundColor: "#F1F5F9",

    transform: [
      {
        rotate: "-12deg",
      },
    ],

    zIndex: 0,
  },

  // =====================================================
  // HEADER
  // =====================================================

  header: {
    height: 58,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    paddingHorizontal: 20,

    backgroundColor: "transparent",

    zIndex: 5,
  },

  backButton: {
    width: 44,
    height: 44,

    alignItems: "center",
    justifyContent: "center",
  },

  headerSpacer: {
    width: 44,
    height: 44,
  },

  headerTitle: {
    color: "#111827",

    fontSize: 20,

    lineHeight: 26,

    fontWeight: "700",

    letterSpacing: -0.3,
  },

  // =====================================================
  // CONTENT
  // =====================================================

  content: {
    paddingHorizontal: 20,

    paddingBottom: 42,

    zIndex: 2,
  },

  // =====================================================
  // PROFILE
  // =====================================================

  profileHero: {
    alignItems: "center",

    paddingTop: 18,

    paddingBottom: 30,
  },

  avatarContainer: {
    position: "relative",
  },

  avatar: {
    width: 112,
    height: 112,

    borderRadius: 56,

    borderWidth: 4,

    borderColor: "#FFFFFF",

    backgroundColor: "#E5E7EB",
  },

  cameraButton: {
    position: "absolute",

    right: -1,
    bottom: 0,

    width: 36,
    height: 36,

    borderRadius: 18,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#FFFFFF",

    borderWidth: 1,

    borderColor: "#E5E7EB",

    shadowColor: "#000",

    shadowOpacity: 0.08,

    shadowRadius: 6,

    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 2,
  },

  name: {
    marginTop: 15,

    color: "#111827",

    fontSize: 24,

    lineHeight: 30,

    fontWeight: "800",

    letterSpacing: -0.5,

    textAlign: "center",

    maxWidth: "90%",
  },

  email: {
    marginTop: 4,

    color: "#64748B",

    fontSize: 14,

    lineHeight: 20,

    textAlign: "center",

    maxWidth: "90%",
  },

  // =====================================================
  // PROFILE STATUS
  // =====================================================

  profileStatus: {
    flexDirection: "row",

    alignItems: "center",

    marginTop: 12,

    paddingHorizontal: 11,

    paddingVertical: 6,

    borderRadius: 999,
  },

  profileStatusActive: {
    backgroundColor: "#F0FDF4",
  },

  profileStatusInactive: {
    backgroundColor: "#FEF2F2",
  },

  profileStatusDot: {
    width: 7,
    height: 7,

    borderRadius: 4,

    marginRight: 7,
  },

  profileStatusText: {
    fontSize: 12,

    lineHeight: 16,

    fontWeight: "600",
  },

  // =====================================================
  // SECTIONS
  // =====================================================

  section: {
    marginBottom: 28,
  },

  sectionTitle: {
    color: "#111827",

    fontSize: 18,

    lineHeight: 24,

    fontWeight: "700",

    letterSpacing: -0.25,
  },

  accentLine: {
    width: 34,
    height: 3,

    borderRadius: 2,

    backgroundColor: "#2563EB",

    marginTop: 9,

    marginBottom: 15,
  },

  // =====================================================
  // INFO ROW
  // =====================================================

  infoRow: {
    minHeight: 64,

    flexDirection: "row",

    alignItems: "center",
  },

  infoIcon: {
    width: 34,

    alignItems: "flex-start",

    justifyContent: "center",

    marginRight: 10,
  },

  infoContent: {
    flex: 1,

    minWidth: 0,
  },

  label: {
    color: "#111827",

    fontSize: 13,

    lineHeight: 18,

    fontWeight: "500",

    marginBottom: 3,
  },

  value: {
    color: "#64748B",

    fontSize: 15,

    lineHeight: 21,

    fontWeight: "400",
  },

  divider: {
    height: 1,

    backgroundColor: "#E2E8F0",

    marginLeft: 44,

    marginVertical: 2,
  },

  // =====================================================
  // STATUS
  // =====================================================

  statusIcon: {
    width: 34,

    alignItems: "flex-start",

    justifyContent: "center",

    marginRight: 10,
  },

  statusIconOuter: {
    width: 26,
    height: 26,

    borderRadius: 13,

    alignItems: "center",
    justifyContent: "center",
  },

  statusIconInner: {
    width: 9,
    height: 9,

    borderRadius: 5,
  },

  // =====================================================
  // EDIT BUTTON
  // =====================================================

  editButton: {
    minHeight: 56,

    borderRadius: 16,

    backgroundColor: "#111827",

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    paddingHorizontal: 18,

    marginTop: -2,

    position: "relative",
  },

  editButtonPressed: {
    opacity: 0.82,
  },

  editButtonText: {
    color: "#FFFFFF",

    fontSize: 15,

    lineHeight: 20,

    fontWeight: "800",

    letterSpacing: 0.35,

    marginLeft: 9,
  },

  editArrow: {
    position: "absolute",

    right: 18,
  },

  // =====================================================
  // PRESS STATE
  // =====================================================

  pressed: {
    opacity: 0.6,
  },
});