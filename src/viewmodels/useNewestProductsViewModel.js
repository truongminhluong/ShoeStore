import { useEffect, useState } from "react";
import { getNewestProducts } from "../services/productService";

export default function useNewestProductsViewModel() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    try {
      const data = await getNewestProducts();
      console.log("Danh sách hàng mới:", data);
      console.log("Products:", products);
      console.log("Số lượng:", products.length);
      setProducts(data);
    } catch (error) {
      console.log("Lỗi lấy hàng mới về:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return {
    products,
    loading,
    refresh: loadProducts,
  };
}
