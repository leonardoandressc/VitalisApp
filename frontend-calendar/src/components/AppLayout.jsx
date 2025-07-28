/** @jsxImportSource @emotion/react */
import { useState } from 'react';
import { ThemeProvider } from '@emotion/react';
import styled from '@emotion/styled';
import { lightTheme, darkTheme } from '../theme';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Calendar from './calendar/Calendar'; // Importamos el componente externo

// Estilos del Layout (se mantienen igual)
const LayoutWrapper = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  position: fixed;
  background-color: ${({ theme }) => theme.colors.background};
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ContentWrapper = styled.main`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
`;

export default function AppLayout() {
  const [mode, setMode] = useState('light');
  const currentTheme = mode === 'light' ? lightTheme : darkTheme;

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={currentTheme}>
      <LayoutWrapper>
        <Sidebar />
        <MainContent>
          <Topbar toggleTheme={toggleTheme} mode={mode} />
          <ContentWrapper>
            {/* Aquí se integra el componente Calendar */}
            <Calendar />
          </ContentWrapper>
        </MainContent>
      </LayoutWrapper>
    </ThemeProvider>
  );
}