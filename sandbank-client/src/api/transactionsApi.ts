import axiosInstance from "./axiosInstance";

export interface Transaction {
  id: number;
  sender_id: number;
  receiver_id: number;
  amount: number;
  description: string;
  service_request_id: number | null;
  created_at: string;
}

export const getMyTransactions = () =>
  axiosInstance.get<Transaction[]>("/transactions/me");

export const getMyBalance = () =>
  axiosInstance.get<{ balance: number }>("/users/me/balance");
