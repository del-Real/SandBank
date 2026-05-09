import axiosInstance from "./axiosInstance";

export const getAdminStats = () =>
  axiosInstance.get("/admin/stats");

export const getAdminUsers = () =>
  axiosInstance.get("/admin/users");

export const setUserActive = (id: number, is_active: boolean) =>
  axiosInstance.put(`/admin/users/${id}/active`, { is_active });

export const setUserRole = (id: number, role: string) =>
  axiosInstance.put(`/admin/users/${id}/role`, { role });

export const getAdminActivities = () =>
  axiosInstance.get("/admin/activities");

export const setActivityVisible = (id: number, is_visible: boolean) =>
  axiosInstance.put(`/admin/activities/${id}/visible`, { is_visible });

export const deleteActivity = (id: number) =>
  axiosInstance.delete(`/admin/activities/${id}`);

export const getAdminTransactions = () =>
  axiosInstance.get("/admin/transactions");