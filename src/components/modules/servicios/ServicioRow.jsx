import React, { useState } from 'react';
import { useDebouncedCallback } from '../../../hooks/useDebounce.js';
import { validateRequired, validatePositive } from '../../../utils/validators.js';
import { CONFIRMATION_MESSAGES } from '../../../utils/constants.js';
import { formatCurrency } from '../../../utils/formatters.js';

function ServicioRow({ servicio, onUpdate, onDelete }) {
  const [editingField, setEditingField] = useState(null);
  const [formData, setFormData] = useState({
    nombre: servicio.nombre,
    precio: servicio.precio || '',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const debouncedSave = useDebouncedCallback(async (field, value) => {
    if (saving) return;

    let error = null;
    if (field === 'nombre') {
      error = validateRequired(value, 'El nombre');
    } else if (field === 'precio') {
      error = validateRequired(value, 'El precio') || validatePositive(value, 'El precio');
    }

    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }));
      return;
    }

    setSaving(true);
    const result = await onUpdate(servicio.id, { [field]: value });
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
    if (window.confirm(CONFIRMATION_MESSAGES.deleteServicio)) {
      await onDelete(servicio.id);
    }
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
            placeholder="Nombre del servicio"
          />
          {saving && editingField === 'nombre' && (
            <span className="cell-saving-indicator">
              <i className="bi bi-arrow-repeat spin"></i>
            </span>
          )}
        </div>
        {errors.nombre && <span className="cell-error-text">{errors.nombre}</span>}
      </td>

      {/* Precio */}
      <td className={errors.precio ? 'cell-error' : ''}>
        <div className="editable-cell">
          {editingField === 'precio' ? (
            <input
              type="number"
              value={formData.precio}
              onChange={(e) => handleChange('precio', e.target.value)}
              onFocus={() => handleFocus('precio')}
              onBlur={handleBlur}
              className="cell-input cell-editing"
              placeholder="0"
              min="0"
              step="0.01"
            />
          ) : (
            <input
              type="text"
              value={formatCurrency(formData.precio)}
              onFocus={() => handleFocus('precio')}
              readOnly
              className="cell-input"
            />
          )}
          {saving && editingField === 'precio' && (
            <span className="cell-saving-indicator">
              <i className="bi bi-arrow-repeat spin"></i>
            </span>
          )}
        </div>
        {errors.precio && <span className="cell-error-text">{errors.precio}</span>}
      </td>

      {/* Acciones */}
      <td className="actions-cell">
        <button
          type="button"
          className="action-btn action-btn-delete"
          onClick={handleDelete}
          title="Eliminar servicio"
        >
          <i className="bi bi-trash"></i>
        </button>
      </td>
    </tr>
  );
}

export default ServicioRow;