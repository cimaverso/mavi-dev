import React, { useState, useMemo } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CalendarioReservas.css';

function CalendarioReservas({ reservas, onSelectReserva, filtros }) {
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());

  // Agrupar reservas por fecha para performance
  const reservasPorFecha = useMemo(() => {
    const mapa = {};
    
    reservas.forEach((reserva) => {
      const fecha = reserva.fechaReserva.split('T')[0]; // Formato YYYY-MM-DD
      if (!mapa[fecha]) {
        mapa[fecha] = [];
      }
      mapa[fecha].push(reserva);
    });
    
    return mapa;
  }, [reservas]);

  // Obtener reservas de una fecha específica
  const getReservasDelDia = (fecha) => {
    const fechaStr = fecha.toISOString().split('T')[0];
    return reservasPorFecha[fechaStr] || [];
  };

  // Renderizar contenido del tile (día)
  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;

    const reservasDelDia = getReservasDelDia(date);
    
    if (reservasDelDia.length === 0) return null;

    // Contar por estado
    const contadores = {
      PENDIENTE: 0,
      CONFIRMADA: 0,
      CANCELADA: 0,
    };

    reservasDelDia.forEach((r) => {
      contadores[r.estado] = (contadores[r.estado] || 0) + 1;
    });

    return (
      <div className="calendar-tile-indicators">
        {contadores.PENDIENTE > 0 && (
          <span className="indicator indicator-warning" title={`${contadores.PENDIENTE} pendiente(s)`}>
            {contadores.PENDIENTE}
          </span>
        )}
        {contadores.CONFIRMADA > 0 && (
          <span className="indicator indicator-success" title={`${contadores.CONFIRMADA} confirmada(s)`}>
            {contadores.CONFIRMADA}
          </span>
        )}
        {contadores.CANCELADA > 0 && (
          <span className="indicator indicator-error" title={`${contadores.CANCELADA} cancelada(s)`}>
            {contadores.CANCELADA}
          </span>
        )}
      </div>
    );
  };

  // Agregar clase CSS a días con reservas
  const tileClassName = ({ date, view }) => {
    if (view !== 'month') return null;

    const reservasDelDia = getReservasDelDia(date);
    
    if (reservasDelDia.length === 0) return null;

    return 'has-reservas';
  };

  // Manejar click en un día
  const handleDayClick = (fecha) => {
    setFechaSeleccionada(fecha);
  };

  // Obtener reservas del día seleccionado
  const reservasDiaSeleccionado = getReservasDelDia(fechaSeleccionada);

  const getEstadoBadgeClass = (estado) => {
    const clases = {
      'PENDIENTE': 'badge-warning',
      'CONFIRMADA': 'badge-success',
      'CANCELADA': 'badge-error',
    };
    return clases[estado] || 'badge-default';
  };

  return (
    <div className="calendario-reservas-container">
      <div className="calendario-wrapper">
        <Calendar
          locale="es-ES"
          value={fechaSeleccionada}
          onClickDay={handleDayClick}
          tileContent={tileContent}
          tileClassName={tileClassName}
          showNeighboringMonth={false}
          next2Label={null}
          prev2Label={null}
        />

        {/* Leyenda */}
        <div className="calendario-leyenda">
          <h4 className="leyenda-title">Leyenda</h4>
          <div className="leyenda-items">
            <div className="leyenda-item">
              <span className="indicator indicator-warning">N</span>
              <span>Pendiente</span>
            </div>
            <div className="leyenda-item">
              <span className="indicator indicator-success">N</span>
              <span>Confirmada</span>
            </div>
            <div className="leyenda-item">
              <span className="indicator indicator-error">N</span>
              <span>Cancelada</span>
            </div>
          </div>
        </div>
      </div>

      {/* Panel lateral con reservas del día */}
      <div className="reservas-dia-panel">
        <h3 className="panel-title">
          <i className="bi bi-calendar-check"></i>
          {fechaSeleccionada.toLocaleDateString('es-ES', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </h3>

        {reservasDiaSeleccionado.length === 0 ? (
          <div className="panel-empty">
            <i className="bi bi-calendar-x"></i>
            <p>No hay reservas para este día</p>
          </div>
        ) : (
          <div className="reservas-lista">
            {reservasDiaSeleccionado.map((reserva) => (
              <div 
                key={reserva.id} 
                className="reserva-card"
                onClick={() => onSelectReserva(reserva)}
              >
                <div className="reserva-card-header">
                  <span className="reserva-id">#{reserva.id}</span>
                  <span className={`badge ${getEstadoBadgeClass(reserva.estado)}`}>
                    {reserva.estado}
                  </span>
                </div>

                <div className="reserva-card-body">
                  <div className="reserva-info-row">
                    <i className="bi bi-sailboat"></i>
                    <span>{reserva.embarcacion?.nombre || 'N/A'}</span>
                  </div>
                  <div className="reserva-info-row">
                    <i className="bi bi-person"></i>
                    <span>{reserva.usuario?.nombre || 'N/A'}</span>
                  </div>
                </div>

                {reserva.resuelto && (
                  <div className="reserva-resuelto">
                    <i className="bi bi-check-circle-fill"></i>
                    <span>Resuelto</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CalendarioReservas;