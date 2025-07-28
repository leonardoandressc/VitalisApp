/** @jsxImportSource @emotion/react */
import { useState } from "react";
import { ThemeProvider, Global, css } from "@emotion/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lightTheme, darkTheme } from "./theme";
import ThemeToggle from "./components/ThemeToggle";
import Login from "./components/Login";
import Register from "./routes/Register"; // << nueva ruta
/*
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
      <ThemeToggle isDark={isDark} toggle={() => setIsDark(!isDark)} />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
*/

// App.jsx o main router
import { Routes, Route } from 'react-router-dom';
import CalendarView from './routes/CalendarView';
import AppLayout from './components/layout/AppLayout';
// otras rutas...

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        {/* Otras rutas */}
        <Route path="/calendario" element={<CalendarView />} />
      </Route>
    </Routes>
  );
}