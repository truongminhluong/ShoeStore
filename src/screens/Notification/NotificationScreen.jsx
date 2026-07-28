import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";

import { SafeAreaView } from "react-native-safe-area-context";

import useNotificationViewModel from "../../viewmodels/useNotificationViewModel";

import COLORS from "../../constants/colors";

export default function NotificationScreen({ navigation }) {
  const { notifications, loading, markAsRead, markAllAsRead } =
    useNotificationViewModel();

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  const renderNotification = ({ item }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.notificationItem, !item.isRead && styles.unreadItem]}
        onPress={() => {
          if (!item.isRead) {
            markAsRead(item._id);
          }
        }}
      >
        {/* ICON */}
        <View
          style={[
            styles.iconContainer,
            !item.isRead && styles.unreadIconContainer,
          ]}
        >
          <Ionicons
            name={
              item.type === "order_status"
                ? "cube-outline"
                : "notifications-outline"
            }
            size={22}
            color={!item.isRead ? COLORS.primary : "#777777"}
          />
        </View>

        {/* NỘI DUNG */}
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, !item.isRead && styles.unreadTitle]}>
              {item.title}
            </Text>

            {!item.isRead && <View style={styles.unreadDot} />}
          </View>

          <Text style={styles.message}>{item.message}</Text>

          <View style={styles.dateRow}>
            <Ionicons name="time-outline" size={14} color="#999999" />

            <Text style={styles.date}>
              {new Date(item.createdAt).toLocaleString("vi-VN")}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* HEADER */}
      <View style={styles.header}>
        {/* NÚT QUAY LẠI */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={25} color={COLORS.black} />
        </TouchableOpacity>

        {/* TIÊU ĐỀ */}
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Thông báo</Text>

          {unreadCount > 0 && (
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{unreadCount}</Text>
            </View>
          )}
        </View>

        {/* ĐỌC TẤT CẢ */}
        <TouchableOpacity onPress={markAllAsRead} disabled={unreadCount === 0}>
          <Text
            style={[
              styles.readAllText,
              unreadCount === 0 && styles.disabledText,
            ]}
          >
            Đọc tất cả
          </Text>
        </TouchableOpacity>
      </View>

      {/* DANH SÁCH */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id}
        renderItem={renderNotification}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={false}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        contentContainerStyle={
          notifications.length === 0
            ? styles.emptyContainer
            : styles.listContainer
        }
        ListEmptyComponent={
          <View style={styles.emptyContent}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="notifications-off-outline"
                size={42}
                color="#AAAAAA"
              />
            </View>

            <Text style={styles.emptyTitle}>Chưa có thông báo</Text>

            <Text style={styles.emptyMessage}>
              Các thông báo về đơn hàng của bạn sẽ xuất hiện ở đây.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FB",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  // =========================
  // HEADER
  // =========================

  header: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    backgroundColor: "#F8F9FB",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },

  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },

  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.black,
  },

  countBadge: {
    minWidth: 22,
    height: 22,
    paddingHorizontal: 6,
    marginLeft: 8,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary,
  },

  countText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },

  readAllText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.primary,
  },

  disabledText: {
    color: "#BBBBBB",
  },

  // =========================
  // LIST
  // =========================

  listContainer: {
    padding: 16,
    paddingBottom: 30,
  },

  notificationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    marginBottom: 12,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.05,
    shadowRadius: 6,

    elevation: 2,
  },

  unreadItem: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },

  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    backgroundColor: "#F1F1F1",
  },

  unreadIconContainer: {
    backgroundColor: "#EAF3FF",
  },

  content: {
    flex: 1,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
  },

  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#333333",
  },

  unreadTitle: {
    fontWeight: "700",
    color: COLORS.black,
  },

  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
    backgroundColor: COLORS.primary,
  },

  message: {
    fontSize: 14,
    lineHeight: 20,
    color: "#666666",
    marginBottom: 8,
  },

  dateRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  date: {
    fontSize: 12,
    color: "#999999",
    marginLeft: 4,
  },

  // =========================
  // EMPTY
  // =========================

  emptyContainer: {
    flex: 1,
  },

  emptyContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },

  emptyIcon: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#EEEEEE",
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333333",
    marginBottom: 8,
  },

  emptyMessage: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    color: "#999999",
  },
});
