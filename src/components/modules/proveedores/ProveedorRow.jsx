import React, { useState } from 'react';
import { useDebouncedCallback } from '../../../hooks/useDebounce.js'; // ← Cambiar aquí
import { validateRequired, validatePhone } from '../../../utils/validators.js';
import { CONFIRMATION_MESSAGES } from '../../../utils/constants.js';

function ProveedorRow({ proveedor, onUpdate, onDelete }) {
  const [editingField, setEditingField] = useState(null);
  const [formData, setFormData] = useState({
    nombre: proveedor.nombre,
    telefono: proveedor.telefono || '',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Autosave con debounce
  const debouncedSave = useDebouncedCallback(async (field, value) => {
    if (saving) return;

    // Validar
    let error = null;
    if (field === 'nombre') {
      error = validateRequired(value, 'El nombre');
    } else if (field === 'telefono' && value) {
      error = validatePhone(value);
    }

    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }));
      return;
    }

    // Guardar
    setSaving(true);
    const result = await onUpdate(proveedor.id, { [field]: value });
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
    if (window.confirm(CONFIRMATION_MESSAGES.deleteProveedor)) {
      await onDelete(proveedor.id);
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
            placeholder="Nombre del proveedor"
          />
          {saving && editingField === 'nombre' && (
            <span className="cell-saving-indicator">
              <i className="bi bi-arrow-repeat spin"></i>
            </span>
          )}
        </div>
        {errors.nombre && <span className="cell-error-text">{errors.nombre}</span>}
      </td>

      {/* Teléfono */}
      <td className={errors.telefono ? 'cell-error' : ''}>
        <div className="editable-cell">
          <input
            type="tel"
            value={formData.telefono}
            onChange={(e) => handleChange('telefono', e.target.value)}
            onFocus={() => handleFocus('telefono')}
            onBlur={handleBlur}
            className={`cell-input ${editingField === 'telefono' ? 'cell-editing' : ''}`}
            placeholder="+57 300 123 4567"
          />
          {saving && editingField === 'telefono' && (
            <span className="cell-saving-indicator">
              <i className="bi bi-arrow-repeat spin"></i>
            </span>
          )}
        </div>
        {errors.telefono && <span className="cell-error-text">{errors.telefono}</span>}
      </td>

      {/* Acciones */}
      <td className="actions-cell">
        <button
          type="button"
          className="action-btn action-btn-delete"
          onClick={handleDelete}
          title="Eliminar proveedor"
        >
          <i className="bi bi-trash"></i>
        </button>
      </td>
    </tr>
  );
}

export default ProveedorRow;