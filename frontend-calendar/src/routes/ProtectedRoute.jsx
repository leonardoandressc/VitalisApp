import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null; // o spinner
  return user ? children : <Navigate to="/login" replace />;
}
