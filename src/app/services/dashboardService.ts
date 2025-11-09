import api, { setAuthToken } from "@/lib/api";

export const dashboardService = {
  getDashboardSummery: async (token: string) => {

    setAuthToken(token);

    const { data } = await api.get("/admin/dashboard/summary"); 
    return data?.data;
  },

  getAllUsers: async (token: string) => {

    setAuthToken(token);

    const { data } = await api.get("admin/dashboard/users"); 
    return data?.data;

  }
};
