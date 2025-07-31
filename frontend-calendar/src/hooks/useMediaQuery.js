import { useState, useEffect } from 'react';

/**
 * Hook personalizado para detectar si una media query coincide con el viewport actual
 * @param {string} query - La media query a evaluar (ej: '(max-width: 768px)')
 * @returns {boolean} - Retorna true si la media query coincide, false en caso contrario
 */
export const useMediaQuery = (query) => {
  // Inicializar con una evaluación inmediata si window está disponible
  const getMatches = () => {
    // Verificar si window está disponible (para SSR)
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  };

  const [matches, setMatches] = useState(getMatches);

  useEffect(() => {
    // Verificar si window está disponible (para SSR)
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    const handleChange = () => setMatches(mediaQuery.matches);

    // Inicializar con el valor actual
    handleChange();

    // Escuchar cambios en la media query
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback para navegadores antiguos
      mediaQuery.addListener(handleChange);
    }

    // Limpiar listener al desmontar
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        // Fallback para navegadores antiguos
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [query]);

  return matches;
};