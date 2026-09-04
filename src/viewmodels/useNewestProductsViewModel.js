import { useCallback, useEffect, useState } from "react";
import { getNewestProducts } from "../services/productService";

export default function useNewestProductsViewModel() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }

      console.log("📦 Đang lấy sản phẩm mới...");

      const data = await getNewestProducts();


      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(
        "❌ Lỗi lấy hàng mới về:",
        error?.response?.data || error?.message,
      );

      if (showLoading) {
        setProducts([]);
      }
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    loadProducts(true);
  }, [loadProducts]);

  const refresh = useCallback(async () => {
    await loadProducts(false);
  }, [loadProducts]);

  return {
    products,
    loading,
    refresh,
  };
}
