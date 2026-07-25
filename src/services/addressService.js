import api from "../utils/api";

// Lấy danh sách địa chỉ
export const getAddressesApi = async (token) => {
  const response = await api.get("/addresses", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Thêm địa chỉ
export const createAddressApi = async (
  addressData,
  token
) => {
  const response = await api.post(
    "/addresses",
    addressData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// Đặt địa chỉ làm mặc định
export const setDefaultAddressApi = async (
  addressId,
  token
) => {
  const response = await api.put(
    `/addresses/${addressId}/default`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// Xóa địa chỉ
export const deleteAddressApi = async (
  addressId,
  token
) => {
  const response = await api.delete(
    `/addresses/${addressId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};