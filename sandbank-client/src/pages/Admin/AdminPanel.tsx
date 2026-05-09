import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  getAdminStats, getAdminUsers, setUserActive, setUserRole,
  getAdminActivities, setActivityVisible, deleteActivity,
  getAdminTransactions, getAdminRatings, deleteRating
} from "../../api/adminApi";

type Tab = "stats" | "users" | "activities" | "transactions" | "ratings";

export function AdminPanel() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("stats");
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [ratings, setRatings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.role !== "Admin") navigate("/");
  }, [user]);

  useEffect(() => { loadTab(tab); }, [tab]);

  const loadTab = async (t: Tab) => {
    setLoading(true);
    try {
      if (t === "stats") {
        const res = await getAdminStats();
        setStats(res.data);
      } else if (t === "users") {
        const res = await getAdminUsers();
        setUsers(res.data);
      } else if (t === "activities") {
        const res = await getAdminActivities();
        setActivities(res.data);
      } else if (t === "transactions") {
        const res = await getAdminTransactions();
        setTransactions(res.data);
      } else if (t === "ratings") {
        const res = await getAdminRatings();
        setRatings(res.data);
      }
    } catch {
      alert("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleSetActive = async (id: number, is_active: boolean) => {
    await setUserActive(id, is_active);
    setUsers(prev => prev.map(u => u.id === id ? { ...u, is_active } : u));
  };

  const handleSetRole = async (id: number, role: string) => {
    await setUserRole(id, role);
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
  };

  const handleSetVisible = async (id: number, is_visible: boolean) => {
    await setActivityVisible(id, is_visible);
    setActivities(prev => prev.map(a => a.id === id ? { ...a, is_visible } : a));
  };

  const handleDeleteActivity = async (id: number) => {
    if (!confirm("Delete this activity permanently?")) return;
    await deleteActivity(id);
    setActivities(prev => prev.filter(a => a.id !== id));
  };

  const handleDeleteRating = async (id: number) => {
    if (!confirm("Delete this review?")) return;
    await deleteRating(id);
    setRatings(prev => prev.filter(r => r.id !== id));
  };

  return (
    <>
      <h3>Admin Panel</h3>
      <hr />

      <div className="admin-tabs">
        {(["stats", "users", "activities", "transactions", "ratings"] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={tab === t ? "admin-tab active" : "admin-tab"}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {loading && <p>Loading...</p>}

      {/* ── Stats ── */}
      {tab === "stats" && stats && (
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <p className="stat-value">{stats.total_users}</p>
            <p className="stat-label">Total Users</p>
          </div>
          <div className="admin-stat-card">
            <p className="stat-value">{stats.active_users}</p>
            <p className="stat-label">Active Users</p>
          </div>
          <div className="admin-stat-card">
            <p className="stat-value">{stats.total_activities}</p>
            <p className="stat-label">Total Activities</p>
          </div>
          <div className="admin-stat-card">
            <p className="stat-value">{stats.visible_activities}</p>
            <p className="stat-label">Visible Activities</p>
          </div>
          <div className="admin-stat-card">
            <p className="stat-value">{stats.total_transactions}</p>
            <p className="stat-label">Transactions</p>
          </div>
          <div className="admin-stat-card">
            <p className="stat-value">{stats.total_credits_in_circulation}</p>
            <p className="stat-label">Credits in Circulation</p>
          </div>
          <div className="admin-stat-card">
            <p className="stat-value">{stats.total_payments}</p>
            <p className="stat-label">Completed Payments</p>
          </div>
        </div>
      )}

      {/* ── Users ── */}
      {tab === "users" && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Balance</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>
                    <select
                      value={u.role}
                      onChange={e => handleSetRole(u.id, e.target.value)}
                    >
                      <option value="User">User</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </td>
                  <td>{u.balance}</td>
                  <td style={{ color: u.is_active ? "green" : "red" }}>
                    {u.is_active ? "Active" : "Inactive"}
                  </td>
                  <td>
                    <button onClick={() => handleSetActive(u.id, !u.is_active)}>
                      {u.is_active ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Activities ── */}
      {tab === "activities" && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Owner</th>
                <th>Duration</th>
                <th>Visible</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {activities.map(a => (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td>{a.title}</td>
                  <td>#{a.owner_id}</td>
                  <td>{a.duration}h</td>
                  <td style={{ color: a.is_visible ? "green" : "red" }}>
                    {a.is_visible ? "Visible" : "Hidden"}
                  </td>
                  <td className="admin-actions">
                    <button onClick={() => handleSetVisible(a.id, !a.is_visible)}>
                      {a.is_visible ? "Hide" : "Show"}
                    </button>
                    <button
                      onClick={() => handleDeleteActivity(a.id)}
                      style={{ color: "red" }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Transactions ── */}
      {tab === "transactions" && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>From</th>
                <th>To</th>
                <th>Amount</th>
                <th>Description</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(t => (
                <tr key={t.id}>
                  <td>{t.id}</td>
                  <td>#{t.sender_id}</td>
                  <td>#{t.receiver_id}</td>
                  <td>{t.amount} credits</td>
                  <td>{t.description}</td>
                  <td>{new Date(t.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Ratings ── */}
      {tab === "ratings" && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Request</th>
                <th>Reviewer</th>
                <th>Reviewee</th>
                <th>Stars</th>
                <th>Review</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ratings.map(r => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>#{r.service_request_id}</td>
                  <td>#{r.reviewer_id}</td>
                  <td>#{r.reviewee_id}</td>
                  <td>
                    {"★".repeat(r.stars)}
                    {"☆".repeat(5 - r.stars)}
                  </td>
                  <td>{r.review || <em style={{ color: "#aaa" }}>no review</em>}</td>
                  <td>{new Date(r.created_at).toLocaleDateString()}</td>
                  <td>
                    <button
                      onClick={() => handleDeleteRating(r.id)}
                      style={{ color: "red" }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}