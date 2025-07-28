/** @jsxImportSource @emotion/react */
import { useState } from "react";
import styled from "@emotion/styled";
import { css } from '@emotion/react';
import { ThemeProvider } from "@emotion/react";
import { lightTheme, darkTheme } from "../theme";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const LayoutWrapper = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
  position: fixed; /* ¡Clave! */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme }) => theme.colors.background};
`

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
`

const ContentWrapper = styled.main`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  box-sizing: border-box;
  /* Fuerza hardware acceleration */
  transform: translateZ(0);
  `

export default function AppLayout({ children }) {
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
          <ContentWrapper>{children}</ContentWrapper>
        </MainContent>
      </LayoutWrapper>
    </ThemeProvider>
  );
}
