import api from "../utils/api";

// =========================
// TẠO ĐƠN HÀNG
// =========================

export const createOrderApi = async (orderData, token) => {
  const response = await api.post(
    "/orders",
    orderData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// =========================
// LẤY DANH SÁCH ĐƠN HÀNG
// =========================

export const getMyOrdersApi = async (token) => {
  const response = await api.get(
    "/orders",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// =========================
// LẤY CHI TIẾT ĐƠN HÀNG
// =========================

export const getMyOrderDetailApi = async (
  orderId,
  token
) => {
  const response = await api.get(
    `/orders/${orderId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// =========================
// HỦY ĐƠN HÀNG
// =========================

export const cancelOrderApi = async (
  orderId,
  token
) => {
  const response = await api.put(
    `/orders/${orderId}/cancel`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};