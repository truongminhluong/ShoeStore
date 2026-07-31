import { SERVER_URL } from "./api";

const fallbackImage = require("../../assets/images/banner1.jpg");

/**
 * Chuyển đổi giá trị ảnh (string URL hoặc đường dẫn tương đối)
 * thành source object cho component Image của React Native.
 *
 * - URL đầy đủ (http/https) → { uri: url }
 * - Đường dẫn tương đối (/uploads/...) → { uri: SERVER_URL + path }
 * - Không hợp lệ / undefined → fallbackImage (ảnh local)
 */
export const getImageSource = (image) => {
  if (typeof image === "string" && image.trim()) {
    const trimmed = image.trim();

    // URL đầy đủ
    if (/^https?:\/\//i.test(trimmed)) {
      return { uri: trimmed };
    }

    // Đường dẫn tương đối từ server
    if (trimmed.startsWith("/")) {
      return { uri: `${SERVER_URL}${trimmed}` };
    }
  }

  return fallbackImage;
};

export default getImageSource;
