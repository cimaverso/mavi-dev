import React, { useState } from 'react';
import ProveedorRow from './ProveedorRow.jsx';
import Loader from '../../common/Loader/Loader.jsx';
import './ProveedoresTable.css';

function ProveedoresTable({ proveedores, loading, onUpdate, onDelete, onAdd }) {
  const [newProveedor, setNewProveedor] = useState({
    nombre: '',
    telefono: '',
  });
  const [showNewRow, setShowNewRow] = useState(false);
  const [errors, setErrors] = useState({});

  const handleAddClick = () => {
    setShowNewRow(true);
  };

  const handleCancelAdd = () => {
    setShowNewRow(false);
    setNewProveedor({ nombre: '', telefono: '' });
    setErrors({});
  };

  const handleSaveNew = async () => {
    const newErrors = {};

    if (!newProveedor.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const result = await onAdd(newProveedor);

    if (result.success) {
      setShowNewRow(false);
      setNewProveedor({ nombre: '', telefono: '' });
      setErrors({});
    } else {
      setErrors({ general: result.error });
    }
  };

  if (loading) {
    return <Loader message="Cargando proveedores..." />;
  }

  return (
    <div className="table-container">
      <div className="table-header">
        <h2 className="table-title">Lista de Proveedores</h2>
        {!showNewRow && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleAddClick}
          >
            <i className="bi bi-plus-lg"></i>
            Agregar Proveedor
          </button>
        )}
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th className="actions-column">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {/* Nueva fila para agregar */}
            {showNewRow && (
              <tr className="new-row">
                <td>
                  <input
                    type="text"
                    value={newProveedor.nombre}
                    onChange={(e) => setNewProveedor(prev => ({ ...prev, nombre: e.target.value }))}
                    className={`cell-input ${errors.nombre ? 'input-error' : ''}`}
                    placeholder="Nombre del proveedor"
                    autoFocus
                  />
                  {errors.nombre && <span className="cell-error-text">{errors.nombre}</span>}
                </td>
                <td>
                  <input
                    type="tel"
                    value={newProveedor.telefono}
                    onChange={(e) => setNewProveedor(prev => ({ ...prev, telefono: e.target.value }))}
                    className="cell-input"
                    placeholder="+57 300 123 4567"
                  />
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
            {proveedores.length === 0 && !showNewRow ? (
              <tr>
                <td colSpan="3" className="empty-state">
                  <i className="bi bi-inbox"></i>
                  <p>No hay proveedores registrados</p>
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
              proveedores.map(proveedor => (
                <ProveedorRow
                  key={proveedor.id}
                  proveedor={proveedor}
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

export default ProveedoresTable;