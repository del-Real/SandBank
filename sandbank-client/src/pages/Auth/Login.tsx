import { useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      login(response.data.token, {
        id: response.data.id,
        username: response.data.username,
        email: response.data.email,
        expiresAt: response.data.expiresAt,
        role: response.data.role,
      });
      // redirect to home after login
      navigate("/");
    } catch (error: any) {
      setError("Invalid email or password");
      console.error("Login failed", error.response?.data);
    }
  };

  return (
    <div className="user-login-card">
      <form onSubmit={handleSubmit} className="user-login-form">
        <h3>Log in</h3>
        <label>Email</label>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Password</label>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Log in</button>
      </form>
    </div>
  );
}
