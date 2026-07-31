import api from "../utils/api";

const normalizeResponse = (response) => {
  if (!response) return [];

  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  if (Array.isArray(response?.data?.products)) return response.data.products;

  return response?.data?.data || response?.data || response;
};

const normalizeProductDetailResponse = (response) => {
  const payload = response?.data?.data ?? response?.data ?? response;

  if (!payload || typeof payload !== "object") {
    return { product: payload, variants: [] };
  }

  const nestedData = payload?.data && typeof payload.data === "object" ? payload.data : {};
  const product = payload?.product ?? nestedData?.product ?? payload;
  const variants = Array.isArray(payload?.variants)
    ? payload.variants
    : Array.isArray(nestedData?.variants)
      ? nestedData.variants
      : Array.isArray(product?.variants)
        ? product.variants
        : [];

  return {
    ...(payload && !Array.isArray(payload) ? payload : {}),
    product,
    variants,
  };
};

export const getProducts = async () => {
  try {
    const response = await api.get("/products");
    return normalizeResponse(response);
  } catch (error) {
    if (error?.response?.status === 404) {
      return [];
    }
    throw error;
  }
};

export const getNewestProducts = async () => {
  try {
    const response = await api.get("/products/new");
    return normalizeResponse(response);
  } catch (error) {
    if (error?.response?.status === 404) {
      return [];
    }
    throw error;
  }
};

export const getProductDetail = async (id) => {
  try {
    const response = await api.get(`/products/detail/${id}`);
    return normalizeProductDetailResponse(response);
  } catch (error) {
    if (error?.response?.status === 404) {
      return null;
    }
    throw error;
  }
};