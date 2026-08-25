import React, { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";

import COLORS from "../../constants/colors";
import FONTS from "../../constants/fonts";

export default function RegisterScreen({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
        >

          {/* ================= HEADER ================= */}

          <View style={styles.header}>

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons
                name="arrow-back"
                size={22}
                color={COLORS.primary}
              />
            </TouchableOpacity>

            <Text style={styles.logo}>
              RydeStore
            </Text>

            <View style={styles.headerRight} />

          </View>


          {/* ================= TITLE ================= */}

          <View style={styles.titleContainer}>

            <Text style={styles.title}>
              Tạo tài khoản mới
            </Text>

            <Text style={styles.description}>
              Hãy tham gia cùng Ryde để trải nghiệm tốc
              độ mua sắm vượt trội.
            </Text>

          </View>


          {/* ================= FULL NAME ================= */}

          <View style={styles.inputContainer}>

            <Text style={styles.label}>
              Họ và tên
            </Text>

            <View style={styles.inputBox}>

              <Ionicons
                name="person-outline"
                size={20}
                color="#8A8FA3"
              />

              <TextInput
                style={styles.input}
                placeholder="Nguyễn Văn A"
                placeholderTextColor="#B8BDCE"
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
              />

            </View>

          </View>


          {/* ================= EMAIL ================= */}

          <View style={styles.inputContainer}>

            <Text style={styles.label}>
              Email
            </Text>

            <View style={styles.inputBox}>

              <Ionicons
                name="mail-outline"
                size={20}
                color="#8A8FA3"
              />

              <TextInput
                style={styles.input}
                placeholder="example@velocity.com"
                placeholderTextColor="#B8BDCE"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />

            </View>

          </View>


          {/* ================= PHONE ================= */}

          <View style={styles.inputContainer}>

            <Text style={styles.label}>
              Số điện thoại
            </Text>

            <View style={styles.inputBox}>

              <Ionicons
                name="call-outline"
                size={20}
                color="#8A8FA3"
              />

              <TextInput
                style={styles.input}
                placeholder="0901 234 567"
                placeholderTextColor="#B8BDCE"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />

            </View>

          </View>


          {/* ================= PASSWORD ================= */}

          <View style={styles.inputContainer}>

            <Text style={styles.label}>
              Mật khẩu
            </Text>

            <View style={styles.inputBox}>

              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#8A8FA3"
              />

              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#B8BDCE"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />

              <TouchableOpacity
                onPress={() =>
                  setShowPassword(!showPassword)
                }
              >
                <Ionicons
                  name={
                    showPassword
                      ? "eye-outline"
                      : "eye-off-outline"
                  }
                  size={21}
                  color="#777D91"
                />
              </TouchableOpacity>

            </View>

          </View>


          {/* ================= TERMS ================= */}

          <TouchableOpacity
            style={styles.termsContainer}
            onPress={() => setAgree(!agree)}
            activeOpacity={0.8}
          >

            <View
              style={[
                styles.checkbox,
                agree && styles.checkboxActive,
              ]}
            >
              {agree && (
                <Ionicons
                  name="checkmark"
                  size={15}
                  color={COLORS.white}
                />
              )}
            </View>

            <Text style={styles.termsText}>
              Tôi đồng ý với{" "}
              <Text style={styles.link}>
                Điều khoản & Chính sách
              </Text>{" "}
              của Velocity Commerce.
            </Text>

          </TouchableOpacity>


          {/* ================= REGISTER ================= */}

          <TouchableOpacity
            style={styles.registerButton}
            activeOpacity={0.85}
            onPress={() => {
              console.log({
                fullName,
                email,
                phone,
                password,
                agree,
              });
            }}
          >

            <Text style={styles.registerText}>
              ĐĂNG KÝ
            </Text>

          </TouchableOpacity>


          {/* ================= OR ================= */}

          <View style={styles.orContainer}>

            <View style={styles.line} />

            <Text style={styles.orText}>
              HOẶC TIẾP TỤC VỚI
            </Text>

            <View style={styles.line} />

          </View>


          {/* ================= SOCIAL ================= */}

          <View style={styles.socialContainer}>

            {/* GOOGLE */}

            <TouchableOpacity
              style={styles.socialButton}
            >

              <Text style={styles.googleIcon}>
                G
              </Text>

              <Text style={styles.socialText}>
                Google
              </Text>

            </TouchableOpacity>


            {/* FACEBOOK */}

            <TouchableOpacity
              style={styles.socialButton}
            >

              <Text style={styles.facebookIcon}>
                f
              </Text>

              <Text style={styles.socialText}>
                Facebook
              </Text>

            </TouchableOpacity>

          </View>


          {/* ================= LOGIN ================= */}

          <View style={styles.loginContainer}>

            <Text style={styles.loginText}>
              Đã có tài khoản?
            </Text>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Login")
              }
            >
              <Text style={styles.loginLink}>
                Đăng nhập
              </Text>
            </TouchableOpacity>

          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },


  screen: {
    flex: 1,
    backgroundColor: "#F9F7FF",
  },

  content: {
    paddingBottom: 30,
  },

  // ================= HEADER =================

  header: {
    height: 55,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    paddingHorizontal: 16,

    borderBottomWidth: 1,
    borderBottomColor: "#EEEAF7",
  },

  backButton: {
    width: 40,
    height: 40,

    justifyContent: "center",
    alignItems: "flex-start",
  },

  logo: {
    fontSize: 20,
    fontWeight: "800",

    color: COLORS.primary,

    letterSpacing: 0.5,
  },

  headerRight: {
    width: 40,
  },

  // ================= TITLE =================

  titleContainer: {
    paddingHorizontal: 15,
    marginTop: 17,
    marginBottom: 12,
  },

  title: {
    fontSize: 21,
    fontWeight: "800",
    color: "#172033",

    marginBottom: 5,
  },

  description: {
    fontSize: 13,
    lineHeight: 18,

    color: "#454A5C",
  },

  // ================= INPUT =================

  inputContainer: {
    marginHorizontal: 15,
    marginBottom: 12,
  },

  label: {
    fontSize: 16,
    fontWeight: "700",

    color: "#454A5C",

    marginBottom: 5,
  },

  inputBox: {
    height: 51,

    borderWidth: 1,
    borderColor: "#A9ACBA",

    borderRadius: 7,

    backgroundColor: "#FFFFFF",

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 12,
  },

  input: {
    flex: 1,

    height: "100%",

    marginLeft: 10,

    fontSize: 14,

    color: "#202638",
  },

  // ================= TERMS =================

  termsContainer: {
    flexDirection: "row",

    alignItems: "flex-start",

    marginHorizontal: 17,

    marginTop: 5,

    marginBottom: 22,
  },

  checkbox: {
    width: 16,
    height: 16,

    borderWidth: 1,
    borderColor: "#9CA1B1",

    marginTop: 1,

    justifyContent: "center",
    alignItems: "center",
  },

  checkboxActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  termsText: {
    flex: 1,

    marginLeft: 8,

    fontSize: 10,

    lineHeight: 15,

    color: "#4D5262",
  },

  link: {
    color: COLORS.primary,
    fontWeight: "700",
  },

  // ================= REGISTER =================

  registerButton: {
    height: 38,

    marginHorizontal: 15,

    borderRadius: 6,

    backgroundColor: COLORS.primary,

    justifyContent: "center",
    alignItems: "center",

    elevation: 3,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },

  registerText: {
    color: COLORS.white,

    fontSize: 16,

    fontWeight: "800",

    letterSpacing: 0.3,
  },

  // ================= OR =================

  orContainer: {
    flexDirection: "row",

    alignItems: "center",

    marginHorizontal: 15,

    marginTop: 25,
    marginBottom: 20,
  },

  line: {
    flex: 1,

    height: 1,

    backgroundColor: "#E3E0EB",
  },

  orText: {
    marginHorizontal: 12,

    fontSize: 10,

    color: "#858999",

    letterSpacing: 0.5,
  },

  // ================= SOCIAL =================

  socialContainer: {
    flexDirection: "row",

    marginHorizontal: 15,

    gap: 12,
  },

  socialButton: {
    flex: 1,

    height: 39,

    borderWidth: 1,

    borderColor: "#D7D4E2",

    borderRadius: 6,

    backgroundColor: "#FFFFFF",

    flexDirection: "row",

    alignItems: "center",
    justifyContent: "center",
  },

  googleIcon: {
    fontSize: 13,

    fontWeight: "800",

    color: "#4285F4",

    marginRight: 8,
  },

  facebookIcon: {
    fontSize: 17,

    fontWeight: "800",

    color: "#1877F2",

    marginRight: 8,
  },

  socialText: {
    fontSize: 11,

    fontWeight: "600",

    color: "#252A3A",
  },

  // ================= LOGIN =================

  loginContainer: {
    flexDirection: "row",

    justifyContent: "center",
    alignItems: "center",

    marginTop: 35,
  },

  loginText: {
    fontSize: 12,

    color: "#555A6A",
  },

  loginLink: {
    marginLeft: 5,

    fontSize: 12,

    fontWeight: "800",

    color: COLORS.primary,
  },

});