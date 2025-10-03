import axiosClient from "../api/axiosClient";

// Type SettleResponse
export type SettleResponse = {
  message: string;
  walletId?: number;
  newBalance?: string;
  error?: string;
};

export const topupService = {
  topUp: async (
    walletId: number,
    amount: number,
    returnUrl?: string,
    cancelUrl?: string
  ) => {
    const response = await axiosClient.post(
      `/wallets/${walletId}/topups`,
      { amount },
      {
        headers: {
          ...(returnUrl && { "X-Return-Url": returnUrl }),
          ...(cancelUrl && { "X-Cancel-Url": cancelUrl }),
        },
      }
    );
    return response.data;
  },

  settleOrderCode: async (orderCode: number): Promise<SettleResponse> => {
    const response = await axiosClient.post(
      `/payment/payos/webhook/dev-complete/${orderCode}`
    );
    return response.data;
  },
};

export default topupService;
