import axiosClient from "../lib/axiosClient";

export type LoginResponse = {
  accessToken: string;
};

const userService = {
  login: async (
    username: string,
    password: string
  ): Promise<LoginResponse> => {
    try {
      const res = await axiosClient.post<LoginResponse>("users/login", {
        username,
        password,
      });
      return res.data;
    } catch (error) {
      console.error("❌ Error logging in:", error);
      throw error;
    }
  },

  getUserById: async (id: string): Promise<LoginResponse> => {
    try {
      const res = await axiosClient.get<LoginResponse>(`/users/${id}`);
      return res.data;
    } catch (error) {
      console.error("❌ Error fetching profile:", error);
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    try {
      localStorage.removeItem("token");
    } catch (error) {
      console.error("❌ Error logging out:", error);
      throw error;
    }
  },
};

export default userService;
