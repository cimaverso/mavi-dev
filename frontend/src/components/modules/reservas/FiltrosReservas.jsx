import React from 'react';
import Select from '../../common/Select/Select.jsx';
import './FiltrosReservas.css';

function FiltrosReservas({ filtros, onChange }) {
  const estadosOptions = [
    { value: '', label: 'Todos los estados' },
    { value: 'PENDIENTE', label: 'Pendiente' },
    { value: 'CONFIRMADA', label: 'Confirmada' },
    { value: 'CANCELADA', label: 'Cancelada' },
  ];

  const handleEstadoChange = (e) => {
    onChange({
      ...filtros,
      estado: e.target.value,
    });
  };

  // Generar opciones de meses (últimos 6 y próximos 6)
  const generarMeses = () => {
    const meses = [];
    const hoy = new Date();
    
    for (let i = -6; i <= 6; i++) {
      const fecha = new Date(hoy.getFullYear(), hoy.getMonth() + i, 1);
      const year = fecha.getFullYear();
      const month = String(fecha.getMonth() + 1).padStart(2, '0');
      const valor = `${year}-${month}`;
      
      const nombreMes = fecha.toLocaleDateString('es-ES', { 
        month: 'long', 
        year: 'numeric' 
      });
      
      meses.push({
        value: valor,
        label: nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1),
      });
    }
    
    return meses;
  };

  const mesesOptions = [
    { value: '', label: 'Todos los meses' },
    ...generarMeses(),
  ];

  const handleMesChange = (e) => {
    onChange({
      ...filtros,
      month: e.target.value,
    });
  };

  return (
    <div className="filtros-reservas">
      <div className="filtro-item">
        <label className="filtro-label">Mes</label>
        <Select
          value={filtros.month || ''}
          onChange={handleMesChange}
          options={mesesOptions}
        />
      </div>

      <div className="filtro-item">
        <label className="filtro-label">Estado</label>
        <Select
          value={filtros.estado || ''}
          onChange={handleEstadoChange}
          options={estadosOptions}
        />
      </div>

      <div className="filtros-info">
        <i className="bi bi-info-circle"></i>
        <span>Usa los filtros para buscar reservas específicas</span>
      </div>
    </div>
  );
}

export default FiltrosReservas;