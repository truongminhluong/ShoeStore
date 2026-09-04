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
    ScrollView,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import Ionicons from "@expo/vector-icons/Ionicons";

import COLORS from "../../constants/colors";

import { updateProfile } from "../../services/authService";

const normalizeText = (value) => {
    return String(value || "").trim();
};

// ==========================================
// VALIDATE EMAIL
// ==========================================

const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// ==========================================
// VALIDATE PHONE
// ==========================================

const isValidPhone = (phone) => {
    return /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/.test(
        phone.replace(/\s/g, "")
    );
};

const EditProfileScreen = ({ navigation, route }) => {
    // ==========================================
    // USER TỪ ACCOUNT
    // ==========================================

    const user = route?.params?.user;

    // ==========================================
    // STATE
    // Ban đầu để rỗng để sử dụng placeholder
    // ==========================================

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    const [loading, setLoading] = useState(false);

    // ==========================================
    // LƯU THÔNG TIN
    // ==========================================

    const handleUpdateProfile = async () => {
        // ------------------------------------------
        // Nếu không có user
        // ------------------------------------------

        if (!user) {
            Alert.alert(
                "Lỗi",
                "Không tìm thấy thông tin tài khoản"
            );

            return;
        }

        // ------------------------------------------
        // Lấy dữ liệu mới
        // Nếu input rỗng -> lấy dữ liệu cũ
        // ------------------------------------------

        const newFullName =
            normalizeText(fullName) ||
            normalizeText(user.fullName);

        const newEmail =
            normalizeText(email) ||
            normalizeText(user.email);

        const newPhone =
            normalizeText(phone) ||
            normalizeText(user.phone);

        // ==========================================
        // VALIDATE HỌ TÊN
        // ==========================================

        if (!newFullName) {
            Alert.alert(
                "Thông báo",
                "Họ và tên không được để trống"
            );

            return;
        }

        // ==========================================
        // VALIDATE EMAIL
        // ==========================================

        if (!isValidEmail(newEmail)) {
            Alert.alert(
                "Thông báo",
                "Email không đúng định dạng"
            );

            return;
        }

        // ==========================================
        // VALIDATE PHONE
        // ==========================================

        if (!newPhone) {
            Alert.alert(
                "Thông báo",
                "Số điện thoại không được để trống"
            );

            return;
        }

        if (!isValidPhone(newPhone)) {
            Alert.alert(
                "Thông báo",
                "Số điện thoại không đúng định dạng"
            );

            return;
        }

        // ==========================================
        // DATA GỬI API
        // ==========================================

        const data = {
            fullName: newFullName,
            email: newEmail,
            phone: newPhone,
        };

        try {
            setLoading(true);

            const response = await updateProfile(data);

            console.log("UPDATE PROFILE:", response);

            Alert.alert(
                "Thành công",
                "Cập nhật thông tin thành công",
                [
                    {
                        text: "OK",
                        onPress: () => {
                            navigation.goBack();
                        },
                    },
                ]
            );
        } catch (error) {
            console.log(
                "UPDATE PROFILE ERROR:",
                error?.response?.data || error
            );

            const message =
                error?.response?.data?.message ||
                "Không thể cập nhật thông tin";

            Alert.alert(
                "Cập nhật thất bại",
                message
            );
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // KHÔNG CÓ USER
    // ==========================================

    if (!user) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>
                        Không tìm thấy thông tin người dùng
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView
            style={styles.container}
            edges={["top"]}
        >
            {/* ======================================
          HEADER
      ====================================== */}

            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons
                        name="arrow-back"
                        size={25}
                        color={COLORS.black}
                    />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>
                    Chỉnh sửa thông tin
                </Text>

                <View style={styles.headerRight} />
            </View>

            <KeyboardAvoidingView
                style={styles.flex}
                behavior={
                    Platform.OS === "ios"
                        ? "padding"
                        : undefined
                }
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={styles.content}
                >
                    {/* ==================================
              HỌ TÊN
          ================================== */}

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>
                            Họ và tên
                        </Text>

                        <View style={styles.inputContainer}>
                            <Ionicons
                                name="person-outline"
                                size={21}
                                color={COLORS.gray}
                            />

                            <TextInput
                                style={styles.input}
                                placeholder={
                                    user.fullName || "Nhập họ và tên"
                                }
                                placeholderTextColor="#A8A8A8"
                                value={fullName}
                                onChangeText={setFullName}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>
                    </View>

                    {/* ==================================
              EMAIL
          ================================== */}

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>
                            Email
                        </Text>

                        <View style={styles.inputContainer}>
                            <Ionicons
                                name="mail-outline"
                                size={21}
                                color={COLORS.gray}
                            />

                            <TextInput
                                style={styles.input}
                                placeholder={
                                    user.email || "Nhập email"
                                }
                                placeholderTextColor="#A8A8A8"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>
                    </View>

                    {/* ==================================
              SỐ ĐIỆN THOẠI
          ================================== */}

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>
                            Số điện thoại
                        </Text>

                        <View style={styles.inputContainer}>
                            <Ionicons
                                name="call-outline"
                                size={21}
                                color={COLORS.gray}
                            />

                            <TextInput
                                style={styles.input}
                                placeholder={
                                    user.phone || "Nhập số điện thoại"
                                }
                                placeholderTextColor="#A8A8A8"
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
                                maxLength={10}
                            />
                        </View>
                    </View>

                    {/* ==================================
              BUTTON
          ================================== */}

                    <TouchableOpacity
                        style={[
                            styles.updateButton,
                            loading && styles.disabledButton,
                        ]}
                        onPress={handleUpdateProfile}
                        disabled={loading}
                        activeOpacity={0.85}
                    >
                        {loading ? (
                            <Text style={styles.buttonText}>
                                ĐANG CẬP NHẬT...
                            </Text>
                        ) : (
                            <>
                                <Text style={styles.buttonText}>
                                    LƯU THAY ĐỔI
                                </Text>

                                <Ionicons
                                    name="checkmark-circle-outline"
                                    size={21}
                                    color="#FFFFFF"
                                />
                            </>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },

    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },

    header: {
        height: 60,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 18,
    },

    backButton: {
        width: 42,
        height: 42,
        justifyContent: "center",
        alignItems: "center",
    },

    headerTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: COLORS.black,
    },

    headerRight: {
        width: 42,
    },

    content: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 40,
    },

    inputGroup: {
        marginBottom: 20,
    },

    label: {
        fontSize: 15,
        fontWeight: "600",
        color: COLORS.black,
        marginBottom: 8,
    },

    inputContainer: {
        height: 55,
        borderWidth: 1,
        borderColor: "#B8B8B8",
        borderRadius: 12,
        backgroundColor: COLORS.white,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 15,
    },

    input: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
        color: COLORS.black,
    },

    updateButton: {
        height: 55,
        borderRadius: 12,
        backgroundColor: COLORS.primary,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        marginTop: 15,
    },

    disabledButton: {
        opacity: 0.6,
    },

    buttonText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "700",
    },

    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 30,
    },

    errorText: {
        fontSize: 16,
        color: COLORS.black,
        textAlign: "center",
    },
});