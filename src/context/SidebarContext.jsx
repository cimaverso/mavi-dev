/**
 * Context del Sidebar
 * Maneja estado de expansión/colapso del sidebar
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
const SidebarContext = createContext(null);

const SIDEBAR_STORAGE_KEY = 'cimaverso_sidebar_collapsed';

export function SidebarProvider({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si es mobile y cargar preferencia del usuario
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // En mobile siempre empezar cerrado
      if (mobile) {
        setIsMobileOpen(false);
      }
    };

    // Cargar preferencia guardada (solo desktop)
    const savedState = localStorage.getItem(SIDEBAR_STORAGE_KEY);
    if (savedState !== null && window.innerWidth >= 768) {
      setIsCollapsed(savedState === 'true');
    }

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  /**
   * Toggle sidebar en desktop (expandir/colapsar)
   */
  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem(SIDEBAR_STORAGE_KEY, newState.toString());
  };

  /**
   * Toggle sidebar en mobile (abrir/cerrar drawer)
   */
  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  /**
   * Cerrar sidebar mobile (al hacer click en un link)
   */
  const closeMobileMenu = () => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  /**
   * Expandir sidebar temporalmente (hover en desktop cuando está colapsado)
   */
  const expandTemporarily = () => {
    // Esta funcionalidad se maneja con CSS :hover
    // Este método está disponible si se necesita control programático
  };

  const value = {
    isCollapsed,
    isMobileOpen,
    isMobile,
    toggleCollapse,
    toggleMobileMenu,
    closeMobileMenu,
    expandTemporarily,
  };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
}

/**
 * Hook para usar el contexto del sidebar
 * @returns {object} Contexto del sidebar
 */
export function useSidebar() {
  const context = useContext(SidebarContext);
  
  if (!context) {
    throw new Error('useSidebar debe usarse dentro de SidebarProvider');
  }
  
  return context;
}