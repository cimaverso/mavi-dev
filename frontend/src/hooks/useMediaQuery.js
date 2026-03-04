/**
 * Hook para detectar breakpoints y media queries
 * Útil para responsive design
 */

import { useState, useEffect } from 'react';

/**
 * Hook genérico para media queries
 * @param {string} query - Media query CSS
 * @returns {boolean} true si la query coincide
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    // Set inicial
    setMatches(media.matches);

    // Listener para cambios
    const listener = (event) => {
      setMatches(event.matches);
    };

    // Navegadores modernos
    if (media.addEventListener) {
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    } else {
      // Fallback para navegadores antiguos
      media.addListener(listener);
      return () => media.removeListener(listener);
    }
  }, [query]);

  return matches;
}

/**
 * Hook para detectar si es mobile
 * @returns {boolean} true si es mobile
 */
export function useIsMobile() {
  return useMediaQuery('(max-width: 767px)');
}

/**
 * Hook para detectar si es tablet
 * @returns {boolean} true si es tablet
 */
export function useIsTablet() {
  return useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
}

/**
 * Hook para detectar si es desktop
 * @returns {boolean} true si es desktop
 */
export function useIsDesktop() {
  return useMediaQuery('(min-width: 1024px)');
}

/**
 * Hook que retorna el breakpoint actual
 * @returns {string} 'mobile' | 'tablet' | 'desktop'
 */
export function useBreakpoint() {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isDesktop = useIsDesktop();

  if (isMobile) return 'mobile';
  if (isTablet) return 'tablet';
  if (isDesktop) return 'desktop';
  
  return 'mobile'; // Fallback
}

/**
 * Hook para obtener dimensiones de la ventana
 * @returns {object} { width, height }
 */
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

/**
 * Hook para detectar orientación del dispositivo
 * @returns {string} 'portrait' | 'landscape'
 */
export function useOrientation() {
  const isPortrait = useMediaQuery('(orientation: portrait)');
  return isPortrait ? 'portrait' : 'landscape';
}

/**
 * Hook combinado que retorna toda la información responsive
 * @returns {object} Información completa de responsive
 */
export function useResponsive() {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isDesktop = useIsDesktop();
  const breakpoint = useBreakpoint();
  const windowSize = useWindowSize();
  const orientation = useOrientation();

  return {
    isMobile,
    isTablet,
    isDesktop,
    breakpoint,
    windowSize,
    orientation,
  };
}