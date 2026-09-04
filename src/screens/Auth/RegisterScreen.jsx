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
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);

  // ==========================================
  // VALIDATE EMAIL
  // ==========================================

  const validateEmail = (email) => {
    const regex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return regex.test(email);
  };

  // ==========================================
  // VALIDATE PHONE
  // ==========================================

  const validatePhone = (phone) => {
    // Số điện thoại Việt Nam:
    // 03, 05, 07, 08, 09 + 8 số
    const regex =
      /^(03|05|07|08|09)[0-9]{8}$/;

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
      newErrors.fullName =
        "Vui lòng nhập họ và tên";
    } else if (cleanFullName.length < 2) {
      newErrors.fullName =
        "Họ và tên phải có ít nhất 2 ký tự";
    }

    // Email
    if (!cleanEmail) {
      newErrors.email =
        "Vui lòng nhập email";
    } else if (!validateEmail(cleanEmail)) {
      newErrors.email =
        "Email không đúng định dạng";
    }

    // Số điện thoại
    if (!cleanPhone) {
      newErrors.phone =
        "Vui lòng nhập số điện thoại";
    } else if (!validatePhone(cleanPhone)) {
      newErrors.phone =
        "Số điện thoại không đúng định dạng";
    }

    // Password
    if (!password) {
      newErrors.password =
        "Vui lòng nhập mật khẩu";
    } else if (password.length < 6) {
      newErrors.password =
        "Mật khẩu phải có ít nhất 6 ký tự";
    }

    // Confirm password
    if (!confirmPassword) {
      newErrors.confirmPassword =
        "Vui lòng xác nhận mật khẩu";
    } else if (
      confirmPassword !== password
    ) {
      newErrors.confirmPassword =
        "Mật khẩu xác nhận không trùng khớp";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ==========================================
  // ĐĂNG KÝ
  // ==========================================

  const handleRegister = async () => {
    // Validate trước
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // Dữ liệu gửi lên backend
      const data = {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password: password,
      };

      console.log(
        "Dữ liệu đăng ký:",
        data
      );

      const response = await register(data);

      console.log(
        "Đăng ký thành công:",
        response
      );

      Alert.alert(
        "Đăng ký thành công",
        "Tài khoản của bạn đã được tạo.",
        [
          {
            text: "Đăng nhập",
            onPress: () => {
              navigation.navigate("Login");
            },
          },
        ]
      );

    } catch (error) {
      console.log(
        "Lỗi đăng ký:",
        error.response?.data || error.message
      );

      // ==========================================
      // LẤY MESSAGE TỪ BACKEND
      // ==========================================

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Đăng ký thất bại. Vui lòng thử lại.";

      Alert.alert(
        "Đăng ký thất bại",
        message
      );

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <SafeAreaViewWrapper>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={
            styles.scrollContent
          }
        >

          {/* ==================================
              HEADER
          ================================== */}

          <View style={styles.header}>

            <TouchableOpacity
              style={styles.backButton}
              onPress={() =>
                navigation.goBack()
              }
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color={COLORS.black}
              />
            </TouchableOpacity>

            <Text style={styles.title}>
              Tạo tài khoản
            </Text>

            <Text style={styles.subtitle}>
              Đăng ký để bắt đầu mua sắm
            </Text>

          </View>

          {/* ==================================
              FORM
          ================================== */}

          <View style={styles.form}>

            {/* HỌ TÊN */}

            <InputField
              label="Họ và tên"
              placeholder="Nhập họ và tên"
              value={fullName}
              onChangeText={(text) => {
                setFullName(text);

                if (errors.fullName) {
                  setErrors((prev) => ({
                    ...prev,
                    fullName: undefined,
                  }));
                }
              }}
              error={errors.fullName}
              icon="person-outline"
            />

            {/* EMAIL */}

            <InputField
              label="Email"
              placeholder="example@gmail.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);

                if (errors.email) {
                  setErrors((prev) => ({
                    ...prev,
                    email: undefined,
                  }));
                }
              }}
              error={errors.email}
              icon="mail-outline"
              keyboardType="email-address"
            />

            {/* PHONE */}

            <InputField
              label="Số điện thoại"
              placeholder="Nhập số điện thoại"
              value={phone}
              onChangeText={(text) => {
                // Chỉ cho phép nhập số
                const numberOnly =
                  text.replace(/[^0-9]/g, "");

                setPhone(numberOnly);

                if (errors.phone) {
                  setErrors((prev) => ({
                    ...prev,
                    phone: undefined,
                  }));
                }
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

                if (errors.password) {
                  setErrors((prev) => ({
                    ...prev,
                    password: undefined,
                  }));
                }
              }}
              error={errors.password}
              icon="lock-closed-outline"
              secureTextEntry={!showPassword}
              showPassword={showPassword}
              onTogglePassword={() =>
                setShowPassword(
                  !showPassword
                )
              }
            />

            {/* CONFIRM PASSWORD */}

            <InputField
              label="Xác nhận mật khẩu"
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);

                if (errors.confirmPassword) {
                  setErrors((prev) => ({
                    ...prev,
                    confirmPassword:
                      undefined,
                  }));
                }
              }}
              error={
                errors.confirmPassword
              }
              icon="lock-closed-outline"
              secureTextEntry={
                !showConfirmPassword
              }
              showPassword={
                showConfirmPassword
              }
              onTogglePassword={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
            />

            {/* ==================================
                BUTTON ĐĂNG KÝ
            ================================== */}

            <TouchableOpacity
              style={[
                styles.registerButton,
                loading &&
                styles.disabledButton,
              ]}
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.8}
            >

              {loading ? (
                <ActivityIndicator
                  color={COLORS.white}
                />
              ) : (
                <Text
                  style={
                    styles.registerButtonText
                  }
                >
                  Đăng ký
                </Text>
              )}

            </TouchableOpacity>

            {/* ==================================
                LOGIN
            ================================== */}

            <View
              style={styles.loginContainer}
            >
              <Text
                style={styles.loginText}
              >
                Đã có tài khoản?
              </Text>

              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(
                    "Login"
                  )
                }
              >
                <Text
                  style={styles.loginLink}
                >
                  Đăng nhập
                </Text>
              </TouchableOpacity>
            </View>

          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaViewWrapper>
  );
};

export default RegisterScreen;

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
}) => {

  return (
    <View style={styles.inputContainer}>

      <Text style={styles.label}>
        {label}
      </Text>

      <View
        style={[
          styles.inputWrapper,
          error &&
          styles.inputError,
        ]}
      >

        <Ionicons
          name={icon}
          size={20}
          color={
            error
              ? "#EF4444"
              : COLORS.gray
          }
        />

        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={
            secureTextEntry
          }
        />

        {onTogglePassword && (
          <TouchableOpacity
            onPress={onTogglePassword}
            style={styles.eyeButton}
          >
            <Ionicons
              name={
                showPassword
                  ? "eye-outline"
                  : "eye-off-outline"
              }
              size={20}
              color={COLORS.gray}
            />
          </TouchableOpacity>
        )}

      </View>

      {error && (
        <Text style={styles.errorText}>
          {error}
        </Text>
      )}

    </View>
  );
};

// ==================================================
// SAFE AREA WRAPPER
// ==================================================

const SafeAreaViewWrapper = ({
  children,
}) => {

  const {
    SafeAreaView,
  } = require(
    "react-native-safe-area-context"
  );

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top", "bottom"]}
    >
      {children}
    </SafeAreaView>
  );
};

// ==================================================
// STYLES
// ==================================================

const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor:
      COLORS.background,
  },

  keyboardView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  header: {
    paddingTop: 15,
    marginBottom: 25,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor:
      COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 30,
    fontFamily: FONTS.bold,
    fontWeight: "700",
    color: COLORS.black,
  },

  subtitle: {
    marginTop: 8,
    fontSize: 15,
    fontFamily: FONTS.medium,
    color: COLORS.gray,
  },

  form: {
    width: "100%",
  },

  inputContainer: {
    marginBottom: 18,
  },

  label: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    color: COLORS.black,
    marginBottom: 8,
  },

  inputWrapper: {
    height: 54,
    backgroundColor:
      COLORS.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
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
    fontSize: 15,
    color: COLORS.black,
    fontFamily: FONTS.medium,
  },

  eyeButton: {
    padding: 5,
  },

  errorText: {
    color: "#EF4444",
    fontSize: 12,
    fontFamily: FONTS.medium,
    marginTop: 5,
    marginLeft: 4,
  },

  registerButton: {
    height: 55,
    borderRadius: 15,
    backgroundColor:
      COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },

  disabledButton: {
    opacity: 0.6,
  },

  registerButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: FONTS.bold,
  },

  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },

  loginText: {
    color: COLORS.gray,
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