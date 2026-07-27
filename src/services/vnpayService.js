import api from "../utils/api";

export const createVnpayPaymentApi = async (
  orderId,
  token,
) => {
  const response = await api.post(
    "/payment/vnpay/create",
    {
      orderId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};