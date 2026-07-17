import api from "../utils/api";

export const getProducts = async () => {
  const response = await api.get("/products");
  return response.data.data;
};

export const getNewestProducts = async () => {
  const response = await api.get("/products/new");
  return response.data.data;
};

export const getProductDetail = async (id) => {
  const response = await api.get(`/products/detail/${id}`);
  return response.data.data;
};