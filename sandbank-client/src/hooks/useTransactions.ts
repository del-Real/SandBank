import { useState, useEffect } from "react";
import {
  getMyTransactions,
  getMyBalance,
  type Transaction,
} from "../api/transactionsApi";

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([getMyTransactions(), getMyBalance()])
      .then(([txRes, balRes]) => {
        setTransactions(txRes.data);
        setBalance(balRes.data.balance);
      })
      .finally(() => setLoading(false));
  }, []);

  return { transactions, balance, loading };
}
