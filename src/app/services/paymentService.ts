import api, { setAuthToken } from "@/lib/api";

interface PaymentPayload {
    userId: string;
    amount: number;
}

export const paymentService = {
  payment: async (token: string, payload: PaymentPayload) => {

    setAuthToken(token);

    const { data } = await api.post("/payments", payload); 
    return data?.data;
  }

};
