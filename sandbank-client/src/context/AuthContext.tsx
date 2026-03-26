import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

// User object shape
interface User {
  username: string;
  email: string;
  expiresAt: string;
}
interface AuthContextType {
  user: User | null; // current user (null if not logged in)
  token: string | null; // JWT token (null if not logged in)
  login: (token: string, user: User) => void; // call this after successful login
  logout: () => void; // call this to log out
  isAuthenticated: boolean; // convenient boolean to check if logged in
}

// Create context
const AuthContext = createContext<AuthContextType | null>(null);

// Provider (wraps the app and holds the actual state)
export function AuthProvider({ children }: { children: ReactNode }) {
  // Initialize from localStorage so user stays logged in on page refresh
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Called after successful login/register
  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  // Logout (clear everything)
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token, // true if token exists, false if null
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
