import React, { useState } from 'react';
import EmbarcacionRow from './EmbarcacionRow.jsx';
import Loader from '../../common/Loader/Loader.jsx';
import './EmbarcacionesTable.css';

function EmbarcacionesTable({ 
  embarcaciones, 
  tipos,
  proveedores,
  loading, 
  onUpdate, 
  onDelete, 
  onAdd,
  onOpenTipoModal,
  onOpenProveedorModal,
  onOpenMediaGallery
}) {
  const [newEmbarcacion, setNewEmbarcacion] = useState({
    nombre: '',
    idTipo: '',
    idProveedor: '',
    capacidad: '',
    valorProveedor: '',
    valorCliente: '',
  });
  const [showNewRow, setShowNewRow] = useState(false);
  const [errors, setErrors] = useState({});

  const handleAddClick = () => {
    setShowNewRow(true);
  };

  const handleCancelAdd = () => {
    setShowNewRow(false);
    setNewEmbarcacion({
      nombre: '',
      idTipo: '',
      idProveedor: '',
      capacidad: '',
      valorProveedor: '',
      valorCliente: '',
    });
    setErrors({});
  };

  const handleSaveNew = async () => {
    const newErrors = {};

    if (!newEmbarcacion.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!newEmbarcacion.idTipo) {
      newErrors.idTipo = 'El tipo es requerido';
    }

    if (!newEmbarcacion.idProveedor) {
      newErrors.idProveedor = 'El proveedor es requerido';
    }

    if (!newEmbarcacion.capacidad || newEmbarcacion.capacidad <= 0) {
      newErrors.capacidad = 'La capacidad debe ser mayor a 0';
    }

    if (!newEmbarcacion.valorProveedor || newEmbarcacion.valorProveedor <= 0) {
      newErrors.valorProveedor = 'El valor proveedor debe ser mayor a 0';
    }

    if (!newEmbarcacion.valorCliente || newEmbarcacion.valorCliente <= 0) {
      newErrors.valorCliente = 'El valor cliente debe ser mayor a 0';
    }

    if (newEmbarcacion.valorCliente && newEmbarcacion.valorProveedor && 
        parseFloat(newEmbarcacion.valorCliente) < parseFloat(newEmbarcacion.valorProveedor)) {
      newErrors.valorCliente = 'El valor cliente debe ser mayor o igual al valor proveedor';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const result = await onAdd({
      nombre: newEmbarcacion.nombre,
      idTipo: parseInt(newEmbarcacion.idTipo),
      idProveedor: parseInt(newEmbarcacion.idProveedor),
      capacidad: parseInt(newEmbarcacion.capacidad),
      valorProveedor: parseFloat(newEmbarcacion.valorProveedor),
      valorCliente: parseFloat(newEmbarcacion.valorCliente),
    });

    if (result.success) {
      setShowNewRow(false);
      setNewEmbarcacion({
        nombre: '',
        idTipo: '',
        idProveedor: '',
        capacidad: '',
        valorProveedor: '',
        valorCliente: '',
      });
      setErrors({});
    } else {
      setErrors({ general: result.error });
    }
  };

  const handleNewSelectChange = (field, value) => {
    if (value === '__add_new__') {
      if (field === 'idTipo') {
        onOpenTipoModal();
      } else if (field === 'idProveedor') {
        onOpenProveedorModal();
      }
    } else {
      setNewEmbarcacion(prev => ({ ...prev, [field]: value }));
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (loading) {
    return <Loader message="Cargando embarcaciones..." />;
  }

  return (
    <div className="table-container">
      <div className="table-header">
        <h2 className="table-title">Lista de Embarcaciones</h2>
        {!showNewRow && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleAddClick}
          >
            <i className="bi bi-plus-lg"></i>
            Agregar Embarcación
          </button>
        )}
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Proveedor</th>
              <th>Capacidad</th>
              <th>Valor Proveedor</th>
              <th>Valor Cliente</th>
              <th>Media</th>
            </tr>
          </thead>
          <tbody>
            {/* Nueva fila */}
            {showNewRow && (
              <tr className="new-row">
                <td>
                  <input
                    type="text"
                    value={newEmbarcacion.nombre}
                    onChange={(e) => {
                      setNewEmbarcacion(prev => ({ ...prev, nombre: e.target.value }));
                      setErrors(prev => ({ ...prev, nombre: '' }));
                    }}
                    className={`cell-input ${errors.nombre ? 'input-error' : ''}`}
                    placeholder="Nombre"
                    autoFocus
                  />
                  {errors.nombre && <span className="cell-error-text">{errors.nombre}</span>}
                </td>
                <td>
                  <select
                    value={newEmbarcacion.idTipo}
                    onChange={(e) => handleNewSelectChange('idTipo', e.target.value)}
                    className={`cell-select ${errors.idTipo ? 'input-error' : ''}`}
                  >
                    <option value="">Seleccionar...</option>
                    {tipos.map(tipo => (
                      <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                    ))}
                    <option value="__add_new__" className="add-option">+ Agregar tipo</option>
                  </select>
                  {errors.idTipo && <span className="cell-error-text">{errors.idTipo}</span>}
                </td>
                <td>
                  <select
                    value={newEmbarcacion.idProveedor}
                    onChange={(e) => handleNewSelectChange('idProveedor', e.target.value)}
                    className={`cell-select ${errors.idProveedor ? 'input-error' : ''}`}
                  >
                    <option value="">Seleccionar...</option>
                    {proveedores.map(prov => (
                      <option key={prov.id} value={prov.id}>{prov.nombre}</option>
                    ))}
                    <option value="__add_new__" className="add-option">+ Agregar proveedor</option>
                  </select>
                  {errors.idProveedor && <span className="cell-error-text">{errors.idProveedor}</span>}
                </td>
                <td>
                  <input
                    type="number"
                    value={newEmbarcacion.capacidad}
                    onChange={(e) => {
                      setNewEmbarcacion(prev => ({ ...prev, capacidad: e.target.value }));
                      setErrors(prev => ({ ...prev, capacidad: '' }));
                    }}
                    className={`cell-input ${errors.capacidad ? 'input-error' : ''}`}
                    placeholder="0"
                    min="1"
                  />
                  {errors.capacidad && <span className="cell-error-text">{errors.capacidad}</span>}
                </td>
                <td>
                  <input
                    type="number"
                    value={newEmbarcacion.valorProveedor}
                    onChange={(e) => {
                      setNewEmbarcacion(prev => ({ ...prev, valorProveedor: e.target.value }));
                      setErrors(prev => ({ ...prev, valorProveedor: '' }));
                    }}
                    className={`cell-input ${errors.valorProveedor ? 'input-error' : ''}`}
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                  {errors.valorProveedor && <span className="cell-error-text">{errors.valorProveedor}</span>}
                </td>
                <td>
                  <input
                    type="number"
                    value={newEmbarcacion.valorCliente}
                    onChange={(e) => {
                      setNewEmbarcacion(prev => ({ ...prev, valorCliente: e.target.value }));
                      setErrors(prev => ({ ...prev, valorCliente: '' }));
                    }}
                    className={`cell-input ${errors.valorCliente ? 'input-error' : ''}`}
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                  {errors.valorCliente && <span className="cell-error-text">{errors.valorCliente}</span>}
                </td>
                <td className="media-cell">-</td>
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
            {embarcaciones.length === 0 && !showNewRow ? (
              <tr>
                <td colSpan="8" className="empty-state">
                  <i className="bi bi-inbox"></i>
                  <p>No hay embarcaciones registradas</p>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={handleAddClick}
                  >
                    Agregar la primera
                  </button>
                </td>
              </tr>
            ) : (
              embarcaciones.map(embarcacion => (
                <EmbarcacionRow
                  key={embarcacion.id}
                  embarcacion={embarcacion}
                  tipos={tipos}
                  proveedores={proveedores}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                  onOpenTipoModal={onOpenTipoModal}
                  onOpenProveedorModal={onOpenProveedorModal}
                  onOpenMediaGallery={onOpenMediaGallery}
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

export default EmbarcacionesTable;