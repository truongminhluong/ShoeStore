import { useState } from "react";

import reviewService from "../services/reviewService";

export default function useCreateReviewViewModel() {
  // =========================
  // TRẠNG THÁI
  // =========================

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  // Số sao đánh giá
  const [rating, setRating] = useState(0);

  // Nội dung đánh giá
  const [comment, setComment] = useState("");

  // Danh sách ảnh đánh giá
  const [images, setImages] = useState([]);

  // =========================
  // TẠO ĐÁNH GIÁ
  // =========================

  const createReview = async ({
    productId,
    orderId,
  }) => {
    try {
      setLoading(true);

      setError(null);

      // Kiểm tra thông tin
      if (!productId) {
        throw new Error(
          "Không tìm thấy sản phẩm"
        );
      }

      if (!orderId) {
        throw new Error(
          "Không tìm thấy đơn hàng"
        );
      }

      // Kiểm tra số sao
      if (
        rating < 1 ||
        rating > 5
      ) {
        throw new Error(
          "Vui lòng chọn số sao đánh giá"
        );
      }

      // Gọi API
      const response =
        await reviewService.createReview({
          productId,
          orderId,
          rating,
          comment: comment || "",
          images: Array.isArray(images)
            ? images
            : [],
        });

      // Kiểm tra kết quả API
      if (!response?.success) {
        throw new Error(
          response?.message ||
            "Không thể gửi đánh giá"
        );
      }

      return {
        success: true,

        data: response.data,

        message:
          response.message ||
          "Đánh giá sản phẩm thành công",
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Không thể gửi đánh giá";

      console.log(
        "Lỗi tạo đánh giá:",
        errorMessage
      );

      setError(errorMessage);

      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // TRẢ DỮ LIỆU CHO SCREEN
  // =========================

  return {
    rating,
    setRating,

    comment,
    setComment,

    images,
    setImages,

    loading,
    error,

    createReview,
  };
}