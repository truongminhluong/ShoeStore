import api from "../utils/api";

export const getVouchersApi = async () => {
  const response = await api.get("/vouchers");
  return response.data;
};

export const validateVoucherApi = async (data) => {
  const response = await api.post("/vouchers/validate", data);
  return response.data;
};