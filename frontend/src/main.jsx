/**
 * Punto de entrada principal de la aplicación
 * Configura providers y renderiza la app
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';

// Contexts
import { AuthProvider } from './context/AuthContext.jsx';
import { SidebarProvider } from './context/SidebarContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';

// Estilos globales
import './styles/variables.css';
import './styles/global.css';
import './styles/utils.css';

// Bootstrap Icons CSS
import 'bootstrap-icons/font/bootstrap-icons.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <SidebarProvider>
            <App />
          </SidebarProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);