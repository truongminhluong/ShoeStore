import api from "../utils/api";

export const getCategories = async () => {
    const response = await api.get("/categories");

    return response.data;
};