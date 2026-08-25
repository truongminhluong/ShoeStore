import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

const API_URL = "http://10.0.2.2:3000/api";

const ResetPasswordScreen = ({ navigation, route }) => {
  const { email, otp } = route.params || {};

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  // =========================
  // RESET PASSWORD
  // =========================
  const handleResetPassword = async () => {
    // Kiểm tra email + OTP
    if (!email || !otp) {
      Alert.alert(
        "Lỗi",
        "Thông tin xác thực không đầy đủ. Vui lòng thực hiện lại.",
      );
      return;
    }

    // Kiểm tra mật khẩu
    if (!password) {
      Alert.alert("Thông báo", "Vui lòng nhập mật khẩu mới");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Thông báo", "Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (!confirmPassword) {
      Alert.alert("Thông báo", "Vui lòng nhập lại mật khẩu");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Thông báo", "Mật khẩu nhập lại không khớp");
      return;
    }

    try {
      setLoading(true);

      console.log("Reset password:", {
        email,
        otp,
      });

      /*
       * Đổi endpoint này nếu backend của bạn
       * đang đặt tên API khác.
       *
       * Ví dụ:
       * POST /api/users/reset-password
       */

      const response = await axios.post(`${API_URL}/users/reset-password`, {
        email,
        otp,
        newPassword: password,
      });

      console.log("Reset password response:", response.data);

      if (response.data.success) {
        Alert.alert("Thành công", "Mật khẩu đã được thay đổi thành công!", [
          {
            text: "Đăng nhập",
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{ name: "Login" }],
              });
            },
          },
        ]);
      } else {
        Alert.alert(
          "Thông báo",
          response.data.message || "Không thể đặt lại mật khẩu",
        );
      }
    } catch (error) {
      console.log(
        "Reset password error:",
        error.response?.data || error.message,
      );

      Alert.alert(
        "Lỗi",
        error.response?.data?.message || "Không thể đặt lại mật khẩu",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.content}>
        {/* BACK BUTTON */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#222" />
        </TouchableOpacity>

        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="lock-closed-outline" size={38} color="#000" />
          </View>

          <Text style={styles.title}>Đặt lại mật khẩu</Text>

          <Text style={styles.description}>Tạo mật khẩu mới cho tài khoản</Text>

          <Text style={styles.email}>{email}</Text>
        </View>

        {/* PASSWORD */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mật khẩu mới</Text>

          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={21} color="#777" />

            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Nhập mật khẩu mới"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />

            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-outline" : "eye-off-outline"}
                size={21}
                color="#777"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* CONFIRM PASSWORD */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Xác nhận mật khẩu</Text>

          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={21} color="#777" />

            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Nhập lại mật khẩu"
              placeholderTextColor="#999"
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
            />

            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Ionicons
                name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                size={21}
                color="#777"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* RESET BUTTON */}
        <TouchableOpacity
          style={[styles.resetButton, loading && styles.disabledButton]}
          onPress={handleResetPassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.resetButtonText}>Đặt lại mật khẩu</Text>
          )}
        </TouchableOpacity>

        {/* NOTE */}
        <Text style={styles.note}>Mật khẩu nên có ít nhất 6 ký tự.</Text>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ResetPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "android" ? 45 : 55,
  },

  backButton: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },

  header: {
    alignItems: "center",
    marginBottom: 35,
  },

  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },

  title: {
    fontSize: 27,
    fontWeight: "700",
    color: "#222",
    marginBottom: 10,
  },

  description: {
    fontSize: 15,
    color: "#777",
    textAlign: "center",
  },

  email: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
    marginTop: 5,
  },

  inputGroup: {
    marginBottom: 18,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 9,
  },

  inputWrapper: {
    height: 55,
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },

  input: {
    flex: 1,
    height: "100%",
    marginLeft: 10,
    fontSize: 15,
    color: "#222",
  },

  resetButton: {
    height: 55,
    borderRadius: 14,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  disabledButton: {
    opacity: 0.6,
  },

  resetButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  note: {
    textAlign: "center",
    marginTop: 15,
    color: "#999",
    fontSize: 13,
  },
});
