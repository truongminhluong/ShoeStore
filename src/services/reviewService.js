import api from "../utils/api";

const reviewService = {
  // ==========================================
  // LẤY DANH SÁCH ĐÁNH GIÁ CỦA SẢN PHẨM
  // ==========================================

  getProductReviews: async (productId) => {
    const response = await api.get(
      `/reviews/product/${productId}`
    );

    return response.data;
  },


  // ==========================================
  // TẠO ĐÁNH GIÁ SẢN PHẨM
  // ==========================================

  createReview: async ({
    productId,
    orderId,
    rating,
    comment,
    images = [],
  }) => {
    const response = await api.post(
      "/reviews",
      {
        productId,
        orderId,
        rating,
        comment,
        images,
      }
    );

    return response.data;
  },


  // ==========================================
  // KIỂM TRA SẢN PHẨM ĐÃ ĐƯỢC ĐÁNH GIÁ
  // ==========================================

  checkReviewed: async (
    productId,
    orderId
  ) => {
    const response = await api.get(
      `/reviews/check/${productId}/${orderId}`
    );

    return response.data;
  },
};

export default reviewService;