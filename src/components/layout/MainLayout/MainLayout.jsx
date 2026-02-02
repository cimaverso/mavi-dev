import React from 'react';
/**
 * Componente MainLayout
 * Layout principal que combina Sidebar, Topbar y contenido
 */

import { useSidebar } from '../../../context/SidebarContext.jsx';
import Sidebar from '../Sidebar/Sidebar.jsx';
import Topbar from '../Topbar/Topbar.jsx';
import './MainLayout.css';

function MainLayout({ children }) {
  const { isCollapsed, isMobile } = useSidebar();

  const contentClasses = [
    'main-content',
    isCollapsed && !isMobile ? 'main-content-expanded' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="app-layout">
      <Sidebar />
      
      <div className={contentClasses}>
        <Topbar />
        
        <main className="main-body">
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;