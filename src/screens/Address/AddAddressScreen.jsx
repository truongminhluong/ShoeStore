import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { createAddressApi } from "../../services/addressService";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import COLORS from "../../constants/colors";

export default function AddAddressScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();

  const { token } = useAuth();

  // =========================
  // STATE
  // =========================

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [ward, setWard] = useState("");
  const [district, setDistrict] = useState("");
  const [province, setProvince] = useState("");

  const [isDefault, setIsDefault] = useState(false);

  // =========================
  // LƯU ĐỊA CHỈ
  // =========================

  const handleSaveAddress = async () => {
    try {
      if (!fullName.trim()) {
        Alert.alert("Thông báo", "Vui lòng nhập họ và tên người nhận");

        return;
      }

      if (!phone.trim()) {
        Alert.alert("Thông báo", "Vui lòng nhập số điện thoại");

        return;
      }

      if (!addressDetail.trim()) {
        Alert.alert("Thông báo", "Vui lòng nhập địa chỉ cụ thể");

        return;
      }

      if (!ward.trim()) {
        Alert.alert("Thông báo", "Vui lòng nhập phường / xã");

        return;
      }

      if (!district.trim()) {
        Alert.alert("Thông báo", "Vui lòng nhập quận / huyện");

        return;
      }

      if (!province.trim()) {
        Alert.alert("Thông báo", "Vui lòng nhập tỉnh / thành phố");

        return;
      }

      if (!token) {
        Alert.alert("Thông báo", "Vui lòng đăng nhập");

        return;
      }

      const addressData = {
        fullName: fullName.trim(),
        phone: phone.trim(),
        addressDetail: addressDetail.trim(),
        ward: ward.trim(),
        district: district.trim(),
        province: province.trim(),
        isDefault,
      };

      console.log("Dữ liệu địa chỉ:", addressData);

      const response = await createAddressApi(addressData, token);

      console.log("Thêm địa chỉ thành công:", response);

      Alert.alert("Thành công", "Thêm địa chỉ thành công", [
        {
          text: "OK",
          onPress: () => {
            // Nếu mở từ Checkout
            if (route.params?.onAddressAdded) {
              route.params.onAddressAdded(response.data);
            }

            navigation.goBack();
          },
        },
      ]);
    } catch (error) {
      console.log("Lỗi thêm địa chỉ:", error.response?.data || error.message);

      Alert.alert(
        "Thất bại",
        error.response?.data?.message || "Không thể thêm địa chỉ",
      );
    }
  };

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
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Thêm địa chỉ</Text>

        <View style={styles.headerRight} />
      </View>

      {/* FORM */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* HỌ VÀ TÊN */}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Họ và tên người nhận</Text>

          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#9CA3AF" />

            <TextInput
              style={styles.input}
              placeholder="Nhập họ và tên"
              placeholderTextColor="#9CA3AF"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>
        </View>

        {/* SỐ ĐIỆN THOẠI */}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Số điện thoại</Text>

          <View style={styles.inputContainer}>
            <Ionicons name="call-outline" size={20} color="#9CA3AF" />

            <TextInput
              style={styles.input}
              placeholder="Nhập số điện thoại"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>
        </View>

        {/* ĐỊA CHỈ CỤ THỂ */}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Địa chỉ cụ thể</Text>

          <View style={styles.inputContainer}>
            <Ionicons name="home-outline" size={20} color="#9CA3AF" />

            <TextInput
              style={styles.input}
              placeholder="Nhập số nhà, tên đường"
              placeholderTextColor="#9CA3AF"
              value={addressDetail}
              onChangeText={setAddressDetail}
            />
          </View>
        </View>

        {/* PHƯỜNG / XÃ */}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phường / Xã</Text>

          <View style={styles.inputContainer}>
            <Ionicons name="location-outline" size={20} color="#9CA3AF" />

            <TextInput
              style={styles.input}
              placeholder="Nhập phường / xã"
              placeholderTextColor="#9CA3AF"
              value={ward}
              onChangeText={setWard}
            />
          </View>
        </View>

        {/* QUẬN / HUYỆN */}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Quận / Huyện</Text>

          <View style={styles.inputContainer}>
            <Ionicons name="map-outline" size={20} color="#9CA3AF" />

            <TextInput
              style={styles.input}
              placeholder="Nhập quận / huyện"
              placeholderTextColor="#9CA3AF"
              value={district}
              onChangeText={setDistrict}
            />
          </View>
        </View>

        {/* TỈNH / THÀNH PHỐ */}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tỉnh / Thành phố</Text>

          <View style={styles.inputContainer}>
            <Ionicons name="business-outline" size={20} color="#9CA3AF" />

            <TextInput
              style={styles.input}
              placeholder="Nhập tỉnh / thành phố"
              placeholderTextColor="#9CA3AF"
              value={province}
              onChangeText={setProvince}
            />
          </View>
        </View>

        {/* ĐỊA CHỈ MẶC ĐỊNH */}

        <TouchableOpacity
          style={styles.defaultAddressRow}
          onPress={() => setIsDefault(!isDefault)}
          activeOpacity={0.8}
        >
          <View style={[styles.checkbox, isDefault && styles.checkboxActive]}>
            {isDefault && (
              <Ionicons name="checkmark" size={16} color="#FFFFFF" />
            )}
          </View>

          <Text style={styles.defaultAddressText}>
            Đặt làm địa chỉ mặc định
          </Text>
        </TouchableOpacity>

        {/* GỢI Ý */}

        <View style={styles.noteBox}>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color={COLORS.primary}
          />

          <Text style={styles.noteText}>
            Địa chỉ mặc định sẽ được tự động sử dụng khi bạn đặt hàng.
          </Text>
        </View>
      </ScrollView>

      {/* BUTTON LƯU */}

      <View
        style={[
          styles.bottomContainer,
          {
            paddingBottom: insets.bottom + 12,
          },
        ]}
      >
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveAddress}>
          <Text style={styles.saveButtonText}>Lưu địa chỉ</Text>
        </TouchableOpacity>
      </View>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    backgroundColor: "#F8F9FC",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
  },

  headerRight: {
    width: 40,
  },

  content: {
    padding: 20,
    paddingBottom: 120,
  },

  inputGroup: {
    marginBottom: 18,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },

  inputContainer: {
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    paddingHorizontal: 15,
  },

  input: {
    flex: 1,
    height: "100%",
    fontSize: 15,
    color: "#1F2937",
    marginLeft: 10,
  },

  defaultAddressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 20,
  },

  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  checkboxActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  defaultAddressText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },

  noteBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#F0F2FF",
    borderRadius: 14,
    padding: 14,
    marginTop: 4,
  },

  noteText: {
    flex: 1,
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 19,
    marginLeft: 8,
  },

  bottomContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },

  saveButton: {
    height: 54,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
