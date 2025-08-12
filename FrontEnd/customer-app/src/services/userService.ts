import axiosClient from "../api/axiosClient";

export const userService = {
  register: (email: string, password: string) => {
    return axiosClient.post("/users/register", { email, password });
  },
  login: (username: string, password: string) => {
    return axiosClient.post("/users/login", { username, password });
  },
};
