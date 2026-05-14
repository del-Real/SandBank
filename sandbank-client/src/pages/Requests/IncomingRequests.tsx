import { useState, useEffect } from "react";
import {
  getIncomingRequests,
  acceptRequest,
  rejectRequest,
  completeRequest,
  type ServiceRequest,
} from "../../api/requestsApi";

export function IncomingRequests() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getIncomingRequests()
      .then((res) => setRequests(res.data))
      .finally(() => setLoading(false));
  }, []);

  const updateRequest = (id: number, updated: ServiceRequest) =>
    setRequests((prev) => prev.map((r) => (r.id === id ? updated : r)));

  const handleAccept = async (id: number) => {
    try {
      const res = await acceptRequest(id);
      updateRequest(id, res.data);
    } catch (e: any) {
      alert(e.response?.data?.detail || "Failed to accept");
    }
  };

  const handleReject = async (id: number) => {
    try {
      const res = await rejectRequest(id);
      updateRequest(id, res.data);
    } catch {
      alert("Failed to reject");
    }
  };

  const handleComplete = async (id: number) => {
    try {
      const res = await completeRequest(id);
      updateRequest(id, res.data);
    } catch {
      alert("Failed to complete");
    }
  };

  return (
    <>
      <div className="page-header">
        <h3>Incoming Requests</h3>
      </div>
      {loading && <p className="loading">Loading...</p>}
      {requests.length === 0 && !loading && (
        <p className="empty-state">No incoming requests.</p>
      )}
      <div className="requests-list">
        {requests.map((r) => (
          <div key={r.id} className="request-card">
            <p>
              <strong>Activity #{r.activity_id}</strong>
            </p>
            <p>From user #{r.requester_id}</p>
            <p>
              Status:{" "}
              <span className={`badge badge-${r.status}`}>{r.status}</span>
            </p>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              {new Date(r.created_at).toLocaleDateString()}
            </p>
            {r.status === "pending" && (
              <div className="card-actions">
                <button className="success" onClick={() => handleAccept(r.id)}>
                  Accept
                </button>
                <button className="danger" onClick={() => handleReject(r.id)}>
                  Reject
                </button>
              </div>
            )}
            {r.status === "accepted" && (
              <button onClick={() => handleComplete(r.id)}>
                Mark Complete
              </button>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
