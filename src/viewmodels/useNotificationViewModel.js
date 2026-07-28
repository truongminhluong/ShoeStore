import { useCallback, useEffect, useState } from "react";

import notificationService from "../services/notificationService";

export default function useNotificationViewModel() {
  const [notifications, setNotifications] = useState([]);

  const [unreadCount, setUnreadCount] = useState(0);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  // ==========================================
  // LẤY DANH SÁCH THÔNG BÁO
  // ==========================================

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await notificationService.getNotifications();

      if (response.success) {
        setNotifications(response.data);
      }
    } catch (error) {
      console.log("Lỗi lấy danh sách thông báo:", error);

      setError(error);
    }
  }, []);

  // ==========================================
  // LẤY SỐ THÔNG BÁO CHƯA ĐỌC
  // ==========================================

  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await notificationService.getUnreadNotificationCount();

      if (response.success) {
        setUnreadCount(response.data.count);
      }
    } catch (error) {
      console.log("Lỗi lấy số thông báo chưa đọc:", error);
    }
  }, []);

  // ==========================================
  // ĐÁNH DẤU MỘT THÔNG BÁO ĐÃ ĐỌC
  // ==========================================

  const markAsRead = async (notificationId) => {
    try {
      await notificationService.markNotificationAsRead(notificationId);

      setNotifications((currentNotifications) =>
        currentNotifications.map((notification) =>
          notification._id === notificationId
            ? {
                ...notification,
                isRead: true,
              }
            : notification,
        ),
      );

      setUnreadCount((count) => (count > 0 ? count - 1 : 0));
    } catch (error) {
      console.log("Lỗi đánh dấu thông báo đã đọc:", error);
    }
  };

  // ==========================================
  // ĐÁNH DẤU TẤT CẢ ĐÃ ĐỌC
  // ==========================================

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllNotificationsAsRead();

      setNotifications((currentNotifications) =>
        currentNotifications.map((notification) => ({
          ...notification,
          isRead: true,
        })),
      );

      setUnreadCount(0);
    } catch (error) {
      console.log("Lỗi đánh dấu tất cả thông báo:", error);
    }
  };

  // ==========================================
  // LOAD BAN ĐẦU
  // ==========================================

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        await Promise.all([fetchNotifications(), fetchUnreadCount()]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchNotifications, fetchUnreadCount]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
  };
}
