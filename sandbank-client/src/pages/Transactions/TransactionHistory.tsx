import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

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
      <div className="page-header">
        <h3>History</h3>
        <span
          style={{
            fontSize: "1.2rem",
            fontWeight: 500,
            color: "var(--text-h)",
          }}
        >
          Balance: {balance} credits
        </span>
        {isAuthenticated && (
          <button onClick={() => navigate("/credits")}>
            Buy ⧗ Time Tokens
          </button>
        )}
      </div>

      {loading && <p className="loading">Loading...</p>}
      {transactions.length === 0 && !loading && (
        <p className="empty-state">No transactions yet.</p>
      )}

      <div className="requests-list">
        {transactions.map((tx) => {
          const isIncoming = tx.description.toLowerCase().includes("top-up");

          return (
            <div key={tx.id} className="request-card">
              <p
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  color: isIncoming ? "var(--success)" : "var(--danger)",
                }}
              >
                {isIncoming ? `+ ${tx.amount}` : `- ${tx.amount}`} credits
              </p>
              <p>{tx.description}</p>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                {new Date(tx.created_at).toLocaleDateString()}
              </p>
            </div>
          );
        })}
      </div>
    </>
  );
}
