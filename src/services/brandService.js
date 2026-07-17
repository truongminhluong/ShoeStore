import api from "../utils/api";

export const getBrands = async () => {
  const response = await api.get("/brands");
  return response.data.data; // lấy mảng data
};