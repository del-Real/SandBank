import axiosInstance from "./axiosInstance";

export interface ServiceRequest {
  id: number;
  activity_id: number;
  requester_id: number;
  status: "pending" | "accepted" | "rejected" | "cancelled" | "completed";
  created_at: string;
}

export const createRequest = (activity_id: number) =>
  axiosInstance.post<ServiceRequest>("/requests/", { activity_id });

export const getMyRequests = () =>
  axiosInstance.get<ServiceRequest[]>("/requests/me");

export const getIncomingRequests = () =>
  axiosInstance.get<ServiceRequest[]>("/requests/incoming");

export const acceptRequest = (id: number) =>
  axiosInstance.put<ServiceRequest>(`/requests/${id}/accept`);

export const rejectRequest = (id: number) =>
  axiosInstance.put<ServiceRequest>(`/requests/${id}/reject`);

export const cancelRequest = (id: number) =>
  axiosInstance.put<ServiceRequest>(`/requests/${id}/cancel`);

export const completeRequest = (id: number) =>
  axiosInstance.put<ServiceRequest>(`/requests/${id}/complete`);
