import React, { useEffect, useState } from 'react';
import reservasApi from '../../api/reservas.api.js';
import { useToast } from '../../context/ToastContext.jsx';
import Loader from '../../components/common/Loader/Loader.jsx';
import FiltrosReservas from '../../components/modules/reservas/FiltrosReservas.jsx';
import CalendarioReservas from '../../components/modules/reservas/CalendarioReservas.jsx';
import ReservaModal from '../../components/modules/reservas/ReservaModal.jsx';
import './ReservasPage.css';

function ReservasPage() {
  const toast = useToast();
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    month: '',
    estado: '',
  });
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  // Cargar reservas
  useEffect(() => {
    fetchReservas();
  }, [filtros]);

  const fetchReservas = async () => {
    setLoading(true);
    try {
      const response = await reservasApi.getAll(filtros);
      
      if (response.success) {
        setReservas(response.data);
      } else {
        toast.error(response.error?.message || 'Error al cargar reservas');
      }
    } catch (error) {
      toast.error('Error al cargar reservas');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambio de filtros
  const handleFiltrosChange = (nuevosFiltros) => {
    setFiltros(nuevosFiltros);
  };

  // Abrir modal con reserva seleccionada
  const handleSelectReserva = (reserva) => {
    setReservaSeleccionada(reserva);
    setModalAbierto(true);
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setModalAbierto(false);
    setReservaSeleccionada(null);
  };

  // Actualizar reserva
  const handleUpdateReserva = async (id, cambios) => {
    try {
      const response = await reservasApi.update(id, cambios);
      
      if (response.success) {
        // Actualizar la lista de reservas
        setReservas((prev) =>
          prev.map((r) => (r.id === id ? response.data : r))
        );
        
        toast.success('Reserva actualizada correctamente');
        return { success: true };
      } else {
        toast.error(response.error?.message || 'Error al actualizar');
        return { success: false };
      }
    } catch (error) {
      toast.error('Error al actualizar la reserva');
      console.error('Error:', error);
      return { success: false };
    }
  };

  // Calcular estadísticas
  const calcularEstadisticas = () => {
    const stats = {
      total: reservas.length,
      pendientes: reservas.filter((r) => r.estado === 'PENDIENTE').length,
      confirmadas: reservas.filter((r) => r.estado === 'CONFIRMADA').length,
      canceladas: reservas.filter((r) => r.estado === 'CANCELADA').length,
      resueltas: reservas.filter((r) => r.resuelto).length,
    };
    return stats;
  };

  const stats = calcularEstadisticas();

  if (loading) {
    return <Loader fullscreen message="Cargando reservas..." />;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Reservas</h1>
          <p className="page-description">
            Gestión de reservas de embarcaciones
          </p>
        </div>
      </div>

      {/* Métricas */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">
            <i className="bi bi-calendar-check"></i>
          </div>
          <div className="metric-content">
            <p className="metric-value">{stats.total}</p>
            <p className="metric-label">Total Reservas</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon metric-icon-warning">
            <i className="bi bi-clock-history"></i>
          </div>
          <div className="metric-content">
            <p className="metric-value">{stats.pendientes}</p>
            <p className="metric-label">Pendientes</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon metric-icon-success">
            <i className="bi bi-check-circle"></i>
          </div>
          <div className="metric-content">
            <p className="metric-value">{stats.confirmadas}</p>
            <p className="metric-label">Confirmadas</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon metric-icon-error">
            <i className="bi bi-x-circle"></i>
          </div>
          <div className="metric-content">
            <p className="metric-value">{stats.canceladas}</p>
            <p className="metric-label">Canceladas</p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <FiltrosReservas filtros={filtros} onChange={handleFiltrosChange} />

      {/* Calendario */}
      {reservas.length === 0 ? (
        <div className="empty-state">
          <i className="bi bi-calendar-x"></i>
          <h3>No hay reservas</h3>
          <p>No se encontraron reservas con los filtros aplicados.</p>
        </div>
      ) : (
        <CalendarioReservas
          reservas={reservas}
          onSelectReserva={handleSelectReserva}
          filtros={filtros}
        />
      )}

      {/* Modal de detalles */}
      {reservaSeleccionada && (
        <ReservaModal
          reserva={reservaSeleccionada}
          isOpen={modalAbierto}
          onClose={handleCloseModal}
          onUpdate={handleUpdateReserva}
        />
      )}
    </div>
  );
}

export default ReservasPage;