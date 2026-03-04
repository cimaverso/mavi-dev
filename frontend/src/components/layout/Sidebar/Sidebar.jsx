import React from 'react';
/**
 * Componente Sidebar
 * Navegación principal de la aplicación
 */

import { NavLink } from 'react-router-dom';
import { useSidebar } from '../../../context/SidebarContext.jsx';
import './Sidebar.css';

function Sidebar() {
  const { isCollapsed, isMobileOpen, isMobile, toggleCollapse, closeMobileMenu } = useSidebar();

  const menuItems = [
    {
      path: '/embarcaciones',
      icon: 'bi-diagram-3',
      label: 'Embarcaciones',
    },
    {
      path: '/proveedores',
      icon: 'bi-people',
      label: 'Proveedores',
    },
    {
      path: '/reservas',
      icon: 'bi-calendar-check',
      label: 'Reservas',
    },
    {
      path: '/soporte',
      icon: 'bi-headset',
      label: 'Soporte',
    },
    {
      path: '/agente',
      icon: 'bi-robot',
      label: 'Agente',
      locked: true,
    },
  ];

  const sidebarClasses = [
    'sidebar',
    isCollapsed && !isMobile ? 'sidebar-collapsed' : '',
    isMobile && isMobileOpen ? 'sidebar-mobile-open' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const handleLinkClick = () => {
    if (isMobile) {
      closeMobileMenu();
    }
  };

  return (
    <>
      {/* Overlay para mobile */}
      {isMobile && isMobileOpen && (
        <div className="sidebar-overlay" onClick={closeMobileMenu}></div>
      )}

      {/* Sidebar */}
      <aside className={sidebarClasses}>
        {/* Header */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <img src="/cimaverso.svg" alt="Cimaverso" className="sidebar-logo-img" />
            {(!isCollapsed || isMobile) && (
              <span className="sidebar-logo-text">Cimaverso</span>
            )}
          </div>

          {/* Toggle button (solo desktop) */}
          {!isMobile && (
            <button
              type="button"
              className="sidebar-toggle"
              onClick={toggleCollapse}
              aria-label={isCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
            >
              <i className={`bi ${isCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'}`}></i>
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <ul className="sidebar-menu">
            {menuItems.map((item) => (
              <li key={item.path} className="sidebar-menu-item">
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? 'sidebar-link-active' : ''} ${
                      item.locked ? 'sidebar-link-locked' : ''
                    }`
                  }
                  onClick={handleLinkClick}
                >
                  <i className={`bi ${item.icon} sidebar-link-icon`}></i>
                  {(!isCollapsed || isMobile) && (
                    <>
                      <span className="sidebar-link-text">{item.label}</span>
                      {item.locked && (
                        <i className="bi bi-lock-fill sidebar-link-lock"></i>
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          {(!isCollapsed || isMobile) && (
            <div className="sidebar-footer-text">
              <p className="sidebar-version">v1.0.0</p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

export default Sidebar;