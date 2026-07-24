import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";

export default function useRelatedProductsViewModel(
  currentProductId
) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setLoading(true);

        const data = await getProducts();
        const safeProducts = Array.isArray(data) ? data : [];

        const relatedProducts = safeProducts
          .filter(
            (product) =>
              product?._id !== currentProductId
          )
          .slice(0, 6);

        setProducts(relatedProducts);
      } catch (error) {
        console.log(
          "Lỗi lấy sản phẩm liên quan:",
          error.message
        );
      } finally {
        setLoading(false);
      }
    };

    if (currentProductId) {
      fetchRelatedProducts();
    }
  }, [currentProductId]);

  return {
    products,
    loading,
  };
}