import { useEffect, useMemo, useState } from "react";

import {
  getProductDetail,
} from "../services/productService";

export default function useProductDetailViewModel(productId) {
  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // =========================
  // LẤY CHI TIẾT SẢN PHẨM
  // =========================

  const fetchProductDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getProductDetail(productId);

      const fetchedProduct = response?.product || response;
      const fetchedVariants = Array.isArray(response?.variants)
        ? response.variants
        : Array.isArray(response?.product?.variants)
          ? response.product.variants
          : [];

      setProduct(fetchedProduct);
      setVariants(fetchedVariants);

    } catch (error) {
      console.log(
        "Lỗi lấy chi tiết sản phẩm:",
        error.response?.data?.message ||
        error.message
      );

      setError(
        error.response?.data?.message ||
        "Không thể tải thông tin sản phẩm"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProductDetail();
    }
  }, [productId]);

  // =========================
  // DANH SÁCH MÀU
  // =========================

  const colors = useMemo(() => {
    const uniqueColors = new Map();

    variants.forEach((variant) => {
      if (!uniqueColors.has(variant.colorCode)) {
        uniqueColors.set(variant.colorCode, {
          colorName: variant.colorName,
          colorCode: variant.colorCode,
          image: variant.image,
        });
      }
    });

    return Array.from(uniqueColors.values());
  }, [variants]);

  // =========================
  // TẤT CẢ SIZE CỦA SẢN PHẨM
  // =========================

  const sizes = useMemo(() => {
    const uniqueSizes = new Set();

    variants.forEach((variant) => {
      uniqueSizes.add(variant.size);
    });

    return Array.from(uniqueSizes).sort(
      (a, b) => a - b
    );
  }, [variants]);

  // =========================
  // KIỂM TRA SIZE CÓ TỒN TẠI
  // THEO MÀU ĐANG CHỌN
  // =========================

  const isSizeAvailable = (size) => {
    if (!selectedColor) {
      return variants.some(
        (variant) =>
          variant.size === size &&
          variant.stock > 0
      );
    }

    return variants.some(
      (variant) =>
        variant.colorCode ===
        selectedColor.colorCode &&
        variant.size === size &&
        variant.stock > 0
    );
  };

  // =========================
  // VARIANT ĐANG CHỌN
  // =========================

  const selectedVariant = useMemo(() => {
    if (!selectedColor || !selectedSize) {
      return null;
    }

    return variants.find(
      (variant) =>
        variant.colorCode ===
        selectedColor.colorCode &&
        variant.size === selectedSize
    );
  }, [
    variants,
    selectedColor,
    selectedSize,
  ]);

  // =========================
  // CHỌN MÀU
  // =========================

  const handleSelectColor = (color) => {
    setSelectedColor(color);

    // Nếu size đang chọn không tồn tại
    // trong màu mới thì bỏ chọn size
    if (
      selectedSize &&
      !variants.some(
        (variant) =>
          variant.colorCode ===
          color.colorCode &&
          variant.size === selectedSize &&
          variant.stock > 0
      )
    ) {
      setSelectedSize(null);
    }
  };

  // =========================
  // CHỌN SIZE
  // =========================

  const handleSelectSize = (size) => {
    if (!isSizeAvailable(size)) {
      return;
    }

    setSelectedSize(size);
  };

  // =========================
  // ẢNH HIỂN THỊ
  // =========================

  const displayImage =
    selectedVariant?.image ||
    selectedColor?.image ||
    product?.image;

  return {
    product,
    variants,

    colors,
    sizes,

    selectedColor,
    selectedSize,
    selectedVariant,

    displayImage,

    loading,
    error,

    isSizeAvailable,

    handleSelectColor,
    handleSelectSize,

    fetchProductDetail,
  };
}