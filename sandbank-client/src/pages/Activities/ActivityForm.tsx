import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createActivity,
  getActivity,
  updateActivity,
} from "../../api/activitiesApi";

export function ActivityForm() {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [startDate, setStartDate] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditing) return;
    getActivity(parseInt(id!)).then((res) => {
      setTitle(res.data.title);
      setDescription(res.data.description);
      setDuration(String(res.data.duration));
      setStartDate(res.data.start_date.slice(0, 16)); // format for datetime-local input
    });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const data = {
      title,
      description,
      duration: parseInt(duration),
      start_date: new Date(startDate).toISOString(),
    };
    try {
      if (isEditing) {
        await updateActivity(parseInt(id!), data);
      } else {
        await createActivity(data);
      }
      navigate("/activities");
    } catch {
      setError("Failed to save activity");
    }
  };

  return (
    <div className="user-register-card">
      <form onSubmit={handleSubmit} className="user-register-form">
        <h3>{isEditing ? "Edit Activity" : "New Activity"}</h3>

        <label>Title</label>
        <input
          value={title}
          placeholder="What do you offer?"
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label>Description</label>
        <textarea
          value={description}
          placeholder="Describe the activity..."
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <label>Price (tokens)</label>
        <input
          type="number"
          min="1"
          placeholder="e.g. 2"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
        />

        <label>Start Date</label>
        <input
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />

        {error && <p className="error">{error}</p>}
        <button type="submit">
          {isEditing ? "Save Changes" : "Create Activity"}
        </button>
        <button
          type="button"
          className="secondary"
          onClick={() => navigate("/activities")}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
