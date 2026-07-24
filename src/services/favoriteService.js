import api from "../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

// lấy ra danh sách sản phẩm yêu thích của người dùng
export const getFavorites = async () => {

    const token = await AsyncStorage.getItem("token");

    const response = await api.get("/favorites", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

// xoá một sản phẩm khỏi danh sách yêu thích của người dùng
export const removeFavorite = async (productId) => {
    const token = await AsyncStorage.getItem("token");

    const response = await api.delete(
        `/favorites/${productId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

// thêm một sản phẩm vào danh sách yêu thích của người dùng
export const addFavorite = async (productId) => {
    const token = await AsyncStorage.getItem("token");

    const response = await api.post(
        `/favorites/${productId}`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

// xoá tất cả sản phẩm khỏi danh sách yêu thích của người dùng
export const clearFavorites = async () => {
    const token = await AsyncStorage.getItem("token");

    const response = await api.delete("/favorites", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};