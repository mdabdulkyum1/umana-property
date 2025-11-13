import api, { setAuthToken } from "@/lib/api";

export interface CycleCreatePayload {
  name: string;
  startDate?: string; 
  endDate?: string;
  isInvested: boolean;   
}

export interface CycleUpdatePayload {
  name?: string;
  totalDeposit?: number;
  totalProfit?: number;
  isInvested?: boolean;
  distributed?: boolean;
  endDate?: string;
}

export interface DistributeProfitPayload {
  totalProfit: number;
}

export interface InvestmentCycle {
  id: string;
  name?: string;
  totalDeposit: number;
  totalProfit: number;
  isInvested: boolean;
  distributed: boolean;
  startDate: string;
  endDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

export const investmentService = {
  createInvestment: async (token: string, payload: CycleCreatePayload) => {
    setAuthToken(token);
    const { data } = await api.post<{ data: InvestmentCycle }>("/investment-cycle", payload);
    return data?.data;
  },

  getAllCycles: async (token: string) => {
    setAuthToken(token);
    const { data } = await api.get<{ data: InvestmentCycle[] }>("/investment-cycle");
    return data?.data || [];
  },

  getCycleById: async (token: string, id: string) => {
    setAuthToken(token);
    const { data } = await api.get<{ data: InvestmentCycle }>(`/investment-cycle/${id}`);
    return data?.data;
  },

  updateCycle: async (token: string, id: string, payload: CycleUpdatePayload) => {
    setAuthToken(token);
    const { data } = await api.patch<{ data: InvestmentCycle }>(
      `/investment-cycle/update/${id}`,
      payload
    );
    return data?.data;
  },

  deleteCycle: async (token: string, id: string) => {
    setAuthToken(token);
    await api.delete(`/investment-cycle/${id}`);
    return true;
  },

  markAsInvested: async (token: string, id: string) => {
    setAuthToken(token);
    const { data } = await api.patch<{ data: InvestmentCycle }>(
      `/investment-cycle/mark-invested/${id}`
    );
    return data?.data;
  },

  distributeProfit: async (token: string, id: string, payload: DistributeProfitPayload) => {
    setAuthToken(token);
    const { data } = await api.post<{ data: InvestmentCycle }>(
      `/investment-cycle/distribute/${id}`,
      payload
    );
    return data?.data;
  },

  assignPaidPayments: async (token: string, id: string) => {
    setAuthToken(token);
    const { data } = await api.post<{ data: { message: string; count: number } }>(
      `/investment-cycle/assign-paid/${id}`
    );
    return data?.data;
  },
};