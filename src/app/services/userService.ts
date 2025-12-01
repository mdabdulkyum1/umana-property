import api, { setAuthToken } from "@/lib/api";
import { IUser } from "@/types/user";
import { AxiosError } from "axios";

interface updatePayload {
  name: string;
  phone: string;
  email: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}





export const userService = {
   getMe: async (token: string | null | undefined): Promise<IUser | null> => {
    if (!token) return null;

    try {
      setAuthToken(token);

      const { data } = await api.get<ApiResponse<IUser>>("/users/me");

      return data?.data ?? null;
    } catch (err) {
      const error = err as AxiosError;

      if (error.response?.status === 401) {
        return null;
      }

      throw error;
    }
  },

  updatePhoto: async (token: string, image: string) => {
    setAuthToken(token);
    const { data } = await api.patch("/users/me/uploads-profile-photo", { image });
    return data?.data;
  },

  getAllUsers: async (token: string) => {
    setAuthToken(token);
    const { data } = await api.get("/users/all");
    return data?.data;
  },

  getUserById: async (token: string, id: string) => {
    setAuthToken(token);
    const { data } = await api.get(`/users/get-user-payment/${id}`);
    return data?.data;
  },

  updateUser: async (token: string, id: string, payload: updatePayload) => {
    setAuthToken(token);
    const { data } = await api.patch(`/users/update-user-by-admin/${id}`, payload);
    return data?.data;
  },

  makeLeader: async (token: string, id: string) => {
    setAuthToken(token);
    const { data } = await api.patch(`/users/make-leader/${id}`);
    return data?.data;
  },

  deleteUser: async (token: string, id: string) => {
    setAuthToken(token);
    const { data } = await api.delete(`/users/delete/${id}`);
    return data?.data;
  },
};
