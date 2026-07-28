import { useCallback, useEffect, useState } from "react";

import reviewService from "../services/reviewService";

export default function useProductReviewsViewModel(productId) {
  const [reviews, setReviews] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);

      setError(null);

      const response = await reviewService.getProductReviews(productId);

      if (response.success) {
        setReviews(response.data);
      }
    } catch (error) {
      console.log("Lỗi lấy đánh giá sản phẩm:", error);

      setError(error);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId, fetchReviews]);

  return {
    reviews,
    loading,
    error,
    fetchReviews,
  };
}
