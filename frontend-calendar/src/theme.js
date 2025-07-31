export const lightTheme = {
  colors: {
    primary: '#1CD4C3',
    secondary: '#009688',
    background: '#FAFAF8',
    cardBackground: '#ffffff',
    text: '#263238',
    textSecondary: '#546E7A',
    textMuted: '#78909C',
    surface: '#ffffff',
    accent: '#B2DFDB',
    border: '#E0E0E0',
    error: '#F44336',
    success: '#4CAF50',
    warning: '#FFC107',
    info: '#2196F3',
    lightHover: 'rgba(178, 223, 219, 0.2)',
    backgroundAlt: '#F5F5F5',
    backgroundHover: '#EEEEEE',
  },
  mode: 'light',
  fonts: {
    heading: "'Sora', sans-serif",
    body: "'Roboto', sans-serif",
  },
  shadows: {
    small: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08)',
    medium: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
    large: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '12px',
    round: '50%',
  },
};

export const darkTheme = {
  colors: {
    primary: '#1CD4C3',
    secondary: '#009688',
    background: '#263238',
    cardBackground: '#2E3A40',
    text: '#FAFAF8',
    textSecondary: '#B0BEC5',
    textMuted: '#78909C',
    surface: '#37474F',
    accent: '#B2DFDB',
    border: '#455A64',
    error: '#EF5350',
    success: '#66BB6A',
    warning: '#FFCA28',
    info: '#42A5F5',
    lightHover: 'rgba(178, 223, 219, 0.15)',
    backgroundAlt: '#2E3A40',
    backgroundHover: '#3E4C54',
  },
  mode: 'dark',
  fonts: {
    heading: "'Sora', sans-serif",
    body: "'Roboto', sans-serif",
  },
  shadows: {
    small: '0 1px 3px rgba(0, 0, 0, 0.24), 0 1px 2px rgba(0, 0, 0, 0.16)',
    medium: '0 4px 6px rgba(0, 0, 0, 0.2), 0 2px 4px rgba(0, 0, 0, 0.12)',
    large: '0 10px 15px rgba(0, 0, 0, 0.2), 0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '12px',
    round: '50%',
  },
};

// Función para guardar el tema en localStorage
export const saveThemePreference = (mode) => {
  localStorage.setItem('themeMode', mode);
};

// Función para obtener el tema guardado en localStorage
export const getThemePreference = () => {
  return localStorage.getItem('themeMode') || 'light';
};
