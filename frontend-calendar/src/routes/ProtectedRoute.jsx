import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import styled from "@emotion/styled";

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.text};
`;

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <LoadingContainer>
        Cargando...
      </LoadingContainer>
    );
  }
  
  // Si no hay usuario, redirigir al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Si el usuario no ha verificado su email, redirigir a verificación
  if (!user.is_verified) {
    return <Navigate to="/verify-email" replace />;
  }
  
  return children;
}
