import api from "../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const getStoredToken = async () => {
    const keys = ["token", "accessToken", "authToken"];

    for (const key of keys) {
        const value = await AsyncStorage.getItem(key);

        if (!value) continue;

        try {
            const parsed = JSON.parse(value);

            if (typeof parsed === "string") return parsed;
            if (parsed?.token) return parsed.token;
            if (parsed?.accessToken) return parsed.accessToken;
            if (parsed?.value) return parsed.value;
        } catch {
            return value;
        }
    }

    return null;
};

const withAuthHeader = async () => {
    const token = await getStoredToken();

    if (!token) {
        return {};
    }

    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

// lấy ra danh sách sản phẩm yêu thích của người dùng
export const getFavorites = async () => {
    const authHeader = await withAuthHeader();

    if (!authHeader.headers) {
        return { data: [] };
    }

    const response = await api.get("/favorites", authHeader);

    return response.data;
};

// xoá một sản phẩm khỏi danh sách yêu thích của người dùng
export const removeFavorite = async (productId) => {
    const authHeader = await withAuthHeader();

    if (!authHeader.headers) {
        return null;
    }

    const response = await api.delete(`/favorites/${productId}`, authHeader);

    return response.data;
};

// thêm một sản phẩm vào danh sách yêu thích của người dùng
export const addFavorite = async (productId) => {
    const authHeader = await withAuthHeader();

    if (!authHeader.headers) {
        return null;
    }

    const response = await api.post(`/favorites/${productId}`, {}, authHeader);

    return response.data;
};

// xoá tất cả sản phẩm khỏi danh sách yêu thích của người dùng
export const clearFavorites = async () => {
    const authHeader = await withAuthHeader();

    if (!authHeader.headers) {
        return null;
    }

    const response = await api.delete("/favorites", authHeader);

    return response.data;
};