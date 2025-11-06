import axios from "@/lib/api";

interface RegisterPayload {
  name: string;
  fatherName: string; 
  phone: string;
  email: string;
  password: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface VerifyOtpPayload {
  userId: string;
  otpCode: string;
  type: string;
}

interface ResendOtpPayload {
  userId: string;
  email: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://neo-market-server.vercel.app/api/v1";

export const authService = {

  registerUser: async (payload: RegisterPayload) => {
    const { data } = await axios.post(`${BASE_URL}/auth/create-account`, payload);
    return data;
  },


  loginUser: async (payload: LoginPayload) => {
    const { data } = await axios.post(`${BASE_URL}/auth/login`, payload);
    return data;
  },

  verifyOtp: async (payload: VerifyOtpPayload) => {
    const { data } = await axios.post(`${BASE_URL}/auth/email-verify`, payload);
    return data;
  },


  resendOtp: async (payload: ResendOtpPayload) => {
    const { data } = await axios.post(`${BASE_URL}/auth/resend-otp`, payload);
    return data;
  },

  forgotPassword: async (email: string) => {
    const { data } = await axios.post(`${BASE_URL}/auth/forgot-password`, { email });
    return data;
  },

  resetPassword: async (userId: string, newPassword: string) => {
    const { data } = await axios.post(`${BASE_URL}/auth/reset-password`, { userId, newPassword });
    return data;
  },

  changePassword: async (userId: string, oldPassword: string, newPassword: string) => {
    const { data } = await axios.post(`${BASE_URL}/auth/change-password`, { userId, oldPassword, newPassword });
    return data;
  },
};
