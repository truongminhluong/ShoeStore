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
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";

import { login } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

import COLORS from "../../constants/colors";

export default function LoginScreen({ navigation }) {
  const { login: saveLogin } = useAuth();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [remember, setRemember] = useState(true);

  const [emailFocus, setEmailFocus] = useState(false);

  const [passwordFocus, setPasswordFocus] = useState(false);

  const [emailError, setEmailError] = useState("");

  const [passwordError, setPasswordError] = useState("");

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

  const handleLogin = async () => {
    Keyboard.dismiss();

    if (!validate()) return;

    try {
      setLoading(true);

      const response = await login(email, password);

      if (response.success) {
        const token = response.data.token;

        const user = response.data.user;

        await saveLogin(token, user);

        console.log("Đăng nhập thành công");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
          >
            {/* Header */}

            <View style={styles.header}>
              <Text style={styles.logo}>SHOESTORE</Text>

              <Text style={styles.title}>Welcome Back 👋</Text>

              <Text style={styles.subtitle}>Sign in to continue shopping</Text>
            </View>

            {/* Form */}

            <View style={styles.form}>
              {/* Email */}

              <Text style={styles.label}>EMAIL</Text>

              <View
                style={[styles.inputContainer, emailFocus && styles.inputFocus]}
              >
                <Ionicons name="mail-outline" size={22} color="#94A3B8" />

                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="#94A3B8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setEmailFocus(true)}
                  onBlur={() => setEmailFocus(false)}
                />
              </View>

              {emailError ? (
                <Text style={styles.error}>{emailError}</Text>
              ) : null}

              {/* Password */}

              <Text style={styles.label}>PASSWORD</Text>

              <View
                style={[
                  styles.inputContainer,
                  passwordFocus && styles.inputFocus,
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={22}
                  color="#94A3B8"
                />

                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setPasswordFocus(true)}
                  onBlur={() => setPasswordFocus(false)}
                />

                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={22}
                    color="#94A3B8"
                  />
                </TouchableOpacity>
              </View>

              {passwordError ? (
                <Text style={styles.error}>{passwordError}</Text>
              ) : null}

              {/* Remember */}

              <View style={styles.row}>
                <TouchableOpacity
                  style={styles.rememberContainer}
                  onPress={() => setRemember(!remember)}
                >
                  <Ionicons
                    name={remember ? "checkbox" : "square-outline"}
                    size={22}
                    color={COLORS.primary}
                  />

                  <Text style={styles.rememberText}>Remember me</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigation.navigate("ForgotPassword")}
                >
                  <Text style={styles.forgot}>Forgot?</Text>
                </TouchableOpacity>
              </View>

              {/* Login */}

              <TouchableOpacity
                style={styles.loginButton}
                disabled={loading}
                onPress={handleLogin}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.loginText}>SIGN IN</Text>
                )}
              </TouchableOpacity>

              {/* Divider */}

              <View style={styles.divider}>
                <View style={styles.line} />

                <Text style={styles.orText}>OR CONTINUE WITH</Text>

                <View style={styles.line} />
              </View>

              {/* Social */}

              <View style={styles.socialContainer}>
                <TouchableOpacity style={styles.socialButton}>
                  <Ionicons name="logo-google" size={22} color="#EA4335" />

                  <Text style={styles.socialText}>Google</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.socialButton}>
                  <Ionicons name="logo-apple" size={22} color="#000" />

                  <Text style={styles.socialText}>Apple</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Footer */}

            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account?</Text>

              <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <Text style={styles.signUp}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  header: {
    marginTop: 60,
    marginBottom: 35,
  },

  logo: {
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: 2,
    color: COLORS.black,
  },

  title: {
    marginTop: 28,
    fontSize: 30,
    fontWeight: "700",
    color: COLORS.black,
  },

  subtitle: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.gray,
    lineHeight: 24,
  },

  form: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 22,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,

    elevation: 8,
  },

  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#64748B",
    marginBottom: 8,
    letterSpacing: 1,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",

    height: 58,

    borderWidth: 1,

    borderColor: "#E5E7EB",

    borderRadius: 16,

    paddingHorizontal: 16,

    marginBottom: 8,

    backgroundColor: COLORS.white,
  },

  inputFocus: {
    borderColor: COLORS.primary,
  },

  input: {
    flex: 1,

    marginLeft: 12,

    fontSize: 16,

    color: COLORS.black,
  },

  error: {
    color: "#EF4444",
    marginBottom: 15,
    marginLeft: 2,
    fontSize: 13,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    marginTop: 6,
    marginBottom: 28,
  },

  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  rememberText: {
    marginLeft: 8,
    color: COLORS.gray,
    fontSize: 14,
  },

  forgot: {
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: 14,
  },

  loginButton: {
    height: 58,

    backgroundColor: COLORS.black,

    borderRadius: 16,

    justifyContent: "center",

    alignItems: "center",

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.18,

    shadowRadius: 8,

    elevation: 6,
  },

  loginText: {
    color: COLORS.white,

    fontSize: 17,

    fontWeight: "700",

    letterSpacing: 0.5,
  },

  divider: {
    flexDirection: "row",

    alignItems: "center",

    marginVertical: 30,
  },

  line: {
    flex: 1,

    height: 1,

    backgroundColor: "#E5E7EB",
  },

  orText: {
    marginHorizontal: 12,

    fontSize: 12,

    color: "#94A3B8",

    fontWeight: "700",

    letterSpacing: 1,
  },

  socialContainer: {
    flexDirection: "row",

    justifyContent: "space-between",
  },

  socialButton: {
    width: "48%",

    height: 56,

    borderRadius: 16,

    borderWidth: 1,

    borderColor: "#E5E7EB",

    backgroundColor: COLORS.white,

    flexDirection: "row",

    justifyContent: "center",

    alignItems: "center",
  },

  socialText: {
    marginLeft: 10,

    fontSize: 15,

    fontWeight: "600",

    color: COLORS.black,
  },

  footer: {
    flexDirection: "row",

    justifyContent: "center",

    alignItems: "center",

    marginTop: 35,

    marginBottom: 20,
  },

  footerText: {
    fontSize: 15,

    color: COLORS.gray,
  },

  signUp: {
    marginLeft: 6,

    color: COLORS.primary,

    fontWeight: "700",

    fontSize: 15,
  },
});
