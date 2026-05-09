import axiosInstance from "./axiosInstance";

export type CreditPack = "starter" | "standard" | "pro";

export const createCheckout = (pack: CreditPack) =>
  axiosInstance.post<{ checkout_url: string }>("/payments/checkout", { pack });

export const getMyPayments = () =>
  axiosInstance.get("/payments/me");