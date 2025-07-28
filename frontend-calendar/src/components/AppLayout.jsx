// AppLayout.jsx
import { useState } from "react";
import { ThemeProvider } from "@emotion/react";
import { lightTheme, darkTheme } from "../theme";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Calendar from "./Calendar"; // Importa el componente
import styled from "@emotion/styled";

// Estilos (asegúrate de que ContentWrapper permita scroll)
const LayoutWrapper = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* Evita desbordamiento */
`;

const ContentWrapper = styled.main`
  flex: 1;
  padding: 1rem;
  overflow-y: auto; /* Scroll vertical si el calendario es largo */
  background: ${({ theme }) => theme.colors.background};
`;

export default function AppLayout() {
  const [mode, setMode] = useState("light");
  const currentTheme = mode === "light" ? lightTheme : darkTheme;

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeProvider theme={currentTheme}>
      <LayoutWrapper>
        <Sidebar />
        <MainContent>
          <Topbar toggleTheme={toggleTheme} mode={mode} />
          <ContentWrapper>
            <Calendar /> {/* ¡Aquí se integra el calendario! */}
          </ContentWrapper>
        </MainContent>
      </LayoutWrapper>
    </ThemeProvider>
  );
}