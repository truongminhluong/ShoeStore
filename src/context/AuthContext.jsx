import { createContext, useContext, useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { getProfile } from "../services/authService";

const AuthContext = createContext();

// ==========================================
// LẤY TOKEN TỪ ASYNC STORAGE
// ==========================================

const getStoredToken = async () => {
  const keys = ["token", "accessToken", "authToken"];

  for (const key of keys) {
    const value = await AsyncStorage.getItem(key);

    if (!value) continue;

    try {
      const parsed = JSON.parse(value);

      if (typeof parsed === "string") {
        return parsed;
      }

      if (parsed?.token) {
        return parsed.token;
      }

      if (parsed?.accessToken) {
        return parsed.accessToken;
      }

      if (parsed?.value) {
        return parsed.value;
      }
    } catch {
      return value;
    }
  }

  return null;
};

// ==========================================
// CHUẨN HÓA USER
// ==========================================

const normalizeUser = (userData) => {
  if (!userData) {
    return null;
  }

  return {
    id: userData.id || userData._id,

    fullName: userData.fullName || "",

    email: userData.email || "",

    phone: userData.phone || "",

    avatar: userData.avatar || "",

    role: userData.role || "user",

    // Giữ đúng giá trị backend trả về
    isActive:
      typeof userData.isActive === "boolean" ? userData.isActive : undefined,
  };
};

// ==========================================
// AUTH PROVIDER
// ==========================================

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [token, setToken] = useState(null);

  const [loading, setLoading] = useState(true);

  // ========================================
  // LẤY PROFILE MỚI NHẤT TỪ SERVER
  // ========================================

  const refreshProfile = async () => {
    try {
      const response = await getProfile();

      console.log("PROFILE REFRESH:", response);

      if (!response?.success || !response?.data) {
        return null;
      }

      const normalizedUser = normalizeUser(response.data);

      // Cập nhật React state
      setUser(normalizedUser);

      // Cập nhật AsyncStorage
      await AsyncStorage.setItem("user", JSON.stringify(normalizedUser));

      console.log("USER SAU KHI REFRESH:", normalizedUser);

      return normalizedUser;
    } catch (error) {
      console.log(
        "Lỗi refresh profile:",
        error?.response?.data || error?.message || error,
      );

      return null;
    }
  };

  // ========================================
  // LOAD USER KHI MỞ APP
  // ========================================

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const savedToken = await getStoredToken();

      const savedUser = await AsyncStorage.getItem("user");

      // ------------------------------------
      // Có token
      // ------------------------------------

      if (savedToken) {
        setToken(savedToken);

        // ----------------------------------
        // Load user cũ trước
        // để app không bị trống thông tin
        // ----------------------------------

        if (savedUser) {
          try {
            const parsedUser = JSON.parse(savedUser);

            const normalizedUser = normalizeUser(parsedUser);

            setUser(normalizedUser);

            console.log("USER LOAD TỪ STORAGE:", normalizedUser);
          } catch (error) {
            console.log("Lỗi đọc user storage:", error);
          }
        }

        // ----------------------------------
        // Sau đó lấy user mới nhất từ API
        // ----------------------------------

        await refreshProfile();
      }
    } catch (error) {
      console.log("Lỗi load user:", error);
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // LOGIN
  // ========================================

  const login = async (tokenInput, userData) => {
    const normalizedToken =
      typeof tokenInput === "string"
        ? tokenInput
        : tokenInput?.token || tokenInput?.accessToken || null;

    if (!normalizedToken) {
      throw new Error("Không tìm thấy token từ phản hồi đăng nhập");
    }

    const normalizedUser = normalizeUser(userData);

    console.log("USER ĐĂNG NHẬP:", normalizedUser);

    // Lưu token
    await AsyncStorage.multiSet([
      ["token", normalizedToken],
      ["accessToken", normalizedToken],
      ["authToken", normalizedToken],
      ["user", JSON.stringify(normalizedUser)],
    ]);

    setToken(normalizedToken);

    setUser(normalizedUser);

    // --------------------------------------
    // Lấy profile mới nhất sau khi login
    // --------------------------------------

    try {
      const response = await getProfile();

      if (response?.success && response?.data) {
        const latestUser = normalizeUser(response.data);

        setUser(latestUser);

        await AsyncStorage.setItem("user", JSON.stringify(latestUser));

        console.log("USER SAU LOGIN:", latestUser);
      }
    } catch (error) {
      console.log(
        "Không thể lấy profile sau login:",
        error?.response?.data || error?.message,
      );
    }
  };

  // ========================================
  // LOGOUT
  // ========================================

  const logout = async () => {
    await AsyncStorage.multiRemove([
      "token",
      "accessToken",
      "authToken",
      "user",
    ]);

    setToken(null);

    setUser(null);
  };

  // ========================================
  // CONTEXT
  // ========================================

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,

        login,

        logout,

        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ==========================================
// USE AUTH
// ==========================================

export const useAuth = () => useContext(AuthContext);
