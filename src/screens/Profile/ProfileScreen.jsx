import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  StatusBar,
  Pressable,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";

import { useAuth } from "../../context/AuthContext";
import COLORS from "../../constants/colors";

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();

  const menus = [
    {
      title: "Account",
      icon: "person-outline",
      screen: "Account",
    },
    {
      title: "Orders",
      icon: "bag-handle-outline",
      screen: "Orders",
    },
    {
      title: "Address",
      icon: "location-outline",
      screen: "Address",
    },
    {
      title: "Wishlist",
      icon: "heart-outline",
      screen: "Wishlist",
    },
    {
      title: "Settings",
      icon: "settings-outline",
      screen: "Settings",
    },
    {
      title: "Help",
      icon: "help-circle-outline",
      screen: "Help",
    },
  ];

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

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor="#111827" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}

        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>

          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: user?.avatar || "https://i.pravatar.cc/300",
              }}
              style={styles.avatar}
            />

            <Pressable style={styles.editAvatar}>
              <Ionicons name="camera" size={18} color="white" />
            </Pressable>
          </View>

          <Text style={styles.name}>{user?.fullName}</Text>

          <Text style={styles.email}>{user?.email}</Text>

          <Text style={styles.member}>Member since July 2026</Text>
        </View>

        {/* STATISTIC */}

        <View style={styles.statCard}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>12</Text>

            <Text style={styles.statLabel}>Orders</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.statItem}>
            <Text style={styles.statNumber}>8</Text>

            <Text style={styles.statLabel}>Wishlist</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.statItem}>
            <Text style={styles.statNumber}>5</Text>

            <Text style={styles.statLabel}>Reviews</Text>
          </View>
        </View>

        {/* MENU */}

        <View style={styles.menuCard}>
          {menus.map((item, index) => (
            <Pressable
              android_ripple={{
                color: "#EFEFEF",
              }}
              key={index}
              onPress={() => {
                navigation.navigate(item.screen);
              }}
              style={({ pressed }) => [
                styles.menuItem,
                pressed && {
                  opacity: 0.6,
                },
                index === menus.length - 1 && {
                  borderBottomWidth: 0,
                },
              ]}
            >
              <View style={styles.menuLeft}>
                <Ionicons name={item.icon} size={22} color="#111827" />

                <Text style={styles.menuText}>{item.title}</Text>
              </View>

              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </Pressable>
          ))}
        </View>

        {/* VERSION */}

        <Text style={styles.version}>Version 1.0.0</Text>

        {/* LOGOUT */}

        <Pressable
          onPress={handleLogout}
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && {
              opacity: 0.85,
            },
          ]}
        >
          <Ionicons name="log-out-outline" size={22} color="white" />

          <Text style={styles.logoutText}>Đăng xuất</Text>
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
    backgroundColor: "#111827",

    alignItems: "center",

    paddingTop: 20,

    paddingBottom: 80,

    borderBottomLeftRadius: 35,

    borderBottomRightRadius: 35,
  },

  headerTitle: {
    color: "#fff",

    fontSize: 30,

    fontWeight: "700",

    marginBottom: 22,
  },

  avatarContainer: {
    position: "relative",
  },

  avatar: {
    width: 120,

    height: 120,

    borderRadius: 60,

    borderWidth: 4,

    borderColor: "#fff",
  },

  editAvatar: {
    position: "absolute",

    bottom: 0,

    right: 0,

    width: 36,

    height: 36,

    borderRadius: 18,

    backgroundColor: "#111827",

    borderWidth: 3,

    borderColor: "#fff",

    justifyContent: "center",

    alignItems: "center",
  },

  name: {
    color: "#fff",

    fontSize: 24,

    fontWeight: "700",

    marginTop: 18,
  },

  email: {
    color: "#D1D5DB",

    marginTop: 8,

    fontSize: 15,
  },

  member: {
    color: "#9CA3AF",

    marginTop: 6,

    fontSize: 14,
  },

  statCard: {
    backgroundColor: "#fff",

    marginHorizontal: 20,

    marginTop: -40,

    borderRadius: 22,

    flexDirection: "row",

    justifyContent: "space-around",

    alignItems: "center",

    paddingVertical: 22,

    elevation: 5,

    shadowColor: "#000",

    shadowOpacity: 0.08,

    shadowRadius: 12,

    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  statItem: {
    alignItems: "center",

    flex: 1,
  },

  divider: {
    width: 1,

    height: 40,

    backgroundColor: "#ECECEC",
  },

  statNumber: {
    fontSize: 22,

    fontWeight: "700",

    color: "#111827",
  },

  statLabel: {
    marginTop: 5,

    color: "#6B7280",
  },

  menuCard: {
    backgroundColor: "#fff",

    marginHorizontal: 20,

    marginTop: 25,

    borderRadius: 22,

    overflow: "hidden",

    elevation: 4,

    shadowColor: "#000",

    shadowOpacity: 0.05,

    shadowRadius: 10,

    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  menuItem: {
    height: 62,

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    paddingHorizontal: 20,

    borderBottomWidth: 1,

    borderBottomColor: "#F2F2F2",
  },

  menuLeft: {
    flexDirection: "row",

    alignItems: "center",
  },

  menuText: {
    marginLeft: 16,

    fontSize: 16,

    color: "#111827",

    fontWeight: "500",
  },

  version: {
    textAlign: "center",

    color: "#9CA3AF",

    marginTop: 30,

    marginBottom: 18,

    fontSize: 14,
  },

  logoutButton: {
    height: 58,

    marginHorizontal: 20,

    marginBottom: 40,

    borderRadius: 18,

    backgroundColor: "#111827",

    flexDirection: "row",

    justifyContent: "center",

    alignItems: "center",
  },

  logoutText: {
    color: "#fff",

    marginLeft: 10,

    fontSize: 16,

    fontWeight: "700",
  },
});
