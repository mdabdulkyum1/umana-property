import api, { setAuthToken } from "@/lib/api";

interface PaymentPayload {
    userId: string;
    amount: number;
}

interface PaymentFinePayload {
    fine: number;
}

export const paymentService = {
  payment: async (token: string, payload: PaymentPayload) => {

    setAuthToken(token);

    const { data } = await api.post("/payments", payload); 
    return data?.data;
  },

  getMyPayments: async (token: string) => {

    setAuthToken(token);

    const { data } = await api.get("/payments/my-payments");
    return data?.data;

  },

  updatePayments: async (token: string, id: string, payload: PaymentFinePayload ) => {

    setAuthToken(token);

    const { data } = await api.patch(`/payments/${id}`, payload);
    return data?.data;

  }

};
