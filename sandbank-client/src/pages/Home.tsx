import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getActivities, type Activity } from "../api/activitiesApi";

export function Home() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    getActivities({}).then((res) => setActivities(res.data.slice(0, 8)));
  }, []);

  return (
    <>
      <div className="home-hero">
        <h2>Your time is the most valuable currency</h2>
        <p>Teach & learn new skills</p>
      </div>

      <div className="page-header">
        <h3>Recent Activities</h3>
        <Link to="/activities">
          <button className="secondary">View all</button>
        </Link>
      </div>

      <div className="activities-grid">
        {activities.map((activity) => (
          <div key={activity.id} className="activity-card">
            <h4>{activity.title}</h4>
            <p>{activity.description}</p>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              {activity.duration}h
            </p>
          </div>
        ))}
        {activities.length === 0 && (
          <p className="empty-state">
            No activities yet. Be the first to post one!
          </p>
        )}
      </div>
    </>
  );
}
