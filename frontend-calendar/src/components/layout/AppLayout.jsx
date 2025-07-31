/** @jsxImportSource @emotion/react */
import { useState, useEffect } from 'react';
import { ThemeProvider, Global, css } from '@emotion/react';
import styled from '@emotion/styled';
import { lightTheme, darkTheme, saveThemePreference, getThemePreference } from '../../theme';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useMediaQuery } from '../../hooks/useMediaQuery';

const LayoutWrapper = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: ${({ theme }) => theme.colors.background};
  position: relative;
  overflow: hidden;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: margin-left 0.3s ease;
`;

const ContentWrapper = styled.main`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  position: relative;
`;

export default function AppLayout({ children }) {
  // Obtener preferencia de tema guardada o usar 'light' por defecto
  const [mode, setMode] = useState(() => getThemePreference());
  const currentTheme = mode === 'light' ? lightTheme : darkTheme;
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  // Actualizar estado del sidebar cuando cambia el tamaño de pantalla
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    saveThemePreference(newMode);
  };

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <ThemeProvider theme={currentTheme}>
      <Global
        styles={css`
          @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap');
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: ${currentTheme.fonts.body};
            background-color: ${currentTheme.colors.background};
            color: ${currentTheme.colors.text};
            transition: background-color 0.3s ease, color 0.3s ease;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          
          h1, h2, h3, h4, h5, h6 {
            font-family: ${currentTheme.fonts.heading};
            font-weight: 600;
          }
        `}
      />
      <LayoutWrapper>
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <MainContent>
          <Topbar 
            toggleTheme={toggleTheme} 
            mode={mode} 
            toggleSidebar={toggleSidebar}
            sidebarOpen={sidebarOpen}
          />
          <ContentWrapper>
            {children}
          </ContentWrapper>
        </MainContent>
      </LayoutWrapper>
    </ThemeProvider>
  );
}
