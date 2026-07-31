import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

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

      if (parsed?.token) return parsed.token;
      if (parsed?.accessToken) return parsed.accessToken;
      if (parsed?.value) return parsed.value;
    } catch {
      return value;
    }
  }

  return null;
};

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [token, setToken] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const savedToken = await getStoredToken();

      const savedUser =
        await AsyncStorage.getItem("user");

      if (savedToken && savedUser) {
        setToken(savedToken);

        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (tokenInput, user) => {
    const normalizedToken =
      typeof tokenInput === "string"
        ? tokenInput
        : tokenInput?.token || tokenInput?.accessToken || null;

    if (!normalizedToken) {
      throw new Error("Không tìm thấy token từ phản hồi đăng nhập");
    }

    console.log("User đăng nhập:", user);

    await AsyncStorage.multiSet([
      ["token", normalizedToken],
      ["accessToken", normalizedToken],
      ["authToken", normalizedToken],
      ["user", JSON.stringify(user)],
    ]);

    setToken(normalizedToken);

    setUser(user);
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(["token", "accessToken", "authToken"]);

    await AsyncStorage.removeItem("user");

    setToken(null);

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () =>
  useContext(AuthContext);