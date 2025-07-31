/** @jsxImportSource @emotion/react */
import { useState } from "react";
import { ThemeProvider, Global, css } from "@emotion/react";
import { Routes, Route, Navigate } from 'react-router-dom';
import { lightTheme, darkTheme } from "./theme";
import AuthProvider from './auth/AuthContext';
import Login from "./components/Login";
import Register from "./routes/Register";
import EmailVerification from "./components/EmailVerification";
import CalendarPage from './components/calendar/CalendarPage';
import Dashboard from './components/Dashboard';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  const [isDark, setIsDark] = useState(true);
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <Global
        styles={css`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: ${theme.fonts.body};
          }
          body {
            background-color: ${theme.colors.background};
            color: ${theme.colors.text};
            transition: background-color 0.3s ease, color 0.3s ease;
          }
        `}
      />
      <AuthProvider>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<EmailVerification />} />
          
          {/* Rutas protegidas */}
          <Route path="/" element={
            <ProtectedRoute>
              <AppLayout>
                <Navigate to="/dashboard" replace />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/calendar" element={
            <ProtectedRoute>
              <AppLayout>
                <CalendarPage />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/patients" element={
            <ProtectedRoute>
              <AppLayout>
                <div>Pacientes - En desarrollo</div>
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/medical-records" element={
            <ProtectedRoute>
              <AppLayout>
                <div>Historiales Médicos - En desarrollo</div>
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/treatments" element={
            <ProtectedRoute>
              <AppLayout>
                <div>Tratamientos - En desarrollo</div>
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/billing" element={
            <ProtectedRoute>
              <AppLayout>
                <div>Facturación - En desarrollo</div>
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/settings" element={
            <ProtectedRoute>
              <AppLayout>
                <div>Configuración - En desarrollo</div>
              </AppLayout>
            </ProtectedRoute>
          } />
          
          {/* Ruta por defecto */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
