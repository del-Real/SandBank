import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  getMyRequests,
  cancelRequest,
  type ServiceRequest,
} from "../../api/requestsApi";
import { createRating } from "../../api/ratingsApi";

export function MyRequests() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [ratingForm, setRatingForm] = useState<{
    [key: number]: { stars: number; review: string };
  }>({});
  const [rated, setRated] = useState<number[]>([]);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

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

  const handleRate = async (requestId: number) => {
    const form = ratingForm[requestId];
    if (!form?.stars) return alert("Pick a star rating first");
    try {
      await createRating({
        service_request_id: requestId,
        stars: form.stars,
        review: form.review || undefined,
      });
      setRated((prev) => [...prev, requestId]);
      alert("Rating submitted!");
    } catch (e: any) {
      alert(e.response?.data?.detail || "Failed to submit rating");
    }
  };

  return (
    <>
      <div className="page-header">
        <h3>My Requests</h3>
        {isAuthenticated && (
          <button onClick={() => navigate("/requests/incoming")}>
            Incoming Requests
          </button>
        )}
      </div>
      {loading && <p className="loading">Loading...</p>}
      {requests.length === 0 && !loading && (
        <p className="empty-state">No requests yet.</p>
      )}
      <div className="requests-list">
        {requests.map((r) => (
          <div key={r.id} className="request-card">
            <p>
              <strong>Activity #{r.activity_id}</strong>
            </p>
            <p>
              Status:{" "}
              <span className={`badge badge-${r.status}`}>{r.status}</span>
            </p>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              {new Date(r.created_at).toLocaleDateString()}
            </p>

            {r.status === "pending" && (
              <button className="secondary" onClick={() => handleCancel(r.id)}>
                Cancel
              </button>
            )}

            {r.status === "completed" && !rated.includes(r.id) && (
              <div className="rating-form">
                <p>
                  <strong>Rate this service:</strong>
                </p>
                <div className="stars-input">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() =>
                        setRatingForm((prev) => ({
                          ...prev,
                          [r.id]: {
                            ...prev[r.id],
                            stars: star,
                            review: prev[r.id]?.review || "",
                          },
                        }))
                      }
                      style={{
                        color:
                          ratingForm[r.id]?.stars >= star
                            ? "#f59e0b"
                            : "#d1d5db",
                        background: "none",
                        border: "none",
                        fontSize: "1.4rem",
                        cursor: "pointer",
                      }}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <textarea
                  placeholder="Leave a review (optional)"
                  value={ratingForm[r.id]?.review || ""}
                  onChange={(e) =>
                    setRatingForm((prev) => ({
                      ...prev,
                      [r.id]: { ...prev[r.id], review: e.target.value },
                    }))
                  }
                  rows={2}
                />
                <button className="success" onClick={() => handleRate(r.id)}>
                  Submit Rating
                </button>
              </div>
            )}

            {rated.includes(r.id) && (
              <p className="badge badge-completed">✓ Rated</p>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
