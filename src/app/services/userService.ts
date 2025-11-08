import api, { setAuthToken } from "@/lib/api";

export const userService = {
  getMe: async (token: string) => {

    setAuthToken(token);

    const { data } = await api.get("/users/me"); 
    return data?.data;
  },

  updatePhoto: async (token: string, image: string) => {

    setAuthToken(token);

    const { data } = await api.patch("/users/me/uploads-profile-photo", { image }); 
    return data?.data;
  },

  getAllUsers: async (token: string) => { 

    setAuthToken(token);

    const { data } = await api.get("/users"); 
    return data?.data;
  }

};
