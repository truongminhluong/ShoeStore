import axios from "axios";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Android Emulator → 10.0.2.2
// iOS Simulator   → localhost
// Thiết bị thật   → đổi thành IP LAN (ví dụ: 192.168.1.x)
const HOST = Platform.OS === "android" ? "10.0.2.2" : "localhost";
export const SERVER_URL = `http://${HOST}:3000`;

const api = axios.create({
  baseURL: `${SERVER_URL}/api`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

const getStoredToken = async () => {
  const keys = ["token", "accessToken", "authToken"];

  for (const key of keys) {
    const rawValue = await AsyncStorage.getItem(key);

    if (!rawValue) continue;

    try {
      const parsed = JSON.parse(rawValue);

      if (typeof parsed === "string") return parsed;
      if (parsed?.token) return parsed.token;
      if (parsed?.accessToken) return parsed.accessToken;
      if (parsed?.value) return parsed.value;
    } catch {
      return rawValue;
    }
  }

  return null;
};

api.interceptors.request.use(
  async (config) => {
    const token = await getStoredToken();

    if (token) {
      config.headers = {
        ...(config.headers || {}),
        Authorization: `Bearer ${token}`,
      };
    } else {
      delete config.headers?.Authorization;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.response?.status === 401) {
      await AsyncStorage.multiRemove(["token", "accessToken", "authToken"]);
    }

    return Promise.reject(error);
  },
);

export default api;