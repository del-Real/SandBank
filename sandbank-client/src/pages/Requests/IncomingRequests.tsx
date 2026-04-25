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
      <h3>Incoming Requests</h3>
      <hr />
      {loading && <p>Loading...</p>}
      {requests.length === 0 && !loading && <p>No incoming requests.</p>}
      <div className="requests-list">
        {requests.map((r) => (
          <div key={r.id} className="request-card">
            <p>Activity #{r.activity_id}</p>
            <p>From user #{r.requester_id}</p>
            <p>
              Status: <strong>{r.status}</strong>
            </p>
            <p>Date: {new Date(r.created_at).toLocaleDateString()}</p>
            {r.status === "pending" && (
              <div>
                <button onClick={() => handleAccept(r.id)}>Accept</button>
                <button onClick={() => handleReject(r.id)}>Reject</button>
              </div>
            )}
            {r.status === "accepted" && (
              <button onClick={() => handleComplete(r.id)}>Complete</button>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
