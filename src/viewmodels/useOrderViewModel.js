import { useCallback, useEffect, useState } from "react";

import { useAuth } from "../context/AuthContext";

import {
  getMyOrdersApi,
} from "../services/orderService";

export default function useOrderViewModel() {
  const { token } = useAuth();

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  // =========================
  // LẤY DANH SÁCH ĐƠN HÀNG
  // =========================

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);

      setError(null);

      if (!token) {
        return;
      }

      const response =
        await getMyOrdersApi(token);

      setOrders(response.data || []);
    } catch (error) {
      console.log(
        "Lỗi lấy danh sách đơn hàng:",
        error.response?.data ||
          error.message
      );

      setError(
        error.response?.data?.message ||
          "Không thể lấy danh sách đơn hàng"
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    loading,
    error,
    fetchOrders,
  };
}