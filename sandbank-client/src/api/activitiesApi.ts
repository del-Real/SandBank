import axiosInstance from "./axiosInstance";

// types
export interface Activity {
  id: number;
  title: string;
  description: string;
  duration: number;
  start_date: string;
  created_at: string;
  owner_id: number;
}

export interface CreateActivityData {
  title: string;
  description: string;
  duration: number;
  start_date: string;
}

// calls
export const getActivities = (filters?: {
  title?: string;
  max_duration?: number;
}) => axiosInstance.get<Activity[]>("/activities/", { params: filters });

export const getActivity = (id: number) =>
  axiosInstance.get<Activity>(`/activities/${id}`);

export const createActivity = (data: CreateActivityData) =>
  axiosInstance.post<Activity>("/activities/", data);

export const updateActivity = (id: number, data: Partial<CreateActivityData>) =>
  axiosInstance.put<Activity>(`/activities/${id}`, data);

export const deleteActivity = (id: number) =>
  axiosInstance.delete(`/activities/${id}`);
