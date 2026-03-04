/**
 * Componente principal de la aplicación
 * Maneja routing y autenticación
 */

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';

// Layout
import MainLayout from './components/layout/MainLayout/MainLayout.jsx';
import ToastContainer from './components/common/Toast/ToastContainer.jsx';
import Loader from './components/common/Loader/Loader.jsx';

// Pages (placeholder - crearemos estas páginas después)
import LoginPage from './pages/Login/LoginPage.jsx';
import EmbarcacionesPage from './pages/Embarcaciones/EmbarcacionesPage.jsx';
import ProveedoresPage from './pages/Proveedores/ProveedoresPage.jsx';
import ServiciosPage from './pages/Servicios/ServiciosPage.jsx';
import ReservasPage from './pages/Reservas/ReservasPage.jsx';
import SoportePage from './pages/Soporte/SoportePage.jsx';
import AgentePage from './pages/Agente/AgentePage.jsx';

// Componente de ruta protegida
function ProtectedRoute({ children }) {
  const { isAuth, loading } = useAuth();

  if (loading) {
    return <Loader fullscreen message="Cargando..." />;
  }

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Componente de ruta pública (solo accesible si NO está autenticado)
function PublicRoute({ children }) {
  const { isAuth, loading } = useAuth();

  if (loading) {
    return <Loader fullscreen message="Cargando..." />;
  }

  if (isAuth) {
    return <Navigate to="/embarcaciones" replace />;
  }

  return children;
}

function App() {
  return (
    <>
      {/* Toast notifications global */}
      <ToastContainer />

      <Routes>
        {/* Ruta pública - Login */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        {/* Rutas protegidas - Requieren autenticación */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Routes>
                  {/* Redirect de root a embarcaciones */}
                  <Route path="/" element={<Navigate to="/embarcaciones" replace />} />

                  {/* Módulos principales */}
                  <Route path="/embarcaciones" element={<EmbarcacionesPage />} />
                  <Route path="/proveedores" element={<ProveedoresPage />} />
                  <Route path="/servicios" element={<ServiciosPage />} />
                  <Route path="/reservas" element={<ReservasPage />} />
                  <Route path="/soporte" element={<SoportePage />} />
                  <Route path="/agente" element={<AgentePage />} />

                  {/* 404 - Ruta no encontrada */}
                  <Route path="*" element={<Navigate to="/embarcaciones" replace />} />
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;