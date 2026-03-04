import React from 'react';
/**
 * Componente Topbar
 * Barra superior con usuario y controles
 */

import { useAuth } from '../../../context/AuthContext.jsx';
import { useSidebar } from '../../../context/SidebarContext.jsx';
import './Topbar.css';

function Topbar() {
  const { user, logout } = useAuth();
  const { isMobile, toggleMobileMenu } = useSidebar();

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro que deseas cerrar sesión?')) {
      logout();
      window.location.href = '/login';
    }
  };

  return (
    <header className="topbar">
      {/* Mobile menu button */}
      {isMobile && (
        <button
          type="button"
          className="topbar-mobile-toggle"
          onClick={toggleMobileMenu}
          aria-label="Abrir menú"
        >
          <i className="bi bi-list"></i>
        </button>
      )}

      {/* Spacer */}
      <div className="topbar-spacer"></div>

      {/* User info */}
      <div className="topbar-user">
        <div className="topbar-user-info">
          <span className="topbar-user-name">{user?.nombre || 'Usuario'}</span>
        </div>

        <div className="topbar-user-avatar">
          <i className="bi bi-person-circle"></i>
        </div>

        {/* Logout button */}
        <button
          type="button"
          className="topbar-logout"
          onClick={handleLogout}
          aria-label="Cerrar sesión"
          title="Cerrar sesión"
        >
          <i className="bi bi-box-arrow-right"></i>
        </button>
      </div>
    </header>
  );
}

export default Topbar;