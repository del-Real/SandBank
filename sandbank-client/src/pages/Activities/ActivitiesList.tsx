import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  getActivities,
  deleteActivity,
  type Activity,
} from "../../api/activitiesApi";
import { createRequest } from "../../api/requestsApi";

export function ActivitiesList() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [titleFilter, setTitleFilter] = useState("");
  const [durationFilter, setDurationFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const res = await getActivities({
        title: titleFilter || undefined,
        max_duration: durationFilter ? parseInt(durationFilter) : undefined,
      });
      setActivities(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleRequest = async (activityId: number) => {
    try {
      await createRequest(activityId);
      alert("Request sent!");
    } catch {
      alert("Failed to send request");
    }
  };

  const handleDelete = async (activityId: number) => {
    if (!confirm("Delete this activity?")) return;
    try {
      await deleteActivity(activityId);
      setActivities((prev) => prev.filter((a) => a.id !== activityId));
    } catch {
      alert("Failed to delete");
    }
  };

  return (
    <>
      <h3>Activities</h3>
      <hr />

      <div className="filters">
        <input
          placeholder="Search by title"
          value={titleFilter}
          onChange={(e) => setTitleFilter(e.target.value)}
        />
        <input
          placeholder="Max duration (hours)"
          type="number"
          value={durationFilter}
          onChange={(e) => setDurationFilter(e.target.value)}
        />
        <button onClick={fetchActivities}>Search</button>
        {isAuthenticated && (
          <button onClick={() => navigate("/activities/new")}>
            + New Activity
          </button>
        )}
      </div>

      {loading && <p>Loading...</p>}

      <div className="activities-grid">
        {activities.map((activity) => (
          <div key={activity.id} className="activity-card">
            <h4>{activity.title}</h4>
            <p>{activity.description}</p>
            <p>{activity.duration}h</p>

            {isAuthenticated && activity.owner_id === user?.id ? (
              <div>
                <button
                  onClick={() => navigate(`/activities/${activity.id}/edit`)}
                >
                  Edit
                </button>
                <button onClick={() => handleDelete(activity.id)}>
                  Delete
                </button>
              </div>
            ) : isAuthenticated ? (
              <button onClick={() => handleRequest(activity.id)}>
                Request
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </>
  );
}
