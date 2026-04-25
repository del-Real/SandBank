// src/components/ProtectedRoute.tsx
import { Navigate, Route } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { ReactNode } from "react";
import { ActivitiesList } from "../pages/Activities/ActivitiesList";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

// usage in App.tsx
<Route
  path="/activities"
  element={
    <ProtectedRoute>
      <ActivitiesList />
    </ProtectedRoute>
  }
/>;
