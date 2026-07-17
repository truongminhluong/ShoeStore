import { useEffect, useState } from "react";
import { getBrands } from "../services/brandService";

export default function useBrandViewModel() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBrands = async () => {
    try {
      const data = await getBrands();
      setBrands(data);
    } catch (error) {
      console.log("Lỗi khi lấy danh sách thương hiệu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBrands();
  }, []);

  return {
    brands,
    loading,
    reload: loadBrands,
  };
}