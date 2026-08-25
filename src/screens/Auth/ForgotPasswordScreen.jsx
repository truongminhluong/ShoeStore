import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import api from "../../utils/api";

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    const trimmedEmail = email.trim();

    // Kiểm tra email rỗng
    if (!trimmedEmail) {
      Alert.alert("Thông báo", "Vui lòng nhập email của bạn");
      return;
    }

    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
      Alert.alert("Thông báo", "Email không hợp lệ");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/users/forgot-password", {
        email: trimmedEmail,
      });

      if (response.data?.success) {
        Alert.alert(
          "Gửi mã thành công",
          "Mã OTP đã được gửi đến email của bạn.",
          [
            {
              text: "Tiếp tục",
              onPress: () => {
                navigation.navigate("VerifyOTP", {
                  email: trimmedEmail,
                });
              },
            },
          ]
        );
      } else {
        Alert.alert(
          "Thông báo",
          response.data?.message || "Không thể gửi mã OTP"
        );
      }
    } catch (error) {
      console.log(
        "Forgot password error:",
        error.response?.data || error.message
      );

      Alert.alert(
        "Gửi mã thất bại",
        error.response?.data?.message ||
          "Có lỗi xảy ra. Vui lòng thử lại."
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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>RYDE</Text>

          <TouchableOpacity
            style={styles.settingsButton}
            activeOpacity={0.8}
          >
            <Ionicons
              name="settings-outline"
              size={22}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Quên mật khẩu?</Text>

          <Text style={styles.subtitle}>
            Nhập email của bạn để nhận mã xác nhận
          </Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>EMAIL</Text>

            <View style={styles.inputContainer}>
              <Ionicons
                name="mail-outline"
                size={20}
                color="#8FA0B8"
                style={styles.inputIcon}
              />

              <TextInput
                style={styles.input}
                placeholder="Nhập email của bạn"
                placeholderTextColor="#A7B3C5"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
            </View>
          </View>

          {/* Description */}
          <View style={styles.infoContainer}>
            <Ionicons
              name="information-circle-outline"
              size={18}
              color="#6B7A90"
            />

            <Text style={styles.infoText}>
              Mã OTP gồm 6 chữ số sẽ được gửi đến email của bạn
              và có hiệu lực trong 5 phút.
            </Text>
          </View>

          {/* Button */}
          <TouchableOpacity
            style={[
              styles.button,
              loading && styles.buttonDisabled,
            ]}
            onPress={handleSendOTP}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator
                size="small"
                color="#FFFFFF"
              />
            ) : (
              <>
                <Text style={styles.buttonText}>
                  GỬI MÃ OTP
                </Text>

                <Ionicons
                  name="arrow-forward"
                  size={19}
                  color="#FFFFFF"
                />
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Back to Login */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons
            name="arrow-back"
            size={18}
            color="#246BFD"
          />

          <Text style={styles.backText}>
            Quay lại đăng nhập
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "android" ? 45 : 55,
    paddingBottom: 30,
  },

  // =========================
  // HEADER
  // =========================

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
  },

  logo: {
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: 1.2,
    color: "#121B2A",
  },

  settingsButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#C7C7C7",
    alignItems: "center",
    justifyContent: "center",
  },

  // =========================
  // TITLE
  // =========================

  titleContainer: {
    marginBottom: 28,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#172131",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 15,
    color: "#7E8999",
    lineHeight: 22,
  },

  // =========================
  // CARD
  // =========================

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    paddingTop: 20,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.12,
    shadowRadius: 10,

    elevation: 5,
  },

  // =========================
  // INPUT
  // =========================

  inputGroup: {
    marginBottom: 18,
  },

  label: {
    fontSize: 12,
    fontWeight: "800",
    color: "#62738C",
    letterSpacing: 0.7,
    marginBottom: 8,
  },

  inputContainer: {
    height: 50,
    borderWidth: 1,
    borderColor: "#E5E9EF",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },

  inputIcon: {
    marginLeft: 14,
    marginRight: 10,
  },

  input: {
    flex: 1,
    height: "100%",
    fontSize: 15,
    color: "#172131",
    paddingRight: 12,
  },

  // =========================
  // INFO
  // =========================

  infoContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 2,
    marginBottom: 22,
    paddingHorizontal: 2,
  },

  infoText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    lineHeight: 20,
    color: "#7C8797",
  },

  // =========================
  // BUTTON
  // =========================

  button: {
    height: 50,
    borderRadius: 11,
    backgroundColor: "#111A29",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.5,
    marginRight: 8,
  },

  // =========================
  // BACK
  // =========================

  backButton: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 28,
    padding: 8,
  },

  backText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#246BFD",
    marginLeft: 7,
  },
});