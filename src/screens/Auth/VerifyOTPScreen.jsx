import React, { useEffect, useRef, useState } from "react";
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

const VerifyOTPScreen = ({ navigation, route }) => {
  const { email } = route.params || {};

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const inputRef = useRef(null);

  // =========================
  // COUNTDOWN
  // =========================
  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  // =========================
  // XÁC THỰC OTP
  // =========================
  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ 6 số OTP");
      return;
    }

    if (!email) {
      Alert.alert("Lỗi", "Không tìm thấy email");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(`${API_URL}/users/verify-reset-otp`, {
        email,
        otp,
      });

      console.log("Verify OTP response:", response.data);

      if (response.data.success) {
        Alert.alert("Thành công", "Xác thực OTP thành công", [
          {
            text: "Tiếp tục",
            onPress: () => {
              navigation.navigate("ResetPassword", {
                email,
                otp,
              });
            },
          },
        ]);
      } else {
        Alert.alert(
          "Thông báo",
          response.data.message || "OTP không chính xác",
        );
      }
    } catch (error) {
      console.log("Verify OTP error:", error.response?.data || error.message);

      Alert.alert(
        "Lỗi",
        error.response?.data?.message || "OTP không chính xác hoặc đã hết hạn",
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // GỬI LẠI OTP
  // =========================
  const handleResendOTP = async () => {
    if (countdown > 0 || resending) return;

    if (!email) {
      Alert.alert("Lỗi", "Không tìm thấy email");
      return;
    }

    try {
      setResending(true);

      const response = await axios.post(`${API_URL}/auth/forgot-password`, {
        email,
      });

      console.log("Resend OTP response:", response.data);

      if (response.data.success) {
        setCountdown(60);
        setOtp("");

        Alert.alert("Thành công", "Mã OTP mới đã được gửi đến email");
      } else {
        Alert.alert(
          "Thông báo",
          response.data.message || "Không thể gửi lại OTP",
        );
      }
    } catch (error) {
      console.log("Resend OTP error:", error.response?.data || error.message);

      Alert.alert(
        "Lỗi",
        error.response?.data?.message || "Không thể gửi lại OTP",
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.content}>
        {/* BACK */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#222" />
        </TouchableOpacity>

        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="mail-outline" size={38} color="#000" />
          </View>

          <Text style={styles.title}>Xác thực OTP</Text>

          <Text style={styles.description}>
            Mã OTP gồm 6 số đã được gửi đến
          </Text>

          <Text style={styles.email}>{email}</Text>
        </View>

        {/* OTP INPUT */}
        <View style={styles.otpContainer}>
          <Text style={styles.label}>Nhập mã OTP</Text>

          <TextInput
            ref={inputRef}
            style={styles.otpInput}
            value={otp}
            onChangeText={(text) => {
              const value = text.replace(/[^0-9]/g, "");
              setOtp(value.slice(0, 6));
            }}
            keyboardType="number-pad"
            maxLength={6}
            placeholder="••••••"
            placeholderTextColor="#BDBDBD"
            textAlign="center"
            autoFocus
          />

          <Text style={styles.otpCount}>{otp.length}/6</Text>
        </View>

        {/* VERIFY */}
        <TouchableOpacity
          style={[styles.verifyButton, loading && styles.disabledButton]}
          onPress={handleVerifyOTP}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.verifyText}>Xác nhận OTP</Text>
          )}
        </TouchableOpacity>

        {/* RESEND */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendLabel}>Không nhận được mã?</Text>

          <TouchableOpacity
            onPress={handleResendOTP}
            disabled={countdown > 0 || resending}
          >
            {resending ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <Text
                style={[
                  styles.resendText,
                  countdown > 0 && styles.resendDisabled,
                ]}
              >
                {countdown > 0 ? `Gửi lại sau ${countdown}s` : "Gửi lại OTP"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default VerifyOTPScreen;

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
    marginBottom: 35,
  },

  header: {
    alignItems: "center",
  },

  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#222",
    marginBottom: 12,
  },

  description: {
    fontSize: 15,
    color: "#777",
    textAlign: "center",
    lineHeight: 22,
  },

  email: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
    marginTop: 5,
  },

  otpContainer: {
    marginTop: 40,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },

  otpInput: {
    height: 65,
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    fontSize: 30,
    fontWeight: "700",
    letterSpacing: 12,
    color: "#222",
  },

  otpCount: {
    textAlign: "right",
    marginTop: 8,
    color: "#999",
    fontSize: 13,
  },

  verifyButton: {
    height: 55,
    borderRadius: 14,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
  },

  disabledButton: {
    opacity: 0.6,
  },

  verifyText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
    gap: 5,
  },

  resendLabel: {
    fontSize: 14,
    color: "#777",
  },

  resendText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000",
  },

  resendDisabled: {
    color: "#999",
  },
});
