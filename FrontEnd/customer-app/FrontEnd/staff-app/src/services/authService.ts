import axiosClient from "../api/axiosClient";
import endpoints from "../api/endpoints";

export const login = (username: string, password: string) => {
  return axiosClient.post(endpoints.auth.login, { username, password });
};

export const register = (email: string, password: string) => {
  return axiosClient.post(endpoints.auth.register, { email, password });
};

export const getProfile = (id: number) => {
  return axiosClient.get(endpoints.auth.profile(id));
};
