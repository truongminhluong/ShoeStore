import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";

import COLORS from "../../constants/colors";

export default function Header({
  navigation,
  unreadCount = 0,
}) {
  return (
    <View style={styles.container}>
      {/* NÚT MENU */}
      <TouchableOpacity>
        <Ionicons
          name="menu-outline"
          size={28}
          color={COLORS.black}
        />
      </TouchableOpacity>

      {/* LOGO */}
      <Text style={styles.logo}>
        Ryde
      </Text>

      {/* NÚT THÔNG BÁO */}
      <TouchableOpacity
        style={styles.notificationButton}
        onPress={() =>
          navigation.navigate("Notifications")
        }
      >
        <Ionicons
          name="notifications-outline"
          size={26}
          color={COLORS.black}
        />

        {/* CHỈ HIỆN CHẤM ĐỎ KHI CÓ THÔNG BÁO CHƯA ĐỌC */}
        {unreadCount > 0 && (
          <View
            style={styles.notificationDot}
          />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  logo: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.black,
  },

  notificationButton: {
    position: "relative",
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },

  notificationDot: {
    position: "absolute",
    top: 1,
    right: 1,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "red",
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
});