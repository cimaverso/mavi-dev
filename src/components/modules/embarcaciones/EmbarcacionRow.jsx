import React, { useState } from 'react';
import { useDebouncedCallback } from '../../../hooks/useDebounce.js';
import { validateRequired, validatePositive, validateComparison } from '../../../utils/validators.js';
import { CONFIRMATION_MESSAGES } from '../../../utils/constants.js';
import { formatCurrency } from '../../../utils/formatters.js';

function EmbarcacionRow({ 
  embarcacion, 
  tipos, 
  proveedores, 
  onUpdate, 
  onDelete, 
  onOpenTipoModal,
  onOpenProveedorModal,
  onOpenMediaGallery
}) {
  const [editingField, setEditingField] = useState(null);
  const [formData, setFormData] = useState({
    nombre: embarcacion.nombre,
    idTipo: embarcacion.tipo?.id || '',
    idProveedor: embarcacion.proveedor?.id || '',
    capacidad: embarcacion.capacidad || '',
    valorProveedor: embarcacion.valorProveedor || '',
    valorCliente: embarcacion.valorCliente || '',
    caracteristicas: embarcacion.caracteristicas || '',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const debouncedSave = useDebouncedCallback(async (field, value) => {
    if (saving) return;

    // Validar según el campo
    let error = null;
    
    switch(field) {
      case 'nombre':
        error = validateRequired(value, 'El nombre');
        break;
      case 'idTipo':
        error = validateRequired(value, 'El tipo');
        break;
      case 'idProveedor':
        error = validateRequired(value, 'El proveedor');
        break;
      case 'capacidad':
        error = validateRequired(value, 'La capacidad') || 
                validatePositive(value, 'La capacidad');
        break;
      case 'valorProveedor':
        error = validateRequired(value, 'El valor proveedor') ||
                validatePositive(value, 'El valor proveedor');
        break;
      case 'valorCliente':
        error = validateRequired(value, 'El valor cliente') ||
                validatePositive(value, 'El valor cliente') ||
                validateComparison(
                  value, 
                  formData.valorProveedor, 
                  'gte',
                  'El valor cliente debe ser mayor o igual al valor proveedor'
                );
        break;
    }

    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }));
      return;
    }

    // Guardar
    setSaving(true);
    const result = await onUpdate(embarcacion.id, { [field]: value });
    setSaving(false);

    if (!result.success) {
      setErrors(prev => ({ ...prev, [field]: result.error }));
    }
  }, 500);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
    debouncedSave(field, value);
  };

  const handleFocus = (field) => {
    setEditingField(field);
  };

  const handleBlur = () => {
    setEditingField(null);
  };

  const handleDelete = async () => {
    if (window.confirm(CONFIRMATION_MESSAGES.deleteEmbarcacion)) {
      await onDelete(embarcacion.id);
    }
  };

  const handleMediaClick = () => {
    onOpenMediaGallery(embarcacion);
  };

  return (
    <tr className={saving ? 'row-saving' : ''}>
      {/* Nombre */}
      <td className={errors.nombre ? 'cell-error' : ''}>
        <div className="editable-cell">
          <input
            type="text"
            value={formData.nombre}
            onChange={(e) => handleChange('nombre', e.target.value)}
            onFocus={() => handleFocus('nombre')}
            onBlur={handleBlur}
            className={`cell-input ${editingField === 'nombre' ? 'cell-editing' : ''}`}
            placeholder="Nombre"
          />
          {saving && editingField === 'nombre' && (
            <span className="cell-saving-indicator">
              <i className="bi bi-arrow-repeat spin"></i>
            </span>
          )}
        </div>
        {errors.nombre && <span className="cell-error-text">{errors.nombre}</span>}
      </td>

      {/* Tipo */}
      <td className={errors.idTipo ? 'cell-error' : ''}>
        <div className="editable-cell select-with-add">
          <select
            value={formData.idTipo}
            onChange={(e) => {
              if (e.target.value === '__add_new__') {
                onOpenTipoModal();
              } else {
                handleChange('idTipo', e.target.value);
              }
            }}
            onFocus={() => handleFocus('idTipo')}
            onBlur={handleBlur}
            className={`cell-select ${editingField === 'idTipo' ? 'cell-editing' : ''}`}
          >
            <option value="">Seleccionar...</option>
            {tipos.map(tipo => (
              <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
            ))}
            <option value="__add_new__" className="add-option">+ Agregar tipo</option>
          </select>
          {saving && editingField === 'idTipo' && (
            <span className="cell-saving-indicator">
              <i className="bi bi-arrow-repeat spin"></i>
            </span>
          )}
        </div>
        {errors.idTipo && <span className="cell-error-text">{errors.idTipo}</span>}
      </td>

      {/* Proveedor */}
      <td className={errors.idProveedor ? 'cell-error' : ''}>
        <div className="editable-cell select-with-add">
          <select
            value={formData.idProveedor}
            onChange={(e) => {
              if (e.target.value === '__add_new__') {
                onOpenProveedorModal();
              } else {
                handleChange('idProveedor', e.target.value);
              }
            }}
            onFocus={() => handleFocus('idProveedor')}
            onBlur={handleBlur}
            className={`cell-select ${editingField === 'idProveedor' ? 'cell-editing' : ''}`}
          >
            <option value="">Seleccionar...</option>
            {proveedores.map(prov => (
              <option key={prov.id} value={prov.id}>{prov.nombre}</option>
            ))}
            <option value="__add_new__" className="add-option">+ Agregar proveedor</option>
          </select>
          {saving && editingField === 'idProveedor' && (
            <span className="cell-saving-indicator">
              <i className="bi bi-arrow-repeat spin"></i>
            </span>
          )}
        </div>
        {errors.idProveedor && <span className="cell-error-text">{errors.idProveedor}</span>}
      </td>

      {/* Capacidad */}
      <td className={errors.capacidad ? 'cell-error' : ''}>
        <div className="editable-cell">
          <input
            type="number"
            value={formData.capacidad}
            onChange={(e) => handleChange('capacidad', e.target.value)}
            onFocus={() => handleFocus('capacidad')}
            onBlur={handleBlur}
            className={`cell-input ${editingField === 'capacidad' ? 'cell-editing' : ''}`}
            placeholder="0"
            min="1"
          />
          {saving && editingField === 'capacidad' && (
            <span className="cell-saving-indicator">
              <i className="bi bi-arrow-repeat spin"></i>
            </span>
          )}
        </div>
        {errors.capacidad && <span className="cell-error-text">{errors.capacidad}</span>}
      </td>

      {/* Valor Proveedor */}
      <td className={errors.valorProveedor ? 'cell-error' : ''}>
        <div className="editable-cell">
          {editingField === 'valorProveedor' ? (
            <input
              type="number"
              value={formData.valorProveedor}
              onChange={(e) => handleChange('valorProveedor', e.target.value)}
              onFocus={() => handleFocus('valorProveedor')}
              onBlur={handleBlur}
              className="cell-input cell-editing"
              placeholder="0"
              min="0"
              step="0.01"
            />
          ) : (
            <input
              type="text"
              value={formatCurrency(formData.valorProveedor)}
              onFocus={() => handleFocus('valorProveedor')}
              readOnly
              className="cell-input"
            />
          )}
          {saving && editingField === 'valorProveedor' && (
            <span className="cell-saving-indicator">
              <i className="bi bi-arrow-repeat spin"></i>
            </span>
          )}
        </div>
        {errors.valorProveedor && <span className="cell-error-text">{errors.valorProveedor}</span>}
      </td>

      {/* Valor Cliente */}
      <td className={errors.valorCliente ? 'cell-error' : ''}>
        <div className="editable-cell">
          {editingField === 'valorCliente' ? (
            <input
              type="number"
              value={formData.valorCliente}
              onChange={(e) => handleChange('valorCliente', e.target.value)}
              onFocus={() => handleFocus('valorCliente')}
              onBlur={handleBlur}
              className="cell-input cell-editing"
              placeholder="0"
              min="0"
              step="0.01"
            />
          ) : (
            <input
              type="text"
              value={formatCurrency(formData.valorCliente)}
              onFocus={() => handleFocus('valorCliente')}
              readOnly
              className="cell-input"
            />
          )}
          {saving && editingField === 'valorCliente' && (
            <span className="cell-saving-indicator">
              <i className="bi bi-arrow-repeat spin"></i>
            </span>
          )}
        </div>
        {errors.valorCliente && <span className="cell-error-text">{errors.valorCliente}</span>}
      </td>

      {/* Media */}
      <td className="media-cell">
        <button
          type="button"
          className="action-btn action-btn-media"
          onClick={handleMediaClick}
          title={`${embarcacion.media?.length || 0} archivo(s)`}
        >
          <i className="bi bi-images"></i>
          {embarcacion.media && embarcacion.media.length > 0 && (
            <span className="media-badge">{embarcacion.media.length}</span>
          )}
        </button>
      </td>

      {/* Acciones */}
      <td className="actions-cell">
        <button
          type="button"
          className="action-btn action-btn-delete"
          onClick={handleDelete}
          title="Eliminar embarcación"
        >
          <i className="bi bi-trash"></i>
        </button>
      </td>
    </tr>
  );
}

export default EmbarcacionRow;