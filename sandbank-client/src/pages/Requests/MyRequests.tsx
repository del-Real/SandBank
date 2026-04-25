import { useState, useEffect } from "react";
import {
  getMyRequests,
  cancelRequest,
  type ServiceRequest,
} from "../../api/requestsApi";

export function MyRequests() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getMyRequests()
      .then((res) => setRequests(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id: number) => {
    try {
      const res = await cancelRequest(id);
      setRequests((prev) => prev.map((r) => (r.id === id ? res.data : r)));
    } catch {
      alert("Failed to cancel request");
    }
  };

  return (
    <>
      <h3>My Requests</h3>
      <hr />
      {loading && <p>Loading...</p>}
      {requests.length === 0 && !loading && <p>No requests yet.</p>}
      <div className="requests-list">
        {requests.map((r) => (
          <div key={r.id} className="request-card">
            <p>Activity #{r.activity_id}</p>
            <p>
              Status: <strong>{r.status}</strong>
            </p>
            <p>Requested: {new Date(r.created_at).toLocaleDateString()}</p>
            {r.status === "pending" && (
              <button onClick={() => handleCancel(r.id)}>Cancel</button>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
