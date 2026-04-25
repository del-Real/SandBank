import { useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/auth/register", {
        email,
        username,
        password,
      });
      login(response.data.token, {
        id: response.data.id,
        username: response.data.username,
        email: response.data.email,
        expiresAt: response.data.expires_at,
        role: response.data.role,
      });
      // redirect to home after login
      navigate("/");
    } catch (error: any) {
      console.error("Registration failed", error.response?.data);
    }
  };

  return (
    <div className="user-register-card">
      <form onSubmit={handleSubmit} className="user-register-form">
        <label>Email</label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Sign up</button>
      </form>
    </div>
  );
}
