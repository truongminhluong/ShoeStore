import api from "../utils/api";

const notificationService = {
  // =========================
  // LẤY DANH SÁCH THÔNG BÁO
  // =========================
  getNotifications: async () => {
    try {
      const response = await api.get("/notifications");

      return response.data;
    } catch (error) {
      console.log(
        "Lỗi lấy danh sách thông báo:",
        error.response?.data || error.message,
      );

      throw error;
    }
  },

  // =========================
  // LẤY SỐ THÔNG BÁO CHƯA ĐỌC
  // =========================
  getUnreadNotificationCount: async () => {
    try {
      const response = await api.get(
        "/notifications/unread-count",
      );

      return response.data;
    } catch (error) {
      console.log(
        "Lỗi lấy số thông báo chưa đọc:",
        error.response?.data || error.message,
      );

      throw error;
    }
  },

  // =========================
  // ĐÁNH DẤU MỘT THÔNG BÁO ĐÃ ĐỌC
  // =========================
  markNotificationAsRead: async (
    notificationId,
  ) => {
    try {
      const response = await api.put(
        `/notifications/${notificationId}/read`,
      );

      return response.data;
    } catch (error) {
      console.log(
        "Lỗi đánh dấu thông báo đã đọc:",
        error.response?.data || error.message,
      );

      throw error;
    }
  },

  // =========================
  // ĐÁNH DẤU TẤT CẢ ĐÃ ĐỌC
  // =========================
  markAllNotificationsAsRead: async () => {
    try {
      const response = await api.put(
        "/notifications/read-all",
      );

      return response.data;
    } catch (error) {
      console.log(
        "Lỗi đánh dấu tất cả thông báo:",
        error.response?.data || error.message,
      );

      throw error;
    }
  },
};

export default notificationService;