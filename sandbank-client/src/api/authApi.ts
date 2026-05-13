import axiosInstance from "./axiosInstance";

export const getMyProfile = () => axiosInstance.get("/users/me");

export const updateMyProfile = (data: { username?: string; email?: string }) =>
  axiosInstance.put("/users/me", data);

export const updateMyPassword = (data: {
  current_password: string;
  new_password: string;
}) => axiosInstance.put("/users/me/password", data);
