import { useState, useEffect } from "react";
import { getMyRequests, cancelRequest, type ServiceRequest } from "../../api/requestsApi";
import { createRating } from "../../api/ratingsApi";

export function MyRequests() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [ratingForm, setRatingForm] = useState<{ [key: number]: { stars: number; review: string } }>({});
  const [rated, setRated] = useState<number[]>([]);

  useEffect(() => {
    setLoading(true);
    getMyRequests()
      .then(res => setRequests(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id: number) => {
    try {
      const res = await cancelRequest(id);
      setRequests(prev => prev.map(r => r.id === id ? res.data : r));
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
      setRated(prev => [...prev, requestId]);
      alert("Rating submitted!");
    } catch (e: any) {
      alert(e.response?.data?.detail || "Failed to submit rating");
    }
  };

  return (
    <>
      <h3>My Requests</h3>
      <hr />
      {loading && <p>Loading...</p>}
      {requests.length === 0 && !loading && <p>No requests yet.</p>}
      <div className="requests-list">
        {requests.map(r => (
          <div key={r.id} className="request-card">
            <p>Activity #{r.activity_id}</p>
            <p>Status: <strong>{r.status}</strong></p>
            <p>Requested: {new Date(r.created_at).toLocaleDateString()}</p>

            {r.status === "pending" && (
              <button onClick={() => handleCancel(r.id)}>Cancel</button>
            )}

            {r.status === "completed" && !rated.includes(r.id) && (
              <div className="rating-form">
                <p><strong>Rate this service:</strong></p>
                <div className="stars-input">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => setRatingForm(prev => ({
                        ...prev,
                        [r.id]: { ...prev[r.id], stars: star, review: prev[r.id]?.review || "" }
                      }))}
                      style={{
                        color: ratingForm[r.id]?.stars >= star ? "gold" : "gray",
                        background: "none", border: "none", fontSize: "1.4rem", cursor: "pointer"
                      }}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <textarea
                  placeholder="Leave a review (optional)"
                  value={ratingForm[r.id]?.review || ""}
                  onChange={e => setRatingForm(prev => ({
                    ...prev,
                    [r.id]: { ...prev[r.id], review: e.target.value }
                  }))}
                  rows={2}
                  style={{ width: "100%", marginTop: "0.4rem" }}
                />
                <button onClick={() => handleRate(r.id)} style={{ marginTop: "0.4rem" }}>
                  Submit Rating
                </button>
              </div>
            )}

            {rated.includes(r.id) && (
              <p style={{ color: "green" }}>✓ Rated</p>
            )}
          </div>
        ))}
      </div>
    </>
  );
}