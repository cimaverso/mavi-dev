import React, { useState } from 'react';
import Modal from '../../common/Modal/Modal.jsx';
import Button from '../../common/Button/Button.jsx';
import Select from '../../common/Select/Select.jsx';
import { useToast } from '../../../context/ToastContext.jsx';
import { formatDate } from '../../../utils/formatters.js';
import './ReservaModal.css';

function ReservaModal({ reserva, isOpen, onClose, onUpdate }) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [estadoActual, setEstadoActual] = useState(reserva?.estado || 'PENDIENTE');
  const [resuelto, setResuelto] = useState(reserva?.resuelto || false);

  const estadosOptions = [
    { value: 'PENDIENTE', label: 'Pendiente' },
    { value: 'CONFIRMADA', label: 'Confirmada' },
    { value: 'CANCELADA', label: 'Cancelada' },
  ];

  const handleGuardar = async () => {
    setLoading(true);

    try {
      const cambios = {};
      
      if (estadoActual !== reserva.estado) {
        cambios.estado = estadoActual;
      }
      
      if (resuelto !== reserva.resuelto) {
        cambios.resuelto = resuelto;
      }

      if (Object.keys(cambios).length === 0) {
        toast.info('No hay cambios para guardar');
        setLoading(false);
        return;
      }

      const resultado = await onUpdate(reserva.id, cambios);
      
      if (resultado.success) {
        onClose();
      }
    } catch (error) {
      toast.error('Error al actualizar la reserva');
    } finally {
      setLoading(false);
    }
  };

  const getEstadoBadgeClass = (estado) => {
    const clases = {
      'PENDIENTE': 'badge-warning',
      'CONFIRMADA': 'badge-success',
      'CANCELADA': 'badge-error',
    };
    return clases[estado] || 'badge-default';
  };

  if (!reserva) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalles de Reserva"
      size="medium"
    >
      <div className="reserva-modal-content">
        {/* Información de la reserva */}
        <div className="reserva-info-grid">
          <div className="reserva-info-item">
            <label>ID Reserva</label>
            <span className="reserva-info-value">#{reserva.id}</span>
          </div>

          <div className="reserva-info-item">
            <label>Fecha de Registro</label>
            <span className="reserva-info-value">
              {formatDate(reserva.fechaRegistro)}
            </span>
          </div>

          <div className="reserva-info-item">
            <label>Embarcación</label>
            <span className="reserva-info-value reserva-embarcacion">
              <i className="bi bi-sailboat"></i>
              {reserva.embarcacion?.nombre || 'No especificada'}
            </span>
          </div>

          <div className="reserva-info-item">
            <label>Cliente</label>
            <span className="reserva-info-value reserva-cliente">
              <i className="bi bi-person"></i>
              {reserva.usuario?.nombre || 'No especificado'}
            </span>
          </div>

          <div className="reserva-info-item">
            <label>Fecha de Reserva</label>
            <span className="reserva-info-value reserva-fecha">
              <i className="bi bi-calendar-event"></i>
              {formatDate(reserva.fechaReserva)}
            </span>
          </div>

          <div className="reserva-info-item">
            <label>Estado Actual</label>
            <span className={`badge ${getEstadoBadgeClass(reserva.estado)}`}>
              {reserva.estado}
            </span>
          </div>
        </div>

        <div className="reserva-divider"></div>

        {/* Formulario de edición */}
        <div className="reserva-edit-section">
          <h3 className="reserva-section-title">Actualizar Reserva</h3>

          <div className="form-group">
            <label htmlFor="estado-select">Cambiar Estado</label>
            <Select
              id="estado-select"
              value={estadoActual}
              onChange={(e) => setEstadoActual(e.target.value)}
              options={estadosOptions}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={resuelto}
                onChange={(e) => setResuelto(e.target.checked)}
                disabled={loading}
                className="checkbox-input"
              />
              <span className="checkbox-text">
                Marcar como resuelto
              </span>
            </label>
            <p className="form-help-text">
              Las reservas marcadas como resueltas no aparecen en las alertas pendientes
            </p>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="reserva-modal-actions">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleGuardar}
            loading={loading}
          >
            Guardar Cambios
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ReservaModal;