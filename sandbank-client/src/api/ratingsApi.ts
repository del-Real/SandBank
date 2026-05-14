import axiosInstance from "./axiosInstance";

export interface Rating {
  id: number;
  service_request_id: number;
  reviewer_id: number;
  reviewee_id: number;
  stars: number;
  review: string | null;
  created_at: string;
}

export interface CreateRatingData {
  service_request_id: number;
  stars: number;
  review?: string;
}

export const createRating = (data: CreateRatingData) =>
  axiosInstance.post<Rating>("/ratings/", data);

export const getUserRatings = (userId: number) =>
  axiosInstance.get<Rating[]>(`/ratings/user/${userId}`);

export const getActivityRatings = (activityId: number) =>
  axiosInstance.get<Rating[]>(`/ratings/activity/${activityId}`);

export const getMyGivenRatings = () =>
  axiosInstance.get<Rating[]>("/ratings/me");