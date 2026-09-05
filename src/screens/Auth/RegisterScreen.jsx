import React, { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import COLORS from "../../constants/colors";
import FONTS from "../../constants/fonts";

import { register } from "../../services/authService";

const RegisterScreen = ({ navigation }) => {
  // ==========================================
  // STATE
  // ==========================================

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ==========================================
  // VALIDATE EMAIL
  // ==========================================

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return regex.test(email);
  };

  // ==========================================
  // VALIDATE PHONE
  // ==========================================

  const validatePhone = (phone) => {
    // Số điện thoại Việt Nam:
    // 03, 05, 07, 08, 09 + 8 số
    const regex = /^(03|05|07|08|09)[0-9]{8}$/;

    return regex.test(phone);
  };

  // ==========================================
  // VALIDATE FORM
  // ==========================================

  const validateForm = () => {
    const newErrors = {};

    const cleanFullName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    // Họ tên
    if (!cleanFullName) {
      newErrors.fullName = "Vui lòng nhập họ và tên";
    } else if (cleanFullName.length < 2) {
      newErrors.fullName = "Họ và tên phải có ít nhất 2 ký tự";
    }

    // Email
    if (!cleanEmail) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!validateEmail(cleanEmail)) {
      newErrors.email = "Email không đúng định dạng";
    }

    // Số điện thoại
    if (!cleanPhone) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!validatePhone(cleanPhone)) {
      newErrors.phone = "Số điện thoại không đúng định dạng";
    }

    // Password
    if (!password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    // Confirm password
    if (!confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không trùng khớp";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ==========================================
  // ĐĂNG KÝ
  // ==========================================

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const data = {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password: password,
      };

      console.log("Dữ liệu đăng ký:", data);

      const response = await register(data);

      console.log("Đăng ký thành công:", response);

      Alert.alert("Đăng ký thành công", "Tài khoản của bạn đã được tạo.", [
        {
          text: "Đăng nhập",
          onPress: () => {
            navigation.navigate("Login");
          },
        },
      ]);
    } catch (error) {
      console.log("Lỗi đăng ký:", error.response?.data || error.message);

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Đăng ký thất bại. Vui lòng thử lại.";

      Alert.alert("Đăng ký thất bại", message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // CLEAR ERROR
  // ==========================================

  const clearError = (field) => {
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          {/* ==================================
              HEADER
          ================================== */}

          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={23} color={COLORS.black} />
            </TouchableOpacity>

            <View style={styles.logoContainer}>
              <Text style={styles.logo}>RYDE</Text>
              <View style={styles.logoAccent} />
            </View>
          </View>

          {/* ==================================
              TITLE
          ================================== */}

          <View style={styles.titleContainer}>
            <Text style={styles.title}>Tạo tài khoản mới</Text>

            <Text style={styles.subtitle}>
              Đăng ký để bắt đầu mua sắm và khám phá những sản phẩm mới nhất từ
              RYDE.
            </Text>
          </View>

          {/* ==================================
              FORM
          ================================== */}

          <View style={styles.form}>
            {/* HỌ TÊN */}

            <InputField
              label="Họ và tên"
              placeholder="Nguyễn Văn A"
              value={fullName}
              onChangeText={(text) => {
                setFullName(text);
                clearError("fullName");
              }}
              error={errors.fullName}
              icon="person-outline"
              autoCapitalize="words"
            />

            {/* EMAIL */}

            <InputField
              label="Email"
              placeholder="example@gmail.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                clearError("email");
              }}
              error={errors.email}
              icon="mail-outline"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {/* PHONE */}

            <InputField
              label="Số điện thoại"
              placeholder="0901234567"
              value={phone}
              onChangeText={(text) => {
                const numberOnly = text.replace(/[^0-9]/g, "");

                setPhone(numberOnly);
                clearError("phone");
              }}
              error={errors.phone}
              icon="call-outline"
              keyboardType="phone-pad"
            />

            {/* PASSWORD */}

            <InputField
              label="Mật khẩu"
              placeholder="Nhập mật khẩu"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                clearError("password");
              }}
              error={errors.password}
              icon="lock-closed-outline"
              secureTextEntry={!showPassword}
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
            />

            {/* CONFIRM PASSWORD */}

            <InputField
              label="Xác nhận mật khẩu"
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                clearError("confirmPassword");
              }}
              error={errors.confirmPassword}
              icon="lock-closed-outline"
              secureTextEntry={!showConfirmPassword}
              showPassword={showConfirmPassword}
              onTogglePassword={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            />

            {/* ==================================
                BUTTON ĐĂNG KÝ
            ================================== */}

            <TouchableOpacity
              style={[styles.registerButton, loading && styles.disabledButton]}
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <>
                  <Text style={styles.registerButtonText}>ĐĂNG KÝ</Text>

                  <Ionicons
                    name="arrow-forward"
                    size={19}
                    color={COLORS.white}
                  />
                </>
              )}
            </TouchableOpacity>

            {/* ==================================
                DIVIDER
            ================================== */}

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />

              <Text style={styles.dividerText}>HOẶC TIẾP TỤC VỚI</Text>

              <View style={styles.divider} />
            </View>

            {/* ==================================
                SOCIAL
            ================================== */}

            <View style={styles.socialContainer}>
              <TouchableOpacity style={styles.socialButton} activeOpacity={0.8}>
                <Text style={styles.googleIcon}>G</Text>

                <Text style={styles.socialText}>Google</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialButton} activeOpacity={0.8}>
                <Text style={styles.facebookIcon}>f</Text>

                <Text style={styles.socialText}>Facebook</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ==================================
              LOGIN
          ================================== */}

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Đã có tài khoản?</Text>

            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
              activeOpacity={0.7}
            >
              <Text style={styles.loginLink}>Đăng nhập</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// ==================================================
// INPUT COMPONENT
// ==================================================

const InputField = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  icon,
  keyboardType = "default",
  secureTextEntry = false,
  showPassword,
  onTogglePassword,
  autoCapitalize = "none",
}) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>

      <View style={[styles.inputWrapper, error && styles.inputError]}>
        <Ionicons name={icon} size={20} color={error ? "#EF4444" : "#8A8FA3"} />

        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#B8BDCE"
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          secureTextEntry={secureTextEntry}
        />

        {onTogglePassword && (
          <TouchableOpacity
            onPress={onTogglePassword}
            style={styles.eyeButton}
            activeOpacity={0.7}
          >
            <Ionicons
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={20}
              color="#777D91"
            />
          </TouchableOpacity>
        )}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

// ==================================================
// STYLES
// ==================================================

const styles = StyleSheet.create({
  // ==========================================
  // SCREEN
  // ==========================================

  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  keyboardView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 35,
  },

  // ==========================================
  // HEADER
  // ==========================================

  header: {
    height: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,

    elevation: 1,
  },

  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  logo: {
    fontSize: 23,
    fontWeight: "900",
    letterSpacing: 2,
    color: COLORS.black,
  },

  logoAccent: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginLeft: 4,
    marginTop: 13,
  },

  // ==========================================
  // TITLE
  // ==========================================

  titleContainer: {
    marginTop: 25,
    marginBottom: 27,
  },

  title: {
    fontSize: 29,
    lineHeight: 35,
    fontFamily: FONTS.bold,
    fontWeight: "800",
    color: COLORS.black,
  },

  subtitle: {
    marginTop: 9,
    fontSize: 14,
    lineHeight: 21,
    fontFamily: FONTS.medium,
    color: "#697083",
    maxWidth: "95%",
  },

  // ==========================================
  // FORM
  // ==========================================

  form: {
    width: "100%",
  },

  inputContainer: {
    marginBottom: 17,
  },

  label: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    fontWeight: "700",
    color: COLORS.black,
    marginBottom: 8,
  },

  inputWrapper: {
    height: 54,
    borderWidth: 1,
    borderColor: "#E1E4EA",
    borderRadius: 14,
    backgroundColor: COLORS.white,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 15,
  },

  inputError: {
    borderColor: "#EF4444",
  },

  input: {
    flex: 1,
    marginLeft: 10,

    height: "100%",

    fontSize: 15,
    fontFamily: FONTS.medium,
    color: COLORS.black,
  },

  eyeButton: {
    padding: 5,
    marginLeft: 5,
  },

  errorText: {
    color: "#EF4444",
    fontSize: 12,
    fontFamily: FONTS.medium,
    marginTop: 5,
    marginLeft: 4,
  },

  // ==========================================
  // REGISTER BUTTON
  // ==========================================

  registerButton: {
    height: 55,
    borderRadius: 15,

    backgroundColor: COLORS.primary,

    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    marginTop: 5,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,

    elevation: 3,
  },

  disabledButton: {
    opacity: 0.6,
  },

  registerButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontFamily: FONTS.bold,
    fontWeight: "800",
    letterSpacing: 0.8,
    marginRight: 8,
  },

  // ==========================================
  // DIVIDER
  // ==========================================

  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",

    marginTop: 28,
    marginBottom: 20,
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },

  dividerText: {
    marginHorizontal: 12,

    fontSize: 10,
    fontFamily: FONTS.medium,

    color: "#9CA3AF",
    letterSpacing: 0.5,
  },

  // ==========================================
  // SOCIAL
  // ==========================================

  socialContainer: {
    flexDirection: "row",
    gap: 12,
  },

  socialButton: {
    flex: 1,
    height: 47,

    borderWidth: 1,
    borderColor: "#E1E4EA",
    borderRadius: 13,

    backgroundColor: COLORS.white,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  googleIcon: {
    fontSize: 17,
    fontWeight: "800",
    color: "#4285F4",
    marginRight: 8,
  },

  facebookIcon: {
    fontSize: 21,
    fontWeight: "800",
    color: "#1877F2",
    marginRight: 8,
  },

  socialText: {
    fontSize: 13,
    fontFamily: FONTS.medium,
    fontWeight: "600",
    color: COLORS.black,
  },

  // ==========================================
  // LOGIN
  // ==========================================

  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    marginTop: 28,
  },

  loginText: {
    color: "#697083",
    fontSize: 14,
    fontFamily: FONTS.medium,
  },

  loginLink: {
    color: COLORS.primary,
    fontSize: 14,
    fontFamily: FONTS.bold,
    marginLeft: 5,
  },
});

export default RegisterScreen;
