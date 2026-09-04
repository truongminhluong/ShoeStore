import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  ActivityIndicator,
  Image,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";

import { login } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

import COLORS from "../../constants/colors";

export default function LoginScreen({ navigation }) {
  const { login: saveLogin } = useAuth();

  // =====================================================
  // STATE
  // =====================================================

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(true);

  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // =====================================================
  // VALIDATION
  // =====================================================

  const validate = () => {
    let valid = true;

    setEmailError("");
    setPasswordError("");

    if (!email.trim()) {
      setEmailError("Vui lòng nhập email");
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Email không hợp lệ");
      valid = false;
    }

    if (!password.trim()) {
      setPasswordError("Vui lòng nhập mật khẩu");
      valid = false;
    }

    return valid;
  };

  // =====================================================
  // LOGIN
  // =====================================================

  const handleLogin = async () => {
    Keyboard.dismiss();

    if (!validate()) return;

    try {
      setLoading(true);

      const response = await login(email, password);

      if (response?.success) {
        const payload = response?.data || response;

        const token = payload?.token || payload?.accessToken || null;

        const user = payload?.user || response?.user || null;

        if (!token) {
          throw new Error("Không nhận được token từ máy chủ");
        }

        await saveLogin(token, user);

        console.log("Đăng nhập thành công");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
          >
            {/* =================================================
                BACKGROUND DECORATION
            ================================================= */}

<<<<<<< Updated upstream
            <View style={styles.backgroundDecor}>
              {/* Dot pattern */}
              <View style={styles.dotPattern}>
                {Array.from({ length: 36 }).map((_, index) => (
                  <View key={index} style={styles.dot} />
                ))}
              </View>
=======
            <View style={styles.header}>
              <Text style={styles.logo}>RYDESTORE</Text>
>>>>>>> Stashed changes

              {/* Bottom soft shapes */}
              <View style={styles.bottomShapeOne} />
              <View style={styles.bottomShapeTwo} />
            </View>

            {/* =================================================
                HERO IMAGE
            ================================================= */}

            <Image
              source={require("../../../assets/images/login-shoe.png")}
              style={styles.shoeImage}
              resizeMode="contain"
            />

            {/* =================================================
                HEADER
            ================================================= */}

            <View style={styles.header}>
              <Text style={styles.logo}>RYDE</Text>

              <View style={styles.logoAccent} />

              <Text style={styles.title}>Chào mừng trở lại 👋</Text>

              <Text style={styles.subtitle}>
                Đăng nhập để tiếp tục mua sắm{"\n"}
                và khám phá những đôi giày mới nhất.
              </Text>
            </View>

            {/* =================================================
                FORM
            ================================================= */}

            <View style={styles.form}>
              {/* EMAIL */}
              <View style={styles.field}>
                <Text style={styles.label}>Email</Text>

                <View
                  style={[
                    styles.inputContainer,
                    emailFocus && styles.inputFocus,
                    emailError && styles.inputError,
                  ]}
                >
                  <Ionicons
                    name="mail-outline"
                    size={24}
                    color={emailFocus ? COLORS.primary : "#8490A3"}
                  />

                  <TextInput
                    style={styles.input}
                    placeholder="Nhập email của bạn"
                    placeholderTextColor="#9AA3B2"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);

                      if (emailError) {
                        setEmailError("");
                      }
                    }}
                    onFocus={() => setEmailFocus(true)}
                    onBlur={() => setEmailFocus(false)}
                  />
                </View>

                {emailError ? (
                  <Text style={styles.error}>{emailError}</Text>
                ) : null}
              </View>

              {/* PASSWORD */}
              <View style={styles.field}>
                <Text style={styles.label}>Mật khẩu</Text>

                <View
                  style={[
                    styles.inputContainer,
                    passwordFocus && styles.inputFocus,
                    passwordError && styles.inputError,
                  ]}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={24}
                    color={passwordFocus ? COLORS.primary : "#8490A3"}
                  />

                  <TextInput
                    style={styles.input}
                    placeholder="Nhập mật khẩu của bạn"
                    placeholderTextColor="#9AA3B2"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);

                      if (passwordError) {
                        setPasswordError("");
                      }
                    }}
                    onFocus={() => setPasswordFocus(true)}
                    onBlur={() => setPasswordFocus(false)}
                  />

                  <TouchableOpacity
                    style={styles.eyeButton}
                    activeOpacity={0.7}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={25}
                      color={passwordFocus ? COLORS.primary : "#8490A3"}
                    />
                  </TouchableOpacity>
                </View>

                {passwordError ? (
                  <Text style={styles.error}>{passwordError}</Text>
                ) : null}
              </View>

              {/* =================================================
                  REMEMBER + FORGOT
              ================================================= */}

              <View style={styles.optionsRow}>
                <TouchableOpacity
                  style={styles.rememberContainer}
                  activeOpacity={0.7}
                  onPress={() => setRemember(!remember)}
                >
                  <View
                    style={[styles.checkbox, remember && styles.checkboxActive]}
                  >
                    {remember ? (
                      <Ionicons name="checkmark" size={15} color="#FFFFFF" />
                    ) : null}
                  </View>

                  <Text style={styles.rememberText}>Ghi nhớ đăng nhập</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate("ForgotPassword")}
                >
                  <Text style={styles.forgot}>Quên mật khẩu?</Text>
                </TouchableOpacity>
              </View>

              {/* =================================================
                  LOGIN BUTTON
              ================================================= */}

              <TouchableOpacity
                style={[
                  styles.loginButton,
                  loading && styles.loginButtonDisabled,
                ]}
                disabled={loading}
                activeOpacity={0.85}
                onPress={handleLogin}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Text style={styles.loginText}>ĐĂNG NHẬP</Text>

                    <View style={styles.loginArrow}>
                      <Ionicons
                        name="arrow-forward"
                        size={25}
                        color="#FFFFFF"
                      />
                    </View>
                  </>
                )}
              </TouchableOpacity>

              {/* =================================================
                  DIVIDER
              ================================================= */}

              <View style={styles.divider}>
                <View style={styles.dividerLine} />

                <Text style={styles.orText}>HOẶC TIẾP TỤC VỚI</Text>

                <View style={styles.dividerLine} />
              </View>

              {/* =================================================
                  SOCIAL LOGIN
              ================================================= */}

              <View style={styles.socialContainer}>
                <TouchableOpacity
                  style={styles.socialButton}
                  activeOpacity={0.8}
                >
                  <Ionicons name="logo-google" size={23} color="#4285F4" />

                  <Text style={styles.socialText}>Google</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.socialButton}
                  activeOpacity={0.8}
                >
                  <Ionicons name="logo-apple" size={24} color="#000000" />

                  <Text style={styles.socialText}>Apple</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* =================================================
                FOOTER
            ================================================= */}

            <View style={styles.footer}>
              <Text style={styles.footerText}>Chưa có tài khoản?</Text>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation.navigate("Register")}
              >
                <Text style={styles.signUp}>Đăng ký</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({
  // ==========================================================
  // CONTAINER
  // ==========================================================

  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  keyboardView: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 25,
    position: "relative",
    overflow: "hidden",
  },

  // ==========================================================
  // BACKGROUND
  // ==========================================================

  backgroundDecor: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: "none",
  },

  // ==========================================================
  // DOT PATTERN
  // ==========================================================

  dotPattern: {
    position: "absolute",
    top: 28,
    left: 3,
    width: 80,
    height: 80,
    flexDirection: "row",
    flexWrap: "wrap",
    opacity: 0.45,
  },

  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D9DEE6",
    marginRight: 9,
    marginBottom: 9,
  },

  // ==========================================================
  // BOTTOM ABSTRACT SHAPES
  // ==========================================================

  bottomShapeOne: {
    position: "absolute",
    bottom: -90,
    left: -70,
    width: 270,
    height: 150,
    borderRadius: 150,
    backgroundColor: "#F5F7FA",
    transform: [
      {
        rotate: "-12deg",
      },
    ],
  },

  bottomShapeTwo: {
    position: "absolute",
    bottom: -110,
    right: -80,
    width: 300,
    height: 170,
    borderRadius: 170,
    backgroundColor: "#F8F9FB",
    transform: [
      {
        rotate: "12deg",
      },
    ],
  },

  // ==========================================================
  // SNEAKER IMAGE
  // ==========================================================

  shoeImage: {
    position: "absolute",
    top: 42,
    right: -48,
    width: 270,
    height: 270,
    opacity: 0.76,
  },

  // ==========================================================
  // HEADER
  // ==========================================================

  header: {
    marginTop: 105,
    marginBottom: 27,
    position: "relative",
    zIndex: 2,
  },

  logo: {
    fontSize: 55,
    lineHeight: 60,
    fontWeight: "900",
    letterSpacing: 2.5,
    color: "#101828",
  },

  logoAccent: {
    width: 34,
    height: 4,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
    marginTop: 10,
    marginBottom: 32,
  },

  title: {
    fontSize: 30,
    lineHeight: 37,
    fontWeight: "800",
    color: "#101828",
    letterSpacing: -0.7,
  },

  subtitle: {
    marginTop: 10,
    fontSize: 15.5,
    lineHeight: 23,
    color: "#667085",
  },

  // ==========================================================
  // FORM
  // ==========================================================

  form: {
    position: "relative",
    zIndex: 3,
  },

  field: {
    marginBottom: 21,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#101828",
    marginBottom: 9,
  },

  inputContainer: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 17,
    backgroundColor: "#FFFFFF",

    borderWidth: 1,
    borderColor: "#E0E4EA",

    borderRadius: 15,
  },

  inputFocus: {
    borderColor: COLORS.primary,
    borderWidth: 1.5,
  },

  inputError: {
    borderColor: "#EF4444",
  },

  input: {
    flex: 1,
    height: "100%",
    marginLeft: 13,
    paddingVertical: 0,

    fontSize: 15.5,
    color: "#101828",
  },

  eyeButton: {
    width: 38,
    height: 50,
    justifyContent: "center",
    alignItems: "flex-end",
  },

  error: {
    marginTop: 6,
    marginLeft: 2,
    fontSize: 12.5,
    color: "#EF4444",
  },

  // ==========================================================
  // OPTIONS
  // ==========================================================

  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    marginTop: -2,
    marginBottom: 25,
  },

  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  checkbox: {
    width: 21,
    height: 21,
    borderRadius: 5,

    borderWidth: 1.5,
    borderColor: "#CBD2DC",

    justifyContent: "center",
    alignItems: "center",
  },

  checkboxActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  rememberText: {
    marginLeft: 9,
    fontSize: 14,
    color: "#475467",
  },

  forgot: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.primary,
  },

  // ==========================================================
  // LOGIN BUTTON
  // ==========================================================

  loginButton: {
    height: 58,

    borderRadius: 15,

    backgroundColor: "#101828",

    justifyContent: "center",
    alignItems: "center",

    position: "relative",

    shadowColor: "#101828",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.14,
    shadowRadius: 8,

    elevation: 4,
  },

  loginButtonDisabled: {
    opacity: 0.7,
  },

  loginText: {
    color: "#FFFFFF",

    fontSize: 16,
    fontWeight: "800",

    letterSpacing: 0.5,
  },

  loginArrow: {
    position: "absolute",
    right: 18,

    width: 35,
    height: 35,

    justifyContent: "center",
    alignItems: "center",
  },

  // ==========================================================
  // DIVIDER
  // ==========================================================

  divider: {
    flexDirection: "row",
    alignItems: "center",

    marginVertical: 28,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E3E6EB",
  },

  orText: {
    marginHorizontal: 14,

    fontSize: 11,
    fontWeight: "600",

    color: "#8A94A6",

    letterSpacing: 0.3,
  },

  // ==========================================================
  // SOCIAL
  // ==========================================================

  socialContainer: {
    flexDirection: "row",
    gap: 12,
  },

  socialButton: {
    flex: 1,

    height: 58,

    backgroundColor: "#FFFFFF",

    borderWidth: 1,
    borderColor: "#E0E4EA",

    borderRadius: 15,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  socialText: {
    marginLeft: 10,

    fontSize: 15,
    fontWeight: "600",

    color: "#101828",
  },

  // ==========================================================
  // FOOTER
  // ==========================================================

  footer: {
    position: "relative",
    zIndex: 3,

    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    marginTop: 30,
    paddingBottom: 5,
  },

  footerText: {
    fontSize: 14.5,
    color: "#667085",
  },

  signUp: {
    marginLeft: 7,

    fontSize: 14.5,
    fontWeight: "700",

    color: COLORS.primary,
  },
});
