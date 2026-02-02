import React, { useState } from 'react';
import ServicioRow from './ServicioRow.jsx';
import Loader from '../../common/Loader/Loader.jsx';
import './ServiciosTable.css';

function ServiciosTable({ servicios, loading, onUpdate, onDelete, onAdd }) {
  const [newServicio, setNewServicio] = useState({
    nombre: '',
    precio: '',
  });
  const [showNewRow, setShowNewRow] = useState(false);
  const [errors, setErrors] = useState({});

  const handleAddClick = () => {
    setShowNewRow(true);
  };

  const handleCancelAdd = () => {
    setShowNewRow(false);
    setNewServicio({ nombre: '', precio: '' });
    setErrors({});
  };

  const handleSaveNew = async () => {
    const newErrors = {};

    if (!newServicio.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!newServicio.precio || newServicio.precio <= 0) {
      newErrors.precio = 'El precio debe ser mayor a 0';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const result = await onAdd({
      nombre: newServicio.nombre,
      precio: parseFloat(newServicio.precio),
    });

    if (result.success) {
      setShowNewRow(false);
      setNewServicio({ nombre: '', precio: '' });
      setErrors({});
    } else {
      setErrors({ general: result.error });
    }
  };

  if (loading) {
    return <Loader message="Cargando servicios..." />;
  }

  return (
    <div className="table-container">
      <div className="table-header">
        <h2 className="table-title">Lista de Servicios</h2>
        {!showNewRow && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleAddClick}
          >
            <i className="bi bi-plus-lg"></i>
            Agregar Servicio
          </button>
        )}
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Precio</th>
              <th className="actions-column">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {/* Nueva fila */}
            {showNewRow && (
              <tr className="new-row">
                <td>
                  <input
                    type="text"
                    value={newServicio.nombre}
                    onChange={(e) => setNewServicio(prev => ({ ...prev, nombre: e.target.value }))}
                    className={`cell-input ${errors.nombre ? 'input-error' : ''}`}
                    placeholder="Nombre del servicio"
                    autoFocus
                  />
                  {errors.nombre && <span className="cell-error-text">{errors.nombre}</span>}
                </td>
                <td>
                  <input
                    type="number"
                    value={newServicio.precio}
                    onChange={(e) => setNewServicio(prev => ({ ...prev, precio: e.target.value }))}
                    className={`cell-input ${errors.precio ? 'input-error' : ''}`}
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                  {errors.precio && <span className="cell-error-text">{errors.precio}</span>}
                </td>
                <td className="actions-cell">
                  <button
                    type="button"
                    className="action-btn action-btn-save"
                    onClick={handleSaveNew}
                    title="Guardar"
                  >
                    <i className="bi bi-check-lg"></i>
                  </button>
                  <button
                    type="button"
                    className="action-btn action-btn-cancel"
                    onClick={handleCancelAdd}
                    title="Cancelar"
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                </td>
              </tr>
            )}

            {/* Filas existentes */}
            {servicios.length === 0 && !showNewRow ? (
              <tr>
                <td colSpan="3" className="empty-state">
                  <i className="bi bi-inbox"></i>
                  <p>No hay servicios registrados</p>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={handleAddClick}
                  >
                    Agregar el primero
                  </button>
                </td>
              </tr>
            ) : (
              servicios.map(servicio => (
                <ServicioRow
                  key={servicio.id}
                  servicio={servicio}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {errors.general && (
        <div className="table-error">
          {errors.general}
        </div>
      )}
    </div>
  );
}

export default ServiciosTable;