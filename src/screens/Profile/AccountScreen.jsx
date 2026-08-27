import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import Ionicons from "@expo/vector-icons/Ionicons";

import { useCallback } from "react";

import { useFocusEffect } from "@react-navigation/native";

import { useAuth } from "../../context/AuthContext";

export default function AccountScreen({ navigation }) {
  const { user, refreshProfile } = useAuth();

  // ==========================================
  // MỖI LẦN MỞ ACCOUNT
  // LẤY PROFILE MỚI NHẤT
  // ==========================================

  useFocusEffect(
    useCallback(() => {
      refreshProfile();
    }, []),
  );

  // ==========================================
  // DEBUG
  // ==========================================

  console.log("ACCOUNT USER:", user);

  console.log("ACCOUNT isActive:", user?.isActive);

  console.log("ACCOUNT isActive TYPE:", typeof user?.isActive);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor="#111827" />

      {/* ===================================== */}
      {/* HEADER */}
      {/* ===================================== */}

      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>

        <Text style={styles.headerTitle}>Tài khoản</Text>

        <View style={styles.headerRight} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* =================================== */}
        {/* AVATAR */}
        {/* =================================== */}

        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: user?.avatar || "https://i.pravatar.cc/300",
              }}
              style={styles.avatar}
            />

            <View style={styles.cameraButton}>
              <Ionicons name="camera" size={18} color="#fff" />
            </View>
          </View>

          <Text style={styles.name}>{user?.fullName || "Người dùng"}</Text>

          <Text style={styles.email}>{user?.email || ""}</Text>
        </View>

        {/* =================================== */}
        {/* THÔNG TIN CÁ NHÂN */}
        {/* =================================== */}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>

          {/* HỌ TÊN */}

          <View style={styles.infoItem}>
            <View style={styles.iconContainer}>
              <Ionicons name="person-outline" size={21} color="#111827" />
            </View>

            <View style={styles.infoContent}>
              <Text style={styles.label}>Họ và tên</Text>

              <Text style={styles.value}>
                {user?.fullName || "Chưa cập nhật"}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* EMAIL */}

          <View style={styles.infoItem}>
            <View style={styles.iconContainer}>
              <Ionicons name="mail-outline" size={21} color="#111827" />
            </View>

            <View style={styles.infoContent}>
              <Text style={styles.label}>Email</Text>

              <Text style={styles.value}>{user?.email || "Chưa cập nhật"}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* SỐ ĐIỆN THOẠI */}

          <View style={styles.infoItem}>
            <View style={styles.iconContainer}>
              <Ionicons name="call-outline" size={21} color="#111827" />
            </View>

            <View style={styles.infoContent}>
              <Text style={styles.label}>Số điện thoại</Text>

              <Text style={styles.value}>{user?.phone || "Chưa cập nhật"}</Text>
            </View>
          </View>
        </View>

        {/* =================================== */}
        {/* TRẠNG THÁI TÀI KHOẢN */}
        {/* =================================== */}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Trạng thái tài khoản</Text>

          {/* STATUS */}

          <View style={styles.statusRow}>
            <View style={styles.statusLeft}>
              <Ionicons
                name="shield-checkmark-outline"
                size={22}
                color="#111827"
              />

              <Text style={styles.statusText}>Tài khoản</Text>
            </View>

            <View
              style={[
                styles.statusBadge,

                {
                  backgroundColor:
                    user?.isActive === true ? "#DCFCE7" : "#FEE2E2",
                },
              ]}
            >
              <Text
                style={[
                  styles.statusBadgeText,

                  {
                    color: user?.isActive === true ? "#16A34A" : "#DC2626",
                  },
                ]}
              >
                {user?.isActive === true ? "Đang hoạt động" : "Đã khóa"}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* ROLE */}

          <View style={styles.statusRow}>
            <View style={styles.statusLeft}>
              <Ionicons
                name="person-circle-outline"
                size={22}
                color="#111827"
              />

              <Text style={styles.statusText}>Loại tài khoản</Text>
            </View>

            <Text style={styles.roleText}>
              {user?.role === "user"
                ? "Khách hàng"
                : user?.role || "Khách hàng"}
            </Text>
          </View>
        </View>

        {/* =================================== */}
        {/* CHỈNH SỬA */}
        {/* =================================== */}

        <Pressable
          style={({ pressed }) => [
            styles.editButton,

            pressed && {
              opacity: 0.8,
            },
          ]}
          onPress={() => {
            // Sau này mở EditProfileScreen
          }}
        >
          <Ionicons name="create-outline" size={21} color="#fff" />

          <Text style={styles.editButtonText}>Chỉnh sửa thông tin</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },

  header: {
    height: 65,
    backgroundColor: "#111827",

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    paddingHorizontal: 20,
  },

  backButton: {
    width: 40,
    height: 40,

    justifyContent: "center",
    alignItems: "center",
  },

  headerRight: {
    width: 40,
  },

  headerTitle: {
    color: "#fff",

    fontSize: 20,

    fontWeight: "700",
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  avatarSection: {
    alignItems: "center",

    paddingVertical: 30,
  },

  avatarContainer: {
    position: "relative",
  },

  avatar: {
    width: 110,
    height: 110,

    borderRadius: 55,

    borderWidth: 4,

    borderColor: "#fff",
  },

  cameraButton: {
    position: "absolute",

    right: 0,
    bottom: 0,

    width: 34,
    height: 34,

    borderRadius: 17,

    backgroundColor: "#111827",

    borderWidth: 3,

    borderColor: "#fff",

    justifyContent: "center",

    alignItems: "center",
  },

  name: {
    marginTop: 15,

    fontSize: 22,

    fontWeight: "700",

    color: "#111827",
  },

  email: {
    marginTop: 5,

    fontSize: 14,

    color: "#6B7280",
  },

  card: {
    backgroundColor: "#fff",

    borderRadius: 20,

    padding: 20,

    marginBottom: 18,

    elevation: 3,

    shadowColor: "#000",

    shadowOpacity: 0.05,

    shadowRadius: 8,

    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  sectionTitle: {
    fontSize: 18,

    fontWeight: "700",

    color: "#111827",

    marginBottom: 18,
  },

  infoItem: {
    flexDirection: "row",

    alignItems: "center",
  },

  iconContainer: {
    width: 42,
    height: 42,

    borderRadius: 12,

    backgroundColor: "#F3F4F6",

    justifyContent: "center",

    alignItems: "center",
  },

  infoContent: {
    flex: 1,

    marginLeft: 14,
  },

  label: {
    fontSize: 13,

    color: "#9CA3AF",

    marginBottom: 4,
  },

  value: {
    fontSize: 16,

    color: "#111827",

    fontWeight: "500",
  },

  divider: {
    height: 1,

    backgroundColor: "#F0F0F0",

    marginVertical: 16,
  },

  statusRow: {
    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",
  },

  statusLeft: {
    flexDirection: "row",

    alignItems: "center",
  },

  statusText: {
    marginLeft: 12,

    fontSize: 15,

    color: "#111827",

    fontWeight: "500",
  },

  statusBadge: {
    paddingHorizontal: 10,

    paddingVertical: 6,

    borderRadius: 10,
  },

  statusBadgeText: {
    fontSize: 12,

    fontWeight: "600",
  },

  roleText: {
    fontSize: 15,

    color: "#6B7280",

    fontWeight: "500",
  },

  editButton: {
    height: 56,

    borderRadius: 18,

    backgroundColor: "#111827",

    flexDirection: "row",

    justifyContent: "center",

    alignItems: "center",

    marginTop: 2,
  },

  editButtonText: {
    color: "#fff",

    fontSize: 16,

    fontWeight: "700",

    marginLeft: 10,
  },
});
