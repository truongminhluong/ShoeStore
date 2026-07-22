import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [token, setToken] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const savedToken =
        await AsyncStorage.getItem("token");

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

  const login = async (token, user) => {
    console.log("User đăng nhập:", user);

    await AsyncStorage.setItem(
      "token",
      token
    );

    await AsyncStorage.setItem(
      "user",
      JSON.stringify(user)
    );

    setToken(token);

    setUser(user);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");

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