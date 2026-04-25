import { useState, useEffect } from "react";
import {
  getMyTransactions,
  getMyBalance,
  type Transaction,
} from "../../api/transactionsApi";
import { useAuth } from "../../context/AuthContext";

export function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    Promise.all([getMyTransactions(), getMyBalance()])
      .then(([txRes, balRes]) => {
        setTransactions(txRes.data);
        setBalance(balRes.data.balance);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <h3>Transaction History</h3>
      <hr />
      <p>
        Balance: <strong>{balance} credits</strong>
      </p>
      {loading && <p>Loading...</p>}
      {transactions.length === 0 && !loading && <p>No transactions yet.</p>}
      <div className="requests-list">
        {transactions.map((tx) => {
          const isSender = tx.sender_id === user?.id;
          return (
            <div key={tx.id} className="request-card">
              <p style={{ color: isSender ? "red" : "green" }}>
                {isSender ? `- ${tx.amount}` : `+ ${tx.amount}`} credits
              </p>
              <p>{tx.description}</p>
              <p>{new Date(tx.created_at).toLocaleDateString()}</p>
            </div>
          );
        })}
      </div>
    </>
  );
}
