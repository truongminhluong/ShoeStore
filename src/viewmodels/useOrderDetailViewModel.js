import { useCallback, useEffect, useState } from "react";

import { getMyOrderDetailApi } from "../services/orderService";

import { useAuth } from "../context/AuthContext";

export default function useOrderDetailViewModel(orderId) {
  const { token } = useAuth();

  const [order, setOrder] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  // =========================
  // LẤY CHI TIẾT ĐƠN HÀNG
  // =========================

  const fetchOrderDetail = useCallback(async () => {
    if (!orderId) {
      setLoading(false);

      setError("Không tìm thấy mã đơn hàng");

      return;
    }

    if (!token) {
      setLoading(false);

      setError("Bạn chưa đăng nhập");

      return;
    }

    try {
      setLoading(true);

      setError(null);

      const response = await getMyOrderDetailApi(orderId, token);

      if (response.success) {
        setOrder(response.data);
      } else {
        setError(response.message || "Không thể lấy chi tiết đơn hàng");
      }
    } catch (error) {
      console.log("Lỗi lấy chi tiết đơn hàng:", error);

      setError(
        error.response?.data?.message || "Không thể tải chi tiết đơn hàng",
      );
    } finally {
      setLoading(false);
    }
  }, [orderId, token]);

  useEffect(() => {
    fetchOrderDetail();
  }, [fetchOrderDetail]);

  return {
    order,
    loading,
    error,
    fetchOrderDetail,
  };
}
