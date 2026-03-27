export function Home() {
  return (
    <div>
      <h2 className="home-title">Your time is the most valuable currency</h2>
      <a href="/register">Register</a>
      &ensp; / &ensp;
      <a href="/login">Login</a>
      <h3>Activities</h3>
      <hr />
      <div className="activities-grid">
        <div className="activity-card"></div>
        <div className="activity-card"></div>
        <div className="activity-card"></div>
        <div className="activity-card"></div>
        <div className="activity-card"></div>
        <div className="activity-card"></div>
        <div className="activity-card"></div>
        <div className="activity-card"></div>
        <div className="activity-card"></div>
        <div className="activity-card"></div>
        <div className="activity-card"></div>
        <div className="activity-card"></div>
      </div>
    </div>
  );
}
