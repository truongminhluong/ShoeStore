import api from "../utils/api";

// ==========================================
// ĐĂNG NHẬP
// ==========================================

export const login = async (email, password) => {
  const response = await api.post("/users/login", {
    email,
    password,
  });

  return response.data;
};

// ==========================================
// ĐĂNG KÝ
// ==========================================

export const register = async (data) => {
  const response = await api.post("/users/register", data);

  return response.data;
};

// ==========================================
// LẤY THÔNG TIN CÁ NHÂN
// ==========================================

export const getProfile = async () => {
  const response = await api.get("/users/profile");

  return response.data;
};

// ==========================================
// CẬP NHẬT THÔNG TIN
// ==========================================

export const updateProfile = async (data) => {
  const response = await api.put("/users/profile", data);

  return response.data;
};

// ==========================================
// ĐỔI MẬT KHẨU
// ==========================================

export const changePassword = async (data) => {
  const response = await api.put("/users/change-password", data);

  return response.data;
};